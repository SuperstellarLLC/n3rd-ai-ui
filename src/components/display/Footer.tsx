import type { CSSProperties } from 'react'
import styles from './Footer.module.css'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

export interface FooterProps {
  tagline?: string
  links?: FooterLink[]
  branding?: string
  className?: string
  style?: CSSProperties
}

export function Footer({
  tagline = "where we're going, we don't need images",
  links = [],
  branding = 'built with n3rd.ai',
  className,
  style,
}: FooterProps) {
  return (
    <footer className={`${styles.footer} ${className ?? ''}`} style={style}>
      {branding && <div className={styles.branding}>── {branding} ──</div>}

      <div className={styles.starfield} aria-hidden="true">
        <div className={styles.starRow}>{'·  ✦    ·          ·          ·    ✦  ·'}</div>
        <div className={styles.starRow}>{'    ·      ✦     ·    ·      ·           ·'}</div>
        <div className={styles.starRow}>{'✦            ·          ·  ✦         ·  ·'}</div>
        <div className={styles.starRow}>{'    ·    ·         ✦       ·        ✦'}</div>
      </div>

      <div className={styles.sunset} aria-hidden="true">
        <div className={styles.sunLine} style={{ width: '30%', background: '#7c3aed' }} />
        <div className={styles.sunLine} style={{ width: '45%', background: '#a855f7' }} />
        <div className={styles.sunGap} />
        <div className={styles.sunLine} style={{ width: '55%', background: '#c084fc' }} />
        <div className={styles.sunLine} style={{ width: '62%', background: '#ec4899' }} />
        <div className={styles.sunGap} />
        <div className={styles.sunLine} style={{ width: '70%', background: '#f472b6' }} />
        <div className={styles.sunLine} style={{ width: '78%', background: '#fb7185' }} />
        <div className={styles.sunGap} style={{ height: '3px' }} />
        <div className={styles.sunLine} style={{ width: '85%', background: '#fda4af' }} />
        <div className={styles.sunLine} style={{ width: '92%', background: '#fecdd3' }} />
      </div>

      <div className={styles.horizon} aria-hidden="true">
        <div className={styles.horizonBright} />
        <div className={styles.reflection} />
        <div className={styles.reflectionDashed} />
        <div className={styles.reflection} style={{ opacity: 0.4 }} />
        <div className={styles.reflectionDashed} style={{ opacity: 0.2 }} />
      </div>

      {tagline && <div className={styles.tagline}>{tagline.toUpperCase()}</div>}

      {links.length > 0 && (
        <nav className={styles.links}>
          {links.map((link, i) => (
            <span key={link.label}>
              {i > 0 && <span className={styles.sep}> │ </span>}
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className={styles.link}
              >
                {link.label}
                {link.external ? ' ↗' : ''}
              </a>
            </span>
          ))}
        </nav>
      )}
    </footer>
  )
}
