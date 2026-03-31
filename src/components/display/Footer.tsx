import type { CSSProperties } from 'react'
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
  branding = 'built with n3rd.ai',
  className,
  style,
}: FooterProps) {
  return (
    <footer className={`n3rd-footer ${className ?? ''}`} style={style}>
      {branding && <div className="n3rd-footer-branding">── {branding} ──</div>}

      <div className="n3rd-footer-starfield" aria-hidden="true">
        <div className="n3rd-footer-star-row">{'·  ✦    ·          ·          ·    ✦  ·'}</div>
        <div className="n3rd-footer-star-row">{'    ·      ✦     ·    ·      ·           ·'}</div>
        <div className="n3rd-footer-star-row">{'✦            ·          ·  ✦         ·  ·'}</div>
        <div className="n3rd-footer-star-row">{'    ·    ·         ✦       ·        ✦'}</div>
      </div>

      <div className="n3rd-footer-sunset" aria-hidden="true">
        {/* Semicircle: widths follow sqrt curve, steep at top, flat at bottom */}
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '26%', background: 'var(--n3rd-accent-violet)' }}
        />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '42%', background: 'var(--n3rd-accent-violet)' }}
        />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '52%', background: 'var(--n3rd-accent-purple)' }}
        />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '60%', background: 'var(--n3rd-accent-lavender)' }}
        />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '66%', background: 'var(--n3rd-accent-pink)' }}
        />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '71%', background: 'var(--n3rd-accent-pink)' }}
        />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '75%', background: 'var(--n3rd-accent-rose)' }}
        />
        {/* Horizon gaps — sun dipping behind the water */}
        <div className="n3rd-footer-sun-gap" />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '78%', background: 'var(--n3rd-accent-rose)' }}
        />
        <div className="n3rd-footer-sun-gap" />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '80%', background: 'var(--n3rd-accent-rose)' }}
        />
        <div className="n3rd-footer-sun-gap" style={{ height: '3px' }} />
        <div
          className="n3rd-footer-sun-line"
          style={{ width: '82%', background: 'var(--n3rd-accent-rose)' }}
        />
      </div>

      <div className="n3rd-footer-horizon" aria-hidden="true">
        <div className="n3rd-footer-horizon-bright" />
        <div className="n3rd-footer-reflection" />
        <div className="n3rd-footer-reflection-dashed" />
      </div>

      {tagline && <div className="n3rd-footer-tagline">{tagline.toUpperCase()}</div>}

      {links.length > 0 && (
        <nav className="n3rd-footer-links" aria-label="Footer">
          <ul className="n3rd-footer-link-list">
            {links.map((link, i) => (
              <li key={link.href}>
                {i > 0 && (
                  <span className="n3rd-footer-sep" aria-hidden="true">
                    {' '}
                    │{' '}
                  </span>
                )}
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="n3rd-footer-link"
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
