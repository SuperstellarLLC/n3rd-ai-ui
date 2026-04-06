/**
 * Reputation score computation — the one number that matters.
 *
 * score = 0.40 × uptime    (are you available?)
 *       + 0.30 × reliability (do your tools succeed?)
 *       + 0.20 × speed      (are you fast?)
 *       + 0.10 × breadth    (do you have enough tools?)
 *
 * Each sub-score is normalized to [0, 1]. Final score is [0, 100].
 */

export interface ScoreInputs {
  /** Uptime percentage 0-100 over the scoring window */
  uptimePct: number
  /** Fraction of tool calls that returned errors (0-1) */
  errorRate: number
  /** 95th percentile response time in milliseconds */
  p95Ms: number
  /** Number of distinct tools registered */
  toolCount: number
  /** Total tool calls in the scoring window */
  callsTotal: number
}

export interface ScoreBreakdown {
  score: number
  uptime: number
  reliability: number
  speed: number
  breadth: number
  band: 'excellent' | 'good' | 'fair' | 'unverified'
  color: 'green' | 'blue' | 'yellow' | 'red'
}

const WEIGHTS = {
  uptime: 0.4,
  reliability: 0.3,
  speed: 0.2,
  breadth: 0.1,
} as const

/** Latency ceiling in ms — anything above this scores 0 for speed */
const LATENCY_CEILING_MS = 5000

/** Tool count cap — having more than this doesn't help */
const TOOL_COUNT_CAP = 10

/** Minimum calls required to produce a verified score */
const MIN_CALLS_FOR_VERIFIED = 10

export function computeScore(inputs: ScoreInputs): ScoreBreakdown {
  const uptime = clamp(inputs.uptimePct / 100)
  const reliability = clamp(1 - inputs.errorRate)
  const speed = clamp(1 - Math.min(inputs.p95Ms / LATENCY_CEILING_MS, 1))
  const breadth = clamp(Math.min(inputs.toolCount, TOOL_COUNT_CAP) / TOOL_COUNT_CAP)

  const raw =
    uptime * WEIGHTS.uptime +
    reliability * WEIGHTS.reliability +
    speed * WEIGHTS.speed +
    breadth * WEIGHTS.breadth

  const score = Math.round(raw * 100)
  const band =
    inputs.callsTotal < MIN_CALLS_FOR_VERIFIED
      ? 'unverified'
      : score >= 90
        ? 'excellent'
        : score >= 70
          ? 'good'
          : score >= 50
            ? 'fair'
            : 'unverified'

  const color =
    band === 'excellent' ? 'green' : band === 'good' ? 'blue' : band === 'fair' ? 'yellow' : 'red'

  return { score, uptime, reliability, speed, breadth, band, color }
}

/**
 * Compute an initial score from public signals (npm downloads, GitHub stars, etc.)
 * Used for pre-seeding before any attestation data exists.
 */
export function computePublicScore(signals: {
  npmWeeklyDownloads?: number
  githubStars?: number
  lastCommitDaysAgo?: number
  hasTypes?: boolean
  packageSizeKb?: number
}): number {
  let score = 50 // base

  // Popularity (up to +20)
  if (signals.npmWeeklyDownloads !== undefined) {
    if (signals.npmWeeklyDownloads > 100_000) score += 20
    else if (signals.npmWeeklyDownloads > 10_000) score += 15
    else if (signals.npmWeeklyDownloads > 1_000) score += 10
    else if (signals.npmWeeklyDownloads > 100) score += 5
  }

  // Trust (up to +15)
  if (signals.githubStars !== undefined) {
    if (signals.githubStars > 10_000) score += 15
    else if (signals.githubStars > 1_000) score += 10
    else if (signals.githubStars > 100) score += 5
  }

  // Maintenance (up to +10, or penalty)
  if (signals.lastCommitDaysAgo !== undefined) {
    if (signals.lastCommitDaysAgo < 30) score += 10
    else if (signals.lastCommitDaysAgo < 90) score += 5
    else if (signals.lastCommitDaysAgo > 365) score -= 10
  }

  // Quality (up to +5)
  if (signals.hasTypes) score += 3
  if (signals.packageSizeKb !== undefined && signals.packageSizeKb < 100) score += 2

  return clamp(score / 100) * 100
}

function clamp(n: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, n))
}
