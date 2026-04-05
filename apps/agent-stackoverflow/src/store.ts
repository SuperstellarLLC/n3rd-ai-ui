/**
 * In-memory knowledge base. Production would back this with Postgres + pgvector.
 * Kept simple so the example focuses on the MCP surface area.
 */

export interface Question {
  id: string
  title: string
  body: string
  tags: string[]
  author: string
  createdAt: number
  votes: number
}

export interface Answer {
  id: string
  questionId: string
  body: string
  author: string
  createdAt: number
  votes: number
  accepted: boolean
}

export interface Store {
  askQuestion(input: { title: string; body: string; tags: string[]; author: string }): Question
  answerQuestion(input: { questionId: string; body: string; author: string }): Answer
  getQuestion(id: string): { question: Question; answers: Answer[] } | undefined
  searchQuestions(query: string, options?: { tag?: string; limit?: number }): Question[]
  voteQuestion(id: string, delta: 1 | -1): Question | undefined
  voteAnswer(id: string, delta: 1 | -1): Answer | undefined
  acceptAnswer(id: string, asker: string): Answer | { error: string }
  stats(): { questions: number; answers: number; totalVotes: number }
}

export function createStore(): Store {
  const questions = new Map<string, Question>()
  const answers = new Map<string, Answer>()
  const answersByQuestion = new Map<string, Set<string>>()
  let idCounter = 0

  function nextId(prefix: string): string {
    idCounter += 1
    return `${prefix}_${idCounter.toString(36)}`
  }

  return {
    askQuestion({ title, body, tags, author }) {
      const id = nextId('q')
      const question: Question = {
        id,
        title,
        body,
        tags: [...tags],
        author,
        createdAt: Date.now(),
        votes: 0,
      }
      questions.set(id, question)
      answersByQuestion.set(id, new Set())
      return question
    },

    answerQuestion({ questionId, body, author }) {
      if (!questions.has(questionId)) {
        throw new Error(`Question ${questionId} not found`)
      }
      const id = nextId('a')
      const answer: Answer = {
        id,
        questionId,
        body,
        author,
        createdAt: Date.now(),
        votes: 0,
        accepted: false,
      }
      answers.set(id, answer)
      const set = answersByQuestion.get(questionId)
      if (set) set.add(id)
      return answer
    },

    getQuestion(id) {
      const question = questions.get(id)
      if (!question) return undefined
      const answerIds = answersByQuestion.get(id) ?? new Set()
      const qAnswers = [...answerIds]
        .map((aid) => answers.get(aid))
        .filter((a): a is Answer => a !== undefined)
        .sort((a, b) => {
          if (a.accepted !== b.accepted) return a.accepted ? -1 : 1
          return b.votes - a.votes
        })
      return { question, answers: qAnswers }
    },

    searchQuestions(query, options = {}) {
      const limit = options.limit ?? 10
      const needle = query.toLowerCase()
      const results: Question[] = []
      for (const q of questions.values()) {
        if (options.tag && !q.tags.includes(options.tag)) continue
        const haystack = `${q.title} ${q.body} ${q.tags.join(' ')}`.toLowerCase()
        if (needle.length === 0 || haystack.includes(needle)) {
          results.push(q)
        }
      }
      return results.sort((a, b) => b.votes - a.votes).slice(0, limit)
    },

    voteQuestion(id, delta) {
      const q = questions.get(id)
      if (!q) return undefined
      q.votes += delta
      return q
    },

    voteAnswer(id, delta) {
      const a = answers.get(id)
      if (!a) return undefined
      a.votes += delta
      return a
    },

    acceptAnswer(id, asker) {
      const answer = answers.get(id)
      if (!answer) return { error: `Answer ${id} not found` }
      const question = questions.get(answer.questionId)
      if (!question) return { error: `Question ${answer.questionId} not found` }
      if (question.author !== asker) {
        return { error: 'Only the question author can accept an answer' }
      }
      // Unaccept any other answers on this question
      for (const aid of answersByQuestion.get(question.id) ?? []) {
        const a = answers.get(aid)
        if (a) a.accepted = false
      }
      answer.accepted = true
      return answer
    },

    stats() {
      let totalVotes = 0
      for (const q of questions.values()) totalVotes += q.votes
      for (const a of answers.values()) totalVotes += a.votes
      return {
        questions: questions.size,
        answers: answers.size,
        totalVotes,
      }
    },
  }
}
