<div align="center">

<a href="https://github.com/MrCheeku"><img src="https://avatars.githubusercontent.com/u/235286067?v=4" width="96" height="96" alt="Mr.Cheeku GitHub avatar" /></a>

# 🛡️ SENTINELX

### Your Personal AI Security Copilot

<p><strong>Detect risks • Understand them with AI • Fix them immediately</strong></p>

<a href="https://github.com/MrCheeku"><img src="https://img.shields.io/badge/ENGINEERED%20BY-Mr.Cheeku-111827?style=for-the-badge&logo=github&logoColor=white" alt="Engineered by Mr.Cheeku" /></a>

</div>

---

## 🛡️ What is SENTINELX?

**SENTINELX** is a privacy-first cybersecurity web application that combines deterministic local security analysis with an AI-powered security copilot.

> **Secrets stay local. Sanitized security metadata can be analyzed by AI.**

The local engine handles measurable checks such as password strength, reuse, freshness, and vault hygiene. The AI layer explains findings, prioritizes risks, and turns them into practical next steps.

## ✨ Highlights

| Capability | What it does |
|---|---|
| **Security Dashboard** | Shows a 0–100 security posture score and current risk summary. |
| **Security Scan** | Detects weak, reused, stale, and incomplete credentials locally. |
| **Sentinel AI** | Explains security findings and creates prioritized recommendations. |
| **Fix with Generator** | Moves directly from a detected risk to a stronger generated credential. |
| **Credential Vault** | Stores and manages credentials with masked secrets. |
| **Secure Generator** | Generates high-entropy passwords using browser cryptographic randomness. |
| **Demo Mode** | Uses synthetic accounts for safe demonstrations. |
| **Privacy Center** | Shows what non-secret metadata can cross the AI boundary. |
| **AI Fallback** | Local security analysis continues when AI inference is unavailable. |
| **Encrypted Backups** | Supports local backup and restore workflows. |

## ✨ Core Experience

```text
Scan → Review Security → Generate AI Insight → Fix Risk → Rescan
```

## 🧰 Tech Stack

<div align="center">

### Frontend
<img src="https://skillicons.dev/icons?i=react,typescript,vite,tailwind" alt="React, TypeScript, Vite, Tailwind CSS" />

### Backend
<img src="https://skillicons.dev/icons?i=nodejs,express" alt="Node.js, Express" />

### AI & Infrastructure
<img src="https://img.shields.io/badge/Nebius-Token%20Factory-111827?style=flat-square" alt="Nebius Token Factory" />
<img src="https://img.shields.io/badge/NVIDIA-Open%20Source%20Model-76B900?style=flat-square" alt="NVIDIA Open Source Model" />

### Security
<img src="https://img.shields.io/badge/Web%20Crypto%20API-Local%20CSPRNG-2563eb?style=flat-square" alt="Web Crypto API" />
<img src="https://img.shields.io/badge/Privacy-Sanitized%20AI%20Payloads-dc2626?style=flat-square" alt="Privacy-safe AI payloads" />

</div>

## 🧭 Project Structure

```mermaid
flowchart TB
    A[🛡️ SENTINELX] --> B[🖥️ Web UI]
    B --> C[🔍 Local Security Engine]
    C --> D[🔒 Privacy Sanitizer]
    D --> E[⚙️ Express Backend]
    E --> F[☁️ Nebius Token Factory]
    F --> G[🧠 NVIDIA Open-Source Model]
    G --> H[🤖 Sentinel AI / Security Report]
    H --> I[✅ Fix Risk + Rescan]
    I --> C

    classDef root fill:#7c3aed,stroke:#c4b5fd,color:#ffffff,stroke-width:3px;
    classDef ui fill:#2563eb,stroke:#93c5fd,color:#ffffff,stroke-width:2px;
    classDef local fill:#059669,stroke:#6ee7b7,color:#ffffff,stroke-width:2px;
    classDef privacy fill:#dc2626,stroke:#fca5a5,color:#ffffff,stroke-width:2px;
    classDef backend fill:#475569,stroke:#cbd5e1,color:#ffffff,stroke-width:2px;
    classDef ai fill:#d97706,stroke:#fcd34d,color:#ffffff,stroke-width:2px;
    classDef result fill:#0891b2,stroke:#67e8f9,color:#ffffff,stroke-width:2px;

    class A root;
    class B ui;
    class C local;
    class D privacy;
    class E backend;
    class F,G ai;
    class H,I result;

    linkStyle default stroke:#94a3b8,stroke-width:2px;
```

## 🛡️ Security Design

SENTINELX separates **deterministic security facts** from **AI interpretation**. Plaintext passwords, master passwords, encryption keys, raw vault exports, and private credential notes are not sent to the AI layer.

## ☁️ Nebius + NVIDIA AI

The Express backend proxies AI requests to **Nebius Token Factory / Nebius AI Cloud** using an NVIDIA open-source model. Provider credentials remain server-side.

```text
GET  /api/health
POST /api/ai/health
POST /api/security/analyze
POST /api/security/chat
```

## 🚀 Getting Started

```bash
git clone https://github.com/MrCheeku/SentinelX-Clean.git
cd SentinelX-Clean
npm install
npm run dev
```

Create `.env` from `.env.example` and add your own Nebius credentials. Never commit `.env`.

## 🧪 Testing

The project includes verification coverage for local scoring, password checks, reuse detection, credential staleness, vault hygiene, CSPRNG generation, privacy sanitization, backup serialization, and AI proxy/fallback behavior.

## 🧭 Roadmap

- [x] Local security scoring
- [x] Credential risk detection
- [x] Secure password generation
- [x] Privacy-safe AI payloads
- [x] Nebius backend integration
- [x] Sentinel AI workflow
- [x] Demo Mode
- [x] AI fallback behavior
- [ ] Expanded breach intelligence
- [ ] Passkey / WebAuthn support

## 🌐 Official Links

<div align="center">
<a href="https://techwithcheeku.lovable.app/"><img src="https://img.shields.io/badge/Visit%20Tech%20with%20Cheeku-Website-2563eb?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Visit Tech with Cheeku website" /></a>
<a href="https://whatsapp.com/channel/0029Vb9OpwgD8SDvISwrn73Y"><img src="https://img.shields.io/badge/Join%20WhatsApp%20Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Join WhatsApp Channel" /></a>
</div>

## 👨‍💻 Engineered By

<div align="center">
<a href="https://github.com/MrCheeku"><img src="https://avatars.githubusercontent.com/u/235286067?v=4" width="88" height="88" alt="Mr.Cheeku GitHub avatar" /></a>

### **Mr.Cheeku**

<a href="https://github.com/MrCheeku"><img src="https://img.shields.io/badge/Visit%20Developer%20Profile-↗-111827?style=for-the-badge&logo=github&logoColor=white" alt="Visit Mr.Cheeku's GitHub profile" /></a>
<br /><br />
<a href="https://discord.gg/GWJvzcxuN"><img src="https://img.shields.io/badge/Join%20My%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Join Discord" /></a>
</div>

---

<div align="center">
<a href="https://github.com/MrCheeku/SentinelX-Clean/issues">Report an issue</a> •
<a href="https://github.com/MrCheeku/SentinelX-Clean">View source</a> •
<a href="https://github.com/MrCheeku/SentinelX-Clean/releases">View releases</a> •
<a href="https://github.com/MrCheeku">Developer profile</a>

<br /><br />

### 🛡️ SENTINELX
**Detect • Understand • Fix**
</div>
