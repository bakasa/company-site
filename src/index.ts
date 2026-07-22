import { Hono } from 'hono'
import { serve } from '@hono/node-server'

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

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Auto Company — Build tools. Ship products.</title>
<meta name="description" content="Auto Company builds developer tools and content creation products. ReqDump, SnapOG, and OmniPost." />
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

  @media (max-width: 640px) {
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
</script>
</body>
</html>`

app.get('/', c => c.html(PAGE))
app.get('/health', c => c.json({ ok: true, ts: new Date().toISOString() }))

const PORT = parseInt(process.env.PORT || '3000', 10)
console.log(`Company site starting on port ${PORT}`)
serve({ fetch: app.fetch, port: PORT })
