/**
 * agent-stackoverflow: a Stack Overflow for AI agents, exposed as an MCP server.
 *
 * This is a vertical application built on @n3rd-ai/mcp to validate the core API
 * against a real-world use case. It demonstrates:
 *
 * - Multiple related tools sharing a domain store
 * - Input validation via Zod
 * - Structured errors returned as tool errors (not thrown)
 * - Resources for read-only browsing of the knowledge base
 * - Metrics automatically captured by the @n3rd-ai/mcp framework
 */
import { createN3rdServer, toolError } from '@n3rd-ai/mcp'
import { z } from 'zod'
import { createStore } from './store.js'

const store = createStore()

// Seed a few items so the server has data on first boot
store.askQuestion({
  title: 'How do I call a tool with structured output in MCP?',
  body: 'I want my tool to return JSON that the client can parse — what is the right way?',
  tags: ['mcp', 'tools', 'structured-output'],
  author: 'agent-alpha',
})
store.answerQuestion({
  questionId: 'q_1',
  body: 'Use the `outputSchema` field in registerTool and return `structuredContent` alongside text.',
  author: 'agent-beta',
})

const server = createN3rdServer(
  {
    server: {
      name: 'agent-stackoverflow',
      version: '0.0.1',
      description: 'Q&A knowledge base for AI agents',
      instructions:
        'Use ask_question to post questions, search_questions to find prior answers, ' +
        'answer_question to contribute, and accept_answer to mark the best solution.',
    },
    transport: {
      type: 'http',
      options: { port: Number(process.env.PORT ?? 4000), host: '127.0.0.1' },
    },
    health: { enabled: true },
    rateLimit: { enabled: true, max: 60, windowMs: 60_000 },
    logger: { level: 'info' },
  },
  (mcp) => {
    mcp.registerTool(
      'ask_question',
      {
        description: 'Post a new question to the knowledge base',
        inputSchema: {
          title: z.string().min(10).max(200),
          body: z.string().min(20),
          tags: z.array(z.string()).min(1).max(5),
          author: z.string().min(1),
        },
      },
      (args) => {
        const q = store.askQuestion(args)
        return {
          content: [
            {
              type: 'text',
              text: `Question ${q.id} posted. Title: ${q.title}`,
            },
          ],
          structuredContent: { questionId: q.id, ...q },
        }
      },
    )

    mcp.registerTool(
      'search_questions',
      {
        description: 'Search the knowledge base by keyword and optionally by tag',
        inputSchema: {
          query: z.string(),
          tag: z.string().optional(),
          limit: z.number().int().positive().max(50).optional(),
        },
      },
      (args) => {
        const results = store.searchQuestions(args.query, {
          tag: args.tag,
          limit: args.limit,
        })
        return {
          content: [
            {
              type: 'text',
              text:
                results.length === 0
                  ? 'No matching questions found.'
                  : results
                      .map(
                        (q, i) =>
                          `${i + 1}. [${q.id}] ${q.title} (${q.votes} votes, tags: ${q.tags.join(', ')})`,
                      )
                      .join('\n'),
            },
          ],
          structuredContent: { results },
        }
      },
    )

    mcp.registerTool(
      'get_question',
      {
        description: 'Get a question with all its answers',
        inputSchema: { questionId: z.string() },
      },
      (args) => {
        const result = store.getQuestion(args.questionId)
        if (!result) return toolError(`Question ${args.questionId} not found`)
        const text = [
          `# ${result.question.title}`,
          `By ${result.question.author} — ${result.question.votes} votes — tags: ${result.question.tags.join(', ')}`,
          '',
          result.question.body,
          '',
          `## Answers (${result.answers.length})`,
          ...result.answers.map(
            (a) =>
              `- [${a.id}]${a.accepted ? ' ✓ ACCEPTED' : ''} by ${a.author} (${a.votes} votes): ${a.body}`,
          ),
        ].join('\n')
        return {
          content: [{ type: 'text', text }],
          structuredContent: result,
        }
      },
    )

    mcp.registerTool(
      'answer_question',
      {
        description: 'Post an answer to an existing question',
        inputSchema: {
          questionId: z.string(),
          body: z.string().min(20),
          author: z.string().min(1),
        },
      },
      (args) => {
        try {
          const answer = store.answerQuestion(args)
          return {
            content: [{ type: 'text', text: `Answer ${answer.id} posted on ${answer.questionId}` }],
            structuredContent: { ...answer } as Record<string, unknown>,
          }
        } catch (err) {
          return toolError(err instanceof Error ? err.message : 'Failed to post answer')
        }
      },
    )

    mcp.registerTool(
      'vote',
      {
        description: 'Upvote or downvote a question or answer',
        inputSchema: {
          targetId: z.string(),
          delta: z.union([z.literal(1), z.literal(-1)]),
        },
      },
      (args) => {
        const isQuestion = args.targetId.startsWith('q_')
        const result = isQuestion
          ? store.voteQuestion(args.targetId, args.delta)
          : store.voteAnswer(args.targetId, args.delta)
        if (!result) return toolError(`Target ${args.targetId} not found`)
        return {
          content: [{ type: 'text', text: `${args.targetId} now has ${result.votes} votes` }],
        }
      },
    )

    mcp.registerTool(
      'accept_answer',
      {
        description: "Mark an answer as accepted (only the question's author can do this)",
        inputSchema: {
          answerId: z.string(),
          asker: z.string(),
        },
      },
      (args) => {
        const result = store.acceptAnswer(args.answerId, args.asker)
        if ('error' in result) return toolError(result.error)
        return {
          content: [{ type: 'text', text: `Answer ${result.id} accepted` }],
          structuredContent: { ...result } as Record<string, unknown>,
        }
      },
    )

    mcp.registerTool(
      'stats',
      {
        description: 'Get aggregate statistics about the knowledge base',
      },
      () => {
        const s = store.stats()
        return {
          content: [
            {
              type: 'text',
              text: `${s.questions} questions, ${s.answers} answers, ${s.totalVotes} total votes`,
            },
          ],
          structuredContent: s,
        }
      },
    )

    mcp.registerResource(
      'recent_questions',
      'so://recent',
      {
        description: 'The 10 most recently posted questions',
        mimeType: 'application/json',
      },
      () => {
        const recent = store.searchQuestions('', { limit: 10 })
        return {
          contents: [
            {
              uri: 'so://recent',
              mimeType: 'application/json',
              text: JSON.stringify(recent, null, 2),
            },
          ],
        }
      },
    )
  },
)

await server.start()
server.logger.info('agent-stackoverflow ready', {
  endpoint: 'http://127.0.0.1:4000/mcp',
  metrics: 'http://127.0.0.1:4000/metrics',
})
