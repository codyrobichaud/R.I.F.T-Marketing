/**
 * /api/contact.js — Vercel Serverless Function
 * R.I.F.T. Marketing Contact Form Handler
 *
 * Stack:  Resend (transactional email) + in-memory rate limiting
 * Routes: POST /api/contact
 * Env:    RESEND_API_KEY  →  set in Vercel dashboard → Settings → Environment Variables
 */

// ─── IN-MEMORY RATE LIMIT STORE ───────────────────────────────
// Resets per cold start (per Vercel function instance)
// For stricter limiting, swap with Upstash Redis (free tier available)
const rateLimitStore = new Map();

function isRateLimited(ip) {
  const now     = Date.now();
  const window  = 10 * 60 * 1000; // 10-minute window
  const maxReqs = 5;               // max 5 submissions per IP per 10 min

  const entry = rateLimitStore.get(ip) || { count: 0, start: now };

  if (now - entry.start > window) {
    rateLimitStore.set(ip, { count: 1, start: now });
    return false;
  }

  if (entry.count >= maxReqs) return true;

  rateLimitStore.set(ip, { count: entry.count + 1, start: entry.start });
  return false;
}

// ─── SANITIZE INPUT ───────────────────────────────────────────
function sanitize(str = "", maxLen = 2000) {
  return String(str)
    .trim()
    .slice(0, maxLen)
    .replace(/[<>]/g, "")         // strip angle brackets
    .replace(/javascript:/gi, "") // strip JS protocol
    .replace(/on\w+=/gi, "");     // strip inline event handlers
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// ─── HONEYPOT CHECK ───────────────────────────────────────────
// Frontend renders a hidden "website" field — bots fill it, humans don't
function isSpamBot(body) {
  return body.honeypot && body.honeypot.trim().length > 0;
}

// ─── EMAIL HTML TEMPLATE ──────────────────────────────────────
function buildEmailHTML({ name, email, service, message, timestamp, ip }) {
  const serviceMap = {
    smm:     "Social Media Management",
    web:     "Website & Funnel Development",
    content: "Content Strategy",
    brand:   "Brand Identity",
    product: "Digital Product",
    other:   "Other / General Inquiry",
  };
  const serviceLabel = serviceMap[service] || "Not specified";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New R.I.F.T. Inquiry</title>
  <style>
    body { margin:0; padding:0; background:#060B16; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrap { max-width:600px; margin:0 auto; padding:32px 16px; }
    .card { background:#0E1E3F; border:1px solid rgba(77,207,255,.25); border-radius:4px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#0a1628,#0E1E3F); padding:32px; border-bottom:1px solid rgba(77,207,255,.15); }
    .logo { font-size:22px; font-weight:900; letter-spacing:4px; background:linear-gradient(135deg,#4DCFFF,#AAFF00); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .badge { display:inline-block; margin-top:10px; padding:4px 12px; background:rgba(170,255,0,.12); border:1px solid rgba(170,255,0,.3); color:#AAFF00; font-size:11px; letter-spacing:3px; font-family:monospace; }
    .body { padding:32px; }
    .row { display:flex; margin-bottom:20px; gap:0; border-bottom:1px solid rgba(77,207,255,.08); padding-bottom:20px; }
    .row:last-child { border:none; margin-bottom:0; padding-bottom:0; }
    .label { font-size:10px; letter-spacing:3px; color:#4DCFFF; font-family:monospace; min-width:110px; margin-top:3px; text-transform:uppercase; }
    .value { font-size:15px; color:#CBD5E1; line-height:1.65; }
    .message-box { background:rgba(77,207,255,.04); border-left:3px solid #4DCFFF; padding:16px 18px; margin-top:8px; }
    .footer { padding:20px 32px; background:rgba(6,11,22,.6); border-top:1px solid rgba(77,207,255,.08); }
    .meta { font-size:11px; color:#374151; font-family:monospace; letter-spacing:1px; }
    .cta { display:inline-block; margin-top:20px; padding:12px 28px; background:linear-gradient(135deg,#4DCFFF,#AAFF00); color:#060B16; font-weight:700; font-size:12px; letter-spacing:2px; text-decoration:none; font-family:monospace; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <div class="logo">R.I.F.T. MARKETING</div>
        <div class="badge">// NEW SITE INQUIRY RECEIVED</div>
      </div>
      <div class="body">
        <div class="row">
          <div class="label">NAME</div>
          <div class="value">${name}</div>
        </div>
        <div class="row">
          <div class="label">EMAIL</div>
          <div class="value"><a href="mailto:${email}" style="color:#4DCFFF;">${email}</a></div>
        </div>
        <div class="row">
          <div class="label">SERVICE</div>
          <div class="value">${serviceLabel}</div>
        </div>
        <div class="row">
          <div class="label">MESSAGE</div>
          <div class="value">
            <div class="message-box">${message.replace(/\n/g, "<br/>")}</div>
          </div>
        </div>
        <a class="cta" href="mailto:${email}?subject=Re: Your R.I.F.T. Inquiry&body=Hi ${name},%0A%0AThanks for reaching out to R.I.F.T. Marketing!">
          REPLY TO ${name.split(" ")[0].toUpperCase()} →
        </a>
      </div>
      <div class="footer">
        <div class="meta">// TIMESTAMP: ${timestamp}</div>
        <div class="meta">// SOURCE IP: ${ip}</div>
        <div class="meta">// ORIGIN: realityriftdesign.pro/contact</div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();
}

// ─── CONFIRMATION EMAIL TO SENDER ─────────────────────────────
function buildConfirmHTML({ name }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>We received your message</title>
  <style>
    body { margin:0; padding:0; background:#060B16; font-family: 'Segoe UI', Arial, sans-serif; }
    .wrap { max-width:600px; margin:0 auto; padding:32px 16px; }
    .card { background:#0E1E3F; border:1px solid rgba(77,207,255,.2); border-radius:4px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#0a1628,#0E1E3F); padding:40px 32px; text-align:center; border-bottom:1px solid rgba(77,207,255,.12); }
    .logo { font-size:20px; font-weight:900; letter-spacing:4px; color:#4DCFFF; }
    .icon { font-size:42px; margin:16px 0 8px; }
    .title { font-size:22px; font-weight:700; color:#E2E8F0; letter-spacing:1px; margin-top:8px; }
    .body { padding:36px 32px; }
    .p { font-size:15px; color:#8892A4; line-height:1.8; margin-bottom:16px; }
    .highlight { background:rgba(77,207,255,.06); border:1px solid rgba(77,207,255,.18); padding:16px 20px; margin:20px 0; }
    .hl-text { font-size:13px; color:#4DCFFF; font-family:monospace; letter-spacing:1px; }
    .footer { padding:20px 32px; background:rgba(6,11,22,.6); border-top:1px solid rgba(77,207,255,.08); text-align:center; }
    .meta { font-size:12px; color:#374151; font-family:monospace; }
    .social { margin-top:14px; }
    .social a { color:#4DCFFF; font-size:12px; text-decoration:none; margin:0 8px; letter-spacing:1px; font-family:monospace; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <div class="header">
        <div class="logo">R.I.F.T. MARKETING</div>
        <div class="icon">✓</div>
        <div class="title">MESSAGE RECEIVED, ${name.split(" ")[0]}.</div>
      </div>
      <div class="body">
        <p class="p">Thanks for reaching out to R.I.F.T. Marketing. Your inquiry has been received and Cody will be in touch within <strong style="color:#AAFF00;">24 hours</strong>.</p>
        <div class="highlight">
          <div class="hl-text">// WHAT HAPPENS NEXT</div>
          <p class="p" style="margin:10px 0 4px;">→ Cody reviews your inquiry personally</p>
          <p class="p" style="margin:4px 0;">→ You receive a response within 24 hrs</p>
          <p class="p" style="margin:4px 0;">→ We schedule a free discovery call</p>
          <p class="p" style="margin:4px 0 0;">→ We build your R.I.F.T. strategy</p>
        </div>
        <p class="p">In the meantime, explore the <a href="https://realityrift.gumroad.com" style="color:#4DCFFF;">R.I.F.T. Method Guide</a> or join the <a href="https://realityriftdesign.pro/#newsletter" style="color:#4DCFFF;">R.I.F.T. Collective newsletter</a> for weekly brand strategy intelligence.</p>
      </div>
      <div class="footer">
        <div class="meta">© ${new Date().getFullYear()} Reality Rift Designs · realityriftdesign.pro</div>
        <div class="social">
          <a href="https://twitter.com/Rift_Marketing_">X / TWITTER</a>
          <a href="https://instagram.com/Rift_Marketing_">INSTAGRAM</a>
          <a href="https://linkedin.com/in/CodyRobichaud">LINKEDIN</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`.trim();
}

// ─── MAIN HANDLER ─────────────────────────────────────────────
export default async function handler(req, res) {

  // ── CORS PREFLIGHT ──
  res.setHeader("Access-Control-Allow-Origin",  "https://realityriftdesign.pro");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  // ── SECURITY HEADERS ──
  res.setHeader("X-Content-Type-Options",    "nosniff");
  res.setHeader("X-Frame-Options",           "DENY");
  res.setHeader("Referrer-Policy",           "strict-origin-when-cross-origin");

  // ── RATE LIMIT ──
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  // ── PARSE BODY ──
  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ error: "Invalid request body." });
  }

  // ── HONEYPOT CHECK ──
  if (isSpamBot(body)) {
    // Silently succeed — don't tell bots they were caught
    return res.status(200).json({ success: true });
  }

  // ── VALIDATE ──
  const name    = sanitize(body.name,    100);
  const email   = sanitize(body.email,   200);
  const service = sanitize(body.service, 50);
  const message = sanitize(body.message, 3000);

  const errors = [];
  if (!name)                  errors.push("Name is required.");
  if (!email)                 errors.push("Email is required.");
  if (!isValidEmail(email))   errors.push("Please enter a valid email address.");
  if (!message)               errors.push("Message is required.");
  if (message.length < 10)    errors.push("Message is too short.");

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  // ── CHECK ENV ──
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set in environment variables.");
    return res.status(500).json({ error: "Server configuration error. Please email us directly at realityriftdesign@outlook.com" });
  }

  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "full",
    timeStyle: "short"
  });

  // ── SEND NOTIFICATION EMAIL TO RIFT ──
  try {
    const notifyRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from:    "RIFT Site <noreply@realityriftdesign.pro>",  // must be a verified domain in Resend
        to:      ["realityriftdesign@outlook.com"],
        subject: `🔥 New R.I.F.T. Inquiry — ${name}${service ? ` · ${service}` : ""}`,
        html:    buildEmailHTML({ name, email, service, message, timestamp, ip }),
        reply_to: email,
        tags: [
          { name: "source",  value: "contact-form" },
          { name: "service", value: service || "unspecified" },
        ],
      }),
    });

    if (!notifyRes.ok) {
      const err = await notifyRes.json();
      console.error("Resend notify error:", err);
      throw new Error(err.message || "Email delivery failed");
    }

    // ── SEND CONFIRMATION EMAIL TO SUBMITTER ──
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        from:    "Cody @ R.I.F.T. Marketing <noreply@realityriftdesign.pro>",
        to:      [email],
        subject: `✓ Got your message, ${name.split(" ")[0]} — R.I.F.T. Marketing`,
        html:    buildConfirmHTML({ name }),
      }),
    });

    // ── SUCCESS ──
    return res.status(200).json({
      success: true,
      message: "Message received. Cody will respond within 24 hours.",
    });

  } catch (err) {
    console.error("Contact form error:", err.message);
    return res.status(500).json({
      error: "Message delivery failed. Please email us directly at realityriftdesign@outlook.com",
    });
  }
}
