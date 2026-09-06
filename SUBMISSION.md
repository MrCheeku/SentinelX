# NVIDIA Submission Notes

## Project

**SENTINELX — Your Personal AI Security Copilot**

## One-line pitch

SENTINELX performs deterministic credential-risk analysis locally, then uses an NVIDIA open-source model through a server-side AI gateway to explain risks and recommend practical remediation without sending plaintext vault credentials.

## What to demonstrate

1. Open the app in Demo Mode.
2. Show the local security score and findings for weak, reused, and stale synthetic credentials.
3. Run **Analyze with AI** and show that only aggregate security metadata is sent to the AI endpoint.
4. Open **Sentinel AI** and ask which risk should be fixed first.
5. Use **Fix risk** or the secure generator to rotate a synthetic credential.
6. Rescan and show the posture improving.

## AI integration

The default backend configuration targets Nebius Token Factory with an NVIDIA open-source model. The model and OpenAI-compatible base URL are configurable through environment variables; no provider credential is stored in source control.

## Privacy and security design

The browser holds only synthetic demo credentials. The AI boundary accepts security metadata and rejects common credential and secret-bearing keys/markers. AI failures fall back to deterministic local recommendations so the security workflow remains available.

## Important demo limitation

SENTINELX is a hackathon/demo application, not a production password manager. Demo data is synthetic and browser-memory based. Do not enter real passwords or secrets.

## Repository checklist

- `README.md` explains the architecture and setup.
- `.env.example` contains placeholders only.
- `.gitignore` excludes `.env`, dependencies, build output, and logs.
- `tests/security.test.ts` covers the local security engine and privacy boundary.
- `SECURITY.md` documents the security model and reporting guidance.
- `docs/ARCHITECTURE.md` documents the AI/data flow.
- `LICENSE` permits reuse under MIT terms.
