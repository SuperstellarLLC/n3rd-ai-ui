import { describe, it, expect } from 'vitest'
import { computeScore, computePublicScore } from '../src/compute.js'

describe('computeScore', () => {
  it('returns 100 for a perfect server', () => {
    const result = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 1000,
    })
    expect(result.score).toBe(100)
    expect(result.band).toBe('excellent')
    expect(result.color).toBe('green')
  })

  it('returns 0 for worst possible inputs', () => {
    const result = computeScore({
      uptimePct: 0,
      errorRate: 1,
      p95Ms: 10_000,
      toolCount: 0,
      callsTotal: 1000,
    })
    expect(result.score).toBe(0)
  })

  it('weights uptime at 40%', () => {
    const full = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 100,
    })
    const half = computeScore({
      uptimePct: 50,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 100,
    })
    expect(full.score - half.score).toBe(20) // 40% of 100 * 0.5 = 20
  })

  it('weights reliability at 30%', () => {
    const good = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 100,
    })
    const bad = computeScore({
      uptimePct: 100,
      errorRate: 1,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 100,
    })
    expect(good.score - bad.score).toBe(30)
  })

  it('caps latency impact at 5000ms', () => {
    const fast = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 100,
    })
    const slow = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 5000,
      toolCount: 10,
      callsTotal: 100,
    })
    const slower = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 10_000,
      toolCount: 10,
      callsTotal: 100,
    })
    expect(fast.score - slow.score).toBe(20) // full speed penalty
    expect(slow.score).toBe(slower.score) // capped at ceiling
  })

  it('caps tool count at 10', () => {
    const ten = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 100,
    })
    const fifty = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 50,
      callsTotal: 100,
    })
    expect(ten.score).toBe(fifty.score)
  })

  it('returns unverified band when callsTotal < 10', () => {
    const result = computeScore({
      uptimePct: 100,
      errorRate: 0,
      p95Ms: 0,
      toolCount: 10,
      callsTotal: 5,
    })
    expect(result.band).toBe('unverified')
    expect(result.color).toBe('red')
  })

  it('classifies bands correctly', () => {
    expect(
      computeScore({ uptimePct: 100, errorRate: 0, p95Ms: 0, toolCount: 10, callsTotal: 100 }).band,
    ).toBe('excellent')
    expect(
      computeScore({ uptimePct: 80, errorRate: 0.05, p95Ms: 500, toolCount: 5, callsTotal: 100 })
        .band,
    ).toBe('good')
    expect(
      computeScore({ uptimePct: 60, errorRate: 0.3, p95Ms: 2000, toolCount: 3, callsTotal: 100 })
        .band,
    ).toBe('fair')
  })

  it('clamps negative inputs to 0', () => {
    const result = computeScore({
      uptimePct: -10,
      errorRate: 2,
      p95Ms: -100,
      toolCount: -5,
      callsTotal: 100,
    })
    expect(result.score).toBeGreaterThanOrEqual(0)
  })

  it('returns sub-scores in breakdown', () => {
    const result = computeScore({
      uptimePct: 80,
      errorRate: 0.1,
      p95Ms: 1000,
      toolCount: 5,
      callsTotal: 100,
    })
    expect(result.uptime).toBeCloseTo(0.8)
    expect(result.reliability).toBeCloseTo(0.9)
    expect(result.speed).toBeCloseTo(0.8)
    expect(result.breadth).toBeCloseTo(0.5)
  })
})

describe('computePublicScore', () => {
  it('starts at 50 baseline', () => {
    expect(computePublicScore({})).toBe(50)
  })

  it('adds up to 20 for high npm downloads', () => {
    expect(computePublicScore({ npmWeeklyDownloads: 200_000 })).toBe(70)
  })

  it('adds points for GitHub stars', () => {
    expect(computePublicScore({ githubStars: 15_000 })).toBe(65)
  })

  it('adds points for recent commits', () => {
    expect(computePublicScore({ lastCommitDaysAgo: 5 })).toBe(60)
  })

  it('penalizes abandoned repos', () => {
    expect(computePublicScore({ lastCommitDaysAgo: 500 })).toBe(40)
  })

  it('adds points for types and small size', () => {
    expect(computePublicScore({ hasTypes: true, packageSizeKb: 50 })).toBeCloseTo(55)
  })

  it('clamps to 0-100', () => {
    const high = computePublicScore({
      npmWeeklyDownloads: 1_000_000,
      githubStars: 50_000,
      lastCommitDaysAgo: 1,
      hasTypes: true,
      packageSizeKb: 10,
    })
    expect(high).toBeLessThanOrEqual(100)
    expect(high).toBeGreaterThanOrEqual(0)
  })
})
