<div align="center">

<img src="assets/header.svg" alt="SentinelX — AI-assisted defensive security copilot" width="100%" />

<p>
  <a href="https://github.com/MrCheeku/SentinelX"><img src="https://img.shields.io/github/stars/MrCheeku/SentinelX?style=for-the-badge&label=STARS&cacheSeconds=60&v=0" alt="GitHub stars" /></a>
  <a href="https://github.com/MrCheeku/SentinelX"><img src="https://img.shields.io/github/last-commit/MrCheeku/SentinelX?style=for-the-badge&label=UPDATED" alt="Last commit" /></a>
  <a href="https://github.com/MrCheeku/SentinelX"><img src="https://img.shields.io/github/repo-size/MrCheeku/SentinelX?style=for-the-badge&label=SIZE" alt="Repository size" /></a>
</p>

<p><strong>Detect risk • Understand it with AI • Fix it • Rescan</strong></p>

<a href="https://github.com/MrCheeku"><img src="https://img.shields.io/badge/ENGINEERED%20BY-Mr.Cheeku-111827?style=for-the-badge&logo=github&logoColor=white" alt="Engineered by Mr.Cheeku — open GitHub profile" /></a>

</div>

---

## 🛡️ What is SentinelX?

**SentinelX** is a privacy-first cybersecurity web application that separates measurable security checks from AI interpretation. The browser-side engine calculates security posture locally, while only sanitized, non-secret security metadata is sent to the AI boundary for explanation and prioritization.

> **Demo rule:** use synthetic credentials only. Never enter real passwords, API keys, tokens, or other secrets.

### ✨ Highlights

| Capability | What it does |
|---|---|
| **Local Security Scan** | Runs deterministic checks for weak, reused, and stale synthetic credentials directly in the browser. |
| **Security Posture** | Produces a 0–100 security score with concrete findings and remediation priorities. |
| **Sentinel AI** | Uses an NVIDIA open-source model through the configured AI gateway to explain security findings. |
| **Privacy Boundary** | Blocks common secret-bearing fields and markers before upstream inference. |
| **Secure Generator** | Generates 16–128 character synthetic credentials using browser Web Crypto. |
| **Fix Risk** | Rotates a synthetic demo credential and lets the user rescan immediately. |
| **Deterministic Fallback** | Keeps local remediation guidance available when AI inference is unavailable. |
| **Test Coverage** | Covers scoring, sanitization, privacy blocking, and credential generation. |

---

## ✨ Core Experience

```text
Scan → Score Risk → Explain with AI → Fix Finding → Rescan
```

SentinelX combines a local security engine, privacy boundary, AI gateway, and remediation workflow into one focused defensive-security experience.

---

## 🧰 Tech Stack

<div align="center">

### Frontend & UI
<img src="https://skillicons.dev/icons?i=react,typescript,vite,tailwind" alt="React, TypeScript, Vite, Tailwind CSS" />

### Backend & API
<img src="https://skillicons.dev/icons?i=nodejs,express" alt="Node.js and Express" />
<img src="https://img.shields.io/badge/dotenv-Configuration-111827?style=flat-square" alt="dotenv" />

### AI
<img src="https://img.shields.io/badge/Nebius%20Token%20Factory-AI%20Gateway-111827?style=flat-square" alt="Nebius Token Factory" />
<img src="https://img.shields.io/badge/NVIDIA-Open--Source%20Model-76B900?style=flat-square&logo=nvidia&logoColor=white" alt="NVIDIA open-source model" />

### Security
<img src="https://img.shields.io/badge/Web%20Crypto-Local%20Generation-7c3aed?style=flat-square" alt="Web Crypto API" />
<img src="https://img.shields.io/badge/Privacy%20Boundary-Sanitized%20Metadata-DC2626?style=flat-square" alt="Privacy boundary" />
<img src="https://img.shields.io/badge/Deterministic%20Fallback-Local%20Analysis-059669?style=flat-square" alt="Deterministic fallback" />

</div>

---

## 🧭 Project Structure

> 🎨 **Interactive Mermaid architecture:** every major layer has its own color, arrows show how the system connects, and the compact top-to-bottom layout is designed for smaller screens.

```mermaid
flowchart TB
    A[🛡️ SentinelX] --> B[🖥️ Browser UI]
    B --> C[🔎 Local Security Engine]
    C --> D[🔒 Sanitized Security Metadata]
    D --> E[⚙️ Express API]
    E --> F[☁️ Nebius Token Factory]
    F --> G[🧠 NVIDIA Open-Source Model]
    G --> H[🤖 Sentinel AI Report]
    H --> I[✅ Fix + Rescan]
    I --> C

    classDef root fill:#7c3aed,stroke:#c4b5fd,color:#ffffff,stroke-width:3px;
    classDef app fill:#2563eb,stroke:#93c5fd,color:#ffffff,stroke-width:2px;
    classDef source fill:#0891b2,stroke:#67e8f9,color:#ffffff,stroke-width:2px;
    classDef privacy fill:#dc2626,stroke:#fca5a5,color:#ffffff,stroke-width:2px;
    classDef backend fill:#475569,stroke:#cbd5e1,color:#ffffff,stroke-width:2px;
    classDef ai fill:#059669,stroke:#6ee7b7,color:#ffffff,stroke-width:2px;
    classDef result fill:#d97706,stroke:#fcd34d,color:#ffffff,stroke-width:2px;

    class A root;
    class B app;
    class C source;
    class D privacy;
    class E backend;
    class F,G ai;
    class H,I result;

    linkStyle default stroke:#94a3b8,stroke-width:2px;
```

### 📱 Mobile-friendly note

This is **real Mermaid source — not a picture**. The compact `TB` layout keeps the hierarchy narrow, but GitHub controls Mermaid rendering in each client. If the GitHub Android app displays the Mermaid source instead of the rendered diagram, that is a limitation of that app/version and cannot be forced by README code.

<details>
<summary>📂 View Project Structure as Text</summary>

```text
🛡️ SentinelX
│
├── 🖥️ src/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── security.ts
│
├── 🧪 tests/
│   └── security.test.ts
│
├── 📚 docs/
│   └── ARCHITECTURE.md
│
├── 🎨 assets/
│   ├── header.svg
│   └── footer.svg
│
├── 🔑 .env.example
├── 🛡️ SECURITY.md
├── 🏆 SUBMISSION.md
├── 📄 LICENSE
├── 📦 package.json
├── ⚙️ server.ts
└── ⚙️ vite.config.ts
```

</details>

### 🔄 How the pieces connect

```text
🖥️ Browser UI
    │
    ├── 🔎 Local Security Engine ────► Score + Findings
    │             │
    │             └──────────────────► Sanitized Metadata
    │                                      │
    └──────────────────────────────────────┴──► ⚙️ Express API
                                                   │
                                                   ▼
                                             ☁️ AI Gateway
                                                   │
                                                   ▼
                                             🧠 NVIDIA Model
                                                   │
                                                   ▼
                                             🤖 AI Report
                                                   │
                                                   ▼
                                             ✅ Fix + Rescan
```

The structure keeps **UI**, **security logic**, **API**, **AI integration**, and **documentation** separated so contributors can locate each responsibility quickly.

---

## 🔐 Security Design

SentinelX currently implements several concrete defensive mechanisms:

- Security posture scoring and credential checks run locally in the browser.
- The AI boundary accepts sanitized security metadata rather than raw credential records for analysis.
- Common secret-bearing keys such as `password`, `api_key`, `access_token`, and `private_key` are rejected by the privacy boundary.
- Credential generation uses the browser **Web Crypto API**.
- AI failures return deterministic local guidance rather than exposing internal provider errors.

See [`SECURITY.md`](SECURITY.md) and [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for implementation details.

This README describes the current showcase implementation and is not a claim of independent security auditing.

---

## 🚀 Getting Started

### Requirements

- Node.js with npm
- A modern browser
- Optional AI-provider credentials configured locally for the AI features

### Install dependencies

```bash
npm install
```

### Configure the AI provider

Copy `.env.example` to `.env` and provide your own credentials locally.

```bash
cp .env.example .env
```

> Never commit `.env` or provider credentials.

### Run development mode

```bash
npm run dev
```

Then open the local URL shown by the development server.

### Verify the project

```bash
npm run lint
npm test
npm run build
```

---

## 🧪 Testing

The test suite in [`tests/security.test.ts`](tests/security.test.ts) validates the shared security engine, including deterministic scoring, sanitized metadata generation, secret detection, privacy blocking, and Web Crypto credential generation.

```bash
npm test
```

---

## ⚠️ Demo Limitations

SentinelX is currently a **showcase/hackathon application**, not a production password manager. Demo credentials live in browser memory and are synthetic. Persistent encrypted vault storage, real breach intelligence, enterprise identity controls, and production-grade secret management are outside the current scope.

---

## 🗺️ Roadmap

- [x] Local credential posture scoring
- [x] Weak/reused/stale risk detection
- [x] Web Crypto credential generation
- [x] Privacy-safe AI metadata boundary
- [x] NVIDIA model integration through configurable provider gateway
- [x] Deterministic AI fallback
- [x] Automated security/privacy tests
- [ ] Encrypted persistent vault
- [ ] Passkey / WebAuthn support
- [ ] Breach-intelligence integrations
- [ ] Production authentication and audit logging

---

## 🌐 Official Links

<div align="center">

<a href="https://techwithcheeku.lovable.app/"><img src="https://img.shields.io/badge/Visit%20Tech%20with%20Cheeku-Website-7c3aed?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Visit Tech with Cheeku website" /></a>

<a href="https://whatsapp.com/channel/0029Vb9OpwgD8SDvISwrn73Y"><img src="https://img.shields.io/badge/Join%20WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Join Tech with Cheeku WhatsApp channel" /></a>

<a href="https://discord.gg/GWJvzcxuN"><img src="https://img.shields.io/badge/Join%20My%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Join My Discord" /></a>

</div>

---

## 👨‍💻 Engineered By

<div align="center">

<a href="https://github.com/MrCheeku"><img src="https://avatars.githubusercontent.com/u/235286067?v=4" width="88" height="88" alt="Mr.Cheeku GitHub avatar" /></a>

### **Mr.Cheeku**

<a href="https://github.com/MrCheeku"><img src="https://img.shields.io/badge/Visit%20Developer%20Profile-↗-111827?style=for-the-badge&logo=github&logoColor=white" alt="Visit Mr.Cheeku's GitHub profile" /></a>

</div>

---

<div align="center">

<a href="https://github.com/MrCheeku/SentinelX/issues">Report an issue</a>
&nbsp;•&nbsp;
<a href="https://github.com/MrCheeku/SentinelX">View source</a>
&nbsp;•&nbsp;
<a href="https://github.com/MrCheeku">Developer profile</a>

<br /><br />

<img src="assets/footer.svg" alt="SentinelX footer — AI-assisted defensive security, engineered by Mr.Cheeku" width="100%" />

</div>

<!-- LIVE_STARS: 0 | automatically synced 2026-09-10T19:54:20.158Z -->
