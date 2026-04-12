import Image from 'next/image'
import styles from './page.module.css'
import { WaitlistForm } from '@/components/WaitlistForm'

type ShowcaseImage = {
  kind: 'image'
  eyebrow: string
  title: string
  description: string
  image: string
  alt: string
  tags: string[]
  featured?: boolean
}

type ShowcaseCode = {
  kind: 'code'
  eyebrow: string
  title: string
  description: string
  tags: string[]
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

const heroSignals = ['Compare boards', 'Source drawers', 'Live filters', 'Decision math']

const featureNotes = [
  {
    title: 'See the whole decision',
    body: 'Photos, prices, notes, routes, and trade-offs stay in the same view instead of scattering across chat replies.',
  },
  {
    title: 'Refine in place',
    body: 'Change a preference or ask a follow-up, and the interface updates without forcing you to reconstruct context.',
  },
  {
    title: 'Trust what you are seeing',
    body: 'Every card keeps its sources, numbers, and reasoning attached so the answer feels inspectable, not magical.',
  },
]

const interfacePillars = [
  {
    title: 'Cinematic enough to stop the scroll',
    body: 'The first fold should feel like a premiere, not a SaaS template. The product has to earn attention instantly.',
  },
  {
    title: 'Product surfaces before marketing blocks',
    body: 'The page should already behave like the interface layer we are promising, with panes, rails, comparisons, and live states.',
  },
  {
    title: 'Warm enough to avoid AI sameness',
    body: 'The visuals lean tactile and human so the brand feels intentional instead of floating in generic gradient tech land.',
  },
]

const interfaceModules = [
  {
    label: 'Prompt dock',
    body: 'Natural language in. The system translates it into a workspace, not a wall of markdown.',
  },
  {
    label: 'Compare board',
    body: 'Cards, photos, metrics, and trade-offs stay visible side by side while the user decides.',
  },
  {
    label: 'Source rail',
    body: 'Numbers, links, and evidence remain attached to the answer so trust scales with richness.',
  },
  {
    label: 'Live calculator',
    body: 'Budgets, commute times, weights, and scores update without forcing users back into prose.',
  },
  {
    label: 'Diff stack',
    body: 'For code and technical work, risk callouts, tests, and changed files become visible at a glance.',
  },
  {
    label: 'Preference memory',
    body: 'Once the user says “quiet street” or “waterproof,” the view keeps that context alive.',
  },
]

const showcaseCards: Array<ShowcaseImage | ShowcaseCode> = [
  {
    kind: 'image',
    eyebrow: 'Home search',
    title: 'Line up kitchens, light, commute, and budget before the next viewing.',
    description:
      'A property search should feel like a decision room, not a scavenger hunt through scrolling chat replies.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    alt: 'High-end kitchen interior with large windows and warm materials.',
    tags: ['Photo compare', 'Neighborhood notes', 'Commute math'],
    featured: true,
  },
  {
    kind: 'image',
    eyebrow: 'Summer shoes',
    title: 'Compare fit, support, heat comfort, and price in one living board.',
    description:
      'Shopping research becomes visual enough to decide quickly and detailed enough to feel safe spending money.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    alt: 'Colorful athletic shoes photographed in studio lighting.',
    tags: ['Gallery', 'Comfort notes', 'Price deltas'],
  },
  {
    kind: 'image',
    eyebrow: 'Travel planning',
    title: 'Move from itinerary text to a trip surface you can actually steer.',
    description:
      'Hotels, neighborhoods, walking times, budgets, and daily plans stay visible while you refine the trip.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    alt: 'Turquoise coastal water with beach umbrellas and a sunny shoreline.',
    tags: ['Map layers', 'Budget tracker', 'Editable schedule'],
  },
  {
    kind: 'code',
    eyebrow: 'Code review',
    title: 'Technical answers should feel like a real review surface, not a clever paragraph.',
    description:
      'Diffs, architecture notes, test gaps, and regression risks should sit beside each other like a workspace built for engineers.',
    tags: ['Risk callouts', 'Changed files', 'Suggested tests'],
  },
]

const transcriptLines = [
  'Option 1 has the best kitchen but is a bit more expensive than the others.',
  'Option 2 appears to offer the strongest overall value if commute matters a lot.',
  'Option 3 has excellent natural light, although the layout may feel less efficient.',
  'If quiet mornings are important, I would deprioritize the city-facing unit and focus on the other two.',
]

const workspaceScores = [
  { label: 'Kitchen quality', value: '9.4' },
  { label: 'Commute fit', value: '8.8' },
  { label: 'Value score', value: '8.6' },
]

const waitlistReasons = [
  'Priority goes to people with comparison-heavy workflows in ChatGPT or Claude.',
  'We want teams that care about sources, trust, and speed as much as visual polish.',
  'The early product focus is decision-intensive experiences, not generic chat chrome.',
]

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.backgroundHalo} aria-hidden="true" />
      <div className={styles.backgroundGrid} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.brandLockup}>
          <a href="#top" className={styles.brand}>
            boum.ai
          </a>
          <span className={styles.brandTag}>frontier ui</span>
        </div>

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
            boum turns long responses into living workspaces for shopping, home search, travel
            planning, and code review. Compare options side by side, inspect the evidence, and steer
            the view as fast as you think.
          </p>

          <div className={styles.heroActions}>
            <a href="#waitlist" className={styles.primaryButton}>
              Join the waitlist
            </a>
            <a href="#experience" className={styles.secondaryButton}>
              See the experience
            </a>
          </div>

          <div className={styles.proofStrip}>
            {heroSignals.map((signal) => (
              <span key={signal} className={styles.proofChip}>
                {signal}
              </span>
            ))}
          </div>

          <div className={styles.featureNoteGrid}>
            {featureNotes.map((note) => (
              <article key={note.title} className={styles.featureNoteCard}>
                <h2>{note.title}</h2>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.heroStage}>
          <div className={styles.stageGlow} aria-hidden="true" />

          <div className={styles.stageShell}>
            <div className={styles.stageChrome}>
              <div className={styles.chromeDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className={styles.chromeMeta}>
                <span>boum workspace</span>
                <span>decision surface</span>
              </div>
            </div>

            <div className={styles.stageBody}>
              <aside className={styles.stageRail}>
                <div className={styles.stagePrompt}>
                  <span className={styles.promptLabel}>Prompt</span>
                  <p>
                    Find a bright Zurich apartment under CHF 4k and compare kitchens, views,
                    commute, and overall value.
                  </p>
                </div>

                <div className={styles.signalCluster}>
                  <span>Morning light</span>
                  <span>Walkable area</span>
                  <span>Quiet street</span>
                  <span>Lake or skyline view</span>
                </div>

                <div className={styles.insightCard}>
                  <span className={styles.cardEyebrow}>boum insight</span>
                  <h2>Seestrasse Loft wins on kitchen quality and natural light.</h2>
                  <p>Kreis 5 leads on value per square meter and commute flexibility.</p>
                </div>

                <div className={styles.sourceDrawer}>
                  <span className={styles.cardEyebrow}>Evidence attached</span>
                  <ul>
                    <li>Listing photos</li>
                    <li>Budget model</li>
                    <li>Commute routes</li>
                    <li>Neighborhood notes</li>
                  </ul>
                </div>
              </aside>

              <section className={styles.stageMain}>
                <div className={styles.workspaceHeader}>
                  <div>
                    <p className={styles.cardEyebrow}>Live comparison</p>
                    <h2>Apartment shortlist</h2>
                  </div>
                  <p className={styles.workspaceMeta}>2 saved views · 1 updated preference</p>
                </div>

                <div className={styles.comparisonDeck}>
                  {heroHomes.map((home, index) => (
                    <article key={home.title} className={styles.resultCard}>
                      <div className={styles.resultImageWrap}>
                        <Image
                          src={home.image}
                          alt={home.alt}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1180px) 100vw, 24vw"
                          className={styles.coverImage}
                        />
                      </div>
                      <div className={styles.resultBody}>
                        <div>
                          <h3>{home.title}</h3>
                          <p>{home.details}</p>
                        </div>
                        <div className={styles.resultMeta}>
                          <span>{home.price}</span>
                          <span>{home.verdict}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className={styles.dataPanel}>
                  <div className={styles.dataPanelHeader}>
                    <div>
                      <p className={styles.cardEyebrow}>Decision math</p>
                      <h3>Answers become a surface you can steer.</h3>
                    </div>
                    <span className={styles.liveBadge}>updated live</span>
                  </div>

                  <div className={styles.metricList}>
                    {workspaceScores.map((score) => (
                      <div key={score.label} className={styles.metricRow}>
                        <span>{score.label}</span>
                        <strong>{score.value}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>

          <article className={styles.overlayShoe}>
            <div className={styles.overlayMedia}>
              <Image
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"
                alt="Colorful running shoe."
                fill
                sizes="(max-width: 1180px) 100vw, 16vw"
                className={styles.coverImage}
              />
            </div>
            <div className={styles.overlayBody}>
              <p className={styles.overlayLabel}>Summer shoes</p>
              <h2>Heat comfort, support, and waterproof trade-offs in one swipeable card.</h2>
            </div>
          </article>

          <article className={styles.overlayCode}>
            <p className={styles.overlayLabel}>Code review</p>
            <ul className={styles.codeList}>
              <li>Unsafe HTML render path</li>
              <li>Missing loading state in compare view</li>
              <li>Suggested tests ready</li>
            </ul>
          </article>
        </div>
      </section>

      <section className={styles.pillarSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>A landing page should already feel like the product</p>
          <h2>boum is the interface layer that makes AI feel like the future.</h2>
          <p>
            The best version of this company does not sell richer HTML. It ships answers that behave
            like software: visible, editable, source-aware, and made for real decisions.
          </p>
        </div>

        <div className={styles.pillarGrid}>
          {interfacePillars.map((pillar) => (
            <article key={pillar.title} className={styles.pillarCard}>
              <p className={styles.cardEyebrow}>{pillar.title}</p>
              <p>{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className={styles.comparisonSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>From transcript to living interface</p>
          <h2>Text is a prototype. The real answer is a workspace.</h2>
          <p>
            Today, great model output still collapses into a long reply. boum keeps the answer in
            its usable form so users can compare, inspect, and revise without losing the plot.
          </p>
        </div>

        <div className={styles.beforeAfterGrid}>
          <article className={styles.beforeCard}>
            <p className={styles.cardEyebrow}>What users get today</p>
            <h3>A scrolling answer</h3>
            <div className={styles.transcriptList}>
              {transcriptLines.map((line) => (
                <p key={line} className={styles.transcriptBubble}>
                  {line}
                </p>
              ))}
            </div>
          </article>

          <article className={styles.afterCard}>
            <div className={styles.liveToolbar}>
              <span>Gallery</span>
              <span>Compare</span>
              <span>Budget</span>
              <span>Sources</span>
            </div>

            <div className={styles.liveCanvas}>
              <div className={styles.liveSummary}>
                <p className={styles.cardEyebrow}>Now live</p>
                <h3>Apartment compare view</h3>
                <p>
                  Kitchens, views, and numbers remain visible while the user adjusts priorities.
                </p>
              </div>

              <div className={styles.liveMatrix}>
                <div className={styles.matrixRow}>
                  <span>Kitchen</span>
                  <strong>9.4</strong>
                </div>
                <div className={styles.matrixRow}>
                  <span>Quiet mornings</span>
                  <strong>8.9</strong>
                </div>
                <div className={styles.matrixRow}>
                  <span>Commute</span>
                  <strong>8.8</strong>
                </div>
                <div className={styles.matrixRow}>
                  <span>Value</span>
                  <strong>8.6</strong>
                </div>
              </div>
            </div>

            <div className={styles.liveSourceStrip}>
              <span>Listing photos</span>
              <span>Map routes</span>
              <span>Budget math</span>
              <span>User preferences</span>
            </div>
          </article>
        </div>

        <div className={styles.vocabularyGrid}>
          {interfaceModules.map((module) => (
            <article key={module.label} className={styles.vocabularyCard}>
              <p className={styles.cardEyebrow}>{module.label}</p>
              <p>{module.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="use-cases" className={styles.useCaseSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>Real-life views, not demo fluff</p>
          <h2>The strongest wedge is high-consideration decisions.</h2>
          <p>
            This product lands when the stakes are high enough that plain text becomes a liability:
            purchases, property, travel, and technical decisions where context has to stay visible.
          </p>
        </div>

        <div className={styles.useCaseMosaic}>
          {showcaseCards.map((card) => (
            <article
              key={card.title}
              className={`${styles.useCaseCard} ${
                card.kind === 'image' && card.featured ? styles.useCaseCardFeatured : ''
              }`}
            >
              {card.kind === 'image' ? (
                <div className={styles.useCaseImageWrap}>
                  <Image
                    src={card.image}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 1180px) 100vw, 50vw"
                    className={styles.coverImage}
                  />
                </div>
              ) : (
                <div className={styles.codeCasePanel}>
                  <div className={styles.codeCaseHeader}>
                    <span>Review surface</span>
                    <span>4 files</span>
                  </div>
                  <div className={styles.codeCaseRows}>
                    <span>[P1] Unsafe HTML render path</span>
                    <span>[P2] Missing loading state in compare board</span>
                    <span>Tests suggested beside the diff</span>
                  </div>
                </div>
              )}

              <div className={styles.useCaseContent}>
                <p className={styles.cardEyebrow}>{card.eyebrow}</p>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <div className={styles.tagRow}>
                  {card.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.rulesSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>The interface has to do more than look good</p>
          <h2>It should feel fast, trustworthy, and a little inevitable.</h2>
          <p>
            The design language matters because this is the product pitch. If the page feels flat,
            the company feels flat. If the page feels like software from tomorrow, the thesis lands.
          </p>
        </div>

        <div className={styles.rulesGrid}>
          <article className={styles.ruleCard}>
            <span>01</span>
            <h3>Lead with product depth</h3>
            <p>Hero sections should show real panes, not symbolic blobs or anonymous dashboards.</p>
          </article>
          <article className={styles.ruleCard}>
            <span>02</span>
            <h3>Make comparisons feel luxurious</h3>
            <p>
              Decision-heavy surfaces deserve the same care usually reserved for media or fashion.
            </p>
          </article>
          <article className={styles.ruleCard}>
            <span>03</span>
            <h3>Keep the evidence attached</h3>
            <p>Every score, photo, and recommendation should look inspectable, not hand-wavy.</p>
          </article>
          <article className={styles.ruleCard}>
            <span>04</span>
            <h3>Warmth beats generic AI gloss</h3>
            <p>
              Human materials and editorial restraint keep the brand from looking like template
              tech.
            </p>
          </article>
        </div>
      </section>

      <section id="waitlist" className={styles.waitlistSection}>
        <div className={styles.waitlistCopy}>
          <p className={styles.eyebrow}>Early access</p>
          <h2>Join the waitlist for the first serious frontier UI client.</h2>
          <p>
            We are starting with people and teams who already spend meaningful time in ChatGPT or
            Claude and want their highest-value workflows to feel visual, inspectable, and alive.
          </p>
          <ul className={styles.waitlistList}>
            {waitlistReasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>

        <div className={styles.waitlistShell}>
          <WaitlistForm />
        </div>
      </section>

      <footer className={styles.footer}>
        <p>boum.ai turns AI answers into interfaces people can actually use.</p>
        <div className={styles.footerLinks}>
          <a href="#top">Back to top</a>
          <a href="https://github.com/SuperstellarLLC/boum-ai" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>
    </main>
  )
}
