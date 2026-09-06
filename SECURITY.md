# Security Policy

## Scope

SENTINELX is a defensive security demonstration. It is designed to analyze synthetic credential metadata locally and use AI for security explanations.

## Reporting a vulnerability

Please do not disclose credentials, API keys, tokens, or other secrets in an issue. Report security issues privately through GitHub's security reporting features when available, or contact the repository owner through their GitHub profile.

## Privacy boundary

The application is designed so that the AI service receives sanitized security metadata rather than plaintext vault credentials. The API rejects common secret-bearing fields and markers before an AI request is made.

This is a demo architecture, not a guarantee of security for production password management. Do not use real credentials in Demo Mode.
