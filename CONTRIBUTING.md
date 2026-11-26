# Contributing to SentinelX

Thanks for helping improve SentinelX, a defensive security demo that analyzes synthetic credential metadata.

## Development setup

- Node.js 22 or newer
- npm

```bash
npm install
npm run dev
```

Run the checks before opening a pull request:

```bash
npm run lint
npm test
npm run build
```

## Security and privacy requirements

- Use synthetic credentials only. Never paste real passwords, tokens, API keys, or private vault exports into SentinelX.
- Keep deterministic credential scoring in the browser and send only minimal, sanitized metadata to AI providers.
- Never log raw credential values, authorization headers, or API keys.
- Keep provider credentials on the server; do not expose secrets in frontend bundles.
- Add tests for every new secret-detection pattern and privacy boundary.
- Document whether a feature requires network access or an external AI provider.

## Pull requests

Describe the problem, the implementation, tests run, and known limitations. Security-sensitive reports should follow [SECURITY.md](SECURITY.md) rather than disclose exploit details publicly.
