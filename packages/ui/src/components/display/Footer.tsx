import type { CSSProperties } from 'react'
import { legacyClassName } from '../../utils'
import './Footer.css'

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
  branding = 'built with boum.ai',
  className,
  style,
}: FooterProps) {
  return (
    <footer className={legacyClassName('boum-footer', className ?? '')} style={style}>
      {branding && <div className={legacyClassName('boum-footer-branding')}>── {branding} ──</div>}

      <div className={legacyClassName('boum-footer-starfield')} aria-hidden="true">
        <div className={legacyClassName('boum-footer-star-row')}>
          {'·  ✦    ·          ·          ·    ✦  ·'}
        </div>
        <div className={legacyClassName('boum-footer-star-row')}>
          {'    ·      ✦     ·    ·      ·           ·'}
        </div>
        <div className={legacyClassName('boum-footer-star-row')}>
          {'✦            ·          ·  ✦         ·  ·'}
        </div>
        <div className={legacyClassName('boum-footer-star-row')}>
          {'    ·    ·         ✦       ·        ✦'}
        </div>
      </div>

      <div className={legacyClassName('boum-footer-sunset')} aria-hidden="true">
        {/* Semicircle: widths follow sqrt curve, steep at top, flat at bottom */}
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '26%', background: 'var(--boum-accent-violet)' }}
        />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '42%', background: 'var(--boum-accent-violet)' }}
        />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '52%', background: 'var(--boum-accent-purple)' }}
        />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '60%', background: 'var(--boum-accent-lavender)' }}
        />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '66%', background: 'var(--boum-accent-pink)' }}
        />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '71%', background: 'var(--boum-accent-pink)' }}
        />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '75%', background: 'var(--boum-accent-rose)' }}
        />
        {/* Horizon gaps — sun dipping behind the water */}
        <div className={legacyClassName('boum-footer-sun-gap')} />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '78%', background: 'var(--boum-accent-rose)' }}
        />
        <div className={legacyClassName('boum-footer-sun-gap')} />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '80%', background: 'var(--boum-accent-rose)' }}
        />
        <div className={legacyClassName('boum-footer-sun-gap')} style={{ height: '3px' }} />
        <div
          className={legacyClassName('boum-footer-sun-line')}
          style={{ width: '82%', background: 'var(--boum-accent-rose)' }}
        />
      </div>

      <div className={legacyClassName('boum-footer-horizon')} aria-hidden="true">
        <div className={legacyClassName('boum-footer-horizon-bright')} />
        <div className={legacyClassName('boum-footer-reflection')} />
        <div className={legacyClassName('boum-footer-reflection-dashed')} />
      </div>

      {tagline && (
        <div className={legacyClassName('boum-footer-tagline')}>{tagline.toUpperCase()}</div>
      )}

      {links.length > 0 && (
        <nav className={legacyClassName('boum-footer-links')} aria-label="Footer">
          <ul className={legacyClassName('boum-footer-link-list')}>
            {links.map((link, i) => (
              <li key={link.href}>
                {i > 0 && (
                  <span className={legacyClassName('boum-footer-sep')} aria-hidden="true">
                    {' '}
                    │{' '}
                  </span>
                )}
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={legacyClassName('boum-footer-link')}
                >
                  {link.label}
                  {link.external ? ' ↗' : ''}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </footer>
  )
}

Footer.displayName = 'Footer'
