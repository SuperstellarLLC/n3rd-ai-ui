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
        <div className="n3rd-footer-sun-line" style={{ width: '20%', background: '#7c3aed' }} />
        <div className="n3rd-footer-sun-line" style={{ width: '30%', background: '#a855f7' }} />
        <div className="n3rd-footer-sun-gap" />
        <div className="n3rd-footer-sun-line" style={{ width: '37%', background: '#c084fc' }} />
        <div className="n3rd-footer-sun-line" style={{ width: '42%', background: '#ec4899' }} />
        <div className="n3rd-footer-sun-gap" />
        <div className="n3rd-footer-sun-line" style={{ width: '47%', background: '#f472b6' }} />
        <div className="n3rd-footer-sun-line" style={{ width: '52%', background: '#fb7185' }} />
        <div className="n3rd-footer-sun-gap" style={{ height: '3px' }} />
        <div className="n3rd-footer-sun-line" style={{ width: '57%', background: '#fda4af' }} />
        <div className="n3rd-footer-sun-line" style={{ width: '62%', background: '#fecdd3' }} />
      </div>

      <div className="n3rd-footer-horizon" aria-hidden="true">
        <div className="n3rd-footer-horizon-bright" />
        <div className="n3rd-footer-reflection" />
        <div className="n3rd-footer-reflection-dashed" />
        <div className="n3rd-footer-reflection" style={{ opacity: 0.4 }} />
        <div className="n3rd-footer-reflection-dashed" style={{ opacity: 0.2 }} />
      </div>

      {tagline && <div className="n3rd-footer-tagline">{tagline.toUpperCase()}</div>}

      {links.length > 0 && (
        <nav className="n3rd-footer-links">
          {links.map((link, i) => (
            <span key={link.label}>
              {i > 0 && <span className="n3rd-footer-sep"> │ </span>}
              <a
                href={link.href}
                {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="n3rd-footer-link"
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
