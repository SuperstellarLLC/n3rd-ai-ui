import type { TestToolResult, TestResourceResult, TestPromptResult } from './client.js'

export function assertToolSuccess(result: TestToolResult): void {
  if (result.isError) {
    const text = result.content?.[0]?.text ?? 'Unknown error'
    throw new Error(`Expected tool success but got error: ${text}`)
  }
}

export function assertToolError(result: TestToolResult): void {
  if (!result.isError) {
    throw new Error('Expected tool error but got success')
  }
}

export function assertToolText(result: TestToolResult, expected: string | RegExp): void {
  assertToolSuccess(result)
  const text = result.content
    ?.filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('')

  if (typeof expected === 'string') {
    if (text !== expected) {
      throw new Error(`Expected text "${expected}" but got "${text}"`)
    }
  } else {
    if (!text || !expected.test(text)) {
      throw new Error(`Expected text matching ${expected} but got "${text}"`)
    }
  }
}

export function assertToolErrorText(result: TestToolResult, expected: string | RegExp): void {
  assertToolError(result)
  const text = result.content
    ?.filter((c) => c.type === 'text')
    .map((c) => c.text)
    .join('')

  if (typeof expected === 'string') {
    if (text !== expected) {
      throw new Error(`Expected error text "${expected}" but got "${text}"`)
    }
  } else {
    if (!text || !expected.test(text)) {
      throw new Error(`Expected error text matching ${expected} but got "${text}"`)
    }
  }
}

export function assertResourceText(result: TestResourceResult, expected: string | RegExp): void {
  const text = result.contents
    ?.map((c) => c.text)
    .filter(Boolean)
    .join('')

  if (typeof expected === 'string') {
    if (text !== expected) {
      throw new Error(`Expected resource text "${expected}" but got "${text}"`)
    }
  } else {
    if (!text || !expected.test(text)) {
      throw new Error(`Expected resource text matching ${expected} but got "${text}"`)
    }
  }
}

export function assertPromptMessages(result: TestPromptResult, expectedCount: number): void {
  if (result.messages.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} prompt messages but got ${result.messages.length}`)
  }
}

export function assertPromptContains(result: TestPromptResult, text: string): void {
  const allText = result.messages.map((m) => m.content?.text ?? '').join('\n')

  if (!allText.includes(text)) {
    throw new Error(`Expected prompt to contain "${text}" but it doesn't`)
  }
}
