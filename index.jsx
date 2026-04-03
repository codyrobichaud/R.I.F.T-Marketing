import { useState, useEffect, useRef } from "react";
import Head from "next/head";

const COLORS = {
  navy: "#0E1E3F",
  gold: "#C9A84C",
  iceBlue: "#4DCFFF",
  neonLime: "#AAFF00",
  dark: "#0A0F1E",
  mid: "#111827",
};

const CHATBOT_SYSTEM = `You are RIFT AI — the intelligent brand assistant for R.I.F.T. Marketing, a digital marketing agency that helps founders, startups, and entrepreneurs build powerful online brands and movements.

You represent the R.I.F.T. framework:
- Realign: Clarify your brand's direction and purpose
- Ignite: Build momentum through strategic content
- Forge: Create systems and assets that scale
- Thrive: Sustain growth through automation and optimization

Agency Services:
1. Social Media Management — Full-platform management, content creation, scheduling, engagement, analytics
2. Website & Funnel Development — High-converting sites, landing pages, sales funnels, CRO optimization
3. Content Strategy — Creator-led strategy, cross-platform repurposing, newsletter systems, brand voice
4. Brand Identity — Complete brand systems, visual identity, brand guidelines, R.I.F.T. brand audit

Digital Products:
- RIFT Method Quick Start Guide (27-page PDF framework guide) — available at realityrift.gumroad.com
- Clarity Grid Worksheet (brand diagnostic tool) — available at realityrift.gumroad.com
- Hidden Skill Finder (interactive AI-powered monetization tool) — free

Social channels: X @Rift_Marketing_ | Instagram @Rift_Marketing_ | LinkedIn /in/CodyRobichaud
Newsletter: R.I.F.T. Collective on beehiiv
Contact: realityriftdesign@outlook.com

Your role:
- Answer questions about services, products, and processes clearly and confidently
- Qualify leads and route serious inquiries to book a discovery call or fill the contact form
- Be direct, bold, and brand-aligned — like a knowledgeable team member, not a robot
- Use R.I.F.T. framework language naturally when relevant
- Never invent specific prices — always direct pricing inquiries to book a discovery call
- End most conversations by encouraging a discovery call or contact form
- Keep responses concise — 2-4 sentences max unless more detail is truly needed`;

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: #0A0F1E;
    color: #E8EBF0;
    font-family: 'Rajdhani', sans-serif;
    overflow-x: hidden;
    line-height: 1.6;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #0A0F1E; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#4DCFFF, #AAFF00); }

  @keyframes glitch {
    0%   { text-shadow: 3px 0 #4DCFFF, -3px 0 #AAFF00; transform: translate(0); }
    20%  { text-shadow: -3px 0 #4DCFFF, 3px 0 #AAFF00; transform: translate(-2px, 1px); }
    40%  { text-shadow: 3px 0 #AAFF00, -3px 0 #4DCFFF; transform: translate(2px, -1px); }
    60%  { text-shadow: -3px 0 #AAFF00, 3px 0 #4DCFFF; transform: translate(0); }
    80%  { text-shadow: 3px 0 #4DCFFF, -3px 0 #AAFF00; transform: translate(1px, 2px); }
    100% { text-shadow: -3px 0 #4DCFFF, 3px 0 #AAFF00; transform: translate(0); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }

  @keyframes scanline {
    0%   { top: -4px; }
    100% { top: 100vh; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes chatPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(77,207,255,0.5); }
    50%       { box-shadow: 0 0 0 14px rgba(77,207,255,0); }
  }

  @keyframes blink {
    0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
    30%            { opacity: 1; transform: scale(1.1); }
  }

  @keyframes borderPulse {
    0%, 100% { border-color: rgba(77,207,255,0.25); }
    50%       { border-color: rgba(170,255,0,0.4); }
  }

  @keyframes gridScroll {
    0%   { background-position: 0 0; }
    100% { background-position: 0 80px; }
  }

  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  .glitch { animation: glitch 0.25s steps(1) infinite; }
  .float-anim { animation: float 3.5s ease-in-out infinite; }

  .scan-line {
    position: fixed;
    left: 0; width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent 10%, rgba(77,207,255,0.35), transparent 90%);
    animation: scanline 5s linear infinite;
    pointer-events: none;
    z-index: 9999;
  }

  .grid-bg {
    background-image:
      linear-gradient(rgba(77,207,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77,207,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    animation: gridScroll 4s linear infinite;
  }

  .card-glass {
    background: rgba(14,30,63,0.45);
    border: 1px solid rgba(77,207,255,0.18);
    backdrop-filter: blur(14px);
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }
  .card-glass::before {
    content: '';
    position: absolute; top: 0; left: -100%;
    width: 100%; height: 2px;
    background: linear-gradient(90deg, transparent, #4DCFFF, #AAFF00, transparent);
    transition: left 0.6s ease;
  }
  .card-glass:hover::before { left: 100%; }
  .card-glass:hover {
    border-color: rgba(77,207,255,0.45);
    box-shadow: 0 8px 40px rgba(77,207,255,0.12), 0 0 0 1px rgba(77,207,255,0.1);
    transform: translateY(-5px);
  }

  .btn-prime {
    display: inline-flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, #4DCFFF 0%, #AAFF00 100%);
    color: #0A0F1E;
    border: none;
    padding: 14px 34px;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-prime:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(77,207,255,0.45);
    background: linear-gradient(135deg, #AAFF00 0%, #4DCFFF 100%);
  }
  .btn-prime:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .btn-ghost {
    display: inline-flex; align-items: center; justify-content: center;
    background: transparent;
    color: #4DCFFF;
    border: 1px solid rgba(77,207,255,0.5);
    padding: 13px 33px;
    font-family: 'Orbitron', sans-serif;
    font-size: 11px; font-weight: 700;
    letter-spacing: 2.5px; text-transform: uppercase;
    cursor: pointer;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
    transition: all 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover {
    background: rgba(77,207,255,0.1);
    box-shadow: 0 0 25px rgba(77,207,255,0.3);
    border-color: #4DCFFF;
  }

  .field {
    background: rgba(14,30,63,0.65);
    border: 1px solid rgba(77,207,255,0.2);
    color: #E8EBF0;
    padding: 13px 18px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 15px; font-weight: 500;
    width: 100%; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
  }
  .field:focus {
    border-color: #4DCFFF;
    box-shadow: 0 0 20px rgba(77,207,255,0.18);
  }
  .field::placeholder { color: rgba(160,174,192,0.45); }

  select.field option { background: #0E1E3F; color: #E8EBF0; }

  .section-tag {
    font-family: 'Orbitron', sans-serif;
    font-size: 10px; letter-spacing: 4px; color: #AAFF00;
    text-transform: uppercase; margin-bottom: 14px; display: block;
  }

  .section-h {
    font-family: 'Orbitron', sans-serif;
    font-weight: 900; color: #E8EBF0; line-height: 1.08;
  }

  .grad-text {
    background: linear-gradient(135deg, #4DCFFF, #AAFF00);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gold-text {
    background: linear-gradient(135deg, #C9A84C, #FFD166);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-item {
    font-family: 'Rajdhani', sans-serif;
    font-size: 12px; font-weight: 600;
    letter-spacing: 2.5px; text-transform: uppercase;
    color: #6B7280; cursor: pointer;
    transition: color 0.2s;
    background: none; border: none;
  }
  .nav-item:hover { color: #4DCFFF; }
  .nav-item.active { color: #AAFF00; }

  .chat-user {
    background: rgba(77,207,255,0.1);
    border: 1px solid rgba(77,207,255,0.25);
    border-radius: 14px 14px 3px 14px;
    padding: 10px 14px; max-width: 85%;
    align-self: flex-end; font-size: 13.5px; line-height: 1.55;
  }
  .chat-bot {
    background: rgba(14,30,63,0.8);
    border: 1px solid rgba(170,255,0,0.18);
    border-radius: 14px 14px 14px 3px;
    padding: 10px 14px; max-width: 85%;
    align-self: flex-start; font-size: 13.5px; line-height: 1.55; color: #D1D5DB;
  }

  section { scroll-margin-top: 72px; }

  @media (max-width: 768px) {
    .hide-mob { display: none !important; }
    .mob-col { flex-direction: column !important; }
    .mob-full { width: 100% !important; min-width: 0 !important; }
  }
`;

export default function Home() {
  const [chatOpen, setChatOpen]   = useState(false);
  const [msgs, setMsgs]           = useState([{
    r: "bot",
    t: "Hey — I'm RIFT AI. Ask me anything about our services, products, or the R.I.F.T. framework. 🔥"
  }]);
  const [input, setInput]         = useState("");
  const [typing, setTyping]       = useState(false);
  const [form, setForm]           = useState({ name:"", email:"", service:"", message:"" });
  const [formSt, setFormSt]       = useState(null); // null | sending | done | error
  const [activeNav, setActiveNav] = useState("home");
  const [glitch, setGlitch]       = useState(false);
  const [emailSub, setEmailSub]   = useState("");
  const chatEnd = useRef(null);

  // Inject CSS
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  // Auto-scroll chat
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, typing]);

  // Periodic glitch
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 250);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = ["home","about","services","products","newsletter","contact"];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveNav(e.target.id); });
    }, { threshold: 0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
    setActiveNav(id);
  };

  // Chat
  const sendMsg = async () => {
    if (!input.trim() || typing) return;
    const userMsg = { r:"user", t: input.trim() };
    const history = [...msgs, userMsg];
    setMsgs(history);
    setInput("");
    setTyping(true);

    try {
      const apiMsgs = history
        .filter(m => m.r !== "bot" || history.indexOf(m) > 0)
        .map(m => ({ role: m.r === "user" ? "user" : "assistant", content: m.t }));

      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          system: CHATBOT_SYSTEM,
          messages: apiMsgs.slice(-12)
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Reach Cody directly → realityriftdesign@outlook.com";
      setMsgs(p => [...p, { r:"bot", t: reply }]);
    } catch {
      setMsgs(p => [...p, { r:"bot", t:"Connection blip. Reach Cody at realityriftdesign@outlook.com 🔥" }]);
    }
    setTyping(false);
  };

  // Contact form submit → /api/contact serverless function
  const submitForm = async () => {
    if (!form.name || !form.email || !form.message) { setFormSt("error"); return; }
    setFormSt("sending");
    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:      form.name,
          email:     form.email,
          service:   form.service,
          message:   form.message,
          honeypot:  form.honeypot || "", // spam trap — never filled by real users
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setFormSt("done");
      setForm({ name:"", email:"", service:"", message:"", honeypot:"" });
    } catch (err) {
      console.error("Form error:", err.message);
      setFormSt("error");
    }
  };

  const SERVICES = [
    {
      icon:"◈", title:"Social Media\nManagement", accent:"#4DCFFF", tag:"MOST POPULAR",
      perks:["Full-platform management","Content creation & scheduling","Community engagement","Analytics & reporting","R.I.F.T. content system"]
    },
    {
      icon:"⬡", title:"Website & Funnel\nDevelopment", accent:"#AAFF00", tag:"",
      perks:["High-converting websites","Sales funnel architecture","Landing page systems","Speed & SEO optimized","CRO-focused design"]
    },
    {
      icon:"◎", title:"Content\nStrategy", accent:"#C9A84C", tag:"",
      perks:["Creator-led content strategy","Cross-platform repurposing","Newsletter systems","Brand voice development","R.I.F.T. content calendars"]
    },
    {
      icon:"◆", title:"Brand\nIdentity", accent:"#FF6B8A", tag:"NEW",
      perks:["Complete brand systems","Visual identity design","Brand guidelines doc","Asset creation suite","R.I.F.T. brand audit"]
    },
  ];

  const PRODUCTS = [
    {
      icon:"⬢", title:"RIFT Method\nQuick Start Guide",
      desc:"The 27-page brand operating manual. Everything to implement R.I.F.T. from day one.",
      accent:"#4DCFFF", tags:["27 Pages","PDF Guide","Framework"],
      link:"https://realityrift.gumroad.com", cta:"GET THE GUIDE"
    },
    {
      icon:"◫", title:"Clarity Grid\nWorksheet",
      desc:"A structured diagnostic worksheet to map your brand's current position and path forward.",
      accent:"#AAFF00", tags:["Worksheet","Instant Download","Brand Audit"],
      link:"https://realityrift.gumroad.com", cta:"GET THE GRID"
    },
    {
      icon:"◉", title:"Hidden Skill\nFinder Tool",
      desc:"Interactive AI-powered tool that surfaces your highest-value skills and monetization paths.",
      accent:"#C9A84C", tags:["Interactive","AI-Powered","Free"],
      link:"#products", cta:"TRY IT FREE"
    },
  ];

  return (
    <>
      <Head>
        <title>R.I.F.T. Marketing — We Build Movements</title>
        <meta name="description" content="The R.I.F.T. framework transforms founders and startups into recognized market authorities — from brand clarity to automated growth at scale." />
      </Head>
      <div style={{ background:"#0A0F1E", minHeight:"100vh" }}>
      <div className="scan-line" />

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:1000,
        height:"70px", padding:"0 40px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(10,15,30,0.88)", backdropFilter:"blur(18px)",
        borderBottom:"1px solid rgba(77,207,255,0.12)"
      }}>
        <div onClick={() => scrollTo("home")} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{
            fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"20px", letterSpacing:"3px"
          }} className="grad-text">R.I.F.T.</span>
          <span className="hide-mob" style={{ color:"#4A5568", fontFamily:"Rajdhani,sans-serif", fontSize:"11px", letterSpacing:"3px" }}>
            MARKETING
          </span>
        </div>

        <div className="hide-mob" style={{ display:"flex", gap:"28px" }}>
          {[["home","HOME"],["about","ABOUT"],["services","SERVICES"],["products","PRODUCTS"],["newsletter","NEWSLETTER"],["contact","CONTACT"]].map(([id,label])=>(
            <button key={id} className={`nav-item ${activeNav===id?"active":""}`} onClick={()=>scrollTo(id)}>{label}</button>
          ))}
        </div>

        <button className="btn-prime hide-mob" onClick={()=>scrollTo("contact")} style={{ padding:"9px 20px", fontSize:"10px" }}>
          BOOK A CALL
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section id="home" className="grid-bg" style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        justifyContent:"center", alignItems:"center",
        padding:"100px 40px 80px", textAlign:"center", position:"relative", overflow:"hidden"
      }}>
        {/* Glow orbs */}
        {[["15%","8%","rgba(77,207,255,0.07)","500px"],["70%","55%","rgba(170,255,0,0.05)","600px"],["5%","70%","rgba(201,168,76,0.04)","400px"]].map(([t,l,c,s],i)=>(
          <div key={i} style={{ position:"absolute", top:t, left:l, width:s, height:s,
            background:`radial-gradient(circle, ${c} 0%, transparent 70%)`, pointerEvents:"none" }} />
        ))}

        <div style={{ maxWidth:"960px", animation:"fadeUp 0.9s ease forwards", position:"relative" }}>
          <span className="section-tag" style={{ fontSize:"10px", letterSpacing:"5px" }}>// REALITY RIFT DESIGNS — DIGITAL MARKETING AGENCY</span>

          <h1 className={glitch ? "glitch section-h" : "section-h"} style={{
            fontSize:"clamp(38px, 6.5vw, 88px)", marginBottom:"28px"
          }}>
            WE DON'T MARKET BRANDS.<br />
            <span className="grad-text">WE BUILD MOVEMENTS.</span>
          </h1>

          <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"clamp(16px,2vw,20px)", fontWeight:400, color:"#8892A4", maxWidth:"580px", margin:"0 auto 44px", lineHeight:1.7 }}>
            The R.I.F.T. framework transforms founders and startups into recognized market authorities — from brand clarity to automated growth at scale.
          </p>

          <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
            <button className="btn-prime" onClick={()=>scrollTo("services")}>EXPLORE SERVICES</button>
            <button className="btn-ghost" onClick={()=>scrollTo("contact")}>START YOUR RIFT</button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:"56px", justifyContent:"center", marginTop:"72px", flexWrap:"wrap" }}>
            {[["100%","Automated"],["24/7","AI Powered"],["0→∞","Scale Ready"]].map(([n,l])=>(
              <div key={l}>
                <div style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"30px" }} className="grad-text">{n}</div>
                <div style={{ color:"#4A5568", fontSize:"11px", letterSpacing:"2.5px", fontFamily:"Rajdhani,sans-serif", fontWeight:600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="float-anim" style={{ position:"absolute", bottom:"28px", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px" }}>
          <span style={{ fontFamily:"Orbitron,sans-serif", fontSize:"9px", letterSpacing:"4px", color:"#4A5568" }}>SCROLL</span>
          <div style={{ width:"1px", height:"36px", background:"linear-gradient(#4DCFFF, transparent)" }} />
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────── */}
      <section id="about" style={{ padding:"110px 40px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"70px", alignItems:"center" }}>
          <div>
            <span className="section-tag">// THE OPERATING SYSTEM FOR YOUR BRAND</span>
            <h2 className="section-h" style={{ fontSize:"clamp(30px,4vw,54px)", marginBottom:"22px" }}>
              THE <span className="grad-text">R.I.F.T.</span><br />FRAMEWORK
            </h2>
            <p style={{ color:"#8892A4", fontSize:"17px", lineHeight:1.8, marginBottom:"36px" }}>
              Built for founders who are done with marketing tactics that don't compound. R.I.F.T. is a complete brand operating system — from first-principles clarity through to scalable automation.
            </p>
            <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
              <button className="btn-prime" onClick={()=>scrollTo("contact")}>APPLY THE FRAMEWORK</button>
              <button className="btn-ghost" onClick={()=>scrollTo("products")}>GET THE GUIDE</button>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
            {[
              { l:"R", w:"REALIGN",  c:"#4DCFFF", d:"Strip away the noise. Clarify your brand's true direction, ideal audience, and core purpose." },
              { l:"I", w:"IGNITE",   c:"#AAFF00", d:"Build unstoppable momentum through strategic, creator-led content that compounds over time." },
              { l:"F", w:"FORGE",    c:"#C9A84C", d:"Engineer systems that convert — funnels, automations, CRO, and performance-grade brand assets." },
              { l:"T", w:"THRIVE",   c:"#FF6B8A", d:"Sustain growth through data-driven optimization, delegation, and scale-ready automation." },
            ].map(({ l,w,c,d }) => (
              <div key={l} className="card-glass" style={{ padding:"20px 24px", display:"flex", gap:"18px", alignItems:"flex-start", borderRadius:"2px" }}>
                <div style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"42px", color:c, lineHeight:1, flexShrink:0, minWidth:"52px" }}>{l}</div>
                <div>
                  <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"10px", letterSpacing:"3px", color:c, marginBottom:"7px" }}>{w}</div>
                  <div style={{ color:"#8892A4", fontSize:"14.5px", lineHeight:1.6 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────────────────────── */}
      <section id="services" style={{ padding:"110px 40px", background:"rgba(14,30,63,0.2)", borderTop:"1px solid rgba(77,207,255,0.08)", borderBottom:"1px solid rgba(77,207,255,0.08)" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <span className="section-tag" style={{ display:"block", textAlign:"center" }}>// WHAT WE BUILD FOR YOU</span>
          <h2 className="section-h" style={{ textAlign:"center", fontSize:"clamp(30px,4vw,54px)", marginBottom:"60px" }}>
            OUR <span className="grad-text">SERVICES</span>
          </h2>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(255px, 1fr))", gap:"20px" }}>
            {SERVICES.map(({ icon, title, accent, tag, perks }) => (
              <div key={title} className="card-glass" style={{ padding:"32px 26px", borderRadius:"2px", position:"relative" }}>
                {tag && (
                  <div style={{
                    position:"absolute", top:"14px", right:"14px",
                    background:accent, color:"#0A0F1E",
                    fontFamily:"Orbitron,sans-serif", fontSize:"8px", letterSpacing:"2px",
                    padding:"4px 10px", fontWeight:700
                  }}>{tag}</div>
                )}
                <div style={{ fontSize:"38px", marginBottom:"16px", color:accent, lineHeight:1 }}>{icon}</div>
                <h3 style={{ fontFamily:"Orbitron,sans-serif", fontSize:"15px", fontWeight:700, color:"#E8EBF0", marginBottom:"20px", whiteSpace:"pre-line", lineHeight:1.35 }}>{title}</h3>
                <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:"9px", marginBottom:"28px" }}>
                  {perks.map(p => (
                    <li key={p} style={{ display:"flex", gap:"10px", color:"#8892A4", fontSize:"13.5px" }}>
                      <span style={{ color:accent, fontSize:"9px", marginTop:"5px", flexShrink:0 }}>▸</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <button className="btn-ghost" onClick={()=>scrollTo("contact")} style={{
                  width:"100%", fontSize:"10px", padding:"10px",
                  borderColor:`${accent}80`, color:accent
                }}>GET STARTED</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DIGITAL PRODUCTS ─────────────────────────────────── */}
      <section id="products" style={{ padding:"110px 40px" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <span className="section-tag">// SELF-PACED RESOURCES</span>
          <h2 className="section-h" style={{ fontSize:"clamp(30px,4vw,54px)", marginBottom:"14px" }}>
            TOOLS THAT <span style={{ color:"#AAFF00" }}>MOVE</span>
          </h2>
          <p style={{ color:"#8892A4", fontSize:"17px", marginBottom:"56px", maxWidth:"480px" }}>
            Immediate access. Lifetime value. Built on the R.I.F.T. framework — no fluff, all signal.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(290px, 1fr))", gap:"22px" }}>
            {PRODUCTS.map(({ icon, title, desc, accent, tags, link, cta }) => (
              <div key={title} className="card-glass" style={{ padding:"36px 30px", borderRadius:"2px" }}>
                <div style={{ fontSize:"52px", marginBottom:"18px", color:accent, lineHeight:1 }}>{icon}</div>
                <div style={{ display:"flex", gap:"8px", marginBottom:"18px", flexWrap:"wrap" }}>
                  {tags.map(t => (
                    <span key={t} style={{
                      background:`${accent}18`, border:`1px solid ${accent}35`,
                      color:accent, fontSize:"9px", padding:"4px 10px",
                      fontFamily:"Orbitron,sans-serif", letterSpacing:"1.5px"
                    }}>{t}</span>
                  ))}
                </div>
                <h3 style={{ fontFamily:"Orbitron,sans-serif", fontSize:"17px", fontWeight:700, color:"#E8EBF0", marginBottom:"14px", whiteSpace:"pre-line", lineHeight:1.3 }}>{title}</h3>
                <p style={{ color:"#8892A4", fontSize:"14.5px", lineHeight:1.65, marginBottom:"30px" }}>{desc}</p>
                <a href={link} target="_blank" rel="noreferrer" style={{ textDecoration:"none" }}>
                  <button className="btn-prime" style={{ width:"100%", background:`linear-gradient(135deg, ${accent}, ${accent}88)` }}>
                    {cta}
                  </button>
                </a>
              </div>
            ))}
          </div>

          {/* Stripe/Payment note */}
          <div className="card-glass" style={{ marginTop:"40px", padding:"22px 28px", borderRadius:"2px", display:"flex", gap:"16px", alignItems:"center" }}>
            <span style={{ fontSize:"24px" }}>💳</span>
            <div>
              <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"11px", color:"#AAFF00", letterSpacing:"2px", marginBottom:"6px" }}>SECURE PAYMENTS</div>
              <div style={{ color:"#8892A4", fontSize:"14px" }}>
                All transactions are processed securely. Payment integration active — confirm processor details to finalize checkout flow.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────── */}
      <section id="newsletter" style={{
        padding:"110px 40px",
        background:"linear-gradient(135deg, rgba(14,30,63,0.55), rgba(10,15,30,0.85))",
        borderTop:"1px solid rgba(77,207,255,0.1)", borderBottom:"1px solid rgba(77,207,255,0.1)"
      }}>
        <div style={{ maxWidth:"640px", margin:"0 auto", textAlign:"center" }}>
          <span className="section-tag" style={{ display:"block" }}>// THE R.I.F.T. COLLECTIVE</span>
          <h2 className="section-h" style={{ fontSize:"clamp(28px,4vw,50px)", marginBottom:"18px" }}>
            JOIN THE <span className="gold-text">COLLECTIVE</span>
          </h2>
          <p style={{ color:"#8892A4", fontSize:"17px", lineHeight:1.75, marginBottom:"44px" }}>
            Weekly intelligence on brand strategy, content systems, and growth frameworks. Zero fluff. Maximum signal. Drop-in anytime.
          </p>

          {/* ⚠️ Replace this block with your beehiiv embed once you provide the publication key */}
          <div className="card-glass" style={{ padding:"36px 32px", borderRadius:"2px" }}>
            <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"10px", color:"#4DCFFF", letterSpacing:"3px", marginBottom:"20px" }}>
              // SUBSCRIBE TO R.I.F.T. COLLECTIVE
            </div>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <input
                type="email"
                className="field"
                placeholder="your@email.com"
                value={emailSub}
                onChange={e=>setEmailSub(e.target.value)}
                style={{ flex:1, minWidth:"200px" }}
              />
              <button className="btn-prime">SUBSCRIBE</button>
            </div>
            <p style={{ color:"#374151", fontSize:"11px", letterSpacing:"1px", marginTop:"16px", fontFamily:"Orbitron,sans-serif" }}>
              // SWAP WITH: &lt;iframe src="https://embeds.beehiiv.com/[YOUR_PUB_KEY]" /&gt;
            </p>
          </div>

          <div style={{ display:"flex", gap:"36px", justifyContent:"center", marginTop:"40px", flexWrap:"wrap" }}>
            {["Weekly drops","No spam, ever","Unsubscribe anytime"].map(l=>(
              <div key={l} style={{ display:"flex", gap:"8px", alignItems:"center", color:"#6B7280", fontSize:"14px" }}>
                <span style={{ color:"#AAFF00", fontWeight:700 }}>✓</span> {l}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" style={{ padding:"110px 40px" }}>
        <div style={{ maxWidth:"860px", margin:"0 auto" }}>
          <span className="section-tag" style={{ display:"block", textAlign:"center" }}>// INITIATE CONTACT</span>
          <h2 className="section-h" style={{ textAlign:"center", fontSize:"clamp(28px,4vw,54px)", marginBottom:"14px" }}>
            START YOUR <span className="grad-text">RIFT</span>
          </h2>
          <p style={{ textAlign:"center", color:"#8892A4", fontSize:"17px", marginBottom:"56px" }}>
            Every movement starts with one conversation. Fill out the form — Cody responds within 24 hrs.
          </p>

          <div className="card-glass" style={{ padding:"52px 48px", borderRadius:"2px" }}>
            <div style={{ display:"grid", gap:"18px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
                <input className="field" placeholder="Full Name *" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} />
                <input className="field" type="email" placeholder="Email Address *" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} />
              </div>
              <select className="field" value={form.service} onChange={e=>setForm(p=>({...p,service:e.target.value}))}>
                <option value="">Select a Service (optional)</option>
                <option value="smm">Social Media Management</option>
                <option value="web">Website & Funnel Development</option>
                <option value="content">Content Strategy</option>
                <option value="brand">Brand Identity</option>
                <option value="product">Digital Product</option>
                <option value="other">Something Else</option>
              </select>
              <textarea
                className="field"
                placeholder="Tell me about your brand and what you're looking to build... *"
                rows={6}
                value={form.message}
                onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                style={{ resize:"vertical" }}
              />

              {/* Honeypot — hidden, bots fill it, humans don't */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off"
                value={form.honeypot || ""}
                onChange={e => setForm(p => ({ ...p, honeypot: e.target.value }))}
                style={{ position:"absolute", left:"-9999px", width:"1px", height:"1px", opacity:0, pointerEvents:"none" }}
                aria-hidden="true"
              />
                            <button
                className="btn-prime"
                onClick={submitForm}
                disabled={formSt==="sending" || formSt==="done"}
                style={{ width:"100%", fontSize:"12px", padding:"16px" }}
              >
                {formSt==="sending" ? "TRANSMITTING..." : formSt==="done" ? "✓ RIFT INITIATED" : "SEND INQUIRY →"}
              </button>

              {formSt==="done" && (
                <div style={{ textAlign:"center", fontFamily:"Orbitron,sans-serif", fontSize:"11px", color:"#AAFF00", letterSpacing:"2px", animation:"fadeIn 0.4s ease" }}>
                  // MESSAGE RECEIVED — Cody will respond within 24hrs
                </div>
              )}
              {formSt==="error" && (
                <div style={{ textAlign:"center", fontFamily:"Orbitron,sans-serif", fontSize:"11px", color:"#FF6B8A", letterSpacing:"2px" }}>
                  // PLEASE FILL IN NAME, EMAIL &amp; MESSAGE
                </div>
              )}

              <div style={{ textAlign:"center", color:"#374151", fontSize:"11px", fontFamily:"Orbitron,sans-serif", letterSpacing:"1.5px", marginTop:"4px" }}>
                🔒 Secured. Submissions route to realityriftdesign@outlook.com
              </div>
            </div>
          </div>

          {/* Social links */}
          <div style={{ display:"flex", gap:"36px", justifyContent:"center", marginTop:"52px", flexWrap:"wrap" }}>
            {[
              { l:"EMAIL",    v:"realityriftdesign@outlook.com",  h:"mailto:realityriftdesign@outlook.com" },
              { l:"X/TWITTER",v:"@Rift_Marketing_",            h:"https://twitter.com/Rift_Marketing_" },
              { l:"INSTAGRAM",v:"@Rift_Marketing_",            h:"https://instagram.com/Rift_Marketing_" },
              { l:"LINKEDIN", v:"/in/CodyRobichaud",           h:"https://linkedin.com/in/CodyRobichaud" },
            ].map(({ l,v,h }) => (
              <div key={l} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"9px", letterSpacing:"3px", color:"#AAFF00", marginBottom:"8px" }}>{l}</div>
                <a href={h} target="_blank" rel="noreferrer" style={{ color:"#8892A4", fontSize:"13px", textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#4DCFFF"}
                  onMouseLeave={e=>e.currentTarget.style.color="#8892A4"}>
                  {v}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{
        borderTop:"1px solid rgba(77,207,255,0.1)",
        padding:"36px 40px",
        display:"flex", justifyContent:"space-between", alignItems:"center",
        flexWrap:"wrap", gap:"16px"
      }}>
        <div style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"16px", letterSpacing:"3px" }} className="grad-text">
          R.I.F.T. MARKETING
        </div>
        <div style={{ color:"#374151", fontSize:"13px", fontFamily:"Rajdhani,sans-serif", letterSpacing:"1px" }}>
          © {new Date().getFullYear()} Reality Rift Designs — All rights reserved.
        </div>
        <div style={{ display:"flex", gap:"24px" }}>
          {[["Privacy Policy","#"],["Terms","#"]].map(([l,h])=>(
            <a key={l} href={h} style={{ color:"#374151", fontSize:"12px", textDecoration:"none", letterSpacing:"1px", transition:"color 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.color="#4DCFFF"}
              onMouseLeave={e=>e.currentTarget.style.color="#374151"}>
              {l}
            </a>
          ))}
        </div>
      </footer>

      {/* ── AI CHATBOT ───────────────────────────────────────── */}
      <div style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:1100 }}>
        {chatOpen && (
          <div style={{
            position:"absolute", bottom:"68px", right:0,
            width:"360px", height:"530px",
            background:"rgba(8,13,26,0.97)",
            border:"1px solid rgba(77,207,255,0.3)",
            backdropFilter:"blur(24px)",
            display:"flex", flexDirection:"column",
            boxShadow:"0 0 60px rgba(77,207,255,0.18), 0 0 0 1px rgba(77,207,255,0.08)",
            animation:"fadeUp 0.25s ease"
          }}>
            {/* Chat header */}
            <div style={{
              padding:"14px 18px",
              borderBottom:"1px solid rgba(77,207,255,0.15)",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              background:"rgba(14,30,63,0.6)"
            }}>
              <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                <div style={{
                  width:"38px", height:"38px",
                  background:"linear-gradient(135deg, #4DCFFF, #AAFF00)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"11px", color:"#0A0F1E"
                }}>AI</div>
                <div>
                  <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"12px", color:"#E8EBF0", letterSpacing:"1px" }}>RIFT AI</div>
                  <div style={{ display:"flex", gap:"5px", alignItems:"center" }}>
                    <div style={{ width:"6px", height:"6px", background:"#AAFF00", borderRadius:"50%" }} />
                    <span style={{ fontSize:"10px", color:"#AAFF00", letterSpacing:"1px", fontFamily:"Orbitron,sans-serif" }}>ONLINE</span>
                  </div>
                </div>
              </div>
              <button onClick={()=>setChatOpen(false)} style={{ background:"none", border:"none", color:"#6B7280", cursor:"pointer", fontSize:"20px", lineHeight:1 }}>×</button>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:"12px" }}>
              {msgs.map((m, i) => (
                <div key={i} className={m.r==="user" ? "chat-user" : "chat-bot"}>
                  {m.t}
                </div>
              ))}
              {typing && (
                <div className="chat-bot" style={{ display:"flex", gap:"5px", alignItems:"center", padding:"14px" }}>
                  {[0, 0.18, 0.36].map((d,i) => (
                    <div key={i} style={{
                      width:"7px", height:"7px", background:"#AAFF00", borderRadius:"50%",
                      animation:`blink 1s ${d}s infinite`
                    }} />
                  ))}
                </div>
              )}
              <div ref={chatEnd} />
            </div>

            {/* Input */}
            <div style={{ padding:"12px 14px", borderTop:"1px solid rgba(77,207,255,0.12)", display:"flex", gap:"8px" }}>
              <input
                className="field"
                value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter" && sendMsg()}
                placeholder="Ask about services, products..."
                style={{ flex:1, fontSize:"13.5px", padding:"10px 14px" }}
              />
              <button
                onClick={sendMsg}
                disabled={typing}
                style={{
                  width:"42px", height:"42px", flexShrink:0,
                  background:"linear-gradient(135deg, #4DCFFF, #AAFF00)",
                  border:"none", cursor:typing?"not-allowed":"pointer",
                  color:"#0A0F1E", fontWeight:900, fontSize:"18px",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  opacity:typing?0.6:1
                }}
              >→</button>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={()=>setChatOpen(p=>!p)}
          title="Chat with RIFT AI"
          style={{
            width:"58px", height:"58px",
            background:"linear-gradient(135deg, #4DCFFF, #AAFF00)",
            border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"chatPulse 2.5s infinite",
            fontSize:"24px", position:"relative"
          }}
        >
          {chatOpen ? "×" : "🤖"}
        </button>
      </div>
    </div>
    </>
  );
}