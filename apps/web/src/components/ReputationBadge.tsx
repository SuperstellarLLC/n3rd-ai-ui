/**
 * ReputationBadge — the one visual asset that defines n3rd.ai's product surface.
 *
 * Displays a server's reputation score (0-100) in an ASCII-framed card.
 * This is the embeddable asset users paste into their README — the viral loop.
 *
 * Scoring bands:
 *   90-100  excellent  (accent color)
 *   70-89   good       (accent color)
 *   50-69   fair       (warning color)
 *    0-49   unverified (danger color)
 */
import { Box, Stack, Text } from '@n3rd-ai/ui'

export interface ReputationBadgeProps {
  server: string
  score: number
  uptimePct?: number
  callsPerDay?: number
  verified?: boolean
  size?: 'sm' | 'md' | 'lg'
}

type BadgeColor = 'accent' | 'success' | 'warning' | 'danger'

export function ReputationBadge({
  server,
  score,
  uptimePct,
  callsPerDay,
  verified = true,
  size = 'md',
}: ReputationBadgeProps) {
  const band = getBand(score)
  const width = size === 'lg' ? 340 : size === 'sm' ? 220 : 280

  return (
    <Box
      border="double"
      padding="md"
      title={`n3rd · ${server}`}
      style={{ maxWidth: width, display: 'inline-block' }}
    >
      <Stack gap="sm">
        <Text size="2xl" bold color={band.color}>
          {score}
          <Text size="sm" color="tertiary" as="span">
            {' / 100'}
          </Text>
        </Text>
        <Text size="xs" color={band.color}>
          {verified ? '✓ verified' : '· unverified'} · {band.label}
        </Text>
        {(uptimePct !== undefined || callsPerDay !== undefined) && (
          <Text size="xs" color="secondary">
            {uptimePct !== undefined && `↑ ${uptimePct.toFixed(1)}%`}
            {uptimePct !== undefined && callsPerDay !== undefined && ' · '}
            {callsPerDay !== undefined && `⚡ ${formatCount(callsPerDay)}/day`}
          </Text>
        )}
      </Stack>
    </Box>
  )
}

function getBand(score: number): { label: string; color: BadgeColor } {
  if (score >= 90) return { label: 'excellent', color: 'success' }
  if (score >= 70) return { label: 'good', color: 'accent' }
  if (score >= 50) return { label: 'fair', color: 'warning' }
  return { label: 'unverified', color: 'danger' }
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
