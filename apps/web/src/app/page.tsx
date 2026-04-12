import Image from 'next/image'
import styles from './page.module.css'
import { WaitlistForm } from '@/components/WaitlistForm'

type ImageShowcaseCard = {
  kind: 'image'
  eyebrow: string
  title: string
  description: string
  image: string
  alt: string
  chips: string[]
}

type CodeShowcaseCard = {
  kind: 'code'
  eyebrow: string
  title: string
  description: string
  chips: string[]
}

const heroHomes = [
  {
    title: 'Seestrasse Loft',
    details: '3 bed · 142 m² · Lake view',
    price: 'CHF 3,980',
    verdict: 'Best overall fit',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    alt: 'Modern apartment kitchen with wood finishes and large windows.',
  },
  {
    title: 'Kreis 5 Penthouse',
    details: '2 bed · 118 m² · Morning light',
    price: 'CHF 3,720',
    verdict: 'Strong value',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bright apartment living room with soft furniture and a city-facing window.',
  },
]

const showcaseCards: Array<ImageShowcaseCard | CodeShowcaseCard> = [
  {
    kind: 'image',
    eyebrow: 'Summer shoes',
    title: 'See the trade-offs, not just the paragraph.',
    description:
      'Compare comfort, support, waterproofing, and style in one living view with galleries, notes, and price deltas.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    alt: 'Bright athletic shoes displayed against a colorful background.',
    chips: ['Gallery view', 'Comfort notes', 'Price deltas'],
  },
  {
    kind: 'image',
    eyebrow: 'Home search',
    title: 'Line up kitchens, views, commutes, and numbers.',
    description:
      'Turn a messy property search into a clean shortlist with side-by-side photos, scoring, and deal-breaker filters.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    alt: 'High-end kitchen interior with wide windows and natural light.',
    chips: ['Photo compare', 'Commute math', 'Budget guardrails'],
  },
  {
    kind: 'image',
    eyebrow: 'Travel planning',
    title: 'Move from itinerary text to a trip workspace.',
    description:
      'Keep flights, neighborhoods, hotel options, walking times, and budget assumptions visible at once while you refine.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Coastal travel scene with turquoise water and beach umbrellas.',
    chips: ['Maps', 'Cost tracker', 'Editable schedule'],
  },
  {
    kind: 'code',
    eyebrow: 'Code review',
    title: 'Ship richer technical answers than plain markdown.',
    description:
      'Render diffs, architecture notes, performance hotspots, and verification steps in a workspace that feels built for engineering teams.',
    chips: ['Diff views', 'Risk callouts', 'Source-linked notes'],
  },
]

const productPrinciples = [
  {
    step: '01',
    title: 'Ask normally',
    body: 'Users type the same natural prompts they already use in Claude or ChatGPT. No new language to learn.',
  },
  {
    step: '02',
    title: 'Render structured views',
    body: 'n3rd turns the answer into trusted UI blocks like compare tables, galleries, maps, calculators, and review panels.',
  },
  {
    step: '03',
    title: 'Refine in place',
    body: 'Filters, preferences, and follow-up prompts keep the view alive so users can iterate without losing context.',
  },
]

const trustSignals = [
  'Interactive comparisons instead of walls of text',
  'Live preferences and editable views inside the conversation',
  'Sources, numbers, and reasoning attached to every card',
]

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundAura} aria-hidden="true" />

      <header className={styles.header}>
        <a href="#top" className={styles.brand}>
          n3rd.ai
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <a href="#use-cases">Use cases</a>
          <a href="#experience">Experience</a>
          <a href="#waitlist">Waitlist</a>
        </nav>

        <a href="#waitlist" className={styles.headerCta}>
          Join waitlist
        </a>
      </header>

      <section id="top" className={styles.heroSection}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Frontier UI for frontier AI</p>
          <h1 className={styles.heroTitle}>AI should answer with interfaces, not documents.</h1>
          <p className={styles.heroDescription}>
            n3rd turns long AI responses into interactive views you can actually use. Compare
            products, homes, trips, and code in galleries, tables, maps, and workspaces that adapt
            as fast as you think.
          </p>

          <div className={styles.heroActions}>
            <a href="#waitlist" className={styles.primaryButton}>
              Join the waitlist
            </a>
            <a href="#use-cases" className={styles.secondaryButton}>
              Explore the vision
            </a>
          </div>

          <ul className={styles.signalList}>
            {trustSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.mockWindow}>
            <div className={styles.windowTopbar}>
              <div className={styles.windowDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.windowTabs}>
                <span>Homes</span>
                <span>Shoes</span>
                <span>Trips</span>
                <span>Code</span>
              </div>
            </div>

            <div className={styles.workspace}>
              <aside className={styles.workspaceSidebar}>
                <div className={styles.promptCard}>
                  <span className={styles.promptLabel}>Prompt</span>
                  <p>
                    Find a bright Zurich apartment under CHF 4k and compare kitchens, views,
                    commute, and overall value.
                  </p>
                </div>

                <div className={styles.filterStack}>
                  <span className={styles.filterChip}>Morning light</span>
                  <span className={styles.filterChip}>Walkable area</span>
                  <span className={styles.filterChip}>Quiet street</span>
                  <span className={styles.filterChip}>Lake or skyline view</span>
                </div>

                <div className={styles.summaryCard}>
                  <span className={styles.summaryLabel}>n3rd insight</span>
                  <p>
                    Seestrasse Loft wins on kitchen quality and natural light. Kreis 5 gives the
                    strongest price-to-space ratio.
                  </p>
                </div>
              </aside>

              <div className={styles.workspaceMain}>
                <div className={styles.compareHeader}>
                  <div>
                    <p className={styles.compareEyebrow}>Live comparison</p>
                    <h2>Apartment shortlist</h2>
                  </div>
                  <p className={styles.compareMeta}>2 saved views · 1 updated preference</p>
                </div>

                <div className={styles.homeGrid}>
                  {heroHomes.map((home) => (
                    <article key={home.title} className={styles.homeCard}>
                      <div className={styles.homeImageWrap}>
                        <Image
                          src={home.image}
                          alt={home.alt}
                          fill
                          priority
                          sizes="(max-width: 960px) 100vw, 26vw"
                          className={styles.coverImage}
                        />
                      </div>
                      <div className={styles.homeBody}>
                        <div>
                          <h3>{home.title}</h3>
                          <p>{home.details}</p>
                        </div>
                        <div className={styles.homeMetrics}>
                          <span>{home.price}</span>
                          <span>{home.verdict}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={styles.scorePanel}>
                  <div>
                    <p className={styles.compareEyebrow}>Why it works</p>
                    <h3>Answers become a surface you can steer.</h3>
                  </div>
                  <div className={styles.scoreRows}>
                    <div>
                      <span>Kitchen quality</span>
                      <strong>9.4</strong>
                    </div>
                    <div>
                      <span>Commute fit</span>
                      <strong>8.8</strong>
                    </div>
                    <div>
                      <span>Value score</span>
                      <strong>8.6</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.floatingCard}>
            <p className={styles.compareEyebrow}>Quick swap</p>
            <h3>Summer shoes</h3>
            <p>Side-by-side fit notes, heat comfort, and waterproof trade-offs.</p>
          </div>

          <div className={styles.floatingCode}>
            <p className={styles.compareEyebrow}>Code review view</p>
            <pre>{`+ keep inline risk callouts\n+ surface tests beside diff\n- bury key regressions in prose`}</pre>
          </div>
        </div>
      </section>

      <section id="use-cases" className={styles.section}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Real-life experiences</p>
          <h2>Decision-heavy workflows become visual, fast, and obvious.</h2>
          <p>
            The best early wedge is not generic chat. It is helping people make better decisions
            when plain text is too clumsy to hold the full picture.
          </p>
        </div>

        <div className={styles.showcaseGrid}>
          {showcaseCards.map((card) => (
            <article key={card.title} className={styles.showcaseCard}>
              {card.kind === 'image' ? (
                <div className={styles.showcaseImageWrap}>
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 960px) 100vw, 33vw"
                    className={styles.coverImage}
                  />
                </div>
              ) : (
                <div className={styles.codeCardPreview}>
                  <div className={styles.codeCardHeader}>
                    <span>Changed files</span>
                    <span>4</span>
                  </div>
                  <div className={styles.codeRows}>
                    <span>[P1] Unsafe HTML render path</span>
                    <span>[P2] Missing loading state in compare view</span>
                    <span>Suggested tests ready</span>
                  </div>
                </div>
              )}

              <div className={styles.showcaseContent}>
                <p className={styles.showcaseEyebrow}>{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.showcaseChips}>
                  {card.chips.map((chip) => (
                    <span key={chip}>{chip}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className={styles.experienceSection}>
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>The product thesis</p>
          <h2>Chat was the prototype. The future is conversational software.</h2>
          <p>
            Frontier models already understand nuance. The missing layer is an interface runtime
            that can hold comparisons, choices, media, and edits without collapsing back into a
            scrolling transcript.
          </p>
        </div>

        <div className={styles.experienceGrid}>
          <article className={styles.textWallCard}>
            <p className={styles.compareEyebrow}>What users get today</p>
            <h3>A wall of text</h3>
            <p>
              Helpful, but hard to scan, hard to compare, and too easy to lose once the next prompt
              lands.
            </p>
            <div className={styles.textWallBlock}>
              <p>
                Option 1 has the best kitchen but costs slightly more. Option 2 is a better value if
                commute matters. Option 3 has strong natural light although the layout feels less
                efficient...
              </p>
            </div>
          </article>

          <article className={styles.interfaceCard}>
            <p className={styles.compareEyebrow}>What n3rd makes possible</p>
            <h3>A live interface</h3>
            <p>
              The answer keeps its shape: filters remain editable, sources stay visible, and the UI
              updates as the conversation evolves.
            </p>
            <div className={styles.interfaceList}>
              <span>Gallery</span>
              <span>Compare table</span>
              <span>Calculator</span>
              <span>Map</span>
              <span>Diff viewer</span>
              <span>Source drawer</span>
            </div>
          </article>
        </div>

        <div className={styles.principlesGrid}>
          {productPrinciples.map((item) => (
            <article key={item.step} className={styles.principleCard}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="waitlist" className={styles.waitlistSection}>
        <div className={styles.waitlistCopy}>
          <p className={styles.eyebrow}>Early access</p>
          <h2>Join the waitlist for the first serious frontier UI client.</h2>
          <p>
            We’re prioritizing people and teams who already live in ChatGPT or Claude and want their
            highest-value workflows to feel native, visual, and fast.
          </p>
        </div>

        <WaitlistForm />
      </section>

      <footer className={styles.footer}>
        <p>n3rd.ai is building the interface layer that makes AI feel like the future.</p>
        <div>
          <a href="#top">Back to top</a>
          <a href="https://github.com/SuperstellarLLC/n3rd-ai" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
