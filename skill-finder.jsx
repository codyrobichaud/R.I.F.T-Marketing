import { useState, useEffect, useRef } from "react";
import Head from "next/head";

/* ─── CONSTANTS ──────────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: "work",
    label: "01 / HISTORY",
    prompt: "What work, jobs, or roles have you held — paid or unpaid?",
    sub: "Include side projects, volunteering, parenting, anything you've *done* consistently.",
    placeholder: "e.g. Managed social media for a local gym, freelanced graphic design, ran my own Etsy store, coached youth basketball...",
    icon: "◈",
  },
  {
    id: "asked",
    label: "02 / YOUR MAGNET",
    prompt: "What do people constantly ask you for help with?",
    sub: "Think about what friends, coworkers, or family always come to you for — even if it feels obvious to you.",
    placeholder: "e.g. Fixing their computer, editing their resume, giving relationship advice, planning events...",
    icon: "⬡",
  },
  {
    id: "effortless",
    label: "03 / INVISIBLE EDGE",
    prompt: "What feels completely effortless to you but seems hard to others?",
    sub: "This is usually your deepest skill — things you do on autopilot that others struggle to figure out.",
    placeholder: "e.g. Explaining complex ideas simply, spotting patterns in data, making people feel comfortable...",
    icon: "◎",
  },
  {
    id: "flow",
    label: "04 / FLOW STATE",
    prompt: "What activities make you lose complete track of time?",
    sub: "Hobbies, work tasks, creative outlets — anything where you enter a deep flow state without noticing.",
    placeholder: "e.g. Writing, building spreadsheets, designing in Canva, researching topics online, cooking...",
    icon: "◆",
  },
  {
    id: "compliments",
    label: "05 / EXTERNAL SIGNAL",
    prompt: "What compliments do you receive most often — from anyone?",
    sub: "What do people say about *you* specifically that you sometimes brush off or take for granted?",
    placeholder: "e.g. 'You explain things so clearly', 'You always know what to say', 'You're so organized'...",
    icon: "◉",
  },
  {
    id: "teach",
    label: "06 / YOUR CURRICULUM",
    prompt: "If you had to teach someone something useful in 30 days — what would it be?",
    sub: "Think about knowledge you've accumulated through experience, not formal education.",
    placeholder: "e.g. How to build a personal brand from scratch, how to flip furniture, how to run paid ads...",
    icon: "◫",
  },
];

const SYSTEM_PROMPT = `You are RIFT AI — the Hidden Skill Excavation Engine built by R.I.F.T. Marketing (realityriftdesign.pro). Your job is to analyze a person's answers and surface their highest-value hidden skills and monetization paths.

You must respond ONLY with a valid JSON object — no preamble, no markdown, no backticks.

JSON format:
{
  "headline": "A punchy 6-8 word title that describes this person's core superpower (e.g. 'The Clarity Architect Who Turns Chaos Into Systems')",
  "archetype": "A 2-3 word identity label (e.g. 'The Systems Builder', 'The Trust Engineer', 'The Simplicity Expert')",
  "skills": [
    {
      "name": "Skill Name (2-4 words)",
      "rarity": "Common | Uncommon | Rare | Legendary",
      "level": 75,
      "description": "2-sentence description of what this skill is and why it's valuable in the market today.",
      "evidence": "One specific thing from their answers that reveals this skill."
    }
  ],
  "paths": [
    {
      "title": "Monetization path title",
      "model": "Freelance | Coaching | Content | Product | Agency | Consulting",
      "timeToIncome": "2-4 weeks | 1-3 months | 3-6 months",
      "income": "$500-$2K/mo | $2K-$5K/mo | $5K-$15K/mo | $15K+/mo",
      "description": "2-sentence description of this specific path for this specific person.",
      "firstMove": "One concrete action they can take THIS WEEK to start."
    }
  ],
  "rift": {
    "realign": "One sentence on how this person should reframe their identity/positioning.",
    "ignite": "One sentence on the content strategy that would work for their unique skill set.",
    "forge": "One sentence on the product or service they should build first.",
    "thrive": "One sentence on what scale looks like for them in 12 months."
  },
  "truth": "A 2-3 sentence raw, honest assessment of their biggest hidden asset — the thing they don't see about themselves. Be direct and insightful, not generic."
}

Rules:
- Return exactly 3 skills and exactly 3 monetization paths
- Be SPECIFIC to their answers — no generic advice
- Rarity and level should reflect genuine scarcity (most skills are Uncommon, true rare skills deserve Rare/Legendary)
- Income ranges should be realistic for someone starting out
- Make firstMove extremely concrete and actionable
- The truth field should feel like it was written by someone who truly read their answers`;

/* ─── UTILITIES ──────────────────────────────────────────────── */
const RARITY_COLOR = { Common:"#6B7280", Uncommon:"#4DCFFF", Rare:"#C9A84C", Legendary:"#AAFF00" };
const MODEL_ICON   = { Freelance:"◈", Coaching:"◎", Content:"⬡", Product:"◆", Agency:"◉", Consulting:"◫" };

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function HiddenSkillFinder() {
  const [phase, setPhase]       = useState("intro");   // intro | quiz | processing | results
  const [step, setStep]         = useState(0);
  const [answers, setAnswers]   = useState({});
  const [current, setCurrent]   = useState("");
  const [results, setResults]   = useState(null);
  const [error, setError]       = useState("");
  const [scanPct, setScanPct]   = useState(0);
  const [particles, setParticles] = useState([]);
  const [glitchH, setGlitchH]   = useState(false);
  const textRef = useRef(null);

  /* particles */
  useEffect(() => {
    setParticles(Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: 6 + Math.random() * 8,
      delay: Math.random() * 5,
    })));
  }, []);

  /* glitch loop */
  useEffect(() => {
    const id = setInterval(() => {
      setGlitchH(true);
      setTimeout(() => setGlitchH(false), 200);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  /* scan progress */
  useEffect(() => {
    if (phase !== "processing") return;
    setScanPct(0);
    const id = setInterval(() => {
      setScanPct(p => {
        if (p >= 97) { clearInterval(id); return 97; }
        const jump = p < 40 ? 2.5 : p < 75 ? 1.2 : 0.35;
        return p + jump;
      });
    }, 80);
    return () => clearInterval(id);
  }, [phase]);

  /* focus textarea on step change */
  useEffect(() => {
    if (phase === "quiz") setTimeout(() => textRef.current?.focus(), 350);
  }, [step, phase]);

  const advance = () => {
    if (!current.trim()) return;
    const q = QUESTIONS[step];
    const updated = { ...answers, [q.id]: current.trim() };
    setAnswers(updated);
    setCurrent("");
    if (step < QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else {
      runAnalysis(updated);
    }
  };

  const runAnalysis = async (data) => {
    setPhase("processing");
    const userContent = QUESTIONS.map(q => `${q.prompt}\n→ ${data[q.id]}`).join("\n\n");
    try {
      const res  = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userContent }],
        }),
      });
      const raw   = await res.json();
      const text  = raw.content?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setScanPct(100);
      setTimeout(() => { setResults(parsed); setPhase("results"); }, 700);
    } catch (e) {
      setError("Analysis failed — " + e.message);
      setPhase("quiz");
    }
  };

  const restart = () => {
    setPhase("intro"); setStep(0); setAnswers({});
    setCurrent(""); setResults(null); setError("");
  };

  /* ─── STYLES ─────────────────────────────────────────────── */
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#060B16;color:#E2E8F0;font-family:'Rajdhani',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:#060B16}
    ::-webkit-scrollbar-thumb{background:linear-gradient(#4DCFFF,#AAFF00)}

    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes scanBeam{0%{top:-4px}100%{top:100%}}
    @keyframes gridDrift{0%{background-position:0 0}100%{background-position:60px 60px}}
    @keyframes particleDrift{0%{transform:translateY(0) translateX(0);opacity:0}20%{opacity:1}80%{opacity:0.6}100%{transform:translateY(-120px) translateX(20px);opacity:0}}
    @keyframes glitch{0%{text-shadow:3px 0 #4DCFFF,-3px 0 #AAFF00;transform:translate(0)}25%{text-shadow:-3px 0 #4DCFFF,3px 0 #AAFF00;transform:translate(-2px,1px)}50%{text-shadow:3px 0 #AAFF00,-3px 0 #4DCFFF;transform:translate(2px,-1px)}75%{text-shadow:-3px 0 #AAFF00,3px 0 #4DCFFF;transform:translate(0)}100%{text-shadow:-3px 0 #4DCFFF,3px 0 #AAFF00;transform:translate(0)}}
    @keyframes borderPulse{0%,100%{border-color:rgba(77,207,255,.2)}50%{border-color:rgba(170,255,0,.4)}}
    @keyframes barFill{from{width:0}to{width:var(--w)}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(2.2);opacity:0}}
    @keyframes typeIn{from{width:0}to{width:100%}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes cardReveal{from{opacity:0;transform:translateY(24px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}

    .grid-bg{background-image:linear-gradient(rgba(77,207,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(77,207,255,.035) 1px,transparent 1px);background-size:60px 60px;animation:gridDrift 5s linear infinite}
    .float{animation:float 3.5s ease-in-out infinite}
    .glitch-text{animation:glitch .22s steps(1) infinite}
    .grad{background:linear-gradient(135deg,#4DCFFF,#AAFF00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .gold{background:linear-gradient(135deg,#C9A84C,#FFD166);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
    .card{background:rgba(14,26,52,.55);border:1px solid rgba(77,207,255,.16);backdrop-filter:blur(16px);transition:all .28s cubic-bezier(.4,0,.2,1)}
    .card:hover{border-color:rgba(77,207,255,.38);box-shadow:0 8px 40px rgba(77,207,255,.1);transform:translateY(-4px)}
    .card-rev{animation:cardReveal .5s ease forwards}
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;cursor:pointer;font-family:'Orbitron',sans-serif;font-weight:700;letter-spacing:2px;text-transform:uppercase;transition:all .2s;clip-path:polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))}
    .btn-prime{background:linear-gradient(135deg,#4DCFFF,#AAFF00);color:#060B16;padding:14px 36px;font-size:11px}
    .btn-prime:hover{transform:translateY(-2px);box-shadow:0 12px 32px rgba(77,207,255,.42);background:linear-gradient(135deg,#AAFF00,#4DCFFF)}
    .btn-ghost{background:transparent;color:#4DCFFF;border:1px solid rgba(77,207,255,.4);padding:12px 28px;font-size:10px}
    .btn-ghost:hover{background:rgba(77,207,255,.08);border-color:#4DCFFF;box-shadow:0 0 24px rgba(77,207,255,.25)}
    .btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important;box-shadow:none!important}
    .field{width:100%;background:rgba(8,15,35,.7);border:1px solid rgba(77,207,255,.18);color:#E2E8F0;font-family:'Rajdhani',sans-serif;font-size:16px;font-weight:500;padding:16px 20px;resize:none;outline:none;transition:border-color .2s,box-shadow .2s;clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))}
    .field:focus{border-color:#4DCFFF;box-shadow:0 0 24px rgba(77,207,255,.15)}
    .field::placeholder{color:rgba(148,163,184,.35)}
    .mono{font-family:'Share Tech Mono',monospace}
    .tag{font-family:'Orbitron',sans-serif;font-size:9px;letter-spacing:3px;text-transform:uppercase;padding:4px 10px;border:1px solid currentColor}
    .scan-line{position:fixed;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent 10%,rgba(77,207,255,.3),transparent 90%);animation:scanBeam 6s linear infinite;pointer-events:none;z-index:999}
    @media(max-width:680px){.mob-col{flex-direction:column!important}.mob-full{width:100%!important}.mob-sm{font-size:clamp(26px,8vw,40px)!important}}
  `;

  /* ─── SHARED WRAPPERS ───────────────────────────────────────── */
  const Shell = ({ children }) => (
    <div style={{ position:"relative", minHeight:"100vh", background:"#060B16", overflowX:"hidden" }}>
      <style>{css}</style>
      <div className="scan-line" />
      {/* particle field */}
      {particles.map(p => (
        <div key={p.id} style={{
          position:"fixed", left:`${p.x}%`, top:`${p.y}%`,
          width:p.size, height:p.size, borderRadius:"50%",
          background:"#4DCFFF", opacity:0,
          animation:`particleDrift ${p.dur}s ${p.delay}s linear infinite`,
          pointerEvents:"none", zIndex:0
        }}/>
      ))}
      {/* grid */}
      <div className="grid-bg" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}/>
      <div style={{ position:"relative", zIndex:1 }}>{children}</div>
    </div>
  );

  /* ─── PHASE: INTRO ──────────────────────────────────────────── */
  if (phase === "intro") return (
    <Shell>
      <div style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"60px 32px", textAlign:"center"
      }}>
        {/* logo */}
        <div style={{ marginBottom:"28px", animation:"fadeIn .6s ease" }}>
          <span style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"13px", letterSpacing:"6px", color:"#4A5568" }}>
            R.I.F.T. MARKETING · FREE TOOL
          </span>
        </div>

        {/* icon */}
        <div className="float" style={{ marginBottom:"32px", animation:"float 3s ease-in-out infinite, fadeIn .8s ease" }}>
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <polygon points="40,4 76,62 4,62" stroke="#4DCFFF" strokeWidth="1.5" fill="none" opacity=".4"/>
            <polygon points="40,14 68,58 12,58" stroke="#AAFF00" strokeWidth="1" fill="none" opacity=".3"/>
            <circle cx="40" cy="40" r="14" stroke="#4DCFFF" strokeWidth="1.5" fill="rgba(77,207,255,.06)"/>
            <circle cx="40" cy="40" r="5" fill="#AAFF00"/>
            <line x1="40" y1="4" x2="40" y2="26" stroke="#4DCFFF" strokeWidth="1" opacity=".5"/>
            <line x1="40" y1="54" x2="40" y2="76" stroke="#4DCFFF" strokeWidth="1" opacity=".5"/>
            <line x1="4" y1="62" x2="26" y2="50" stroke="#4DCFFF" strokeWidth="1" opacity=".5"/>
            <line x1="54" y1="50" x2="76" y2="62" stroke="#4DCFFF" strokeWidth="1" opacity=".5"/>
          </svg>
        </div>

        <h1 className={glitchH ? "glitch-text" : ""} style={{
          fontFamily:"Orbitron,sans-serif", fontWeight:900,
          fontSize:"clamp(32px,6vw,72px)", lineHeight:1.05,
          marginBottom:"20px", animation:"fadeUp .7s ease"
        }}>
          <span className="grad">HIDDEN SKILL</span><br/>
          <span style={{ color:"#E2E8F0" }}>FINDER</span>
        </h1>

        <p style={{
          fontFamily:"Rajdhani,sans-serif", fontSize:"clamp(16px,2.2vw,20px)",
          color:"#6B7280", maxWidth:"560px", lineHeight:1.75, marginBottom:"14px",
          animation:"fadeUp .85s ease"
        }}>
          6 questions. 90 seconds. The AI surfaces the skills you've been sitting on — and shows you exactly how to monetize them.
        </p>
        <p style={{ fontFamily:"Share Tech Mono,monospace", fontSize:"11px", color:"#374151", marginBottom:"52px", letterSpacing:"1.5px", animation:"fadeUp .9s ease" }}>
          // powered by R.I.F.T. framework · free · no signup required
        </p>

        {/* stats row */}
        <div style={{
          display:"flex", gap:"56px", marginBottom:"56px", flexWrap:"wrap",
          justifyContent:"center", animation:"fadeUp 1s ease"
        }}>
          {[["6","Questions"],["AI","Powered"],["Free","Always"]].map(([n,l]) => (
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"28px" }} className="grad">{n}</div>
              <div style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"11px", letterSpacing:"3px", color:"#4A5568", fontWeight:600 }}>{l}</div>
            </div>
          ))}
        </div>

        <button className="btn btn-prime" onClick={()=>setPhase("quiz")} style={{ fontSize:"12px", padding:"16px 48px", animation:"fadeUp 1.05s ease" }}>
          EXCAVATE MY SKILLS →
        </button>

        {/* example skills preview */}
        <div style={{ marginTop:"64px", display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center", animation:"fadeIn 1.3s ease" }}>
          {[["Rare","Systems Thinking"],["Legendary","Empathy at Scale"],["Uncommon","Visual Communication"],["Rare","Strategic Storytelling"]].map(([r,s])=>(
            <div key={s} className="card" style={{ padding:"8px 14px", display:"flex", gap:"8px", alignItems:"center" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:RARITY_COLOR[r], flexShrink:0 }}/>
              <span style={{ fontFamily:"Orbitron,sans-serif", fontSize:"10px", color:RARITY_COLOR[r], letterSpacing:"1px" }}>{r}</span>
              <span style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"13px", color:"#94A3B8" }}>{s}</span>
            </div>
          ))}
        </div>

        <p style={{ marginTop:"24px", fontFamily:"Rajdhani,sans-serif", fontSize:"13px", color:"#374151", letterSpacing:"1px" }}>
          ↑ real skill types our AI surfaces
        </p>
      </div>
    </Shell>
  );

  /* ─── PHASE: QUIZ ───────────────────────────────────────────── */
  if (phase === "quiz") {
    const q = QUESTIONS[step];
    const pct = Math.round(((step) / QUESTIONS.length) * 100);
    return (
      <Shell>
        <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", padding:"0 24px" }}>

          {/* top bar */}
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"20px 16px", borderBottom:"1px solid rgba(77,207,255,.1)"
          }}>
            <span style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"14px", letterSpacing:"3px" }} className="grad">
              R.I.F.T.
            </span>
            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  width: i === step ? "22px" : "7px", height:"7px", borderRadius:"4px",
                  background: i < step ? "#AAFF00" : i === step ? "#4DCFFF" : "rgba(77,207,255,.2)",
                  transition:"all .35s ease"
                }}/>
              ))}
            </div>
            <span className="mono" style={{ fontSize:"11px", color:"#4A5568" }}>{step+1}/{QUESTIONS.length}</span>
          </div>

          {/* progress bar */}
          <div style={{ height:"2px", background:"rgba(77,207,255,.1)" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:"linear-gradient(90deg,#4DCFFF,#AAFF00)", transition:"width .4s ease" }}/>
          </div>

          {/* question */}
          <div style={{
            flex:1, display:"flex", flexDirection:"column",
            justifyContent:"center", padding:"40px 16px",
            maxWidth:"700px", margin:"0 auto", width:"100%",
            animation:"fadeUp .4s ease"
          }}>

            {/* question label + icon */}
            <div style={{ display:"flex", gap:"14px", alignItems:"center", marginBottom:"20px" }}>
              <div style={{
                width:"46px", height:"46px", border:"1px solid rgba(77,207,255,.3)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"22px", color:"#4DCFFF", flexShrink:0
              }}>{q.icon}</div>
              <span style={{ fontFamily:"Orbitron,sans-serif", fontSize:"10px", letterSpacing:"4px", color:"#AAFF00" }}>{q.label}</span>
            </div>

            {/* question text */}
            <h2 style={{
              fontFamily:"Orbitron,sans-serif", fontWeight:700,
              fontSize:"clamp(18px,3.5vw,30px)", color:"#E2E8F0",
              lineHeight:1.3, marginBottom:"12px"
            }}>{q.prompt}</h2>

            <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"16px", color:"#6B7280", marginBottom:"28px", lineHeight:1.6 }}>
              {q.sub}
            </p>

            {/* error */}
            {error && (
              <div style={{ marginBottom:"16px", padding:"10px 16px", border:"1px solid rgba(255,107,138,.35)", color:"#FF6B8A", fontFamily:"Share Tech Mono,monospace", fontSize:"12px" }}>
                // ERROR: {error}
              </div>
            )}

            {/* textarea */}
            <textarea
              ref={textRef}
              className="field"
              rows={5}
              placeholder={q.placeholder}
              value={current}
              onChange={e => setCurrent(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && e.metaKey) advance();
              }}
            />

            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"20px", flexWrap:"wrap", gap:"12px" }}>
              <div style={{ display:"flex", gap:"10px" }}>
                {step > 0 && (
                  <button className="btn btn-ghost" onClick={() => { setStep(s=>s-1); setCurrent(answers[QUESTIONS[step-1].id] || ""); }}>
                    ← BACK
                  </button>
                )}
              </div>
              <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                <span className="mono" style={{ fontSize:"11px", color:"#374151" }}>⌘+Enter to advance</span>
                <button className="btn btn-prime" onClick={advance} disabled={!current.trim()}>
                  {step === QUESTIONS.length - 1 ? "ANALYZE →" : "NEXT →"}
                </button>
              </div>
            </div>
          </div>

          {/* bottom watermark */}
          <div style={{ padding:"16px", textAlign:"center", borderTop:"1px solid rgba(77,207,255,.06)" }}>
            <span className="mono" style={{ fontSize:"10px", color:"#1F2937", letterSpacing:"2px" }}>
              // RIFT AI SKILL ENGINE · POWERED BY REALITY RIFT DESIGNS
            </span>
          </div>
        </div>
      </Shell>
    );
  }

  /* ─── PHASE: PROCESSING ─────────────────────────────────────── */
  if (phase === "processing") {
    const STAGES = [
      { pct: 0,  label:"Initializing skill excavation engine..." },
      { pct: 18, label:"Mapping experience graph..." },
      { pct: 35, label:"Cross-referencing market demand signals..." },
      { pct: 52, label:"Identifying hidden competency clusters..." },
      { pct: 68, label:"Calibrating rarity scores..." },
      { pct: 82, label:"Building monetization pathways..." },
      { pct: 94, label:"Finalizing R.I.F.T. positioning..." },
    ];
    const stage = STAGES.filter(s => scanPct >= s.pct).pop() || STAGES[0];

    return (
      <Shell>
        <div style={{
          minHeight:"100vh", display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", padding:"40px 24px", textAlign:"center"
        }}>
          {/* hexagon scanner */}
          <div style={{ position:"relative", width:"160px", height:"160px", marginBottom:"48px" }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ position:"absolute", inset:0 }}>
              <polygon points="80,8 148,44 148,116 80,152 12,116 12,44" stroke="rgba(77,207,255,.2)" strokeWidth="1" fill="none"/>
              <polygon points="80,22 136,54 136,106 80,138 24,106 24,54" stroke="rgba(170,255,0,.15)" strokeWidth="1" fill="none"/>
              <circle cx="80" cy="80" r="35" stroke="#4DCFFF" strokeWidth="1.5" fill="none" strokeDasharray="220" strokeDashoffset={220 - (220 * scanPct/100)} style={{ transition:"stroke-dashoffset .3s", transform:"rotate(-90deg)", transformOrigin:"80px 80px" }}/>
              <circle cx="80" cy="80" r="20" stroke="rgba(170,255,0,.3)" strokeWidth="1" fill="none" style={{ animation:"spin 3s linear infinite" }}/>
              <circle cx="80" cy="80" r="6" fill="#AAFF00"/>
              {/* scan beam line */}
              <line x1="80" y1="80" x2={80 + 35 * Math.cos((scanPct/100 * 360 - 90) * Math.PI/180)} y2={80 + 35 * Math.sin((scanPct/100 * 360 - 90) * Math.PI/180)} stroke="#4DCFFF" strokeWidth="1.5" opacity=".7"/>
            </svg>
            {/* pct text */}
            <div style={{
              position:"absolute", inset:0, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center"
            }}>
              <span style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"22px" }} className="grad">
                {Math.round(scanPct)}%
              </span>
            </div>
          </div>

          <h2 style={{ fontFamily:"Orbitron,sans-serif", fontWeight:700, fontSize:"clamp(18px,3vw,26px)", color:"#E2E8F0", marginBottom:"14px" }}>
            EXCAVATING YOUR SKILLS
          </h2>
          <p className="mono" style={{ fontSize:"12px", color:"#4DCFFF", marginBottom:"44px", letterSpacing:"1.5px", minHeight:"18px" }}>
            // {stage.label}
          </p>

          {/* stage list */}
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", width:"100%", maxWidth:"420px" }}>
            {STAGES.map((s, i) => {
              const done    = scanPct > s.pct + 16;
              const active  = !done && scanPct >= s.pct;
              return (
                <div key={i} style={{
                  display:"flex", gap:"12px", alignItems:"center",
                  opacity: done ? 1 : active ? 1 : 0.28,
                  transition:"opacity .4s"
                }}>
                  <div style={{
                    width:"8px", height:"8px", borderRadius:"50%", flexShrink:0,
                    background: done ? "#AAFF00" : active ? "#4DCFFF" : "rgba(77,207,255,.3)",
                    boxShadow: active ? "0 0 12px #4DCFFF" : "none",
                    animation: active ? "ping 1s ease-out infinite" : "none"
                  }}/>
                  <span className="mono" style={{ fontSize:"11px", color: done ? "#AAFF00" : active ? "#4DCFFF" : "#374151", letterSpacing:"1px", textAlign:"left" }}>
                    {done ? "✓ " : active ? "▸ " : "  "}{s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Shell>
    );
  }

  /* ─── PHASE: RESULTS ─────────────────────────────────────────── */
  if (phase === "results" && results) {
    return (
      <Shell>
        <div style={{ maxWidth:"900px", margin:"0 auto", padding:"40px 24px 80px" }}>

          {/* header */}
          <div style={{ textAlign:"center", padding:"32px 0 48px", borderBottom:"1px solid rgba(77,207,255,.1)", marginBottom:"48px" }}>
            <span style={{ fontFamily:"Orbitron,sans-serif", fontSize:"9px", letterSpacing:"5px", color:"#AAFF00", display:"block", marginBottom:"16px" }}>
              // EXCAVATION COMPLETE · SKILL PROFILE GENERATED
            </span>
            <div style={{
              display:"inline-block", padding:"8px 20px", marginBottom:"24px",
              border:"1px solid rgba(77,207,255,.3)", background:"rgba(77,207,255,.05)"
            }}>
              <span style={{ fontFamily:"Orbitron,sans-serif", fontSize:"12px", color:"#4DCFFF", letterSpacing:"3px" }}>
                {results.archetype}
              </span>
            </div>
            <h1 className={glitchH ? "glitch-text" : ""} style={{
              fontFamily:"Orbitron,sans-serif", fontWeight:900,
              fontSize:"clamp(22px,4vw,44px)", lineHeight:1.1, color:"#E2E8F0"
            }}>
              "{results.headline}"
            </h1>
          </div>

          {/* THE TRUTH */}
          <div className="card card-rev" style={{
            padding:"32px 28px", marginBottom:"40px", borderRadius:"1px",
            borderColor:"rgba(201,168,76,.25)", background:"rgba(201,168,76,.04)"
          }}>
            <div style={{ display:"flex", gap:"14px", alignItems:"flex-start" }}>
              <span style={{ fontSize:"28px", lineHeight:1, flexShrink:0 }}>◈</span>
              <div>
                <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"10px", color:"#C9A84C", letterSpacing:"4px", marginBottom:"12px" }}>
                  // THE RIFT ASSESSMENT
                </div>
                <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"17px", color:"#CBD5E1", lineHeight:1.75 }}>
                  {results.truth}
                </p>
              </div>
            </div>
          </div>

          {/* SKILL CARDS */}
          <div style={{ marginBottom:"48px" }}>
            <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"11px", color:"#AAFF00", letterSpacing:"4px", marginBottom:"24px" }}>
              // YOUR HIDDEN SKILLS
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
              {results.skills?.map((sk, i) => (
                <div key={i} className="card card-rev" style={{
                  padding:"26px 28px", borderRadius:"1px",
                  animationDelay:`${i * 0.12}s`, opacity:0
                }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"12px", marginBottom:"14px" }}>
                    <div style={{ display:"flex", gap:"12px", alignItems:"center" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:RARITY_COLOR[sk.rarity], flexShrink:0, boxShadow:`0 0 10px ${RARITY_COLOR[sk.rarity]}` }}/>
                      <h3 style={{ fontFamily:"Orbitron,sans-serif", fontSize:"16px", color:"#E2E8F0", fontWeight:700 }}>{sk.name}</h3>
                    </div>
                    <span className="tag" style={{ color:RARITY_COLOR[sk.rarity], borderColor:`${RARITY_COLOR[sk.rarity]}55`, fontSize:"9px" }}>
                      {sk.rarity}
                    </span>
                  </div>

                  {/* level bar */}
                  <div style={{ marginBottom:"16px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                      <span className="mono" style={{ fontSize:"10px", color:"#4A5568" }}>SKILL LEVEL</span>
                      <span className="mono" style={{ fontSize:"10px", color:RARITY_COLOR[sk.rarity] }}>{sk.level}/100</span>
                    </div>
                    <div style={{ height:"3px", background:"rgba(77,207,255,.1)", borderRadius:"2px" }}>
                      <div style={{
                        height:"100%", borderRadius:"2px",
                        background:`linear-gradient(90deg, ${RARITY_COLOR[sk.rarity]}88, ${RARITY_COLOR[sk.rarity]})`,
                        "--w":`${sk.level}%`, animation:"barFill 1s ease forwards",
                        animationDelay:`${0.4 + i * 0.15}s`, width:0
                      }}/>
                    </div>
                  </div>

                  <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"15px", color:"#8892A4", lineHeight:1.65, marginBottom:"12px" }}>
                    {sk.description}
                  </p>
                  <div className="mono" style={{ fontSize:"11px", color:"#374151", padding:"10px 14px", background:"rgba(77,207,255,.03)", borderLeft:`2px solid ${RARITY_COLOR[sk.rarity]}` }}>
                    Evidence: {sk.evidence}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MONETIZATION PATHS */}
          <div style={{ marginBottom:"48px" }}>
            <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"11px", color:"#AAFF00", letterSpacing:"4px", marginBottom:"24px" }}>
              // MONETIZATION PATHS
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))", gap:"16px" }}>
              {results.paths?.map((p, i) => (
                <div key={i} className="card card-rev" style={{
                  padding:"26px 24px", borderRadius:"1px",
                  animationDelay:`${0.3 + i * 0.15}s`, opacity:0
                }}>
                  {/* model badge */}
                  <div style={{ display:"flex", gap:"10px", alignItems:"center", marginBottom:"16px" }}>
                    <span style={{ fontSize:"22px", color:"#4DCFFF" }}>{MODEL_ICON[p.model] || "◈"}</span>
                    <span className="tag" style={{ color:"#4DCFFF", borderColor:"rgba(77,207,255,.3)", fontSize:"9px" }}>{p.model}</span>
                  </div>
                  <h3 style={{ fontFamily:"Orbitron,sans-serif", fontSize:"14px", color:"#E2E8F0", fontWeight:700, marginBottom:"12px", lineHeight:1.35 }}>
                    {p.title}
                  </h3>
                  <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"14.5px", color:"#8892A4", lineHeight:1.65, marginBottom:"16px" }}>
                    {p.description}
                  </p>
                  {/* meta */}
                  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
                    {[["⏱",p.timeToIncome,"rgba(77,207,255,.15)","#4DCFFF"],["$",p.income,"rgba(170,255,0,.12)","#AAFF00"]].map(([ic,v,bg,c])=>(
                      <div key={ic} style={{ background:bg, border:`1px solid ${c}28`, padding:"5px 10px", display:"flex", gap:"5px", alignItems:"center" }}>
                        <span style={{ fontSize:"10px" }}>{ic}</span>
                        <span className="mono" style={{ fontSize:"10px", color:c }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  {/* first move */}
                  <div style={{ padding:"12px 14px", background:"rgba(170,255,0,.05)", borderLeft:"2px solid #AAFF0055" }}>
                    <div className="mono" style={{ fontSize:"9px", color:"#AAFF00", letterSpacing:"2px", marginBottom:"6px" }}>// FIRST MOVE THIS WEEK</div>
                    <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"13.5px", color:"#CBD5E1", lineHeight:1.55 }}>{p.firstMove}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* R.I.F.T. BREAKDOWN */}
          <div className="card card-rev" style={{ padding:"36px 32px", marginBottom:"48px", borderRadius:"1px", opacity:0, animationDelay:".5s" }}>
            <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"11px", color:"#AAFF00", letterSpacing:"4px", marginBottom:"28px" }}>
              // YOUR R.I.F.T. ROADMAP
            </div>
            <div style={{ display:"grid", gap:"0", borderLeft:"1px solid rgba(77,207,255,.15)" }}>
              {[
                { l:"R", w:"REALIGN",  c:"#4DCFFF",  v: results.rift?.realign  },
                { l:"I", w:"IGNITE",   c:"#AAFF00",  v: results.rift?.ignite   },
                { l:"F", w:"FORGE",    c:"#C9A84C",  v: results.rift?.forge    },
                { l:"T", w:"THRIVE",   c:"#FF6B8A",  v: results.rift?.thrive   },
              ].map(({ l,w,c,v }) => (
                <div key={l} style={{ display:"flex", gap:"20px", padding:"20px 0 20px 28px", borderBottom:"1px solid rgba(77,207,255,.08)" }}>
                  <div style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"36px", color:c, lineHeight:1, flexShrink:0, minWidth:"44px" }}>{l}</div>
                  <div>
                    <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:"9px", color:c, letterSpacing:"3px", marginBottom:"6px" }}>{w}</div>
                    <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"15.5px", color:"#94A3B8", lineHeight:1.65 }}>{v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA BLOCK */}
          <div style={{
            padding:"48px 40px", textAlign:"center",
            background:"linear-gradient(135deg, rgba(14,30,63,.7), rgba(6,11,22,.9))",
            border:"1px solid rgba(77,207,255,.2)",
            animation:"borderPulse 3s ease infinite"
          }}>
            <span style={{ fontFamily:"Orbitron,sans-serif", fontSize:"9px", letterSpacing:"5px", color:"#AAFF00", display:"block", marginBottom:"18px" }}>
              // READY TO DEPLOY THESE SKILLS?
            </span>
            <h2 style={{ fontFamily:"Orbitron,sans-serif", fontWeight:900, fontSize:"clamp(20px,3.5vw,38px)", color:"#E2E8F0", marginBottom:"16px", lineHeight:1.15 }}>
              LET'S BUILD YOUR<br/><span className="grad">MOVEMENT TOGETHER.</span>
            </h2>
            <p style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"17px", color:"#6B7280", marginBottom:"36px", maxWidth:"440px", margin:"0 auto 36px", lineHeight:1.7 }}>
              R.I.F.T. Marketing turns your skill profile into a brand system, content engine, and revenue operation — done-for-you.
            </p>
            <div style={{ display:"flex", gap:"14px", justifyContent:"center", flexWrap:"wrap" }}>
              <a href="mailto:realityriftdesign@outlook.com" style={{ textDecoration:"none" }}>
                <button className="btn btn-prime" style={{ fontSize:"11px", padding:"15px 34px" }}>BOOK A FREE DISCOVERY CALL →</button>
              </a>
              <button className="btn btn-ghost" onClick={restart} style={{ fontSize:"10px", padding:"14px 28px" }}>RUN AGAIN</button>
            </div>
            <p className="mono" style={{ marginTop:"22px", fontSize:"10px", color:"#1F2937", letterSpacing:"2px" }}>
              // realityriftdesign@outlook.com · realityriftdesign.pro · @Rift_Marketing_
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  return null;
}
