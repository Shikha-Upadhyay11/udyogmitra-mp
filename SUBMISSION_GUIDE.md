# Hack2Skill Prototype Submission Guide — UdyogMitra MP

Everything below is copy-paste ready and checked against Hack2Skill's **1,024-character limit**.

---

## 1. Challenges (Dropdown)
Select: **The Rise of New India**

---

## 2. Prototype Brief *(948 characters — under 1,024 limit)*
```text
UdyogMitra MP is a Hindi/Hinglish voice-first AI Operating System and hyper-local SkillBridge built for MSMEs in the Indore–Pithampur–Dewas industrial belt and scalable across Bharat.

Over 80% of Tier-2/3 MSMEs still rely on paper ledgers—blocking GST compliance, B2B growth, and formal working capital—while local ITI/polytechnic youth migrate to metros despite nearby factory skill shortages.

Our working prototype solves both in one closed loop:
1) Voice MSME Copilot & Bill OCR: Owners speak in Hindi/Hinglish (e.g., "Pithampur Auto Parts ko 500 gear shafts bheje, 85000, 30 din udhaar") to auto-generate MP GST invoices (CGST+SGST), update stock, and sync ledgers.
2) UdyogTrust Cash-Flow Credit: Real-time digital trails build a 300–900 credit score for instant OCEN/SIDBI working capital.
3) ONDC B2B Store: 1-click catalog publishing & buyer RFQs.
4) Indore–MP SkillBridge: Matches factory hiring gaps to nearby ITI youth via 2-week NAPS micro-apprenticeships & digital credentials.
```

---

## 3. What is the tech stack being used in your solution? *(691 characters — under 1,024 limit)*
```text
Frontend & UI: React 18, TypeScript, Vite, Tailwind CSS, Lucide React (bilingual English/Hindi interface with printable GST invoice engine).

Voice AI & Extraction: Browser Web Speech API (hi-IN / en-IN live voice capture), custom Hinglish/Hindi MSME NLP entity parser (extracts Party, HSN, Qty, CGST/SGST 9%+9%, Credit Terms) with Handwritten Bill OCR workflow.

India DPI & Architecture Readiness: Designed for GSTN e-Invoicing (MP State Code 23), Account Aggregator & OCEN 4.0 cash-flow lending, ONDC B2B seller catalog integration, and Skill India / NAPS Verifiable Credentials.

Hosting & CI/CD: GitHub Public Repository + Vercel Edge Deployment for zero-latency web and mobile access.
```

---

## 4. How to Push to GitHub (Public Repo) & Deploy Free on Vercel

### Step A — Push to GitHub
1. Create a **new Public repository** on GitHub named `udyogmitra-mp` (do NOT initialize with README).
2. Open PowerShell inside this project folder and run:
```powershell
git init
git add .
git commit -m "Initial commit: UdyogMitra MP prototype"
git branch -M main
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/udyogmitra-mp.git
git push -u origin main
```
3. Paste `https://github.com/<YOUR-GITHUB-USERNAME>/udyogmitra-mp` into **GitHub Public Repository Link**.

### Step B — Deploy Live on Vercel (1 Minute)
1. Go to https://vercel.com → Sign in with GitHub → **Add New Project** → Import `udyogmitra-mp`.
2. Leave defaults (`Vite` is auto-detected) → Click **Deploy**.
3. Copy your live URL (e.g. `https://udyogmitra-mp.vercel.app`) into **Deployed Link**.

---

## 5. How to Export Your Solution Deck PDF (< 5 MB)
1. Open `deck/UdyogMitra-MP-Deck.html` in Google Chrome or Microsoft Edge.
2. Press **Ctrl + P** (Print).
3. Choose **Destination: Save as PDF**, **Layout: Landscape**, **Margins: None**, and enable **Background graphics**.
4. Save as `UdyogMitra-MP-Solution-Deck.pdf` (~300 KB, well under the 5 MB limit) and upload it to Hack2Skill!

---

## 6. 2-Minute Demo Video Script (Record with OBS / Loom / Clipchamp)
- **0:00–0:20 (Hook):** "Namaste! I'm presenting **UdyogMitra MP** for *The Rise of New India*. In the Indore–Pithampur–Dewas industrial belt, 80% of small MSMEs still use paper parchis—missing out on formal credit—while local ITI youth struggle to find jobs nearby. UdyogMitra MP solves both."
- **0:20–0:55 (Tab 1 — Voice Copilot):** Toggle Hindi/English briefly. Click a 1-click Hinglish voice preset (or use the live mic). Show instant extraction of Party, HSN, CGST+SGST → click **Confirm & Generate GST Invoice** → show the printable MP GST Tax Invoice and live stock update.
- **0:55–1:20 (Tab 2 — Cash-Flow Credit):** Switch to **Cash-Flow Credit**. Point out how the **UdyogTrust Score** updated automatically from the new invoice, adjust the working-capital slider, and click **1-Click Apply** on SIDBI GST Sahay.
- **1:20–1:35 (Tab 3 — ONDC B2B):** Switch to **ONDC B2B Store**. Toggle an item live on ONDC and click **Send AI Quote** on the Bhopal EV buyer RFQ.
- **1:35–2:00 (Tab 4 — Indore–MP SkillBridge & Close):** Switch to **Indore–MP SkillBridge**. Show AI-detected CNC/QC skill gaps and matched candidates from Govt. ITI Nanda Nagar & Govt. ITI Pithampur. Click **Assign 2-Week Micro-Apprenticeship** to issue a Verifiable Credential. Close: "Starting with Indore and Madhya Pradesh, UdyogMitra scales to 100+ industrial clusters across New India. Thank you!"
