# UdyogMitra MP — Voice-First AI OS & Local SkillBridge for Indore–Pithampur MSMEs

> **Challenge:** The Rise of New India (Indore & MP · Bharat · Regional Growth)

**UdyogMitra MP** is a zero-training, Hindi/Hinglish voice-first AI operating system built for Tier-2/3 manufacturing and trading MSMEs in the **Indore–Pithampur–Dewas industrial belt**—fusing vernacular digitization, instant cash-flow credit, ONDC B2B market access, and hyper-local ITI/polytechnic skilling into one closed-loop regional growth engine.

---

## The Twin Problem in MP's Industrial Hubs
1. **Digital & Credit Exclusion:** Over 80% of small MSMEs in Pithampur, Sanwer Road, and Dewas still operate on paper parchis and WhatsApp messages, leading to GST friction, missed national B2B orders, and inability to access collateral-free working capital.
2. **Local Talent Mismatch & Migration:** Thousands of youth graduate from MP's ITIs and polytechnics every year and migrate to metros—while local factories right next door struggle to find job-ready CNC operators, QC inspectors, and GST billing assistants.

---

## Core Prototype Modules
1. **Voice-First MSME Copilot (Hindi / Hinglish / English + Bill OCR)**
   - Live browser microphone (`Web Speech API`) + 1-click Hinglish voice presets + Handwritten Bill OCR simulator.
   - Extracts Party, HSN Code, Quantity, CGST (9%) + SGST (9%), and Credit Terms to auto-generate printable **GST-compliant Tax Invoices** and update real-time shop-floor inventory.
2. **UdyogTrust Cash-Flow Credit Engine (OCEN / Account Aggregator Ready)**
   - Dynamically recalculates an MSME's **UdyogTrust Score (300–900)** with every logged invoice/UPI collection.
   - Interactive collateral-free working-capital simulator with SIDBI GST Sahay & MPFC credit offers.
3. **ONDC B2B & Spare-Capacity Storefront**
   - 1-click catalog publishing to ONDC B2B and AI-matched incoming buyer RFQs from Bhopal, Dewas, and Pune.
4. **Hyper-Local Indore–MP SkillBridge**
   - Translates rising factory order volume into **2-week NAPS micro-apprenticeships** matched with verified students from **Govt. ITI Nanda Nagar (Indore), Govt. ITI Pithampur, SGSITS Polytechnic, and Govt. Women ITI Indore**, complete with Verifiable Digital Credentials.

---

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Voice & NLP Engine:** Web Speech API (`hi-IN` / `en-IN`), Deterministic Hinglish MSME Entity Parser (offline-resilient, zero-latency)
- **DPI & India Stack Architecture:** GSTN e-Invoicing (State Code 23 - MP), Account Aggregator / OCEN 4.0 credit schema, ONDC B2B seller catalog, Skill India / NAPS Verifiable Credentials
- **Deployment:** Vercel / Netlify static edge hosting

---

## Run Locally
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
```

---

## Pilot Roadmap (Indore & MP → Bharat)
- **Phase 1 (Months 1–3):** Pilot with 100 MSMEs in Pithampur Sector-3 & Sanwer Road (Indore) + 4 local ITIs.
- **Phase 2 (Months 4–9):** Expand across Dewas, Ujjain, Bhopal & Gwalior clusters with live ONDC & NBFC APIs.
- **Phase 3 (Year 2+):** Replicate across 100+ Tier-2/3 industrial clusters across Bharat.
