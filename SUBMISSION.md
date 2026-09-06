# NVIDIA Submission Notes

## Project

**SENTINELX — Your Personal AI Security Copilot**

## Recommended track

**Best Apps and Agents Track** — SENTINELX is a practical cybersecurity copilot that performs a local security scan, explains findings with an NVIDIA open-source model through Nebius Token Factory, and guides the user through remediation and rescanning.

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

The backend makes runtime inference calls to **Nebius Token Factory** using an OpenAI-compatible API and a configurable NVIDIA open-source model. The default model is `nvidia/Llama-3.1-Nemotron-70B-Instruct`; the model and base URL are configurable through environment variables. No provider credential is stored in source control.

## Privacy and security design

The browser holds only synthetic demo credentials. The AI boundary accepts security metadata and rejects common credential and secret-bearing keys/markers. AI failures fall back to deterministic local recommendations so the security workflow remains available.

## Hackathon compliance checklist

- [x] Working web application source code is included in the public repository.
- [x] Nebius Token Factory integration is implemented as a runtime server-side API call.
- [x] An NVIDIA open-source model is configurable and used by the AI gateway.
- [x] Public GitHub repository.
- [x] MIT open-source license.
- [x] README includes setup and run instructions.
- [x] Architecture and privacy boundary are documented.
- [x] Automated type-checking, security tests, and production-build CI are included.
- [ ] Working public demo URL entered on Devpost.
- [ ] Public YouTube demo video (3 minutes or less) entered on Devpost.
- [ ] Devpost feedback section completed.
- [ ] Final written project description completed on Devpost.

## Existing-project disclosure

If SentinelX existed before the hackathon Submission Period, the Devpost submission must describe the significant work completed after **August 26, 2026**, such as the privacy boundary, NVIDIA/Nebius runtime integration, security test suite, CI verification, submission documentation, and related architecture improvements. Do not claim a pre-existing-project exemption without matching the actual project history.

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

## Devpost evidence to capture

For the final submission, keep screenshots or video evidence of:

- the local security score before remediation;
- an AI analysis response showing the selected model/provider;
- the fix/generate/rescan flow;
- the repository README and MIT license;
- the working hosted demo and its AI-powered flow.
