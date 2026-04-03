import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const EFFECTIVE_DATE = "April 2, 2026";
const COMPANY       = "Reality Rift Designs";
const SITE          = "realityriftdesign.pro";
const EMAIL         = "realityriftdesign@outlook.com";
const ADDRESS       = "Portland, Oregon, United States";

/* ─── SHARED CSS ─────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:#060B16;color:#CBD5E1;font-family:'Rajdhani',sans-serif;line-height:1.75;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:#060B16}
  ::-webkit-scrollbar-thumb{background:linear-gradient(#4DCFFF,#AAFF00)}

  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scanBeam{0%{top:-4px}100%{top:100%}}
  @keyframes gridDrift{0%{background-position:0 0}100%{background-position:60px 60px}}
  @keyframes borderPulse{0%,100%{border-color:rgba(77,207,255,.18)}50%{border-color:rgba(170,255,0,.32)}}

  .scan-line{position:fixed;left:0;width:100%;height:2px;background:linear-gradient(90deg,transparent 10%,rgba(77,207,255,.25),transparent 90%);animation:scanBeam 7s linear infinite;pointer-events:none;z-index:9999}
  .grid-bg{background-image:linear-gradient(rgba(77,207,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(77,207,255,.025) 1px,transparent 1px);background-size:60px 60px;animation:gridDrift 6s linear infinite}
  .grad{background:linear-gradient(135deg,#4DCFFF,#AAFF00);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .mono{font-family:'Share Tech Mono',monospace}

  .tab-btn{font-family:'Orbitron',sans-serif;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;background:transparent;border:none;cursor:pointer;padding:14px 28px;color:#4A5568;transition:all .2s;border-bottom:2px solid transparent;white-space:nowrap}
  .tab-btn:hover{color:#94A3B8}
  .tab-btn.active{color:#4DCFFF;border-bottom-color:#4DCFFF}

  .toc-link{display:block;font-family:'Rajdhani',sans-serif;font-size:13px;font-weight:500;color:#4A5568;text-decoration:none;padding:7px 0 7px 16px;border-left:2px solid transparent;transition:all .2s;cursor:pointer;letter-spacing:.5px;line-height:1.4}
  .toc-link:hover{color:#94A3B8;border-left-color:rgba(77,207,255,.3)}
  .toc-link.active{color:#4DCFFF;border-left-color:#4DCFFF}

  .legal-h2{font-family:'Orbitron',sans-serif;font-weight:700;font-size:clamp(15px,2vw,19px);color:#E2E8F0;margin:48px 0 16px;padding-top:8px;letter-spacing:.5px;display:flex;align-items:center;gap:12px}
  .legal-h2::before{content:'';display:block;width:3px;height:22px;background:linear-gradient(#4DCFFF,#AAFF00);flex-shrink:0}
  .legal-h3{font-family:'Orbitron',sans-serif;font-weight:600;font-size:13px;color:#94A3B8;margin:28px 0 10px;letter-spacing:1.5px;text-transform:uppercase}
  .legal-p{font-size:15.5px;color:#8892A4;line-height:1.82;margin-bottom:14px}
  .legal-ul{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-direction:column;gap:8px}
  .legal-ul li{display:flex;gap:10px;font-size:15px;color:#8892A4;line-height:1.7}
  .legal-ul li::before{content:'▸';color:#4DCFFF;font-size:10px;margin-top:5px;flex-shrink:0}
  .legal-link{color:#4DCFFF;text-decoration:none;border-bottom:1px solid rgba(77,207,255,.25);transition:border-color .2s}
  .legal-link:hover{border-bottom-color:#4DCFFF}

  .highlight-box{background:rgba(77,207,255,.04);border:1px solid rgba(77,207,255,.15);padding:20px 24px;margin:20px 0;animation:borderPulse 4s ease infinite}
  .warn-box{background:rgba(201,168,76,.04);border:1px solid rgba(201,168,76,.2);padding:20px 24px;margin:20px 0}
  .warn-box .legal-p{color:#A89060}

  .chip{display:inline-flex;align-items:center;gap:6px;background:rgba(77,207,255,.07);border:1px solid rgba(77,207,255,.2);padding:5px 12px;font-family:'Share Tech Mono',monospace;font-size:11px;color:#4DCFFF;letter-spacing:1px;margin:4px 4px 4px 0}

  @media(max-width:900px){.hide-desk{display:none!important}.mob-full{width:100%!important}}
`;

/* ─── PRIVACY POLICY CONTENT ─────────────────────────────────── */
const PRIVACY_SECTIONS = [
  { id:"overview",    label:"Overview" },
  { id:"collect",     label:"Information We Collect" },
  { id:"use",         label:"How We Use Your Data" },
  { id:"share",       label:"Sharing & Disclosure" },
  { id:"cookies",     label:"Cookies & Tracking" },
  { id:"retention",   label:"Data Retention" },
  { id:"rights",      label:"Your Rights" },
  { id:"security",    label:"Security" },
  { id:"third-party", label:"Third-Party Services" },
  { id:"children",    label:"Children's Privacy" },
  { id:"changes",     label:"Policy Changes" },
  { id:"contact-p",   label:"Contact Us" },
];

const TERMS_SECTIONS = [
  { id:"acceptance",  label:"Acceptance of Terms" },
  { id:"services-t",  label:"Services Described" },
  { id:"accounts",    label:"User Accounts" },
  { id:"payment",     label:"Payment & Billing" },
  { id:"ip",          label:"Intellectual Property" },
  { id:"conduct",     label:"Acceptable Use" },
  { id:"disclaimer",  label:"Disclaimers" },
  { id:"liability",   label:"Limitation of Liability" },
  { id:"indemnity",   label:"Indemnification" },
  { id:"termination", label:"Termination" },
  { id:"governing",   label:"Governing Law" },
  { id:"contact-t",   label:"Contact Us" },
];

/* ─── PRIVACY CONTENT ────────────────────────────────────────── */
function PrivacyContent() {
  return (
    <div>
      <section id="overview">
        <h2 className="legal-h2">Overview</h2>
        <p className="legal-p">
          {COMPANY} ("we," "us," or "our") operates {SITE} and related digital properties including the R.I.F.T. Collective newsletter, the Hidden Skill Finder tool, and any associated digital products (collectively, the "Services"). This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or engage our services.
        </p>
        <p className="legal-p">
          By using our Services, you agree to the practices described in this policy. If you do not agree, please discontinue use of our Services.
        </p>
        <div className="highlight-box">
          <p className="mono" style={{ fontSize:"11px", color:"#4DCFFF", letterSpacing:"2px", marginBottom:"8px" }}>// THE SHORT VERSION</p>
          <p className="legal-p" style={{ marginBottom:0 }}>
            We collect only what we need to serve you. We don't sell your data. We don't spam. You can request deletion of your data at any time by emailing <a className="legal-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </div>
      </section>

      <section id="collect">
        <h2 className="legal-h2">Information We Collect</h2>
        <h3 className="legal-h3">Information You Provide Directly</h3>
        <ul className="legal-ul">
          <li>Contact form submissions: name, email address, and message content</li>
          <li>Service inquiry details including business name, goals, and budget ranges</li>
          <li>Newsletter subscription: email address and subscription preferences</li>
          <li>Digital product purchases: name, email, and payment information (processed by third-party processors — we do not store raw card data)</li>
          <li>Hidden Skill Finder tool responses (processed in-session; we do not store individual quiz answers on our servers)</li>
          <li>Communications you initiate with us via email or social media</li>
        </ul>
        <h3 className="legal-h3">Information Collected Automatically</h3>
        <ul className="legal-ul">
          <li>IP address, browser type, device type, and operating system</li>
          <li>Pages visited, time on site, referral URLs, and click paths</li>
          <li>Cookie data and local storage identifiers (see Cookies section)</li>
          <li>Performance and error logs for site reliability purposes</li>
        </ul>
        <h3 className="legal-h3">Information From Third Parties</h3>
        <ul className="legal-ul">
          <li>Analytics data from Vercel Analytics and similar infrastructure providers</li>
          <li>Payment processor confirmations (Stripe or equivalent) — limited to transaction status</li>
          <li>beehiiv subscriber engagement data (open rates, click rates) for newsletter optimization</li>
        </ul>
      </section>

      <section id="use">
        <h2 className="legal-h2">How We Use Your Data</h2>
        <p className="legal-p">We use the information we collect for the following purposes:</p>
        <ul className="legal-ul">
          <li><strong style={{ color:"#94A3B8" }}>Service Delivery:</strong> To respond to inquiries, fulfill service agreements, and deliver digital products you've purchased</li>
          <li><strong style={{ color:"#94A3B8" }}>Communications:</strong> To send transactional emails, project updates, and — where you've opted in — our newsletter</li>
          <li><strong style={{ color:"#94A3B8" }}>Improvement:</strong> To analyze how our site and tools are used and to improve their quality and performance</li>
          <li><strong style={{ color:"#94A3B8" }}>Security:</strong> To detect and prevent fraudulent activity, abuse, or unauthorized access</li>
          <li><strong style={{ color:"#94A3B8" }}>Legal Compliance:</strong> To meet applicable legal obligations including tax and financial recordkeeping requirements</li>
          <li><strong style={{ color:"#94A3B8" }}>Marketing (opt-in only):</strong> To send promotional content to subscribers who have explicitly opted in — you can unsubscribe at any time</li>
        </ul>
        <div className="warn-box">
          <p className="legal-p" style={{ marginBottom:0 }}>We will never sell, rent, or trade your personal information to third-party advertisers or data brokers. Period.</p>
        </div>
      </section>

      <section id="share">
        <h2 className="legal-h2">Sharing &amp; Disclosure</h2>
        <p className="legal-p">We share your data only in the following limited circumstances:</p>
        <ul className="legal-ul">
          <li><strong style={{ color:"#94A3B8" }}>Service Providers:</strong> Trusted vendors who process data on our behalf (e.g., Vercel for hosting, beehiiv for email delivery, Stripe for payments). These providers are contractually bound to protect your data and use it only as directed by us.</li>
          <li><strong style={{ color:"#94A3B8" }}>Legal Requirements:</strong> If required by law, court order, or government regulation, or to protect the safety of users or the public</li>
          <li><strong style={{ color:"#94A3B8" }}>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your data may be transferred. We will notify you via the email address on file prior to any such transfer.</li>
          <li><strong style={{ color:"#94A3B8" }}>With Your Consent:</strong> For any other purpose with your explicit prior consent</li>
        </ul>
      </section>

      <section id="cookies">
        <h2 className="legal-h2">Cookies &amp; Tracking</h2>
        <p className="legal-p">
          We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings; however, disabling certain cookies may affect site functionality.
        </p>
        <h3 className="legal-h3">Types of Cookies We Use</h3>
        <ul className="legal-ul">
          <li><strong style={{ color:"#94A3B8" }}>Essential Cookies:</strong> Required for core site functions such as form submissions and navigation. Cannot be disabled.</li>
          <li><strong style={{ color:"#94A3B8" }}>Analytics Cookies:</strong> Used to understand traffic patterns and improve site performance (e.g., Vercel Analytics). Data is aggregated and anonymized where possible.</li>
          <li><strong style={{ color:"#94A3B8" }}>Preference Cookies:</strong> Store your settings and preferences for return visits.</li>
        </ul>
        <p className="legal-p">We do not use advertising cookies or cross-site behavioral tracking cookies.</p>
      </section>

      <section id="retention">
        <h2 className="legal-h2">Data Retention</h2>
        <p className="legal-p">We retain your personal data only as long as necessary for the purposes described in this policy:</p>
        <ul className="legal-ul">
          <li>Contact form submissions: up to 2 years for follow-up and legal documentation purposes</li>
          <li>Active client records: duration of the service engagement plus 3 years</li>
          <li>Newsletter subscriber data: until you unsubscribe plus 30 days for processing</li>
          <li>Transaction records: 7 years as required by U.S. tax law</li>
          <li>Analytics data: up to 24 months in aggregated form</li>
        </ul>
        <p className="legal-p">You may request earlier deletion of your data at any time (see Your Rights below), subject to legal retention requirements.</p>
      </section>

      <section id="rights">
        <h2 className="legal-h2">Your Rights</h2>
        <p className="legal-p">Depending on your location, you may have the following rights regarding your personal data:</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", margin:"16px 0 24px" }}>
          {["Access","Correction","Deletion","Portability","Restriction","Objection","Withdraw Consent"].map(r=>(
            <span key={r} className="chip">✓ {r}</span>
          ))}
        </div>
        <p className="legal-p">
          To exercise any of these rights, email us at <a className="legal-link" href={`mailto:${EMAIL}`}>{EMAIL}</a> with the subject line "Privacy Request." We will respond within 30 days. We may need to verify your identity before processing the request.
        </p>
        <p className="legal-p">
          If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA). If you are an EU/EEA resident, you have rights under the General Data Protection Regulation (GDPR), including the right to lodge a complaint with your local supervisory authority.
        </p>
      </section>

      <section id="security">
        <h2 className="legal-h2">Security</h2>
        <p className="legal-p">
          We implement industry-standard security measures to protect your data, including HTTPS/TLS encryption for all data in transit, secure hosting infrastructure via Vercel, limited access controls (only Cody Robichaud and authorized service providers have access to personal data), and regular security reviews of our tools and integrations.
        </p>
        <div className="warn-box">
          <p className="legal-p" style={{ marginBottom:0 }}>No method of transmission over the internet is 100% secure. While we strive to protect your data using commercially acceptable standards, we cannot guarantee absolute security. In the event of a data breach affecting your personal information, we will notify you within 72 hours of becoming aware of it.</p>
        </div>
      </section>

      <section id="third-party">
        <h2 className="legal-h2">Third-Party Services</h2>
        <p className="legal-p">Our Services integrate with the following third-party platforms. Each has its own privacy policy which governs their data practices:</p>
        <ul className="legal-ul">
          <li><strong style={{ color:"#94A3B8" }}>Vercel:</strong> Hosting and edge network — <a className="legal-link" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noreferrer">vercel.com/legal/privacy-policy</a></li>
          <li><strong style={{ color:"#94A3B8" }}>Anthropic (Claude API):</strong> Powers our AI chatbot and skill finder — <a className="legal-link" href="https://www.anthropic.com/privacy" target="_blank" rel="noreferrer">anthropic.com/privacy</a></li>
          <li><strong style={{ color:"#94A3B8" }}>beehiiv:</strong> Newsletter management — <a className="legal-link" href="https://www.beehiiv.com/privacy" target="_blank" rel="noreferrer">beehiiv.com/privacy</a></li>
          <li><strong style={{ color:"#94A3B8" }}>Gumroad:</strong> Digital product sales — <a className="legal-link" href="https://gumroad.com/privacy" target="_blank" rel="noreferrer">gumroad.com/privacy</a></li>
          <li><strong style={{ color:"#94A3B8" }}>Payment Processor:</strong> Secure payment handling — governed by their respective privacy policy</li>
        </ul>
        <p className="legal-p">We are not responsible for the privacy practices of third-party services. We encourage you to review their policies.</p>
      </section>

      <section id="children">
        <h2 className="legal-h2">Children's Privacy</h2>
        <p className="legal-p">
          Our Services are not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that a child under 13 has provided us personal data, we will delete it promptly. If you believe a child has submitted data to us, contact us at <a className="legal-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </section>

      <section id="changes">
        <h2 className="legal-h2">Policy Changes</h2>
        <p className="legal-p">
          We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this page. For material changes, we will provide notice via email (to subscribers) or a prominent notice on our website at least 14 days before the change takes effect. Your continued use of our Services after any change constitutes acceptance of the updated policy.
        </p>
      </section>

      <section id="contact-p">
        <h2 className="legal-h2">Contact Us</h2>
        <p className="legal-p">For privacy-related inquiries, requests, or concerns:</p>
        <div className="highlight-box">
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {[
              ["COMPANY", COMPANY],
              ["ADDRESS", ADDRESS],
              ["EMAIL",   EMAIL],
              ["WEBSITE", SITE],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", gap:"16px" }}>
                <span className="mono" style={{ fontSize:"11px", color:"#4DCFFF", minWidth:"80px", letterSpacing:"2px" }}>{l}</span>
                <span style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"15px", color:"#94A3B8" }}>
                  {l === "EMAIL" ? <a className="legal-link" href={`mailto:${v}`}>{v}</a> : v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── TERMS CONTENT ──────────────────────────────────────────── */
function TermsContent() {
  return (
    <div>
      <section id="acceptance">
        <h2 className="legal-h2">Acceptance of Terms</h2>
        <p className="legal-p">
          These Terms of Service ("Terms") govern your access to and use of the website located at {SITE}, and all related services, tools, digital products, and communications operated by {COMPANY} ("we," "us," or "our"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
        </p>
        <p className="legal-p">
          If you are using our Services on behalf of a business or organization, you represent that you have the authority to bind that entity to these Terms.
        </p>
        <div className="warn-box">
          <p className="legal-p" style={{ marginBottom:0 }}>
            <strong style={{ color:"#C9A84C" }}>Please read these Terms carefully.</strong> If you do not agree to any provision, you must not use our Services. Your continued use constitutes ongoing acceptance of any updated Terms.
          </p>
        </div>
      </section>

      <section id="services-t">
        <h2 className="legal-h2">Services Described</h2>
        <p className="legal-p">{COMPANY} provides the following categories of services and products:</p>
        <ul className="legal-ul">
          <li><strong style={{ color:"#94A3B8" }}>Digital Marketing Services:</strong> Social media management, content strategy, brand identity development, and related consulting engagements governed by separate service agreements</li>
          <li><strong style={{ color:"#94A3B8" }}>Website & Funnel Development:</strong> Design, development, and deployment of websites, landing pages, and conversion funnels under separate project agreements</li>
          <li><strong style={{ color:"#94A3B8" }}>Digital Products:</strong> Downloadable guides, worksheets, and templates sold via Gumroad or similar platforms</li>
          <li><strong style={{ color:"#94A3B8" }}>Free Tools:</strong> Web-based tools including the Hidden Skill Finder, provided at no cost with no guarantees of continued availability</li>
          <li><strong style={{ color:"#94A3B8" }}>Newsletter (R.I.F.T. Collective):</strong> Free subscription-based email publication — subject to unsubscribe rights at any time</li>
          <li><strong style={{ color:"#94A3B8" }}>AI Chatbot:</strong> Site-embedded AI assistant powered by Anthropic's Claude API — responses are informational only and do not constitute professional advice</li>
        </ul>
        <p className="legal-p">Specific service engagements (client work) are governed by individual Statements of Work or service agreements, which take precedence over these general Terms in the event of conflict.</p>
      </section>

      <section id="accounts">
        <h2 className="legal-h2">User Accounts</h2>
        <p className="legal-p">
          Some features of our Services may require account creation or registration. If you create an account, you agree to:
        </p>
        <ul className="legal-ul">
          <li>Provide accurate, current, and complete information during registration</li>
          <li>Maintain the security of your account credentials and not share them with third parties</li>
          <li>Notify us immediately at <a className="legal-link" href={`mailto:${EMAIL}`}>{EMAIL}</a> if you suspect unauthorized access</li>
          <li>Accept responsibility for all activity that occurs under your account</li>
        </ul>
        <p className="legal-p">We reserve the right to suspend or terminate accounts that violate these Terms, contain false information, or are involved in fraudulent or harmful activity.</p>
      </section>

      <section id="payment">
        <h2 className="legal-h2">Payment &amp; Billing</h2>
        <h3 className="legal-h3">Digital Products</h3>
        <p className="legal-p">
          Digital product purchases are final. Due to the nature of digital goods, we do not offer refunds once a product has been downloaded or accessed, except where required by applicable law or at our sole discretion in cases of demonstrable technical failure on our end.
        </p>
        <h3 className="legal-h3">Service Retainers &amp; Projects</h3>
        <p className="legal-p">
          Ongoing service retainers and project-based engagements are subject to the payment terms specified in your individual service agreement or Statement of Work. Generally:
        </p>
        <ul className="legal-ul">
          <li>Retainer fees are billed in advance on a monthly basis</li>
          <li>Project deposits are non-refundable once work has commenced</li>
          <li>Late payments may incur a 1.5% monthly service charge on overdue balances</li>
          <li>We reserve the right to pause or terminate services for non-payment after 14 days written notice</li>
        </ul>
        <h3 className="legal-h3">Payment Processing</h3>
        <p className="legal-p">
          All payments are processed by third-party payment processors. We do not store, transmit, or have access to your full payment card information. By making a purchase, you also agree to the applicable payment processor's terms of service.
        </p>
        <div className="highlight-box">
          <p className="legal-p" style={{ marginBottom:0 }}>All prices are listed in USD. We reserve the right to modify our pricing at any time. Price changes for active retainer clients will be communicated with a minimum of 30 days' notice.</p>
        </div>
      </section>

      <section id="ip">
        <h2 className="legal-h2">Intellectual Property</h2>
        <h3 className="legal-h3">Our Content</h3>
        <p className="legal-p">
          All content on this website — including but not limited to text, graphics, logos, brand assets, the R.I.F.T. framework name and methodology, website design, code, digital products, and the R.I.F.T. Collective newsletter — is the exclusive property of {COMPANY} and is protected by United States and international copyright, trademark, and intellectual property laws.
        </p>
        <p className="legal-p">You may not reproduce, distribute, modify, create derivative works from, publicly display, or exploit any of our content without our express prior written permission.</p>
        <h3 className="legal-h3">Client Work Product</h3>
        <p className="legal-p">
          Upon receipt of full payment, clients receive a license to use deliverables created specifically for their project as specified in their service agreement. {COMPANY} retains the right to display work in our portfolio unless explicitly agreed otherwise in writing.
        </p>
        <h3 className="legal-h3">Your Content</h3>
        <p className="legal-p">
          By submitting content to us (e.g., via contact forms, brief documents, brand assets for client projects), you grant us a limited, non-exclusive license to use that content solely to provide the requested services. You retain full ownership of your submitted content.
        </p>
      </section>

      <section id="conduct">
        <h2 className="legal-h2">Acceptable Use</h2>
        <p className="legal-p">You agree not to use our Services to:</p>
        <ul className="legal-ul">
          <li>Violate any applicable local, state, federal, or international law or regulation</li>
          <li>Transmit spam, phishing content, or unsolicited commercial communications</li>
          <li>Introduce viruses, malware, or other malicious or harmful code</li>
          <li>Attempt to gain unauthorized access to any portion of our Services or related systems</li>
          <li>Scrape, crawl, or data-mine our website or tools without written permission</li>
          <li>Impersonate {COMPANY}, our team, or any other person or entity</li>
          <li>Engage in conduct that restricts or inhibits any other user's use of the Services</li>
          <li>Use our AI tools to generate content intended to deceive, defraud, or harm others</li>
          <li>Reverse engineer, decompile, or attempt to extract source code from our proprietary tools</li>
        </ul>
        <p className="legal-p">Violation of this section may result in immediate termination of access and may be referred to appropriate authorities.</p>
      </section>

      <section id="disclaimer">
        <h2 className="legal-h2">Disclaimers</h2>
        <div className="warn-box">
          <p className="legal-p">
            OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p className="legal-p" style={{ marginBottom:0 }}>
            We do not warrant that our Services will be uninterrupted, error-free, or free of viruses or other harmful components. We do not guarantee specific results from our marketing services — results depend on many factors outside our control.
          </p>
        </div>
        <p className="legal-p">
          Content generated by our AI chatbot and tools is for informational purposes only and does not constitute legal, financial, medical, or professional advice. Always consult qualified professionals for decisions in those domains.
        </p>
      </section>

      <section id="liability">
        <h2 className="legal-h2">Limitation of Liability</h2>
        <p className="legal-p">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, {COMPANY.toUpperCase()} AND ITS OWNER SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
        </p>
        <ul className="legal-ul">
          <li>Your use of or inability to use our Services</li>
          <li>Any unauthorized access to or alteration of your data</li>
          <li>Statements or conduct of any third party on our Services</li>
          <li>Any other matter relating to our Services</li>
        </ul>
        <p className="legal-p">
          IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU EXCEED THE GREATER OF: (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) ONE HUNDRED U.S. DOLLARS ($100).
        </p>
        <p className="legal-p">Some jurisdictions do not allow certain liability limitations, so these may not fully apply to you.</p>
      </section>

      <section id="indemnity">
        <h2 className="legal-h2">Indemnification</h2>
        <p className="legal-p">
          You agree to defend, indemnify, and hold harmless {COMPANY} and its owner, officers, agents, and successors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of our Services, including but not limited to your User Content, any use of our tools' output, or your violation of any third-party right.
        </p>
      </section>

      <section id="termination">
        <h2 className="legal-h2">Termination</h2>
        <p className="legal-p">
          We reserve the right to suspend or terminate your access to our Services at any time, with or without cause, with or without notice, effective immediately. Reasons may include, but are not limited to, violation of these Terms, non-payment, or conduct harmful to other users or to us.
        </p>
        <p className="legal-p">
          You may terminate your use of our Services at any time by discontinuing access. To cancel active service engagements, refer to the cancellation terms in your individual service agreement (typically 30 days written notice).
        </p>
        <p className="legal-p">Upon termination, provisions of these Terms that by their nature should survive termination shall survive, including IP, disclaimer, limitation of liability, and indemnification sections.</p>
      </section>

      <section id="governing">
        <h2 className="legal-h2">Governing Law</h2>
        <p className="legal-p">
          These Terms are governed by and construed in accordance with the laws of the State of Oregon, United States, without regard to conflict of law principles. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Portland, Oregon.
        </p>
        <p className="legal-p">
          If any provision of these Terms is held invalid or unenforceable, the remaining provisions will continue in full force and effect. Our failure to enforce any right or provision shall not be deemed a waiver of that right or provision.
        </p>
        <div className="highlight-box">
          <p className="legal-p" style={{ marginBottom:0 }}>
            We encourage you to reach out before pursuing any formal dispute. Most issues can be resolved quickly through direct communication at <a className="legal-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </div>
      </section>

      <section id="contact-t">
        <h2 className="legal-h2">Contact Us</h2>
        <p className="legal-p">Questions about these Terms? Reach us at:</p>
        <div className="highlight-box">
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {[
              ["COMPANY", COMPANY],
              ["ADDRESS", ADDRESS],
              ["EMAIL",   EMAIL],
              ["WEBSITE", SITE],
            ].map(([l,v]) => (
              <div key={l} style={{ display:"flex", gap:"16px" }}>
                <span className="mono" style={{ fontSize:"11px", color:"#4DCFFF", minWidth:"80px", letterSpacing:"2px" }}>{l}</span>
                <span style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"15px", color:"#94A3B8" }}>
                  {l === "EMAIL" ? <a className="legal-link" href={`mailto:${v}`}>{v}</a> : v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── MAIN EXPORT ─────────────────────────────────────────────── */
export default function LegalPages() {
  const router = useRouter();
  const [tab, setTab] = useState("privacy");

  // Sync tab with ?tab= URL param
  useEffect(() => {
    const t = router.query.tab;
    if (t === "terms" || t === "privacy") setTab(t);
  }, [router.query.tab]);
  const [activeSection, setActiveSection] = useState("");
  const contentRef = useRef(null);

  const sections = tab === "privacy" ? PRIVACY_SECTIONS : TERMS_SECTIONS;

  useEffect(() => {
    setActiveSection(sections[0].id);
  }, [tab]);

  // Scroll spy
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handler = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = document.getElementById(sections[i].id);
        if (sec && sec.getBoundingClientRect().top <= 140) {
          setActiveSection(sections[i].id);
          return;
        }
      }
      setActiveSection(sections[0].id);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [tab, sections]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth", block:"start" });
    setActiveSection(id);
  };

  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);

  return (
    <div style={{ background:"#060B16", minHeight:"100vh" }}>
      <div className="scan-line" />
      <div className="grid-bg" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}/>

      <div style={{ position:"relative", zIndex:1 }}>

        {/* ── NAV ───────────────────────────────────── */}
        <nav style={{
          position:"sticky", top:0, zIndex:100,
          background:"rgba(6,11,22,.92)", backdropFilter:"blur(18px)",
          borderBottom:"1px solid rgba(77,207,255,.1)",
          padding:"0 40px", display:"flex", alignItems:"center",
          justifyContent:"space-between", gap:"20px", flexWrap:"wrap"
        }}>
          <a href="/" style={{ textDecoration:"none" }}>
            <span style={{
              fontFamily:"Orbitron,sans-serif", fontWeight:900,
              fontSize:"16px", letterSpacing:"3px"
            }} className="grad">R.I.F.T.</span>
          </a>
          <div style={{ display:"flex" }}>
            <button className={`tab-btn ${tab==="privacy"?"active":""}`} onClick={()=>setTab("privacy")}>
              Privacy Policy
            </button>
            <button className={`tab-btn ${tab==="terms"?"active":""}`} onClick={()=>setTab("terms")}>
              Terms of Service
            </button>
          </div>
          <a href="/" style={{ fontFamily:"Orbitron,sans-serif", fontSize:"10px", letterSpacing:"2px", color:"#4A5568", textDecoration:"none", transition:"color .2s" }}
            onMouseEnter={e=>e.currentTarget.style.color="#4DCFFF"}
            onMouseLeave={e=>e.currentTarget.style.color="#4A5568"}>
            ← BACK TO SITE
          </a>
        </nav>

        {/* ── HERO ──────────────────────────────────── */}
        <div style={{
          padding:"60px 40px 48px",
          borderBottom:"1px solid rgba(77,207,255,.08)",
          animation:"fadeUp .5s ease"
        }}>
          <div style={{ maxWidth:"900px", margin:"0 auto" }}>
            <span className="mono" style={{ fontSize:"10px", color:"#4DCFFF", letterSpacing:"4px", display:"block", marginBottom:"14px" }}>
              // LEGAL DOCUMENTATION · {COMPANY.toUpperCase()}
            </span>
            <h1 style={{
              fontFamily:"Orbitron,sans-serif", fontWeight:900,
              fontSize:"clamp(26px,5vw,52px)", color:"#E2E8F0",
              lineHeight:1.1, marginBottom:"16px"
            }}>
              {tab === "privacy" ? (
                <><span className="grad">PRIVACY</span> POLICY</>
              ) : (
                <>TERMS OF <span className="grad">SERVICE</span></>
              )}
            </h1>
            <div style={{ display:"flex", gap:"24px", flexWrap:"wrap", alignItems:"center" }}>
              <span className="mono" style={{ fontSize:"12px", color:"#4A5568" }}>
                Effective: {EFFECTIVE_DATE}
              </span>
              <span style={{ color:"#1F2937" }}>·</span>
              <span className="mono" style={{ fontSize:"12px", color:"#4A5568" }}>
                {COMPANY} · {ADDRESS}
              </span>
            </div>
          </div>
        </div>

        {/* ── LAYOUT ────────────────────────────────── */}
        <div style={{
          maxWidth:"1160px", margin:"0 auto",
          padding:"48px 40px 100px",
          display:"grid",
          gridTemplateColumns:"220px 1fr",
          gap:"56px",
          alignItems:"start"
        }}>

          {/* TOC sidebar */}
          <aside className="hide-desk" style={{
            position:"sticky", top:"80px",
            background:"rgba(14,26,52,.5)",
            border:"1px solid rgba(77,207,255,.12)",
            backdropFilter:"blur(12px)",
            padding:"20px 0"
          }}>
            <div className="mono" style={{ fontSize:"9px", color:"#4DCFFF", letterSpacing:"4px", padding:"0 20px 14px", borderBottom:"1px solid rgba(77,207,255,.1)", marginBottom:"10px" }}>
              CONTENTS
            </div>
            {sections.map(s => (
              <button
                key={s.id}
                className={`toc-link ${activeSection===s.id?"active":""}`}
                onClick={() => scrollToSection(s.id)}
                style={{ width:"100%", background:"none", border:"none", textAlign:"left", display:"block" }}
              >
                {s.label}
              </button>
            ))}
            <div style={{ margin:"20px 16px 0", padding:"14px", background:"rgba(170,255,0,.04)", border:"1px solid rgba(170,255,0,.15)" }}>
              <div className="mono" style={{ fontSize:"9px", color:"#AAFF00", letterSpacing:"2px", marginBottom:"8px" }}>QUESTIONS?</div>
              <a href={`mailto:${EMAIL}`} style={{ fontFamily:"Rajdhani,sans-serif", fontSize:"12px", color:"#8892A4", textDecoration:"none", wordBreak:"break-all" }}>{EMAIL}</a>
            </div>
          </aside>

          {/* Content */}
          <main ref={contentRef} style={{ minWidth:0 }}>
            {tab === "privacy" ? <PrivacyContent /> : <TermsContent />}

            {/* bottom nav */}
            <div style={{
              marginTop:"64px", padding:"28px 0",
              borderTop:"1px solid rgba(77,207,255,.1)",
              display:"flex", justifyContent:"space-between",
              alignItems:"center", flexWrap:"wrap", gap:"16px"
            }}>
              <span className="mono" style={{ fontSize:"11px", color:"#374151" }}>
                © {new Date().getFullYear()} {COMPANY}. All rights reserved.
              </span>
              <div style={{ display:"flex", gap:"20px" }}>
                <button
                  onClick={() => { setTab(tab==="privacy"?"terms":"privacy"); window.scrollTo(0,0); }}
                  style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"Orbitron,sans-serif", fontSize:"10px", letterSpacing:"2px", color:"#4A5568", transition:"color .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color="#4DCFFF"}
                  onMouseLeave={e=>e.currentTarget.style.color="#4A5568"}
                >
                  {tab==="privacy" ? "TERMS OF SERVICE →" : "← PRIVACY POLICY"}
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
