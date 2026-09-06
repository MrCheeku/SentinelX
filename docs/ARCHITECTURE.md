# SENTINELX Architecture

SENTINELX follows a simple privacy-first pipeline:

```text
Browser UI
   │
   ├── Local security engine
   │      ├── strength checks
   │      ├── reuse detection
   │      └── credential age checks
   │
   └── Sanitized metadata
          │
          ▼
     Express API
          │
          ▼
 Nebius Token Factory
          │
          ▼
 NVIDIA open-source model
          │
          ▼
 AI security explanation
```

## Privacy boundary

Credential secrets remain in the browser-side demo state. The AI endpoints accept only security metadata and reject common secret-bearing markers. The free-form chat message is also validated before it is sent upstream.

## AI fallback

AI inference is optional. When the upstream model is unavailable, the backend returns a deterministic local security recommendation so the core security analysis continues to work.

## Demo limitations

The repository intentionally uses synthetic demo credentials and browser memory for the showcase experience. It is not positioned as a production password manager or a replacement for a dedicated secrets-management system.
