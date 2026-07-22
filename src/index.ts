import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { readFile, writeFile, mkdir, appendFile } from 'fs/promises'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { join } from 'path'

const app = new Hono()

const SNAPSHOT_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SnapShot API — Website Screenshots via curl, Zero Signup</title>
<meta name="description" content="Take full-page website screenshots with a single curl command. No signup, no email, instant API key. Free tier: 100 screenshots/month." />
<link rel="canonical" href="${'https://company-site-production-9f58.up.railway.app'}/snapshot" />
<meta property="og:title" content="SnapShot API — Screenshots via curl, Zero Signup" />
<meta property="og:description" content="Take full-page website screenshots with one curl command. No signup. Instant key." />
<meta property="og:image" content="https://snapog-production.up.railway.app/preview?title=SnapShot+API&description=Website+screenshots+via+curl.+Zero+signup.&template=default&theme=dark" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url" content="${'https://company-site-production-9f58.up.railway.app'}/snapshot" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="SnapShot API — Screenshots via curl, Zero Signup" />
<meta name="twitter:description" content="Take full-page website screenshots with one curl command. No signup. Instant key." />
<script defer data-domain="company-site-production-9f58.up.railway.app" src="https://plausible.io/js/script.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<link href="https://fonts.googleapis.com/css2?family=Unbond:wght@700;800&display=swap" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0B0D12;--bg-alt:#0F1219;--surface:#141820;--surface-hover:#1A1F2B;--border:#1F2535;--border-light:#2A3045;--text-1:#EDEEF0;--text-2:#969CA8;--text-3:#545A68;--cyan:#22D3EE;--cyan-dim:rgba(34,211,238,0.1);--cyan-glow:rgba(34,211,238,0.12);--amber:#D97706;--green:#22C55E;--red:#EF4444;--font-sans:'DM Sans',system-ui,sans-serif;--font-mono:'DM Mono','SF Mono',monospace;--font-display:'DM Sans',system-ui,sans-serif;--r:10px;--r-lg:16px}
body{background:var(--bg);color:var(--text-1);font-family:var(--font-sans);font-size:16px;line-height:1.6;min-height:100vh;overflow-x:hidden}
.bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px);background-size:48px 48px}
.bg-gradient{position:fixed;top:-30vh;right:-15vw;width:60vw;height:70vh;background:radial-gradient(ellipse at center,var(--cyan-glow) 0%,transparent 70%);pointer-events:none;z-index:0}
.spot{position:fixed;bottom:-20vh;left:-10vw;width:50vw;height:50vh;background:radial-gradient(ellipse at center,var(--cyan-dim) 0%,transparent 60%);pointer-events:none;z-index:0}
.container{position:relative;z-index:1;max-width:960px;margin:0 auto;padding:0 24px}
nav{display:flex;align-items:center;justify-content:space-between;padding:28px 0;border-bottom:1px solid var(--border)}
.logo{font-family:var(--font-mono);font-weight:500;font-size:18px;color:var(--text-1);text-decoration:none;letter-spacing:-0.02em}
.logo span{color:var(--cyan)}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{color:var(--text-2);text-decoration:none;font-size:14px;transition:color 0.15s}
.nav-links a:hover{color:var(--text-1)}
.hero{padding:80px 0 64px;text-align:center}
.hero-eyebrow{font-family:var(--font-mono);font-size:12px;color:var(--cyan);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:20px;display:inline-flex;align-items:center;gap:8px}
.hero-eyebrow::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--cyan);animation:pulse-dot 2s ease-in-out infinite}
@keyframes pulse-dot{0%,100%{opacity:1}50%{opacity:0.4}}
.hero h1{font-size:clamp(36px,5.5vw,56px);font-weight:700;letter-spacing:-0.04em;line-height:1.05;margin-bottom:16px}
.hero h1 span{background:linear-gradient(135deg,var(--cyan),#67E8F9);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.hero-sub{font-size:18px;color:var(--text-2);max-width:560px;margin:0 auto;line-height:1.65}
.hero-cta{display:flex;gap:12px;justify-content:center;margin-top:32px;flex-wrap:wrap}
.btn{background:var(--cyan);color:#0B0D12;border:none;border-radius:var(--r);padding:14px 28px;font-family:var(--font-sans);font-size:16px;font-weight:600;cursor:pointer;transition:background 0.15s,transform 0.1s;white-space:nowrap;display:inline-flex;align-items:center;gap:8px;text-decoration:none}
.btn:hover{background:#67E8F9;transform:translateY(-1px)}
.btn-outline{background:transparent;color:var(--cyan);border:1px solid var(--cyan);padding:13px 27px}
.btn-outline:hover{background:var(--cyan-dim);border-color:#67E8F9;color:#67E8F9}
.terminal-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px;margin:48px auto;max-width:680px;position:relative}
.terminal-box::before{content:'$';position:absolute;top:24px;left:24px;font-family:var(--font-mono);font-size:13px;color:var(--text-3)}
.terminal-box pre{padding-left:20px;font-family:var(--font-mono);font-size:13px;line-height:1.8;color:var(--text-2);overflow-x:auto;white-space:pre-wrap}
.terminal-box .cmd{color:var(--green)}
.terminal-box .output{color:var(--cyan)}
.section{padding:0 0 80px}
.section-title{font-family:var(--font-mono);font-size:12px;color:var(--text-3);letter-spacing:0.1em;text-transform:uppercase;margin-bottom:16px;padding-bottom:8px;border-bottom:1px solid var(--border)}
.features{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-bottom:48px}
.feature-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:28px;transition:border-color 0.2s,transform 0.15s}
.feature-card:hover{border-color:var(--cyan);transform:translateY(-2px)}
.feature-icon{font-family:var(--font-mono);font-size:24px;margin-bottom:12px;display:block}
.feature-card h3{font-size:16px;font-weight:600;margin-bottom:8px;color:var(--text-1)}
.feature-card p{font-size:14px;color:var(--text-2);line-height:1.6}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:48px}
.pricing-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:32px;text-align:center;transition:border-color 0.2s,transform 0.15s;position:relative}
.pricing-card.featured{border-color:var(--cyan);background:linear-gradient(135deg,var(--surface),var(--cyan-dim))}
.pricing-card.featured::before{content:'Most Popular';position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--cyan);color:#0B0D12;font-family:var(--font-mono);font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:4px 14px;border-radius:100px}
.pricing-card h3{font-size:14px;font-family:var(--font-mono);color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px}
.pricing-card .price{font-family:var(--font-mono);font-size:36px;font-weight:600;color:var(--text-1);margin-bottom:4px}
.pricing-card .price span{font-size:16px;color:var(--text-3)}
.pricing-card .desc{font-size:13px;color:var(--text-2);margin-bottom:20px;min-height:40px}
.pricing-card ul{list-style:none;padding:0;margin:0 0 24px;text-align:left}
.pricing-card ul li{padding:8px 0;font-size:13px;color:var(--text-2);border-top:1px solid var(--border);display:flex;align-items:center;gap:8px}
.pricing-card ul li::before{content:'â\x9C\x93';color:var(--cyan);font-weight:600}
.pricing-card .pricing-btn{display:inline-block;background:transparent;border:1px solid var(--border);border-radius:var(--r);padding:12px 24px;font-family:var(--font-sans);font-size:14px;font-weight:500;color:var(--text-1);text-decoration:none;transition:all 0.15s;width:100%}
.pricing-card .pricing-btn:hover{background:var(--surface-hover);border-color:var(--text-3)}
.pricing-card.featured .pricing-btn{background:var(--cyan);color:#0B0D12;border-color:var(--cyan);font-weight:600}
.pricing-card.featured .pricing-btn:hover{background:#67E8F9}
.use-cases{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.use-case{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px}
.use-case h3{font-size:15px;font-weight:600;margin-bottom:8px;display:flex;align-items:center;gap:8px}
.use-case h3 .tag{font-family:var(--font-mono);font-size:10px;font-weight:500;letter-spacing:0.04em;padding:2px 8px;border-radius:4px;background:var(--cyan-dim);color:var(--cyan)}
.use-case p{font-size:13px;color:var(--text-2);line-height:1.6}
.use-case pre{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:12px;margin-top:12px;font-family:var(--font-mono);font-size:12px;color:var(--text-2);overflow-x:auto}
.referral-box{background:linear-gradient(135deg,var(--cyan-dim),transparent);border:1px solid var(--border);border-radius:var(--r-lg);padding:40px;text-align:center;margin-top:48px}
.referral-box h2{font-size:22px;font-weight:600;margin-bottom:8px;color:var(--text-1)}
.referral-box p{font-size:15px;color:var(--text-2);margin-bottom:20px}
.referral-box .highlight{color:var(--cyan);font-weight:600}
footer{border-top:1px solid var(--border);padding:32px 0;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-3);margin-top:40px}
footer a{color:var(--text-2);text-decoration:none}
footer a:hover{color:var(--text-1)}
@media(max-width:640px){.hero{padding:40px 0 32px}.hero-cta{flex-direction:column;align-items:center}nav{flex-direction:column;gap:16px}.pricing-grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="bg-gradient"></div>
<div class="spot"></div>
<div class="container">
  <nav>
    <a href="/" class="logo">Auto <span>Company</span></a>
    <div class="nav-links">
      <a href="/">Home</a>
      <a href="/playground">Playground</a>
      <a href="/visual-diff">Visual Diff</a>
      <a href="/blog">Blog</a>
      <a href="https://github.com/bakasa/snapshot-api" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-eyebrow">v1.0 — Open Source</div>
    <h1>Website screenshots<br/>with <span>one curl command</span></h1>
    <p class="hero-sub">Instant API key. No signup. No email. Just you, your terminal, and a full-page PNG.</p>
    <div class="hero-cta">
      <a href="https://snapshot-api-production-1374.up.railway.app" class="btn">Get Your API Key</a>
      <a href="/playground" class="btn btn-outline">Try the Playground</a>
      <a href="https://github.com/bakasa/snapshot-api" class="btn btn-outline" style="border-color:var(--border)">GitHub â\x86\x97</a>
    </div>
  </section>

  <div class="terminal-box">
    <pre><span class="cmd"># Get an instant API key — no signup</span>
<span class="output">$ curl https://snapshot-api-production-1374.up.railway.app/key
{"key":"ss_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx","referral_code":"abc123"}</span>

<span class="cmd"># Take a screenshot</span>
<span class="output">$ curl "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://example.com&key=ss_xxx" > screenshot.png</span>

<span class="cmd"># From zero to PNG in ~10 seconds</span></pre>
  </div>

  <section class="section">
    <p class="section-title">Why SnapShot API</p>
    <div class="features">
      <div class="feature-card">
        <span class="feature-icon">00</span>
        <h3>Zero Signup</h3>
        <p>Get a key with one curl call. No email, no OAuth, no dashboard to navigate. Your first screenshot in under 10 seconds.</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">â\x86\x91</span>
        <h3>Referral Bonuses</h3>
        <p>Share your referral link — both parties get +50 screenshots/month. Stackable, unlimited. Your usage grows with your network.</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">â\x9E¡</span>
        <h3>Full-Page Captures</h3>
        <p>Captures the entire page, not just the viewport. Works for any public URL. Returns a clean PNG ready for storage or processing.</p>
      </div>
      <div class="feature-card">
        <span class="feature-icon">{ }</span>
        <h3>JSON API</h3>
        <p>Simple REST endpoint. Returns PNG bytes or JSON errors. No SDK needed — works with curl, fetch, axios, or any HTTP client.</p>
      </div>
    </div>
  </section>

  <section class="section">
    <p class="section-title">Pricing</p>
    <div class="pricing-grid">
      <div class="pricing-card">
        <h3>Free</h3>
        <div class="price">100 <span>/mo</span></div>
        <div class="desc">For side projects, weekend hacks, and experiments</div>
        <ul>
          <li>100 screenshots/month</li>
          <li>Instant API key via curl</li>
          <li>Referral bonuses (unlimited)</li>
          <li>Full-page PNG</li>
        </ul>
        <a href="https://snapshot-api-production-1374.up.railway.app" class="pricing-btn">Get Started</a>
      </div>
      <div class="pricing-card featured">
        <h3>Pro</h3>
        <div class="price">$15 <span>/mo</span></div>
        <div class="desc">For developers, dashboards, and CI/CD pipelines</div>
        <ul>
          <li>1,000 screenshots/month</li>
          <li>Priority support</li>
          <li>JPEG / PNG format selection</li>
          <li>Custom viewport sizes</li>
        </ul>
        <a href="/" class="pricing-btn" onclick="event.preventDefault();alert('Stripe billing incoming — join the waitlist on the homepage.')">Coming Soon</a>
      </div>
      <div class="pricing-card">
        <h3>Business</h3>
        <div class="price">$49 <span>/mo</span></div>
        <div class="desc">For teams, agencies, and production workloads</div>
        <ul>
          <li>10,000 screenshots/month</li>
          <li>Priority support</li>
          <li>PDF output</li>
          <li>Wait-for-selector support</li>
          <li>Custom viewport sizes</li>
        </ul>
        <a href="/" class="pricing-btn" onclick="event.preventDefault();alert('Stripe billing incoming — join the waitlist on the homepage.')">Coming Soon</a>
      </div>
    </div>
  </section>

  <section class="section">
    <p class="section-title">Use Cases</p>
    <div class="use-cases">
      <div class="use-case">
        <h3>Dashboard Monitoring <span class="tag">cron</span></h3>
        <p>Snapshot your dashboards every hour and archive them. Compare over time, detect outages visually.</p>
        <pre>0 * * * * curl "..." > dash-$(date +%H).png</pre>
      </div>
      <div class="use-case">
        <h3>CI/CD Visual Diff <span class="tag">ci</span></h3>
        <p>Capture staging after every deploy. Compare against prod to catch visual regressions before they ship.</p>
        <pre>curl "..." > staging-$(git rev-parse --short HEAD).png</pre>
  <a href="https://github.com/marketplace/actions/snapshot-api-action" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-family:var(--font-mono);font-size:12px;color:var(--cyan)">Or use the GitHub Action →</a>
      </div>
      <div class="use-case">
        <h3>Price Monitoring <span class="tag">data</span></h3>
        <p>Track competitor pricing pages, product listings, and availability indicators over time.</p>
        <pre>curl "..." > competitor-$(date +%F).png</pre>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="referral-box">
      <h2>Share & Earn More Capacity</h2>
      <p>Every referral gives <span class="highlight">both</span> you and your friend <span class="highlight">+50 screenshots/month</span>. No cap. Stackable. Share your link:</p>
      <div class="terminal-box" style="margin:0 auto;max-width:500px;text-align:left">
        <pre><span class="output">https://snapshot-api-production-1374.up.railway.app/?ref=YOUR_CODE</span></pre>
      </div>
      <p style="margin-top:24px;font-size:14px">Your referral code is in the JSON response when you get your API key.</p>
    </div>
  </section>

  <footer>
    <span>&copy; 2026 Auto Company</span>
    <div style="display:flex;align-items:center;gap:20px">
      <a href="/">Home &rarr;</a>
      <a href="https://github.com/bakasa/snapshot-api" target="_blank" rel="noopener">GitHub</a>
    </div>
  </footer>
</div>
</body>
</html>`


const VISUAL_DIFF_PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Visual Website Diff Tool — Compare Two Pages Side-by-Side</title>
<meta name="description" content="Free visual website comparison tool. Enter two URLs and see a side-by-side diff of any two webpages. Powered by SnapShot API." />
<link rel="canonical" href="${'https://company-site-production-9f58.up.railway.app'}/visual-diff" />
<meta property="og:title" content="Visual Website Diff Tool — Compare Two Pages Side-by-Side" />
<meta property="og:description" content="Free visual website comparison tool. Spot differences between any two webpages instantly." />
<meta property="og:image" content="https://snapog-production.up.railway.app/preview?title=Visual+Website+Diff+Tool&description=Compare+any+two+pages+side+by+side&template=default&theme=dark" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0B0D12;--bg-alt:#11141D;--surface:#181C27;--surface-hover:#1F2433;--border:#242938;--border-light:#2E3444;--text-1:#EDEEF0;--text-2:#969CA8;--text-3:#545A68;--accent:#D97706;--accent-glow:rgba(217,119,6,0.15);--green:#22C55E;--cyan:#22D3EE;--magenta:#EC4899;--red:#EF4444;--font-sans:'DM Sans',system-ui,sans-serif;--font-mono:'DM Mono','SF Mono',monospace;--r:10px;--r-lg:16px}
body{background:var(--bg);color:var(--text-1);font-family:var(--font-sans);font-size:16px;line-height:1.6;min-height:100vh}
.bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:48px 48px}
.container{position:relative;z-index:1;max-width:960px;margin:0 auto;padding:0 24px}
nav{display:flex;align-items:center;justify-content:space-between;padding:28px 0;border-bottom:1px solid var(--border)}
.logo{font-family:var(--font-mono);font-weight:500;font-size:18px;color:var(--text-1);text-decoration:none;letter-spacing:-0.02em}
.logo span{color:var(--accent)}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{color:var(--text-2);text-decoration:none;font-size:14px;transition:color 0.15s}
.nav-links a:hover{color:var(--text-1)}
.nav-links a.active{color:var(--accent)}
h1{font-size:32px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;margin-bottom:8px}
p{color:var(--text-2);margin-bottom:16px;line-height:1.65}
.diff-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:32px;margin:32px 0}
.input-row{display:flex;gap:12px;margin-bottom:20px;align-items:flex-end}
.input-group{flex:1;display:flex;flex-direction:column;gap:6px}
.input-group label{font-family:var(--font-mono);font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em}
.input-group input{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:12px 16px;font-family:var(--font-sans);font-size:15px;color:var(--text-1);outline:none;transition:border-color 0.2s}
.input-group input:focus{border-color:var(--accent)}
.input-group input::placeholder{color:var(--text-3)}
.input-group .url-label{font-family:var(--font-mono);font-size:11px;color:var(--text-3)}
.btn-row{display:flex;gap:12px;align-items:flex-end}
.btn{background:var(--accent);color:#0B0D12;border:none;border-radius:var(--r);padding:12px 28px;font-family:var(--font-sans);font-size:15px;font-weight:600;cursor:pointer;transition:background 0.15s,transform 0.1s;white-space:nowrap;display:inline-flex;align-items:center;gap:8px}
.btn:hover{background:#F59E0B;transform:translateY(-1px)}
.btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
.btn-outline{background:transparent;color:var(--accent);border:1px solid var(--accent)}
.btn-outline:hover{background:var(--accent-glow)}
.presets{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.preset-btn{background:transparent;border:1px solid var(--border);border-radius:var(--r);padding:8px 14px;font-family:var(--font-mono);font-size:12px;color:var(--text-2);cursor:pointer;transition:all 0.15s}
.preset-btn:hover{border-color:var(--accent);color:var(--accent)}
.spinner{display:none;text-align:center;padding:48px 0;color:var(--text-3)}
.spinner.active{display:block}
.spinner-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent);animation:bounce 1.2s ease-in-out infinite}
.spinner-dot:nth-child(2){animation-delay:0.2s;background:var(--cyan)}
.spinner-dot:nth-child(3){animation-delay:0.4s}
@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}
.error-box{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:var(--r);padding:16px;color:var(--red);font-size:14px;display:none;margin-top:16px}
.error-box.visible{display:block}
.result-area{display:none;margin-top:24px}
.result-area.visible{display:block}
.comparison{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.image-panel{background:var(--bg-alt);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden}
.image-panel .panel-header{display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:1px solid var(--border);font-family:var(--font-mono);font-size:11px;color:var(--text-3)}
.image-panel .panel-header .panel-label{color:var(--accent);font-weight:600}
.image-panel img{width:100%;display:block}
.diff-metrics{display:flex;gap:24px;justify-content:center;margin-bottom:24px;flex-wrap:wrap}
.diff-metric{text-align:center;background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px 24px;min-width:140px}
.diff-metric .metric-value{font-family:var(--font-mono);font-size:28px;font-weight:600;color:var(--text-1)}
.diff-metric .metric-label{font-size:11px;color:var(--text-3);text-transform:uppercase;letter-spacing:0.06em;margin-top:4px}
.diff-metric.high .metric-value{color:var(--red)}
.diff-metric.medium .metric-value{color:var(--accent)}
.diff-metric.low .metric-value{color:var(--green)}
.slider-section{margin-top:24px;border-top:1px solid var(--border);padding-top:24px}
.slider-section h3{font-size:14px;font-weight:600;margin-bottom:12px;color:var(--text-2)}
.slider-container{position:relative;width:100%;overflow:hidden;border:1px solid var(--border);border-radius:var(--r);background:var(--bg-alt);cursor:ew-resize;user-select:none;touch-action:none;min-height:100px}
.slider-container img{width:100%;display:block;pointer-events:none}
.slider-container .slider-overlay{position:absolute;top:0;left:0;width:100%;height:100%;clip-path:inset(0 50% 0 0)}
.slider-container .slider-handle{position:absolute;top:0;bottom:0;width:3px;background:var(--accent);cursor:ew-resize;z-index:10;left:50%;transform:translateX(-50%)}
.slider-container .slider-handle::before{content:'';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:28px;height:28px;border-radius:50%;background:var(--accent);border:3px solid var(--bg)}
.slider-container .slider-handle::after{content:'↔';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#0B0D12;font-size:14px;font-weight:700}
.slider-labels{display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:10px;color:var(--text-3);margin-top:6px;padding:0 4px}
.curl-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:16px 20px;margin-top:20px;font-family:var(--font-mono);font-size:13px;color:var(--green);overflow-x:auto;position:relative}
.curl-box .copy-btn{position:absolute;top:10px;right:10px;background:var(--surface);border:1px solid var(--border);color:var(--text-2);padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;font-family:var(--font-mono);transition:all 0.15s}
.curl-box .copy-btn:hover{background:var(--surface-hover);color:var(--text-1)}
.diff-canvas{display:none;width:100%;border:1px solid var(--border);border-radius:var(--r);margin-top:16px}
.diff-mode-toggle{display:flex;gap:8px;margin-bottom:16px}
.diff-mode-btn{background:transparent;border:1px solid var(--border);border-radius:var(--r);padding:8px 16px;font-family:var(--font-mono);font-size:12px;color:var(--text-2);cursor:pointer;transition:all 0.15s}
.diff-mode-btn.active{border-color:var(--accent);color:var(--accent);background:var(--accent-glow)}
.diff-mode-btn:hover{border-color:var(--accent)}
footer{border-top:1px solid var(--border);padding:32px 0;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-3);margin-top:60px}
footer a{color:var(--text-2);text-decoration:none}
footer a:hover{color:var(--text-1)}
@media(max-width:720px){.comparison{grid-template-columns:1fr}.input-row{flex-direction:column}.btn-row{width:100%}.btn-row .btn{flex:1}.diff-metrics{gap:12px}.diff-metric{min-width:100px;padding:12px 16px}nav{flex-direction:column;gap:16px}h1{font-size:24px}.diff-box{padding:20px}}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="container">
<nav>
  <a href="/" class="logo">Auto <span>Company</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/snapshot">SnapShot</a>
    <a href="/playground">Playground</a>
    <a href="/visual-diff" class="active">Visual Diff</a>
    <a href="/blog">Blog</a>
    <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub</a>
  </div>
</nav>

<div style="margin:48px 0 0">
  <h1>Visual Website Diff Tool</h1>
  <p>Compare any two webpages side by side. Spot visual differences instantly — powered by <a href="/snapshot" style="color:var(--accent)">SnapShot API</a>. No API key needed.</p>

  <div class="diff-box">
    <div class="presets">
      <button class="preset-btn" onclick="setPreset('https://news.ycombinator.com','https://news.ycombinator.com/newest')">HN: front vs new</button>
      <button class="preset-btn" onclick="setPreset('https://example.com','https://example.com')">Example: same page</button>
      <button class="preset-btn" onclick="setPreset('https://github.com/bakasa/snapshot-api','https://github.com/bakasa/reqdump')">SnapShot vs ReqDump</button>
      <button class="preset-btn" onclick="setPreset('https://www.wikipedia.org','https://en.wikipedia.org')">Wikipedia: main vs EN</button>
    </div>
    <div class="input-row">
      <div class="input-group">
        <label>URL A (Control)</label>
        <input type="url" id="urlA" placeholder="https://example.com" value="https://news.ycombinator.com" autofocus />
      </div>
      <div class="input-group">
        <label>URL B (Changed)</label>
        <input type="url" id="urlB" placeholder="https://example.com/v2" value="https://news.ycombinator.com/newest" />
      </div>
    </div>
    <div class="btn-row">
      <button class="btn" id="compareBtn" onclick="compare()">Compare Pages</button>
      <button class="btn btn-outline" onclick="swapUrls()">Swap URLs</button>
    </div>

    <div class="spinner" id="spinner">
      <span class="spinner-dot"></span>
      <span class="spinner-dot"></span>
      <span class="spinner-dot"></span>
      <div style="margin-top:16px;color:var(--text-3);font-size:14px">Capturing both pages...</div>
    </div>

    <div class="error-box" id="errorBox"></div>

    <div class="result-area" id="resultArea">
      <div class="diff-mode-toggle">
        <button class="diff-mode-btn active" data-mode="side" onclick="setMode('side')">Side by Side</button>
        <button class="diff-mode-btn" data-mode="slider" onclick="setMode('slider')">Slider</button>
        <button class="diff-mode-btn" data-mode="diff" onclick="setMode('diff')">Pixel Diff</button>
      </div>

      <div id="sideView">
        <div class="comparison" id="comparison">
          <div class="image-panel">
            <div class="panel-header"><span class="panel-label">URL A</span><span id="dimA"></span></div>
            <img id="imgA" alt="Screenshot of URL A" />
          </div>
          <div class="image-panel">
            <div class="panel-header"><span class="panel-label">URL B</span><span id="dimB"></span></div>
            <img id="imgB" alt="Screenshot of URL B" />
          </div>
        </div>
      </div>

      <div id="sliderView" style="display:none">
        <div class="slider-section">
          <h3>Drag the slider to compare</h3>
          <div class="slider-container" id="sliderContainer">
            <img id="sliderBase" alt="URL A (base)" />
            <div class="slider-overlay" id="sliderOverlayWrap">
              <img id="sliderOverlay" alt="URL B (overlay)" style="display:block;width:100%" />
            </div>
            <div class="slider-handle" id="sliderHandle"></div>
          </div>
          <div class="slider-labels"><span>URL A</span><span>URL B</span></div>
        </div>
      </div>

      <div id="diffView" style="display:none">
        <div class="slider-section">
          <h3>Pixel Difference Map <span style="font-weight:400;color:var(--text-3);font-size:12px">— magenta pixels differ</span></h3>
          <canvas id="diffCanvas" class="diff-canvas"></canvas>
        </div>
      </div>

      <div class="diff-metrics" id="metrics">
        <div class="diff-metric" id="metricResolution"><div class="metric-value" id="resValue">-</div><div class="metric-label">Resolution</div></div>
        <div class="diff-metric" id="metricDiff"><div class="metric-value" id="diffValue">-</div><div class="metric-label">Difference</div></div>
        <div class="diff-metric" id="metricPixels"><div class="metric-value" id="pixelValue">-</div><div class="metric-label">Pixels Changed</div></div>
      </div>

      <div class="curl-box">
        <button class="copy-btn" onclick="copyCurl()">Copy</button>
        <code id="curlCommand"># Compare two pages programmatically:
curl -o page-a.png "https://snapshot-api-production-1374.up.railway.app/screenshot?url=URL_A&key=YOUR_KEY"
curl -o page-b.png "https://snapshot-api-production-1374.up.railway.app/screenshot?url=URL_B&key=YOUR_KEY"
# Then use ImageMagick to diff:
compare page-a.png page-b.png diff.png</code>
      </div>
    </div>
  </div>
</div>

<footer>
  <span>&copy; 2026 Auto Company</span>
  <div style="display:flex;align-items:center;gap:20px">
    <a href="/snapshot">SnapShot API &rarr;</a>
  </div>
</footer>
</div>

<script>
const API_BASE = 'https://company-site-production-9f58.up.railway.app';
const URL_A = document.getElementById('urlA');
const URL_B = document.getElementById('urlB');
const COMPARISON = document.getElementById('comparison');
const IMG_A = document.getElementById('imgA');
const IMG_B = document.getElementById('imgB');
const DIM_A = document.getElementById('dimA');
const DIM_B = document.getElementById('dimB');
const SLIDER_BASE = document.getElementById('sliderBase');
const SLIDER_OVERLAY = document.getElementById('sliderOverlay');
const SLIDER_OVERLAY_WRAP = document.getElementById('sliderOverlayWrap');
const SLIDER_HANDLE = document.getElementById('sliderHandle');
const SLIDER_CONTAINER = document.getElementById('sliderContainer');
const DIFF_CANVAS = document.getElementById('diffCanvas');
const DIFF_VALUE = document.getElementById('diffValue');
const PIXEL_VALUE = document.getElementById('pixelValue');
const RES_VALUE = document.getElementById('resValue');
const SPINNER = document.getElementById('spinner');
const ERROR_BOX = document.getElementById('errorBox');
const RESULT_AREA = document.getElementById('resultArea');
const SIDE_VIEW = document.getElementById('sideView');
const SLIDER_VIEW = document.getElementById('sliderView');
const DIFF_VIEW = document.getElementById('diffView');
const BTN = document.getElementById('compareBtn');
const CURL_CMD = document.getElementById('curlCommand');

let imgDataA = null, imgDataB = null;
let currentMode = 'side';

function setPreset(a, b) {
  URL_A.value = a;
  URL_B.value = b;
  compare();
}

function swapUrls() {
  const tmp = URL_A.value;
  URL_A.value = URL_B.value;
  URL_B.value = tmp;
  if (RESULT_AREA.classList.contains('visible')) compare();
}

function showError(msg) {
  ERROR_BOX.textContent = msg;
  ERROR_BOX.classList.add('visible');
}

function hideError() {
  ERROR_BOX.textContent = '';
  ERROR_BOX.classList.remove('visible');
}

function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.diff-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  SIDE_VIEW.style.display = mode === 'side' ? 'block' : 'none';
  SLIDER_VIEW.style.display = mode === 'slider' ? 'block' : 'none';
  DIFF_VIEW.style.display = mode === 'diff' ? 'block' : 'none';
  if (mode === 'diff' && imgDataA && imgDataB) computeDiff();
  if (mode === 'slider' && imgDataA && imgDataB) initSlider();
}

async function fetchScreenshot(url) {
  if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
  const r = await fetch(API_BASE + '/api/playground-screenshot?url=' + encodeURIComponent(url));
  if (!r.ok) {
    const err = await r.json().catch(() => ({ error: r.statusText }));
    throw new Error(err.error || 'Request failed (' + r.status + ')');
  }
  return r.blob();
}

function loadImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image'));
    img.src = URL.createObjectURL(blob);
  });
}

function formatNum(n) {
  return n >= 1000000 ? (n/1000000).toFixed(1) + 'M' : n >= 1000 ? (n/1000).toFixed(1) + 'K' : n.toLocaleString();
}

async function compare() {
  const urlA = URL_A.value.trim();
  const urlB = URL_B.value.trim();
  if (!urlA || !urlB) { showError('Please enter both URLs'); return; }

  hideError();
  RESULT_AREA.classList.remove('visible');
  SPINNER.classList.add('active');
  BTN.disabled = true;
  BTN.textContent = 'Comparing...';

  try {
    const [blobA, blobB] = await Promise.all([fetchScreenshot(urlA), fetchScreenshot(urlB)]);
    const [imgA, imgB] = await Promise.all([loadImage(blobA), loadImage(blobB)]);

    imgDataA = imgA;
    imgDataB = imgB;

    IMG_A.src = imgA.src;
    IMG_B.src = imgB.src;
    DIM_A.textContent = imgA.naturalWidth + 'x' + imgA.naturalHeight;
    DIM_B.textContent = imgB.naturalWidth + 'x' + imgB.naturalHeight;

    SLIDER_BASE.src = imgA.src;
    SLIDER_OVERLAY.src = imgB.src;

    RES_VALUE.textContent = imgA.naturalWidth + 'x' + imgA.naturalHeight;
    if (imgA.naturalWidth === imgB.naturalWidth && imgA.naturalHeight === imgB.naturalHeight) {
      RES_VALUE.textContent = imgA.naturalWidth + 'x' + imgA.naturalHeight;
    } else {
      RES_VALUE.textContent = imgA.naturalWidth + 'x' + imgA.naturalHeight + ' vs ' + imgB.naturalWidth + 'x' + imgB.naturalHeight;
    }

    CURL_CMD.textContent = '# Compare two pages programmatically:\ncurl -o page-a.png "' + API_BASE.replace('/visual-diff','') + '/screenshot?url=' + encodeURIComponent(urlA) + '&key=YOUR_KEY"\ncurl -o page-b.png "' + API_BASE.replace('/visual-diff','') + '/screenshot?url=' + encodeURIComponent(urlB) + '&key=YOUR_KEY"\n# Then use ImageMagick to diff:\ncompare page-a.png page-b.png diff.png';

    RESULT_AREA.classList.add('visible');
    setMode('side');
    initSlider();
  } catch (e) {
    showError(e.message);
  } finally {
    SPINNER.classList.remove('active');
    BTN.disabled = false;
    BTN.textContent = 'Compare Pages';
  }
}

function initSlider() {
  if (!imgDataA || !imgDataB) return;
  SLIDER_CONTAINER.style.aspectRatio = imgDataA.naturalWidth + '/' + imgDataA.naturalHeight;
  const moveSlider = (x) => {
    const rect = SLIDER_CONTAINER.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
    SLIDER_OVERLAY_WRAP.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
    SLIDER_HANDLE.style.left = pct + '%';
  };

  const onMove = (e) => {
    const x = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
    moveSlider(x);
  };

  const onDown = (e) => {
    e.preventDefault();
    const onUp = () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp); document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp); };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: true });
    document.addEventListener('touchend', onUp);
    onMove(e);
  };

  SLIDER_CONTAINER.addEventListener('mousedown', onDown);
  SLIDER_CONTAINER.addEventListener('touchstart', onDown, { passive: true });
  moveSlider(SLIDER_CONTAINER.getBoundingClientRect().left + SLIDER_CONTAINER.offsetWidth / 2);
}

function computeDiff() {
  if (!imgDataA || !imgDataB) return;

  const w = Math.max(imgDataA.naturalWidth, imgDataB.naturalWidth);
  const h = Math.max(imgDataA.naturalHeight, imgDataB.naturalHeight);

  DIFF_CANVAS.style.display = 'block';
  DIFF_CANVAS.width = w;
  DIFF_CANVAS.height = h;
  DIFF_CANVAS.style.maxWidth = '100%';
  DIFF_CANVAS.style.height = 'auto';

  const ctx = DIFF_CANVAS.getContext('2d');

  const cA = document.createElement('canvas');
  cA.width = w; cA.height = h;
  const ctxA = cA.getContext('2d');
  ctxA.drawImage(imgDataA, 0, 0);

  const cB = document.createElement('canvas');
  cB.width = w; cB.height = h;
  const ctxB = cB.getContext('2d');
  ctxB.drawImage(imgDataB, 0, 0);

  const dA = ctxA.getImageData(0, 0, w, h);
  const dB = ctxB.getImageData(0, 0, w, h);
  const diff = ctx.createImageData(w, h);
  const data = diff.data;

  let changed = 0;
  const total = w * h;

  for (let i = 0; i < total; i++) {
    const idx = i * 4;
    const r1 = dA.data[idx], g1 = dA.data[idx+1], b1 = dA.data[idx+2];
    const r2 = dB.data[idx], g2 = dB.data[idx+1], b2 = dB.data[idx+2];

    if (Math.abs(r1 - r2) > 10 || Math.abs(g1 - g2) > 10 || Math.abs(b1 - b2) > 10) {
      data[idx] = 236; data[idx+1] = 72; data[idx+2] = 153; data[idx+3] = 255;
      changed++;
    } else {
      data[idx] = r1; data[idx+1] = g1; data[idx+2] = b1; data[idx+3] = 200;
    }
  }

  ctx.putImageData(diff, 0, 0);

  const pct = (changed / total * 100);
  PIXEL_VALUE.textContent = formatNum(changed);
  DIFF_VALUE.textContent = pct < 0.1 ? '<0.1%' : pct.toFixed(1) + '%';

  const metric = document.getElementById('metricDiff');
  metric.className = 'diff-metric' + (pct > 5 ? ' high' : pct > 0.5 ? ' medium' : ' low');
}

async function copyCurl() {
  try {
    await navigator.clipboard.writeText(CURL_CMD.textContent.replace(/^#.*\n/, '').trim());
  } catch {}
}

compare();
</script>
</body>
</html>`

const OG_TITLE = 'Auto Company — Build tools. Ship products.'
const OG_DESC = 'Auto Company builds developer tools and content creation products. Live service dashboard.'
const OG_IMAGE = 'https://snapog-production.up.railway.app/preview?title=Auto+Company&description=Build+tools.+Ship+products.&template=default&theme=dark'
const SITE_URL = 'https://company-site-production-9f58.up.railway.app'
const DEMO_API_KEY = 'ss_60547943423dc73b44f77e28c68b2641a5a97d601ac91772'

const SERVICES: Array<{ id: string; name: string; tagline: string; url: string; github: string | null; badge: string; badgeColor: string; healthPath: string }> = [
  { id: 'snapshot-api', name: 'SnapShot', tagline: 'Website screenshot API — instant key via curl', url: 'https://snapshot-api-production-1374.up.railway.app', github: 'https://github.com/bakasa/snapshot-api', badge: 'API', badgeColor: '#06B6D4', healthPath: '/health' },
  { id: 'reqdump', name: 'ReqDump', tagline: 'HTTP request inspector & webhook debugger', url: 'https://reqdump-production.up.railway.app', github: 'https://github.com/bakasa/reqdump', badge: 'Open Source', badgeColor: '#22C55E', healthPath: '/health' },
  { id: 'snapog', name: 'SnapOG', tagline: 'OG image generation API', url: 'https://snapog-production.up.railway.app', github: 'https://github.com/bakasa/snapog', badge: 'API', badgeColor: '#F59E0B', healthPath: '/health' },
  { id: 'omnipost', name: 'OmniPost', tagline: 'Cross-platform content studio', url: 'https://omnipost-production-38f9.up.railway.app', github: 'https://github.com/bakasa/omnipost', badge: 'Studio', badgeColor: '#A855F7', healthPath: '/health' },
  { id: 'company-site', name: 'Auto Company', tagline: 'Company site & service dashboard', url: 'https://company-site-production-9f58.up.railway.app', github: null, badge: 'Meta', badgeColor: '#6B7280', healthPath: '/health' },
]

const DATA_DIR = path.join(process.cwd(), 'data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const PINGS_FILE = join(DATA_DIR, 'pings.json')

interface PingRecord {
  service_id: string
  online: boolean
  ms: number
  status_code: number | null
  checked_at: string
}

async function loadPings(): Promise<PingRecord[]> {
  try {
    const raw = await readFile(PINGS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function savePings(pings: PingRecord[]) {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const trimmed = pings.filter(p => p.checked_at >= cutoff)
  await writeFile(PINGS_FILE, JSON.stringify(trimmed))
}

async function addPing(service_id: string, online: boolean, ms: number, status_code: number | null) {
  const pings = await loadPings()
  pings.push({ service_id, online, ms, status_code, checked_at: new Date().toISOString() })
  await savePings(pings)
}

async function getRecentPings(service_id: string, days = 7): Promise<PingRecord[]> {
  const pings = await loadPings()
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
  return pings.filter(p => p.service_id === service_id && p.checked_at >= cutoff).sort((a, b) => a.checked_at.localeCompare(b.checked_at))
}

async function getServiceStats(service_id: string) {
  const recent = await getRecentPings(service_id)
  const total = recent.length
  const up = recent.filter(p => p.online).length
  const avgMs = up > 0 ? Math.round(recent.filter(p => p.online).reduce((s, p) => s + p.ms, 0) / up) : 0
  const lastCheck = recent.length > 0 ? recent[recent.length - 1].checked_at : null
  return { total_checks: total, up_checks: up, avg_ms: avgMs, last_check: lastCheck }
}

async function checkService(svc: typeof SERVICES[0]): Promise<{ online: boolean; ms: number; statusCode: number }> {
  const url = `${svc.url.replace(/\/+$/, '')}/${svc.healthPath.replace(/^\//, '')}`
  const t0 = performance.now()
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const ms = Math.round(performance.now() - t0)
    return { online: res.ok, ms, statusCode: res.status }
  } catch {
    return { online: false, ms: Math.round(performance.now() - t0), statusCode: 0 }
  }
}

async function checkAllServices() {
  const results = await Promise.all(SERVICES.map(s => checkService(s)))
  for (let i = 0; i < SERVICES.length; i++) {
    await addPing(SERVICES[i].id, results[i].online, results[i].ms, results[i].statusCode === 0 ? null : results[i].statusCode)
  }
}

checkAllServices()
setInterval(checkAllServices, 5 * 60 * 1000)

const BLOG_POSTS = [
  {
    slug: 'website-screenshot-api-curl',
    title: 'How to Take Automated Website Screenshots with curl (Zero Signup)',
    excerpt: 'Get a screenshot of any webpage via API in under 10 seconds — no signup, no OAuth, no email. Just curl and a URL.',
    date: '2026-07-22',
    tags: ['tutorial', 'api', 'screenshots', 'automation'],
    content: `
<h2>Why Automate Screenshots?</h2>
<p>Manual screenshots don't scale. Whether you need daily dashboard snapshots, CI/CD visual diffs, OG image previews, or monitoring alerts — a scriptable screenshot API saves hours.</p>
<p><a href="https://snapshot-api-production-1374.up.railway.app">SnapShot API</a> is the simplest way to automate this. One endpoint, instant key, no signup.</p>
<h2>Get a Key (No Signup)</h2>
<pre>curl https://snapshot-api-production-1374.up.railway.app/key</pre>
<p>That's it. A JSON response with your <code>key</code> and <code>referral_code</code>. No email, no OAuth, no billing info.</p>
<h2>Take a Screenshot</h2>
<pre>curl "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://example.com&amp;key=YOUR_KEY" > screenshot.png</pre>
<p>The API returns a full-page PNG. Works for any public URL.</p>
<h2>Use Cases</h2>
<h3>Dashboard Monitoring</h3>
<p>Schedule a cron job to snapshot your dashboards every hour:</p>
<pre>0 * * * * curl "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://metrics.example.com/dashboard&amp;key=YOUR_KEY" > /data/dash-\$(date +\\%Y\\%m\\%d\\%H).png</pre>
<h3>CI/CD Visual Regression</h3>
<p>Capture your staging site after every deploy, compare against production baseline:</p>
<pre>curl "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://staging.example.com&amp;key=YOUR_KEY" > staging-snapshot.png</pre>
<h3>AI/LLM Context</h3>
<p>Feed webpage screenshots into vision models for analysis — product pages, documentation, competitor sites.</p>
<h3>Price Monitoring</h3>
<p>Track competitor pricing pages, product listings, or availability indicators over time.</p>
<h2>Share &amp; Earn More Capacity</h2>
<p>Each user gets a referral link. When someone signs up using it, <strong>both</strong> parties get +50 monthly screenshots. Stackable. No limit.</p>
<pre># Your referral link
https://snapshot-api-production-1374.up.railway.app/?ref=YOUR_CODE</pre>
<h2>Pricing</h2>
<ul>
<li><strong>Free</strong> — 100 screenshots/month, instant key, referral bonuses</li>
<li><strong>Pro</strong> ($15) — 1,000/month (coming soon)</li>
<li><strong>Business</strong> ($49) — 10,000/month (coming soon)</li>
</ul>
<p>Or <strong>try it right now</strong> in the <a href="https://company-site-production-9f58.up.railway.app/playground">interactive playground</a> — no API key required.</p>
<p>Start at <a href="https://snapshot-api-production-1374.up.railway.app">snapshot-api-production-1374.up.railway.app</a> or browse the <a href="https://github.com/bakasa/snapshot-api">source on GitHub</a>.</p>
`
  },
  {
    slug: 'self-host-request-inspector-security',
    title: 'Stop Pasting Webhooks Into Strangers\' Services — Self-Host Your Request Inspector',
    excerpt: 'Every time you paste a webhook URL from a public service, you\'re sending sensitive data through someone else\'s infrastructure.',
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
<li><strong>Authentication tokens</strong> — Many services pass API keys or bearer tokens</li>
<li><strong>Customer PII</strong> — Payment processor webhooks include names, emails, billing addresses</li>
<li><strong>Internal URLs</strong> — Callback URLs, redirect URIs, internal service endpoints</li>
<li><strong>Session data</strong> — User IDs, session tokens, internal identifiers</li>
</ul>
<p>Self-hosting a request inspector like <a href="https://reqdump-production.up.railway.app">reqdump</a> flips the security model entirely — your data stays on your infrastructure, the code is fully auditable (~500 lines), and you control retention.</p>
<p><a href="https://reqdump-production.up.railway.app">Try reqdump</a> · <a href="https://github.com/bakasa/reqdump">GitHub</a> · <a href="https://railway.app/template/reqdump">Deploy on Railway</a></p>
`
  },
  {
    slug: 'stripe-webhook-debugging-guide',
    title: 'How to Debug Stripe Webhooks: Signature Verification, Local Testing, and Best Practices',
    excerpt: 'A practical guide to debugging Stripe webhooks — from signature verification and Stripe CLI testing to capturing live events.',
    date: '2026-07-22',
    tags: ['stripe', 'webhooks', 'debugging', 'engineering'],
    content: `
<h2>Why Stripe Webhooks Are Hard to Debug</h2>
<p>Stripe's servers need to reach your endpoint, which means localhost won't work. Webhook signatures add crypto overhead. Events arrive asynchronously.</p>
<p>This guide covers the fastest workflow for debugging Stripe webhooks — from creating a capture endpoint to verifying signatures to replaying events locally.</p>
<h2>Step 1: Create a Capture Endpoint</h2>
<p><a href="https://reqdump-production.up.railway.app">reqdump</a> creates a unique endpoint instantly — no signup, no account.</p>
<h2>Step 2: Point Stripe at Your Capture Endpoint</h2>
<p>Use Stripe Dashboard or Stripe CLI to forward events.</p>
<h2>Step 3: Inspect the Captured Webhook</h2>
<p>Open your dashboard URL and see method, path, headers, body.</p>
<h2>Step 4: Verify the Webhook Signature</h2>
<p>reqdump has a built-in signature verification tool at <a href="https://reqdump-production.up.railway.app/stripe">/stripe</a>.</p>
<h2>Step 5: Replay Events Against Your Local Server</h2>
<p>From the request detail page, open Replay, enter your local server URL, hit Send.</p>
<p><a href="https://reqdump-production.up.railway.app">Try reqdump's Stripe webhook debugger</a></p>
`
  },
  {
    slug: 'snapshot-github-action-ci-screenshots',
    title: 'Automated Website Screenshots in GitHub CI/CD — Introducing the SnapShot API Action',
    excerpt: 'Capture website screenshots directly in your GitHub Actions workflows with zero setup. A new composite action that brings SnapShot API into your CI pipeline.',
    date: '2026-07-22',
    tags: ['github-actions', 'ci-cd', 'screenshots', 'automation'],
    content: `
<h2>Screenshots in CI, Finally</h2>
<p>We just shipped a <a href="https://github.com/bakasa/snapshot-action">GitHub Action</a> for <a href="https://snapshot-api-production-1374.up.railway.app">SnapShot API</a> — now you can capture website screenshots directly in your GitHub Actions workflows.</p>
<pre>jobs:
  screenshot:
    runs-on: ubuntu-latest
    steps:
      - uses: bakasa/snapshot-action@v1
        with:
          api_key: \${{ secrets.SS_API_KEY }}
          url: https://example.com
          output: screenshot.png</pre>
<p>The action automatically uploads the screenshot as a workflow artifact, so you can download it, compare it, or archive it.</p>
<h2>Why a GitHub Action?</h2>
<p>Most screenshot APIs make you write the HTTP wrapper yourself — curl, handle auth, save the file, upload the artifact. This action handles all of that in under 50 lines.</p>
<p>Just set your API key as a secret, pick a URL, and the action returns a PNG.</p>
<h2>Use in Visual Regression</h2>
<p>Pair it with the <a href="https://company-site-production-9f58.up.railway.app/visual-diff">Visual Diff tool</a>: capture your staging site on every deploy, then diff against the production baseline.</p>
<h2>Get Started</h2>
<pre># Get a free API key
curl https://snapshot-api-production-1374.up.railway.app/key

# Add SS_API_KEY to your repo secrets
# Then add to your workflow:
- uses: bakasa/snapshot-action@v1
  with:
    api_key: \${{ secrets.SS_API_KEY }}
    url: https://your-staging.com
    output: staging-\${{ github.sha }}.png</pre>
<p>Full docs on the <a href="https://github.com/bakasa/snapshot-action">GitHub repo</a>.</p>
`
  },
  {
    slug: 'webhook-idempotency-duplicate-events',
    title: 'Webhook Idempotency: How to Handle Duplicate Events Without Breaking Your System',
    excerpt: 'Webhooks are delivered with at-least-once semantics. Here\'s how to build idempotent handlers that safely process the same event multiple times.',
    date: '2026-07-22',
    tags: ['webhooks', 'engineering', 'best-practices'],
    content: `
<h2>Why Duplicate Webhooks Are Inevitable</h2>
<p>Every major webhook provider uses at-least-once delivery semantics. Duplicates are a feature, not a bug.</p>
<h2>What Happens Without Idempotency</h2>
<p>Multiple charge records, duplicate emails, inflated metrics, race conditions.</p>
<h2>The Core Pattern: Event ID Deduplication</h2>
<p>Use a processed-events table with atomic INSERT to gate processing.</p>
<p><a href="https://reqdump-production.up.railway.app">Try reqdump — capture, inspect, and replay webhooks</a></p>
`
  },
  {
    slug: 'test-webhooks-locally-without-ngrok',
    title: 'How to Test Webhooks Locally Without ngrok',
    excerpt: 'Stripe CLI, ReqDump capture+replay, and self-hosted alternatives for debugging webhooks without exposing localhost.',
    date: '2026-07-22',
    tags: ['webhooks', 'testing', 'engineering', 'tutorial'],
    content: `
<h2>Why You Don't Always Need ngrok</h2>
<p>Rate limits, ephemeral URLs, session management, no persistence.</p>
<h2>Method 1: Stripe CLI Forwarding</h2>
<p>stripe listen --forward-to http://localhost:3000/webhook</p>
<h2>Method 2: Capture with ReqDump, Replay Locally</h2>
<p>Create a bin, capture the real request, replay against localhost.</p>
<h2>Method 3: Self-Hosted ReqDump</h2>
<p>For production data where you control the infrastructure.</p>
<p><a href="https://reqdump-production.up.railway.app">Try ReqDump</a></p>
`
  },
  {
    slug: 'hono-sqlite-webhook-debugger',
    title: 'The Stack Behind a 500-Line Webhook Debugger: Hono + SQLite',
    excerpt: 'Why Hono and better-sqlite3 over Express + Postgres, and how ~500 lines of TypeScript became a production webhook inspector.',
    date: '2026-07-22',
    tags: ['engineering', 'opensource'],
    content: `
<h2>Why Not Express?</h2>
<p>Hono is 20x faster, 14KB, runs everywhere, full TypeScript inference.</p>
<h2>Why better-sqlite3 Instead of Postgres</h2>
<p>Zero infrastructure, synchronous API, WAL mode, automatic cleanup.</p>
<h2>The Architecture</h2>
<p>Three routes: create bin, capture request, view dashboard.</p>
<p>The entire server is ~500 lines of TypeScript in a single file.</p>
<p><a href="https://reqdump-production.up.railway.app">Try reqdump</a></p>
`
  },
  {
    slug: 'automated-website-change-monitoring',
    title: 'How to Monitor Website Changes with Automated Screenshots (No Signup)',
    excerpt: 'Set up free visual website monitoring with cron and a screenshot API. Get alerts when pages change — no account required.',
    date: '2026-07-22',
    tags: ['tutorial', 'monitoring', 'screenshots', 'automation', 'ci-cd'],
    content: `
<h2>Why Visual Monitoring?</h2>
<p>Most monitoring tools check if a server responds (ping) or if a keyword exists (text match). But what if your dashboard renders wrong data, your pricing page has a layout shift, or a competitor changed their product image? These are visual changes — and they need visual monitoring.</p>
<p>A screenshot API like <a href="https://snapshot-api-production-1374.up.railway.app">SnapShot API</a> makes this trivial: take a screenshot on a schedule, diff it against the last capture, and you have free visual regression detection.</p>
<h2>What You'll Build</h2>
<p>A zero-cost monitoring script that:</p>
<ul>
<li>Captures a website screenshot every hour via cron</li>
<li>Saves each screenshot with a timestamp</li>
<li>Compares with the previous capture</li>
<li>Alerts you if the page changed visually</li>
</ul>
<h2>Step 1: Get an API Key</h2>
<pre>curl https://snapshot-api-production-1374.up.railway.app/key</pre>
<p>Save the <code>key</code> value from the JSON response. No email, no signup — it's instant.</p>
<h2>Step 2: Write the Monitor Script</h2>
<p>Create a file called <code>monitor.sh</code>:</p>
<pre>#!/bin/bash
SNAPSHOT_KEY="YOUR_KEY"
URL="https://example.com"
DIR="./snapshots"
mkdir -p "$DIR"
TS=$(date +%Y%m%d%H%M)
FILE="$DIR/snapshot-$TS.png"
curl -s -o "$FILE" \\
  "https://snapshot-api-production-1374.up.railway.app/screenshot?url=$URL&key=$SNAPSHOT_KEY"
echo "Saved: $FILE"</pre>
<h2>Step 3: Set Up a Cron Job</h2>
<pre># Run every hour
0 * * * * /path/to/monitor.sh</pre>
<h2>Step 4: Detect Changes</h2>
<p>Add a simple ImageMagick comparison to your script:</p>
<pre>PREV=$(ls -t "$DIR"/*.png | head -2 | tail -1)
CURR=$(ls -t "$DIR"/*.png | head -1)
if [ -n "$PREV" ] && [ -n "$CURR" ]; then
  DIFF=$(compare -metric AE "$PREV" "$CURR" /dev/null 2>&1)
  if [ "$DIFF" -gt 1000 ]; then
    echo "Change detected! ($DIFF pixels differ)"
    # Send alert (email, Slack, etc.)
  fi
fi</pre>
<h2>Use Cases</h2>
<h3>Competitor Monitoring</h3>
<p>Track when competitors change pricing, features, or landing pages. Get screenshots archived daily.</p>
<h3>Dashboard Reliability</h3>
<p>Verify your dashboards render correctly after every deploy. Catch blank pages or broken charts before users do.</p>
<h3>CI/CD Visual Regression</h3>
<p>Add a screenshot step to your deployment pipeline. Reject deploys that change critical pages visually.</p>
<pre># GitHub Actions step
- name: Capture staging
  run: curl -s -o staging.png "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://staging.example.com&key=$KEY"</pre>
<h2>Limitations &amp; Next Steps</h2>
<p>This basic approach works for small-scale monitoring. For production use, consider:</p>
<ul>
<li><strong>PixelDiff</strong> — a proper diff library with threshold tuning</li>
<li><strong>Database-backed history</strong> — store metadata and diffs per page</li>
<li><strong>Alert integrations</strong> — Slack webhook, PagerDuty, email</li>
<li><strong>Twice-daily cadence</strong> — or higher frequency on Pro ($15/mo for 1,000 captures)</li>
</ul>
<p>Start monitoring <strong>right now</strong> — get your API key at <a href="https://snapshot-api-production-1374.up.railway.app">snapshot-api-production-1374.up.railway.app</a> or <a href="https://company-site-production-9f58.up.railway.app/playground">try it in the playground</a>.</p>
`
  },
  {
    slug: 'visual-website-diff-tool',
    title: 'Introducing the Visual Website Diff Tool — Compare Any Two Pages Side-by-Side',
    excerpt: 'A new free tool to compare any two webpages visually. Spot layout changes, content differences, and design regressions instantly — no account required.',
    date: '2026-07-22',
    tags: ['tool', 'screenshots', 'visual-diff', 'testing'],
    content: `
<h2>Spot Visual Differences Instantly</h2>
<p>We just shipped a <a href="/visual-diff">free visual website diff tool</a> — enter two URLs and see them side by side, with a pixel-level difference map and an interactive slider overlay. No signup, no API key, no account.</p>
<p>It's built on top of <a href="/snapshot">SnapShot API</a>, our screenshot-as-a-service that gives you instant API keys via curl.</p>
<h2>Three Ways to Compare</h2>
<p>The tool offers three comparison modes:</p>
<h3>Side by Side</h3>
<p>Both pages rendered at full width with their dimensions displayed. Useful for a quick visual scan.</p>
<h3>Interactive Slider</h3>
<p>A before/after slider overlay. Drag left and right to reveal one page underneath the other. This is the most natural way to spot layout shifts, missing elements, or content changes.</p>
<h3>Pixel Difference Map</h3>
<p>An automated diff that highlights every changed pixel in magenta. Screens that are identical will show no magenta at all — a powerful check for CI/CD visual regression testing.</p>
<p>The tool also computes a difference percentage and total changed pixel count.</p>
<h2>Use It in CI/CD</h2>
<p>The curl command at the bottom of the page shows the programmatic equivalent:</p>
<pre>curl -o staging.png "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://staging.example.com&key=YOUR_KEY"
curl -o prod.png "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://prod.example.com&key=YOUR_KEY"
compare staging.png prod.png diff.png</pre>
<p>Drop this into your GitHub Actions or CI pipeline and reject deploys that exceed a pixel-diff threshold.</p>
<h2>Built with SnapShot API</h2>
<p>Each comparison fetches two screenshots via the SnapShot API playground endpoint — the same API you can call directly with your own key for production workloads.</p>
<p>Get your free API key at <a href="https://snapshot-api-production-1374.up.railway.app">snapshot-api-production-1374.up.railway.app</a> or <a href="/visual-diff">try the visual diff tool now</a>.</p>
`
  }
]

function escapeHtml(s: string): string {
  if (!s) return ''
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

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
<script defer data-domain="company-site-production-9f58.up.railway.app" src="https://plausible.io/js/script.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0B0D12; --bg-alt: #11141D; --surface: #181C27;
  --surface-hover: #1F2433; --border: #242938; --border-light: #2E3444;
  --text-1: #EDEEF0; --text-2: #969CA8; --text-3: #545A68;
  --accent: #D97706; --accent-glow: rgba(217,119,6,0.15);
  --green: #22C55E; --green-dim: rgba(34,197,94,0.12);
  --red: #EF4444; --red-dim: rgba(239,68,68,0.12);
  --yellow: #EAB308;
  --font-sans: 'DM Sans', system-ui, sans-serif;
  --font-mono: 'DM Mono', 'SF Mono', monospace;
  --r: 10px; --r-lg: 16px;
}
body { background: var(--bg); color: var(--text-1); font-family: var(--font-sans); font-size: 16px; line-height: 1.6; min-height: 100vh; }
.bg-grid { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 48px 48px; }
.bg-glow { position: fixed; top: -40vh; left: -20vw; width: 80vw; height: 80vh; background: radial-gradient(ellipse at center, var(--accent-glow) 0%, transparent 70%); pointer-events: none; z-index: 0; }
.container { position: relative; z-index: 1; max-width: 960px; margin: 0 auto; padding: 0 24px; }
nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0; border-bottom: 1px solid var(--border); }
.logo { font-family: var(--font-mono); font-weight: 500; font-size: 18px; color: var(--text-1); letter-spacing: -0.02em; }
.logo span { color: var(--accent); }
.nav-links { display: flex; gap: 28px; align-items: center; }
.nav-links a { color: var(--text-2); text-decoration: none; font-size: 14px; transition: color 0.15s; }
.nav-links a:hover { color: var(--text-1); }
.hero { padding: 80px 0 64px; text-align: center; }
.hero-eyebrow { font-family: var(--font-mono); font-size: 12px; color: var(--accent); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px; }
.hero-eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--green); animation: pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.hero h1 { font-size: clamp(40px, 6vw, 64px); font-weight: 700; letter-spacing: -0.04em; line-height: 1.05; margin-bottom: 20px; }
.hero h1 span { background: linear-gradient(135deg, var(--accent), #FBBF24); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.hero-sub { font-size: 18px; color: var(--text-2); max-width: 520px; margin: 0 auto; line-height: 1.65; }
.hero-stats { display: flex; gap: 48px; justify-content: center; margin-top: 40px; flex-wrap: wrap; }
.hero-stat { text-align: center; }
.hero-stat-num { font-family: var(--font-mono); font-size: 28px; font-weight: 500; color: var(--text-1); }
.hero-stat-label { font-size: 13px; color: var(--text-3); margin-top: 4px; }
.section-title { font-family: var(--font-mono); font-size: 12px; color: var(--text-3); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
.products { padding: 0 0 80px; }
.product-grid { display: flex; flex-direction: column; gap: 12px; }
.product-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 24px 28px; display: flex; align-items: center; gap: 20px; transition: border-color 0.2s, background 0.2s; text-decoration: none; color: inherit; position: relative; overflow: hidden; }
.product-card:hover { border-color: var(--border-light); background: var(--surface-hover); }
.product-card-inner { flex: 1; min-width: 0; }
.product-card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.product-name { font-family: var(--font-mono); font-size: 16px; font-weight: 500; color: var(--text-1); }
.product-badge { font-family: var(--font-mono); font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 10px; border-radius: 100px; line-height: 1.6; }
.product-tagline { font-size: 13px; color: var(--text-2); }
.product-link { font-family: var(--font-mono); font-size: 12px; color: var(--accent); display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; }
.product-link:hover { color: #FBBF24; }
.product-status { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; min-width: 90px; flex-shrink: 0; }
.status-badge { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; padding: 4px 12px; border-radius: 100px; border: 1px solid var(--border); background: var(--bg); }
.status-badge .dot { width: 7px; height: 7px; border-radius: 50%; }
.status-badge.online .dot { background: var(--green); box-shadow: 0 0 6px var(--green); }
.status-badge.offline .dot { background: var(--red); box-shadow: 0 0 6px var(--red); }
.status-badge.checking .dot { background: var(--text-3); animation: pulse-dot 1s ease-in-out infinite; }
.status-latency { font-family: var(--font-mono); font-size: 11px; color: var(--text-3); }
.status-bar-chart { display: flex; gap: 2px; align-items: flex-end; height: 16px; margin-top: 4px; }
.status-bar { width: 4px; border-radius: 1px; background: var(--border); transition: background 0.3s; }
.status-bar.up { background: var(--green); }
.status-bar.down { background: var(--red); }
.status-bar.current { width: 6px; }
.dashboard-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 32px; }
.dashboard-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; }
.dashboard-card h3 { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; font-family: var(--font-mono); }
.dashboard-card .value { font-family: var(--font-mono); font-size: 28px; font-weight: 500; color: var(--text-1); }
.dashboard-card .sub { font-size: 12px; color: var(--text-2); margin-top: 4px; }
.dashboard-card .sub .ok { color: var(--green); }
.dashboard-card .sub .fail { color: var(--red); }
.status-timeline { margin: 24px 0; }
.status-timeline h3 { font-size: 12px; color: var(--text-3); margin-bottom: 8px; font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.06em; }
.timeline-row { display: flex; align-items: center; gap: 12px; margin-bottom: 6px; }
.timeline-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-2); min-width: 80px; text-align: right; }
.timeline-bars { display: flex; gap: 2px; flex: 1; height: 20px; align-items: flex-end; }
.timeline-bar { width: 100%; height: 100%; border-radius: 1px; min-width: 3px; background: var(--border); }
.timeline-bar.up { background: var(--green); }
.timeline-bar.down { background: var(--red); }
.timeline-summary { font-family: var(--font-mono); font-size: 11px; color: var(--text-3); min-width: 60px; }
.waitlist-box { max-width: 520px; margin: 0 auto; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 48px 40px; text-align: center; }
.waitlist-box h2 { font-size: 24px; font-weight: 600; letter-spacing: -0.02em; margin-bottom: 8px; }
.waitlist-box p { font-size: 15px; color: var(--text-2); margin-bottom: 28px; line-height: 1.6; }
.waitlist-form { display: flex; gap: 12px; max-width: 420px; margin: 0 auto; }
.waitlist-input { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 16px; font-family: var(--font-sans); font-size: 15px; color: var(--text-1); outline: none; transition: border-color 0.2s; }
.waitlist-input::placeholder { color: var(--text-3); }
.waitlist-input:focus { border-color: var(--accent); }
.waitlist-btn { background: var(--accent); color: #0B0D12; border: none; border-radius: var(--r); padding: 12px 24px; font-family: var(--font-sans); font-size: 15px; font-weight: 600; cursor: pointer; transition: background 0.15s, transform 0.1s; white-space: nowrap; }
.waitlist-btn:hover { background: #F59E0B; }
.waitlist-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.waitlist-message { margin-top: 20px; font-size: 14px; min-height: 24px; }
.waitlist-message.success { color: var(--green); }
.waitlist-message.error { color: var(--red); }
footer { border-top: 1px solid var(--border); padding: 32px 0; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-3); margin-top: 40px; }
footer a { color: var(--text-2); text-decoration: none; }
footer a:hover { color: var(--text-1); }
@media (max-width: 640px) {
  .hero { padding: 40px 0 32px; }
  .hero-stats { gap: 24px; }
  .product-card { flex-direction: column; align-items: stretch; }
  .product-status { flex-direction: row; align-items: center; }
  .waitlist-form { flex-direction: column; }
  .waitlist-btn { width: 100%; }
  nav { flex-direction: column; gap: 16px; }
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
      <a href="/snapshot">SnapShot</a>
      <a href="/playground">Playground</a>
      <a href="/blog">Blog</a>
      <a href="/#services">Services</a>
      <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>

  <section class="hero">
    <div class="hero-eyebrow">Build tools. Ship products.</div>
    <h1>Autonomous company<br/>building for <span>developers</span></h1>
    <p class="hero-sub">
      We design, build, and deploy developer tools. No meetings. No managers. Just shipped code.
    </p>
    <div class="hero-stats">
      <div class="hero-stat">
        <div class="hero-stat-num">${SERVICES.length}</div>
        <div class="hero-stat-label">Live Services</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num" id="uptimeTotal">-</div>
        <div class="hero-stat-label">Uptime (7d)</div>
      </div>
      <div class="hero-stat">
        <div class="hero-stat-num" id="servicesOnline">-</div>
        <div class="hero-stat-label">Currently Online</div>
      </div>
    </div>
  </section>

  <section class="products" id="services">
    <p class="section-title">Services</p>
    <div class="product-grid" id="productGrid"></div>
  </section>

  <footer>
    <span>&copy; 2026 Auto Company</span>
    <div style="display:flex;align-items:center;gap:20px">
      <span><a href="https://livestatus-production.up.railway.app/status/4" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-3);text-decoration:none;font-size:12px"><img src="https://livestatus-production.up.railway.app/badge/4" alt="LiveStatus" height="20" style="border-radius:3px" /> Powered by LiveStatus</a></span>
      <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub &rarr;</a>
    </div>
  </footer>
</div>

<script>
const SERVICES = ${JSON.stringify(SERVICES)};

async function fetchStatusApi() {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('status api error');
    return await res.json();
  } catch { return null; }
}

function renderTimelineBars(pings, maxBars = 48) {
  if (!pings || pings.length === 0) return '<span style="color:var(--text-3);font-size:11px">No data</span>';
  const recent = pings.slice(-maxBars);
  const up = recent.filter(p => p.online).length;
  const total = recent.length;
  const pct = total > 0 ? Math.round(up / total * 100) : 0;
  return '<div style="display:flex;gap:2px;align-items:flex-end;height:14px">' +
    recent.map(p => '<div class="timeline-bar ' + (p.online ? 'up' : 'down') + '" title="' + (p.online ? 'Up' : 'Down') + ' ' + p.ms + 'ms"></div>').join('') +
    '</div><div style="font-size:11px;color:var(--text-3);margin-top:4px">' + pct + '% uptime (' + up + '/' + total + ' checks)</div>';
}

function renderProducts(data) {
  const grid = document.getElementById('productGrid');
  const statusMap = {};
  if (data && data.services) {
    for (const s of data.services) { statusMap[s.id] = s; }
  }

  let onlineCount = 0;
  grid.innerHTML = SERVICES.map(s => {
    const status = statusMap[s.id];
    const online = status ? status.online : null;
    const ms = status ? status.avg_ms : 0;
    if (online === true) onlineCount++;
    const badgeCls = online === null ? 'checking' : online ? 'online' : 'offline';
    const badgeLabel = online === null ? 'checking...' : online ? 'Online' : 'Offline';
    const latencyHtml = online ? '<span class="status-latency">' + (ms ? ms + 'ms' : '') + '</span>' : '';

    return '<a href="' + s.url + '" class="product-card" target="_blank" rel="noopener">' +
      '<div class="product-card-inner">' +
      '<div class="product-card-header">' +
      '<span class="product-name">' + s.name + '</span>' +
      '<span class="product-badge" style="color:' + s.badgeColor + ';border:1px solid ' + s.badgeColor + '44;background:' + s.badgeColor + '11;">' + s.badge + '</span>' +
      '</div>' +
      '<div class="product-tagline">' + s.tagline + '</div>' +
      (s.github ? '<span class="product-link">GitHub ↗</span>' : '') +
      '</div>' +
      '<div class="product-status">' +
      '<span class="status-badge ' + badgeCls + '"><span class="dot"></span> ' + badgeLabel + '</span>' +
      latencyHtml +
      (status && status.pings ? renderTimelineBars(status.pings) : '') +
      '</div>' +
      '</a>';
  }).join('');

  document.getElementById('servicesOnline').textContent = onlineCount + '/' + SERVICES.length;
  if (data && data.aggregate) {
    document.getElementById('uptimeTotal').textContent = Math.round(data.aggregate.uptime_pct) + '%';
  }
}

async function init() {
  renderProducts(null);
  const data = await fetchStatusApi();
  renderProducts(data);
}
init();
</script>
</body>
</html>`

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

app.get('/api/status', async c => {
  const servicesData = await Promise.all(SERVICES.map(async s => {
    const stats = await getServiceStats(s.id)
    const pings = await getRecentPings(s.id)
    const online = pings.length > 0 ? pings[pings.length - 1].online : null
    return {
      id: s.id,
      name: s.name,
      online,
      total_checks: stats.total_checks,
      up_checks: stats.up_checks,
      avg_ms: stats.avg_ms,
      last_check: stats.last_check,
      pings: pings.map(p => ({ online: p.online, ms: p.ms, checked_at: p.checked_at })),
    }
  }))

  const totalUp = servicesData.filter(s => s.online === true).length
  const totalChecks = servicesData.reduce((a, s) => a + s.total_checks, 0)
  const totalUpChecks = servicesData.reduce((a, s) => a + s.up_checks, 0)
  const uptimePct = totalChecks > 0 ? (totalUpChecks / totalChecks * 100) : 100

  return c.json({
    services: servicesData,
    aggregate: {
      online: totalUp,
      total: SERVICES.length,
      uptime_pct: uptimePct,
      total_checks: totalChecks,
    },
    generated_at: new Date().toISOString(),
  })
})

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
p { margin-bottom: 20px; line-height: 1.75; color: var(--text-2); }
a { color: var(--accent); text-decoration: none; }
a:hover { color: #FBBF24; }
ul, ol { margin-bottom: 20px; padding-left: 24px; color: var(--text-2); }
li { margin-bottom: 8px; line-height: 1.7; }
pre { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); padding: 20px; overflow-x: auto; margin-bottom: 24px; font-family: var(--font-mono); font-size: 13px; line-height: 1.7; color: var(--cyan); }
code { font-family: var(--font-mono); font-size: 13px; background: var(--surface); padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
hr { border: none; border-top: 1px solid var(--border); margin: 40px 0; }
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
      <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub</a>
    </div>
  </nav>
`

const BLOG_FOOT = `
  <footer>
    <span>&copy; 2026 Auto Company</span>
    <div style="display:flex;align-items:center;gap:20px">
      <span><a href="https://livestatus-production.up.railway.app/status/4" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:6px;color:var(--text-3);text-decoration:none;font-size:12px"><img src="https://livestatus-production.up.railway.app/badge/4" alt="LiveStatus" height="20" style="border-radius:3px" /> Powered by LiveStatus</a></span>
      <a href="/">Home &rarr;</a>
    </div>
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
    { loc: `${SITE_URL}/#services`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/snapshot`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/playground`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/visual-diff`, priority: '0.8', changefreq: 'weekly' },
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

app.get('/playground', c => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SnapShot API Playground — Auto Company</title>
<meta name="description" content="Try the SnapShot API live from your browser. Enter any URL and see an instant screenshot." />
<link rel="canonical" href="${SITE_URL}/playground" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0B0D12;--bg-alt:#11141D;--surface:#181C27;--surface-hover:#1F2433;--border:#242938;--border-light:#2E3444;--text-1:#EDEEF0;--text-2:#969CA8;--text-3:#545A68;--accent:#D97706;--accent-glow:rgba(217,119,6,0.15);--green:#22C55E;--red:#EF4444;--font-sans:'DM Sans',system-ui,sans-serif;--font-mono:'DM Mono','SF Mono',monospace;--r:10px;--r-lg:16px}
body{background:var(--bg);color:var(--text-1);font-family:var(--font-sans);font-size:16px;line-height:1.6;min-height:100vh}
.bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:48px 48px}
.container{position:relative;z-index:1;max-width:880px;margin:0 auto;padding:0 24px}
nav{display:flex;align-items:center;justify-content:space-between;padding:28px 0;border-bottom:1px solid var(--border)}
.logo{font-family:var(--font-mono);font-weight:500;font-size:18px;color:var(--text-1);text-decoration:none;letter-spacing:-0.02em}
.logo span{color:var(--accent)}
.nav-links{display:flex;gap:28px;align-items:center}
.nav-links a{color:var(--text-2);text-decoration:none;font-size:14px;transition:color 0.15s}
.nav-links a:hover{color:var(--text-1)}
.nav-links a.active{color:var(--accent)}
h1{font-size:32px;font-weight:700;letter-spacing:-0.03em;line-height:1.15;margin-bottom:8px}
h2{font-size:20px;font-weight:600;margin-bottom:12px;margin-top:32px}
p{color:var(--text-2);margin-bottom:16px;line-height:1.65}
.demo-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);padding:32px;margin:32px 0}
.input-row{display:flex;gap:12px;margin-bottom:20px}
.input-row input{flex:1;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:14px 18px;font-family:var(--font-sans);font-size:16px;color:var(--text-1);outline:none;transition:border-color 0.2s}
.input-row input:focus{border-color:var(--accent)}
.input-row input::placeholder{color:var(--text-3)}
.btn{background:var(--accent);color:#0B0D12;border:none;border-radius:var(--r);padding:14px 28px;font-family:var(--font-sans);font-size:16px;font-weight:600;cursor:pointer;transition:background 0.15s,transform 0.1s;white-space:nowrap;display:inline-flex;align-items:center;gap:8px}
.btn:hover{background:#F59E0B;transform:translateY(-1px)}
.btn:disabled{opacity:0.5;cursor:not-allowed;transform:none}
.presets{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px}
.preset-btn{background:transparent;border:1px solid var(--border);border-radius:var(--r);padding:8px 14px;font-family:var(--font-mono);font-size:12px;color:var(--text-2);cursor:pointer;transition:all 0.15s}
.preset-btn:hover{border-color:var(--accent);color:var(--accent)}
.result-area{display:none;margin-top:24px}
.result-area.visible{display:block}
.result-img{width:100%;border-radius:var(--r);border:1px solid var(--border);background:var(--bg-alt)}
.result-meta{display:flex;gap:16px;margin:12px 0;font-family:var(--font-mono);font-size:12px;color:var(--text-3);flex-wrap:wrap}
.spinner{display:none;text-align:center;padding:48px 0;color:var(--text-3)}
.spinner.active{display:block}
.spinner-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--accent);animation:bounce 1.2s ease-in-out infinite}
.spinner-dot:nth-child(2){animation-delay:0.2s;background:var(--green)}
.spinner-dot:nth-child(3){animation-delay:0.4s}
@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.3}40%{transform:scale(1);opacity:1}}
.error-box{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.3);border-radius:var(--r);padding:16px;color:var(--red);font-size:14px;display:none;margin-top:16px}
.error-box.visible{display:block}
.curl-box{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);padding:16px 20px;margin-top:20px;font-family:var(--font-mono);font-size:13px;color:var(--green);overflow-x:auto;position:relative}
.curl-box .copy-btn{position:absolute;top:10px;right:10px;background:var(--surface);border:1px solid var(--border);color:var(--text-2);padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;font-family:var(--font-mono);transition:all 0.15s}
.curl-box .copy-btn:hover{background:var(--surface-hover);color:var(--text-1)}
footer{border-top:1px solid var(--border);padding:32px 0;display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--text-3);margin-top:60px}
footer a{color:var(--text-2);text-decoration:none}
footer a:hover{color:var(--text-1)}
@media(max-width:640px){.input-row{flex-direction:column}nav{flex-direction:column;gap:16px}h1{font-size:24px}.demo-box{padding:20px}}
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="container">
<nav>
  <a href="/" class="logo">Auto <span>Company</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/playground" class="active">Playground</a>
    <a href="/blog">Blog</a>
    <a href="https://github.com/bakasa" target="_blank" rel="noopener">GitHub</a>
  </div>
</nav>

<div style="margin:48px 0 0">
  <h1>SnapShot API Playground</h1>
  <p>Enter any URL below and see an instant screenshot — powered by <a href="https://snapshot-api-production-1374.up.railway.app" style="color:var(--accent)">SnapShot API</a>. No API key needed for this demo.</p>

  <div class="demo-box">
    <div class="presets">
      <button class="preset-btn" onclick="setUrl('https://news.ycombinator.com')">Hacker News</button>
      <button class="preset-btn" onclick="setUrl('https://example.com')">example.com</button>
      <button class="preset-btn" onclick="setUrl('https://github.com/bakasa/snapshot-api')">SnapShot GitHub</button>
      <button class="preset-btn" onclick="setUrl('https://www.wikipedia.org')">Wikipedia</button>
    </div>
    <div class="input-row">
      <input type="url" id="urlInput" placeholder="https://example.com" value="https://news.ycombinator.com" autofocus />
      <button class="btn" id="captureBtn" onclick="capture()">Capture</button>
    </div>

    <div class="spinner" id="spinner">
      <span class="spinner-dot"></span>
      <span class="spinner-dot"></span>
      <span class="spinner-dot"></span>
      <div style="margin-top:16px;color:var(--text-3);font-size:14px">Taking screenshot...</div>
    </div>

    <div class="error-box" id="errorBox"></div>

    <div class="result-area" id="resultArea">
      <img class="result-img" id="resultImg" alt="Screenshot preview" />
      <div class="result-meta">
        <span id="resultStatus"></span>
        <span id="resultDimensions"></span>
        <span id="resultTime"></span>
      </div>
      <div class="curl-box">
        <button class="copy-btn" onclick="copyCurl()">Copy</button>
        <code id="curlCommand"># Your screenshot will appear below</code>
      </div>
    </div>
  </div>

  <h2>How to use the API</h2>
  <div class="curl-box" style="margin-top:0">
    <code># Get a free API key
curl https://snapshot-api-production-1374.up.railway.app/key

# Take a screenshot
curl -H "Authorization: Bearer YOUR_KEY" \
  "https://snapshot-api-production-1374.up.railway.app/screenshot?url=https://example.com" \
  -o screenshot.png</code>
  </div>

  <p style="margin-top:24px">Full API docs at <a href="https://snapshot-api-production-1374.up.railway.app" style="color:var(--accent)">snapshot-api-production-1374.up.railway.app</a></p>
</div>

<footer>
  <span>&copy; 2026 Auto Company</span>
  <div style="display:flex;align-items:center;gap:20px">
    <a href="/">Home &rarr;</a>
  </div>
</footer>
</div>

<script>
const API_URL = '${SITE_URL}';
const INPUT = document.getElementById('urlInput');
const RESULT_AREA = document.getElementById('resultArea');
const RESULT_IMG = document.getElementById('resultImg');
const RESULT_STATUS = document.getElementById('resultStatus');
const RESULT_DIM = document.getElementById('resultDimensions');
const RESULT_TIME = document.getElementById('resultTime');
const CURL_CMD = document.getElementById('curlCommand');
const SPINNER = document.getElementById('spinner');
const ERROR_BOX = document.getElementById('errorBox');
const BTN = document.getElementById('captureBtn');

function setUrl(url) {
  INPUT.value = url;
  capture();
}

async function capture() {
  let url = INPUT.value.trim();
  if (!url) { showError('Please enter a URL'); return; }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }

  hideError();
  RESULT_AREA.classList.remove('visible');
  SPINNER.classList.add('active');
  BTN.disabled = true;
  BTN.textContent = 'Capturing...';

  try {
    const t0 = performance.now();
    const r = await fetch('/api/playground-screenshot?url=' + encodeURIComponent(url));
    const took = Math.round(performance.now() - t0);

    if (!r.ok) {
      const err = await r.json().catch(() => ({ error: r.statusText }));
      showError(err.error || 'Request failed (' + r.status + ')');
      return;
    }

    const blob = await r.blob();
    const imgUrl = URL.createObjectURL(blob);

    RESULT_IMG.onload = () => {
      RESULT_DIM.textContent = RESULT_IMG.naturalWidth + 'x' + RESULT_IMG.naturalHeight + 'px';
    };
    RESULT_IMG.src = imgUrl;
    RESULT_STATUS.textContent = '200 OK';
    RESULT_TIME.textContent = took + 'ms';
    CURL_CMD.textContent = '# Try it yourself:\ncurl -H "Authorization: Bearer YOUR_KEY" \\\n  "' + window.location.origin.replace('/playground','') + '/screenshot?url=' + encodeURIComponent(url) + '" \\\n  -o screenshot.png';

    RESULT_AREA.classList.add('visible');
  } catch (e) {
    showError('Network error: ' + e.message);
  } finally {
    SPINNER.classList.remove('active');
    BTN.disabled = false;
    BTN.textContent = 'Capture';
  }
}

function showError(msg) {
  ERROR_BOX.textContent = msg;
  ERROR_BOX.classList.add('visible');
}

function hideError() {
  ERROR_BOX.textContent = '';
  ERROR_BOX.classList.remove('visible');
}

async function copyCurl() {
  try {
    await navigator.clipboard.writeText(CURL_CMD.textContent.replace(/^#.*\n/, '').trim());
  } catch {}
}

capture();
</script>
</body>
</html>`
  return c.html(html)
})

app.get('/snapshot', c => c.html(SNAPSHOT_PAGE))

app.get('/visual-diff', c => c.html(VISUAL_DIFF_PAGE))

app.get('/api/playground-screenshot', async c => {
  const url = c.req.query('url')
  if (!url) return c.json({ error: '?url= parameter is required' }, 400)

  try {
    const apiUrl = `https://snapshot-api-production-1374.up.railway.app/screenshot?url=${encodeURIComponent(url)}&format=png`
    const res = await fetch(apiUrl, {
      headers: { 'Authorization': `Bearer ${DEMO_API_KEY}` },
      signal: AbortSignal.timeout(15000),
    })

    if (!res.ok) {
      const text = await res.text()
      return c.json({ error: text || `API error: ${res.status}` }, res.status as any)
    }

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/png'
    return c.newResponse(buffer, 200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    })
  } catch (err: any) {
    return c.json({ error: `Screenshot failed: ${err.message}` }, 502)
  }
})

const PORT = parseInt(process.env.PORT || '3000', 10)
console.log(`Company site starting on port ${PORT}`)
serve({ fetch: app.fetch, port: PORT })
