import { describe, it, expect, beforeEach } from 'vitest'
import { createStore, type Store } from './store.js'

let store: Store

beforeEach(() => {
  store = createStore()
})

describe('askQuestion', () => {
  it('creates a question with generated id', () => {
    const q = store.askQuestion({
      title: 'Test question?',
      body: 'Test body content',
      tags: ['test'],
      author: 'alice',
    })
    expect(q.id).toMatch(/^q_/)
    expect(q.title).toBe('Test question?')
    expect(q.votes).toBe(0)
    expect(q.createdAt).toBeGreaterThan(0)
  })

  it('generates unique ids', () => {
    const a = store.askQuestion({ title: 'A?', body: 'body', tags: [], author: 'x' })
    const b = store.askQuestion({ title: 'B?', body: 'body', tags: [], author: 'x' })
    expect(a.id).not.toBe(b.id)
  })
})

describe('answerQuestion', () => {
  it('attaches answer to question', () => {
    const q = store.askQuestion({ title: 'A?', body: 'body', tags: [], author: 'x' })
    const a = store.answerQuestion({ questionId: q.id, body: 'because', author: 'y' })
    expect(a.questionId).toBe(q.id)
    expect(a.accepted).toBe(false)
  })

  it('throws on unknown question', () => {
    expect(() =>
      store.answerQuestion({ questionId: 'q_999', body: 'x', author: 'y' }),
    ).toThrow(/not found/)
  })
})

describe('getQuestion', () => {
  it('returns question with sorted answers', () => {
    const q = store.askQuestion({ title: 'A?', body: 'body', tags: [], author: 'asker' })
    const a1 = store.answerQuestion({ questionId: q.id, body: 'first', author: 'x' })
    const a2 = store.answerQuestion({ questionId: q.id, body: 'second', author: 'y' })
    store.voteAnswer(a2.id, 1)
    store.voteAnswer(a2.id, 1)
    store.voteAnswer(a1.id, 1)

    const result = store.getQuestion(q.id)
    expect(result?.answers).toHaveLength(2)
    // a2 should rank higher (more votes)
    expect(result?.answers[0].id).toBe(a2.id)
  })

  it('places accepted answer first regardless of votes', () => {
    const q = store.askQuestion({ title: 'A?', body: 'body', tags: [], author: 'asker' })
    const a1 = store.answerQuestion({ questionId: q.id, body: 'first', author: 'x' })
    const a2 = store.answerQuestion({ questionId: q.id, body: 'second', author: 'y' })
    store.voteAnswer(a2.id, 1)
    store.voteAnswer(a2.id, 1)
    store.acceptAnswer(a1.id, 'asker')

    const result = store.getQuestion(q.id)
    expect(result?.answers[0].id).toBe(a1.id)
    expect(result?.answers[0].accepted).toBe(true)
  })

  it('returns undefined for unknown id', () => {
    expect(store.getQuestion('q_999')).toBeUndefined()
  })
})

describe('searchQuestions', () => {
  beforeEach(() => {
    store.askQuestion({ title: 'How to debug MCP', body: 'stuck', tags: ['mcp'], author: 'a' })
    store.askQuestion({ title: 'React hooks rules', body: 'useEffect', tags: ['react'], author: 'b' })
    store.askQuestion({ title: 'MCP rate limiting', body: 'how', tags: ['mcp'], author: 'c' })
  })

  it('matches substring in title and body', () => {
    const results = store.searchQuestions('MCP')
    expect(results).toHaveLength(2)
  })

  it('filters by tag', () => {
    const results = store.searchQuestions('', { tag: 'react' })
    expect(results).toHaveLength(1)
    expect(results[0].tags).toContain('react')
  })

  it('respects limit', () => {
    const results = store.searchQuestions('', { limit: 1 })
    expect(results).toHaveLength(1)
  })

  it('sorts by votes descending', () => {
    const all = store.searchQuestions('')
    const q2 = all.find((q) => q.title === 'React hooks rules')
    expect(q2).toBeDefined()
    if (!q2) return
    store.voteQuestion(q2.id, 1)
    store.voteQuestion(q2.id, 1)
    store.voteQuestion(q2.id, 1)
    const results = store.searchQuestions('')
    expect(results[0].id).toBe(q2.id)
  })
})

describe('voting', () => {
  it('increments and decrements question votes', () => {
    const q = store.askQuestion({ title: 'A?', body: 'b', tags: [], author: 'x' })
    store.voteQuestion(q.id, 1)
    store.voteQuestion(q.id, 1)
    store.voteQuestion(q.id, -1)
    expect(store.getQuestion(q.id)?.question.votes).toBe(1)
  })

  it('returns undefined for unknown id', () => {
    expect(store.voteQuestion('q_999', 1)).toBeUndefined()
    expect(store.voteAnswer('a_999', 1)).toBeUndefined()
  })
})

describe('acceptAnswer', () => {
  it('only asker can accept', () => {
    const q = store.askQuestion({ title: 'A?', body: 'b', tags: [], author: 'alice' })
    const a = store.answerQuestion({ questionId: q.id, body: 'x', author: 'bob' })
    const result = store.acceptAnswer(a.id, 'bob')
    expect('error' in result).toBe(true)
  })

  it('only one answer can be accepted at a time', () => {
    const q = store.askQuestion({ title: 'A?', body: 'b', tags: [], author: 'alice' })
    const a1 = store.answerQuestion({ questionId: q.id, body: 'x', author: 'b' })
    const a2 = store.answerQuestion({ questionId: q.id, body: 'y', author: 'c' })
    store.acceptAnswer(a1.id, 'alice')
    store.acceptAnswer(a2.id, 'alice')
    const result = store.getQuestion(q.id)
    expect(result).toBeDefined()
    if (!result) return
    expect(result.answers.find((a) => a.id === a1.id)?.accepted).toBe(false)
    expect(result.answers.find((a) => a.id === a2.id)?.accepted).toBe(true)
  })

  it('returns error for unknown answer', () => {
    const result = store.acceptAnswer('a_999', 'alice')
    expect('error' in result).toBe(true)
  })
})

describe('stats', () => {
  it('counts questions, answers, and votes', () => {
    const q = store.askQuestion({ title: 'A?', body: 'b', tags: [], author: 'x' })
    store.answerQuestion({ questionId: q.id, body: 'y', author: 'z' })
    store.voteQuestion(q.id, 1)
    store.voteQuestion(q.id, 1)
    const s = store.stats()
    expect(s.questions).toBe(1)
    expect(s.answers).toBe(1)
    expect(s.totalVotes).toBe(2)
  })
})
