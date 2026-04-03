# R.I.F.T. Marketing — realityriftdesign.pro

> We don't market brands. We build movements.

Built on **Next.js 14** · Deployed on **Vercel** · Powered by **Claude AI** + **Resend**

---

## Stack

| Layer       | Tech                          |
|-------------|-------------------------------|
| Framework   | Next.js 14 (Pages Router)     |
| Hosting     | Vercel                        |
| Email       | Resend (transactional)        |
| AI Chatbot  | Anthropic Claude Haiku        |
| Skill Tool  | Anthropic Claude Sonnet       |
| Newsletter  | beehiiv                       |
| Fonts       | Orbitron · Rajdhani · Share Tech Mono |

---

## Project Structure

```
/
├── pages/
│   ├── _app.jsx              ← Global layout + CSS
│   ├── _document.jsx         ← SEO meta, OG tags
│   ├── index.jsx             ← Main site (Hero, About, Services, Products, Newsletter, Contact)
│   ├── legal.jsx             ← Privacy Policy + Terms of Service
│   ├── tools/
│   │   └── skill-finder.jsx  ← Hidden Skill Finder (AI-powered)
│   └── api/
│       └── contact.js        ← Contact form serverless handler
├── styles/
│   └── globals.css           ← Global resets + font imports
├── public/                   ← Static assets (add favicon.ico, og-image.png here)
├── vercel.json               ← Vercel deployment config
├── next.config.js            ← Security headers, redirects, image optimization
├── .env.example              ← Environment variable template
└── .gitignore
```

---

## Quick Deploy

### 1. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/rift-marketing.git
cd rift-marketing
npm install
```

### 2. Set Environment Variables
```bash
cp .env.example .env.local
# Fill in your keys in .env.local
```

| Variable          | Where to get it                              |
|-------------------|----------------------------------------------|
| `RESEND_API_KEY`  | https://resend.com → API Keys                |

### 3. Run Locally
```bash
npm run dev
# → http://localhost:3000
```

### 4. Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

Or connect your GitHub repo in the Vercel dashboard for auto-deploys on every push to `main`.

**Add env vars in Vercel:** Project → Settings → Environment Variables → Add `RESEND_API_KEY`

---

## Pages

| Route                    | Description                          |
|--------------------------|--------------------------------------|
| `/`                      | Main site — full one-page experience |
| `/tools/skill-finder`    | Free AI-powered Hidden Skill Finder  |
| `/legal?tab=privacy`     | Privacy Policy                       |
| `/legal?tab=terms`       | Terms of Service                     |
| `/privacy-policy`        | Redirects → `/legal?tab=privacy`     |
| `/terms`                 | Redirects → `/legal?tab=terms`       |

---

## Features

- **AI Chatbot** — RIFT AI powered by Claude Haiku, brand-aware, memory within session
- **Contact Form** — Serverless handler with rate limiting, honeypot spam protection, branded emails via Resend
- **Hidden Skill Finder** — 6-question AI analysis tool using Claude Sonnet
- **Security** — HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Permissions-Policy
- **Performance** — Vercel Edge Network, compressed output, image optimization
- **SEO** — OG tags, Twitter cards, canonical URL, meta descriptions

---

## Pending Setup

- [ ] Add `favicon.ico` and `og-image.png` (1200×630) to `/public`
- [ ] Verify `realityriftdesign.pro` domain in Resend → add DNS records
- [ ] Add `RESEND_API_KEY` to Vercel environment variables
- [ ] Replace beehiiv placeholder with your embed: `/pages/index.jsx` → newsletter section
- [ ] Confirm payment processor → Stripe checkout backend to be added

---

## Contact

**Reality Rift Designs**  
realityriftdesign@outlook.com  
realityriftdesign.pro  
[@Rift_Marketing_](https://twitter.com/Rift_Marketing_)
