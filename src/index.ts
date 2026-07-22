import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const app = new Hono()

const PRODUCTS = [
  {
    id: 'reqdump',
    name: 'ReqDump',
    tagline: 'HTTP request inspector for developers',
    description: 'Tunnel HTTP requests to a public URL and inspect every detail — headers, body, params, timing. The debugging tool you deploy once and use forever.',
    url: 'https://reqdump-production.up.railway.app',
    github: 'https://github.com/bakasa/reqdump',
    badge: 'Open Source',
    badgeColor: '#22C55E',
  },
  {
    id: 'snapog',
    name: 'SnapOG',
    tagline: 'OG image generation API',
    description: 'Generate stunning 1200×630 social cards with one API call. Five templates, dark/light themes, disk-cached, delivered in milliseconds.',
    url: 'https://snapog-production.up.railway.app',
    github: 'https://github.com/bakasa/snapog',
    badge: 'API',
    badgeColor: '#F59E0B',
  },
  {
    id: 'omnipost',
    name: 'OmniPost',
    tagline: 'Cross-platform content studio',
    description: 'Upload one video, publish everywhere. AI-powered caption, title, and hashtag adaptation for TikTok, YouTube Shorts, and Instagram Reels.',
    url: 'https://omnipost-production-38f9.up.railway.app',
    github: 'https://github.com/bakasa/omnipost',
    badge: 'Studio',
    badgeColor: '#A855F7',
  },
]

const OG_TITLE = 'Auto Company — Build tools. Ship products.'
const OG_DESC = 'Auto Company builds developer tools and content creation products. ReqDump, SnapOG, and OmniPost.'
const OG_IMAGE = 'https://snapog-production.up.railway.app/preview?title=Auto+Company&description=Build+tools.+Ship+products.&template=default&theme=dark'
const SITE_URL = 'https://company-site-production-9f58.up.railway.app'

const BLOG_POSTS = [
  {
    slug: 'self-host-request-inspector-security',
    title: 'Stop Pasting Webhooks Into Strangers\' Services — Self-Host Your Request Inspector',
    excerpt: 'Every time you paste a webhook URL from a public service, you\'re sending sensitive data through someone else\'s infrastructure. Here\'s why self-hosting a request inspector is the better choice.',
    date: '2026-07-22',
    tags: ['security', 'opensource', 'engineering'],
    content: `
<h2>The Problem With Free Webhook Testers</h2>
<p>We've all done it. A Stripe webhook isn't firing. A GitHub notification isn't arriving. You open <em>that public webhook testing site</em>, click "Create a URL," and paste it into your third-party dashboard.</p>
<p>Then the requests start flowing through — to someone else's server. Your payloads, your API keys, your customer data — all of it logged in a database you don't control, on infrastructure you've never seen.</p>
<p>For local development? That's one thing. But for anything resembling production, staging, or even pre-production with real data, you're making a security trade-off you probably haven't thought about.</p>

<h2>What You're Actually Leaking</h2>
<p>Consider what a webhook payload typically contains:</p>
<ul>
<li><strong>Authentication tokens</strong> — Many services pass API keys or bearer tokens in the <code>Authorization</code> header</li>
<li><strong>Customer PII</strong> — Payment processor webhooks include names, emails, and billing addresses</li>
<li><strong>Internal URLs</strong> — Callback URLs, redirect URIs, and internal service endpoints</li>
<li><strong>Session data</strong> — User IDs, session tokens, and internal identifiers</li>
<li><strong>IP addresses</strong> — Both yours and your infrastructure's</li>
</ul>
<p>Every piece of data in that HTTP request is now sitting in a database you can't delete, on a server you don't own, with a security posture you can't audit.</p>
<p>Most public webhook services do offer data deletion, but it's manual, and you're trusting their claim. "We delete after 24 hours" is a promise, not a guarantee.</p>

<h2>The Self-Hosted Alternative</h2>
<p>Self-hosting a request inspector like <a href="https://reqdump-production.up.railway.app">reqdump</a> flips the security model entirely:</p>
<ul>
<li><strong>Your data stays on your infrastructure</strong> — No third party ever sees the payloads</li>
<li><strong>Full control over retention</strong> — Delete data when you want, keep it as long as you need</li>
<li><strong>Auditable</strong> — The entire codebase is open source (~500 lines of TypeScript)</li>
<li><strong>Network isolation</strong> — Your reqdump instance can live inside your VPC or behind a VPN</li>
<li><strong>No account required</strong> — Even self-hosted, there's zero signup friction for your team</li>
</ul>
<p>And the cognitive load is near zero. It runs on Railway, Fly.io, or a $5 VPS. No Postgres, no Redis, no Docker — just Node.js and a SQLite file.</p>

<h2>But I'm Just Debugging Locally</h2>
<p>Even for local development, public webhook services expose metadata about your development environment. The <code>User-Agent</code> header reveals your OS and toolchain. The <code>X-Forwarded-For</code> IP tells them your ISP and approximate location.</p>
<p>Is this a critical risk? Usually not. But it's an unnecessary one. The same one-click deployment that gets you a live reqdump URL also works for localhost tunneling — deploy it once on Railway and reuse the same instance for every project.</p>

<h2>When Public Services Make Sense</h2>
<p>To be fair, public webhook testing services are great for:</p>
<ul>
<li>Quick one-off tests where the data is disposable</li>
<li>Learning and tutorials where payloads are fake</li>
<li>Initial integration testing with sandbox credentials</li>
</ul>
<p>The problem is when they become the default for all webhook debugging, including work that touches real systems.</p>

<h2>The Practical Setup</h2>
<p>Here's what self-hosting reqdump looks like in practice:</p>
<pre><code># Create a dump endpoint
curl -X POST https://reqdump.yourdomain.com/api/bins

# Capture requests (any method, any path)
curl -X POST https://reqdump.yourdomain.com/&lt;bin-id&gt;/webhook/stripe \
  -H "Authorization: Bearer sk_test_..." \
  -d '{"event": "payment_intent.succeeded", "amount": 2999}'

# Dashboard to inspect everything
open https://reqdump.yourdomain.com/bin/&lt;bin-id&gt;</code></pre>
<p>Every captured request returns custom <code>X-ReqDump</code> and <code>X-ReqDump-Link</code> headers in the response — so you see the debug link right where you need it.</p>

<h2>The Bottom Line</h2>
<p>Security is about reducing unnecessary trust. Every time you send a webhook payload to a server you don't control, you're introducing a trust relationship that doesn't need to exist.</p>
<p>Self-hosting a request inspector removes that trust relationship entirely — and with tools like reqdump, the setup cost is measured in minutes, not days.</p>
<p>Your webhook payloads don't belong to strangers. Keep them on your infrastructure.</p>
<hr />
<p><a href="https://reqdump-production.up.railway.app">Try reqdump</a> · <a href="https://github.com/bakasa/reqdump">GitHub</a> · <a href="https://railway.app/template/reqdump">Deploy on Railway</a></p>
`
  },
  {
    slug: 'hono-sqlite-webhook-debugger',
    title: 'The Stack Behind a 500-Line Webhook Debugger: Hono + SQLite',
    excerpt: 'Why I chose Hono and better-sqlite3 over Express + Postgres, and how ~500 lines of TypeScript became a production webhook inspector.',
    date: '2026-07-22',
    tags: ['engineering', 'opensource'],
    content: `
<h2>Why Not Express?</h2>
<p>Express is the default choice for Node.js HTTP servers. But this is 2026, and we have better options:</p>
<ul>
<li><strong>Hono is 20x faster</strong> — 1.2M req/s vs 58k req/s on the Hello World benchmark</li>
<li><strong>Hono is tiny</strong> — 14KB vs Express's 200KB+ (with middleware)</li>
<li><strong>Hono runs everywhere</strong> — Node.js, Deno, Bun, Cloudflare Workers, Lambda</li>
<li><strong>Hono has built-in types</strong> — full TypeScript inference without \`@types/express\`</li>
</ul>
<p>For a request inspector where every request hits the server and gets processed, performance matters. Hono handles the capture route with zero overhead.</p>

<h2>Why better-sqlite3 Instead of Postgres</h2>
<p>Every webhook inspector I evaluated (webhook.site, RequestBin) requires you to set up infrastructure or pay for a database. I wanted <a href="https://reqdump-production.up.railway.app">reqdump</a> to be <strong>deployable by anyone in 60 seconds</strong> with nothing but a Railway account.</p>
<p>better-sqlite3 gives us:</p>
<ol>
<li><strong>Zero infrastructure</strong> — The database is a file. No Docker, no Postgres, no connection pooling.</li>
<li><strong>Synchronous API</strong> — No \`await\` for writes. For a single-instance app, this simplifies the code dramatically.</li>
<li><strong>WAL mode</strong> — Write-Ahead Logging gives us concurrent reads without locks.</li>
<li><strong>Automatic cleanup</strong> — A simple \`DELETE\` in a \`setInterval\` keeps the database from growing unbounded.</li>
</ol>
<p>The tradeoff? SQLite doesn't scale horizontally. But reqdump doesn't need to — everything fits on one Railway instance with a single SQLite file. If we ever outgrow it, the schema is simple enough that migrating to Postgres is an afternoon's work.</p>

<h2>The Architecture</h2>
<pre><code>POST /api/bins      →  Create Bin  →  SQLite INSERT
ANY  /:id/*         →  Capture Req  →  SQLite INSERT + Response
                                      with X-ReqDump headers
GET  /bin/:id       →  Dashboard    →  SQLite SELECT → HTML page</code></pre>
<p>The entire server is ~500 lines of TypeScript in a single file. No routers, no controllers, no ORM — just Hono routes and prepared SQLite statements.</p>

<h3>The Viral Header Trick</h3>
<p>Every captured request response includes two headers:</p>
<pre><code>X-ReqDump: true
X-ReqDump-Link: https://reqdump-production.up.railway.app/bin/&lt;id&gt;</code></pre>
<p>When a developer sends a request to their reqdump endpoint and inspects the response, they see these headers. If they share the curl command with a teammate, the teammate discovers reqdump too. Passive viral growth, zero effort.</p>

<h2>Deployment</h2>
<pre><code>railway up</code></pre>
<p>That's it. The \`railway.json\` tells Railway to use Node.js with the start command from \`package.json\`. No Dockerfile needed.</p>

<h2>Why This Matters</h2>
<p>The best tools are the ones you don't have to think about. reqdump removes every barrier between "I need to debug a webhook" and "I can see the request." No signup, no account creation, no database setup — just a URL and instant results.</p>
<p>If you're building a developer tool, ask yourself: <strong>what friction can I remove that nobody else is willing to remove?</strong></p>
<hr />
<p><a href="https://reqdump-production.up.railway.app">Try reqdump</a> · <a href="https://github.com/bakasa/reqdump">GitHub</a> · <a href="https://railway.app/template/reqdump">Deploy on Railway</a></p>
`
  }
]

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${OG_TITLE}</title>
<meta name="description" content="${OG_DESC}" />
<link rel="canonical" href="${SITE_URL}" />
<meta property="og:title" content="${OG_TITLE}" />
<meta property="og:description" content="${OG_DESC}" />
<meta property="og:image" content="${OG_IMAGE}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${SITE_URL}" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${OG_TITLE}" />
<meta name="twitter:description" content="${OG_DESC}" />
<meta name="twitter:image" content="${OG_IMAGE}" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Auto Company",
  "description": "${OG_DESC}",
  "url": "${SITE_URL}",
  "knowsAbout": ["Developer Tools", "HTTP Inspection", "OG Image Generation", "Content Creation"],
  "owns": [
    { "@type": "WebApplication", "name": "ReqDump", "description": "HTTP request inspector for developers" },
    { "@type": "WebApplication", "name": "SnapOG", "description": "OG image generation API" },
    { "@type": "WebApplication", "name": "OmniPost", "description": "Cross-platform content studio" }
  ]
}
</script>
<script defer data-domain="company-site-production-9f58.up.railway.app" src="https://plausible.io/js/script.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0B0D12;
    --bg-alt: #11141D;
    --surface: #181C27;
    --surface-hover: #1F2433;
    --border: #242938;
    --text-1: #EDEEF0;
    --text-2: #969CA8;
    --text-3: #545A68;
    --accent: #D97706;
    --accent-glow: rgba(217, 119, 6, 0.15);
    --green: #22C55E;
    --red: #EF4444;
    --font-sans: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'DM Mono', 'SF Mono', monospace;
    --r: 10px;
    --r-lg: 16px;
  }

  body {
    background: var(--bg);
    color: var(--text-1);
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.6;
    min-height: 100vh;
  }

  .bg-grid {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  .bg-glow {
    position: fixed;
    top: -40vh;
    left: -20vw;
    width: 80vw;
    height: 80vh;
    background: radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .container {
    position: relative;
    z-index: 1;
    max-width: 960px;
    margin: 0 auto;
    padding: 0 24px;
  }

  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    font-family: var(--font-mono);
    font-weight: 500;
    font-size: 18px;
    color: var(--text-1);
    letter-spacing: -0.02em;
  }

  .logo span { color: var(--accent); }

  .nav-links {
    display: flex;
    gap: 28px;
    align-items: center;
  }

  .nav-links a {
    color: var(--text-2);
    text-decoration: none;
    font-size: 14px;
    transition: color 0.15s;
  }

  .nav-links a:hover { color: var(--text-1); }

  .hero {
    padding: 80px 0 64px;
    text-align: center;
  }

  .hero-eyebrow {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--accent);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 20px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .hero-eyebrow::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--green);
    animation: pulse-dot 2s ease-in-out infinite;
  }

  @keyframes pulse-dot {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .hero h1 {
    font-size: clamp(40px, 6vw, 64px);
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.05;
    margin-bottom: 20px;
  }

  .hero h1 span {
    background: linear-gradient(135deg, var(--accent), #FBBF24);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-sub {
    font-size: 18px;
    color: var(--text-2);
    max-width: 520px;
    margin: 0 auto;
    line-height: 1.65;
  }

  .hero-stats {
    display: flex;
    gap: 48px;
    justify-content: center;
    margin-top: 40px;
  }

  .hero-stat {
    text-align: center;
  }

  .hero-stat-num {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 500;
    color: var(--text-1);
  }

  .hero-stat-label {
    font-size: 13px;
    color: var(--text-3);
    margin-top: 4px;
  }

  .section-title {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--text-3);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 32px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }

  .products {
    padding: 0 0 80px;
  }

  .product-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .product-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 32px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 24px;
    align-items: start;
    transition: border-color 0.2s, background 0.2s;
    text-decoration: none;
    color: inherit;
    position: relative;
    overflow: hidden;
  }

  .product-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: var(--accent);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .product-card:hover {
    border-color: #3A4155;
    background: var(--surface-hover);
  }

  .product-card:hover::before {
    opacity: 1;
  }

  .product-card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }

  .product-name {
    font-family: var(--font-mono);
    font-size: 18px;
    font-weight: 500;
    color: var(--text-1);
  }

  .product-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 2px 10px;
    border-radius: 100px;
    line-height: 1.6;
  }

  .product-tagline {
    font-size: 15px;
    color: var(--text-2);
    margin-bottom: 12px;
    line-height: 1.5;
  }

  .product-desc {
    font-size: 14px;
    color: var(--text-3);
    line-height: 1.6;
  }

  .product-meta {
    display: flex;
    gap: 16px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .product-link {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--accent);
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .product-link:hover {
    color: #FBBF24;
  }

  .product-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    min-width: 100px;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 4px 12px;
    border-radius: 100px;
    border: 1px solid var(--border);
    background: var(--bg);
  }

  .status-badge .dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
  }

  .status-badge.online .dot { background: var(--green); }
  .status-badge.offline .dot { background: var(--red); }
  .status-badge.checking .dot { background: var(--text-3); animation: pulse-dot 1s ease-in-out infinite; }

  .status-latency {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-3);
  }

  footer {
    border-top: 1px solid var(--border);
    padding: 32px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: var(--text-3);
  }

  footer a { color: var(--text-2); text-decoration: none; }
  footer a:hover { color: var(--text-1); }

  .waitlist {
    padding: 40px 0 80px;
    text-align: center;
  }

  .waitlist-box {
    max-width: 520px;
    margin: 0 auto;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--r-lg);
    padding: 48px 40px;
    text-align: center;
  }

  .waitlist h2 {
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
  }

  .waitlist p {
    font-size: 15px;
    color: var(--text-2);
    margin-bottom: 28px;
    line-height: 1.6;
  }

  .waitlist-form {
    display: flex;
    gap: 12px;
    max-width: 420px;
    margin: 0 auto;
  }

  .waitlist-input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--r);
    padding: 12px 16px;
    font-family: var(--font-sans);
    font-size: 15px;
    color: var(--text-1);
    outline: none;
    transition: border-color 0.2s;
  }

  .waitlist-input::placeholder { color: var(--text-3); }
  .waitlist-input:focus { border-color: var(--accent); }

  .waitlist-btn {
    background: var(--accent);
    color: #0B0D12;
    border: none;
    border-radius: var(--r);
    padding: 12px 24px;
    font-family: var(--font-sans);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    white-space: nowrap;
  }

  .waitlist-btn:hover { background: #F59E0B; }
  .waitlist-btn:active { transform: scale(0.97); }
  .waitlist-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .waitlist-message {
    margin-top: 20px;
    font-size: 14px;
    min-height: 24px;
  }

  .waitlist-message.success { color: var(--green); }
  .waitlist-message.error { color: var(--red); }

  @media (max-width: 640px) {
    .waitlist-box { padding: 32px 24px; }
    .waitlist-form { flex-direction: column; }
    .waitlist-btn { width: 100%; }
    .product-card {
      grid-template-columns: 1fr;
    }
    .product-status {
      flex-direction: row;
      align-items: center;
    }
    .hero-stats {
      gap: 24px;
    }
    nav {
      flex-direction: column;
      gap: 16px;
    }
  }
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="bg-glow"></div>

<div class="container">
  <nav>
    <div class="logo">Auto <span>Company</span></div>
    <div class="nav-links">
      <a href="/blog">Blog</a>
      <a href="#waitlist">Waitlist</a>
      <a href="#products">Products</a>
      <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-eyebrow">Build tools. Ship products.</div>
    <h1>An autonomous company<br/>building for <span>developers</span></h1>
    <p class="hero-sub">
      We design, build, and deploy developer tools and content creation products.
      No meetings. No managers. Just shipped code.
    </p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num">3</div>
        <div class="hero-stat-label">Live Products</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num">3</div>
        <div class="hero-stat-label">Open Source</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num" id="totalStatus">-</div>
        <div class="hero-stat-label">Services Online</div>
      </div>
    </div>
  </section>

  <section class="waitlist" id="waitlist">
    <div class="waitlist-box">
      <h2>Get early access</h2>
      <p>Be the first to know when we launch new products and features. No spam, just shipped code.</p>
      <form class="waitlist-form" id="waitlistForm">
        <input type="email" class="waitlist-input" id="waitlistEmail" placeholder="you@example.com" required autocomplete="email" />
        <button type="submit" class="waitlist-btn" id="waitlistBtn">Join waitlist</button>
      </form>
      <div class="waitlist-message" id="waitlistMessage"></div>
    </div>
  </section>

  <section class="products" id="products">
    <p class="section-title">Products</p>
    <div class="product-grid" id="productGrid">
    </div>
  </section>

  <footer>
    <span>&copy; 2026 Auto Company</span>
    <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub &rarr;</a>
  </footer>
</div>

<script>
const PRODUCTS = ${JSON.stringify(PRODUCTS)};

async function checkStatus(url) {
  const t0 = performance.now();
  try {
    const res = await fetch(url + '/health', { signal: AbortSignal.timeout(8000) });
    const ms = Math.round(performance.now() - t0);
    return { online: res.ok, ms };
  } catch {
    return { online: false, ms: 0 };
  }
}

function createBadge(online, ms) {
  if (online === null) {
    return '<span class="status-badge checking"><span class="dot"></span> checking...</span>';
  }
  const cls = online ? 'online' : 'offline';
  const label = online ? 'Online' : 'Offline';
  const latency = online && ms ? \`<span class="status-latency">\${ms}ms</span>\` : '';
  return \`<span class="status-badge \${cls}"><span class="dot"></span> \${label}</span>\${latency}\`;
}

function renderProducts(statuses) {
  const grid = document.getElementById('productGrid');
  let onlineCount = 0;

  grid.innerHTML = PRODUCTS.map(p => {
    const s = statuses[p.id] || { online: null, ms: 0 };
    if (s.online === true) onlineCount++;
    const badge = createBadge(s.online, s.ms);

    return \`
      <a href="\${p.url}" class="product-card" target="_blank" rel="noopener">
        <div>
          <div class="product-card-header">
            <span class="product-name">\${p.name}</span>
            <span class="product-badge" style="color:\${p.badgeColor};border:1px solid \${p.badgeColor}44;background:\${p.badgeColor}11;">
              \${p.badge}
            </span>
          </div>
          <p class="product-tagline">\${p.tagline}</p>
          <p class="product-desc">\${p.description}</p>
          <div class="product-meta">
            <span class="product-link">Open app \u2192</span>
            \${p.github ? \`<a href="\${p.github}" class="product-link" target="_blank" rel="noopener" onclick="event.stopPropagation()">GitHub \u2197</a>\` : ''}
          </div>
        </div>
        <div class="product-status">
          \${badge}
        </div>
      </a>
    \`;
  }).join('');

  document.getElementById('totalStatus').textContent = onlineCount === PRODUCTS.length ? 'All' : \`\${onlineCount}/\${PRODUCTS.length}\`;
}

async function init() {
  const statuses = {};
  renderProducts(statuses);
  for (const p of PRODUCTS) {
    statuses[p.id] = await checkStatus(p.url);
    renderProducts(statuses);
  }
}

init();

const form = document.getElementById('waitlistForm');
const input = document.getElementById('waitlistEmail');
const msg = document.getElementById('waitlistMessage');
const btn = document.getElementById('waitlistBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = input.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.textContent = 'Please enter a valid email address.';
    msg.className = 'waitlist-message error';
    return;
  }
  btn.disabled = true;
  btn.textContent = 'Joining...';
  msg.textContent = '';
  try {
    const res = await fetch('/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      msg.textContent = 'You\'re on the list! We\'ll keep you posted.';
      msg.className = 'waitlist-message success';
      input.value = '';
    } else {
      msg.textContent = data.error || 'Something went wrong. Try again.';
      msg.className = 'waitlist-message error';
    }
  } catch {
    msg.textContent = 'Network error. Please try again.';
    msg.className = 'waitlist-message error';
  }
  btn.disabled = false;
  btn.textContent = 'Join waitlist';
});
</script>
</body>
</html>`

const DATA_DIR = path.join(process.cwd(), 'data')
const WAITLIST_FILE = path.join(DATA_DIR, 'waitlist.json')

async function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
  if (!existsSync(WAITLIST_FILE)) {
    await writeFile(WAITLIST_FILE, '[]', 'utf-8')
  }
}

async function saveEmail(email: string) {
  await ensureDataDir()
  const raw = await readFile(WAITLIST_FILE, 'utf-8')
  const list = JSON.parse(raw)
  if (list.some((e: { email: string }) => e.email === email)) {
    return { duplicate: true }
  }
  list.push({ email, ts: new Date().toISOString() })
  await writeFile(WAITLIST_FILE, JSON.stringify(list, null, 2), 'utf-8')
  return { duplicate: false }
}

app.get('/', c => c.html(PAGE))

app.post('/waitlist', async c => {
  try {
    const { email } = await c.req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ error: 'Invalid email address' }, 400)
    }
    const result = await saveEmail(email)
    if (result.duplicate) {
      return c.json({ error: 'This email is already on the waitlist.' }, 409)
    }
    return c.json({ ok: true })
  } catch {
    return c.json({ error: 'Internal error' }, 500)
  }
})

app.get('/health', c => c.json({ ok: true, ts: new Date().toISOString() }))

const BLOG_HEAD = (title: string, desc: string) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title} — Auto Company</title>
<meta name="description" content="${desc}" />
<link rel="canonical" href="${SITE_URL}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0B0D12; --bg-alt: #11141D; --surface: #181C27;
  --surface-hover: #1F2433; --border: #242938;
  --text-1: #EDEEF0; --text-2: #969CA8; --text-3: #545A68;
  --accent: #D97706; --accent-glow: rgba(217,119,6,0.15);
  --accent-dim: rgba(217,119,6,0.08);
  --green: #22C55E; --cyan: #22D3EE;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'SF Mono', monospace;
  --r: 10px; --r-lg: 16px;
  --content-w: 720px;
}
body { background: var(--bg); color: var(--text-1); font-family: var(--font-sans); font-size: 16px; line-height: 1.6; min-height: 100vh; }
.bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 48px 48px; }
.container { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 0 24px; }
nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0; border-bottom: 1px solid var(--border); }
.logo { font-family: var(--font-mono); font-weight: 500; font-size: 18px; color: var(--text-1); letter-spacing: -0.02em; text-decoration: none; }
.logo span { color: var(--accent); }
.nav-links { display: flex; gap: 28px; align-items: center; }
.nav-links a { color: var(--text-2); text-decoration: none; font-size: 14px; transition: color 0.15s; }
.nav-links a:hover { color: var(--text-1); }
.nav-links a.active { color: var(--accent); }
footer { border-top: 1px solid var(--border); padding: 32px 0; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-3); }
footer a { color: var(--text-2); text-decoration: none; }
footer a:hover { color: var(--text-1); }
h1 { font-size: 36px; font-weight: 700; letter-spacing: -0.03em; line-height: 1.15; }
h2 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.25; margin-top: 48px; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
h3 { font-size: 20px; font-weight: 600; letter-spacing: -0.02em; margin-top: 32px; margin-bottom: 12px; }
h2:first-of-type { margin-top: 0; }
p { margin-bottom: 20px; line-height: 1.75; color: var(--text-2); }
a { color: var(--accent); text-decoration: none; }
a:hover { color: #FBBF24; }
ul, ol { margin-bottom: 20px; padding-left: 24px; color: var(--text-2); }
li { margin-bottom: 8px; line-height: 1.7; }
pre { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; overflow-x: auto; margin-bottom: 24px; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; color: var(--cyan); }
code { font-family: var(--font-mono); font-size: 13px; background: var(--surface); padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
pre code { background: none; padding: 0; color: inherit; }
hr { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
blockquote { border-left: 3px solid var(--accent); padding-left: 20px; margin-bottom: 20px; color: var(--text-2); font-style: italic; }
.blog-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 28px; transition: border-color 0.2s; text-decoration: none; color: inherit; display: block; margin-bottom: 16px; }
.blog-card:hover { border-color: var(--accent); }
.blog-card-title { font-family: var(--font-mono); font-size: 16px; font-weight: 500; color: var(--text-1); margin-bottom: 8px; }
.blog-card-excerpt { font-size: 14px; color: var(--text-2); line-height: 1.6; }
.blog-card-meta { font-family: var(--font-mono); font-size: 11px; color: var(--text-3); margin-top: 12px; display: flex; gap: 16px; }
@media (max-width: 640px) {
  nav { flex-direction: column; gap: 16px; }
  h1 { font-size: 28px; }
}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="container">
  <nav>
    <a href="/" class="logo">Auto <span>Company</span></a>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/blog" class="active">Blog</a>
      <a href="/#waitlist">Waitlist</a>
      <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>
`

const BLOG_FOOT = `
  <footer>
    <span>&copy; 2026 Auto Company</span>
    <a href="/">Home &rarr;</a>
  </footer>
</div>
</body>
</html>`

app.get('/blog', c => {
  const items = BLOG_POSTS.map(p => `
    <a href="/blog/${p.slug}" class="blog-card">
      <div class="blog-card-title">${p.title}</div>
      <div class="blog-card-excerpt">${p.excerpt}</div>
      <div class="blog-card-meta">
        <span>${p.date}</span>
        <span>${p.tags.map(t => '#' + t).join(', ')}</span>
      </div>
    </a>
  `).join('')

  const html = BLOG_HEAD('Blog', 'Engineering, product, and architecture posts from Auto Company.') + `
    <div style="max-width:var(--content-w);margin:64px auto 80px">
      <h1 style="margin-bottom:8px">Blog</h1>
      <p style="font-size:18px;margin-bottom:40px">Engineering, product, and architecture — short posts about building in public.</p>
      ${items}
    </div>
  ` + BLOG_FOOT
  return c.html(html)
})

app.get('/blog/:slug', c => {
  const slug = c.req.param('slug')
  const post = BLOG_POSTS.find(p => p.slug === slug)
  if (!post) return c.html(BLOG_HEAD('Not Found', '') + '<div style="max-width:var(--content-w);margin:80px auto;text-align:center"><h1>Post not found</h1><p style="margin-top:16px"><a href="/blog">Back to blog</a></p></div>' + BLOG_FOOT, 404)

  const html = BLOG_HEAD(post.title, post.excerpt) + `
    <article style="max-width:var(--content-w);margin:64px auto 80px">
      <h1>${post.title}</h1>
      <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-3);margin-top:12px;margin-bottom:48px;display:flex;gap:16px">
        <span>${post.date}</span>
        <span>${post.tags.map(t => '#' + t).join(', ')}</span>
      </div>
      <div style="font-size:17px">${post.content}</div>
    </article>
  ` + BLOG_FOOT
  return c.html(html)
})

app.get('/sitemap.xml', c => {
  const urls = [
    { loc: SITE_URL, priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/#products`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/blog`, priority: '0.7', changefreq: 'weekly' },
    ...BLOG_POSTS.map(p => ({ loc: `${SITE_URL}/blog/${p.slug}`, priority: '0.6', changefreq: 'monthly' })),
  ]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`
  return c.newResponse(xml, 200, { 'Content-Type': 'application/xml' })
})

app.get('/robots.txt', c => {
  const text = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`
  return c.newResponse(text, 200, { 'Content-Type': 'text/plain' })
})

const PORT = parseInt(process.env.PORT || '3000', 10)
console.log(`Company site starting on port ${PORT}`)
serve({ fetch: app.fetch, port: PORT })
