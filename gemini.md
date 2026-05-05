# Project Constitution

## Data Schemas

**1. Sponsorship Interest Payload (Input to Email API):**
```json
{
  "companyName": "string",
  "contactName": "string",
  "email": "string",
  "phone": "string (optional)",
  "interestedTier": "string (Hermes, Apollo, ZEUS, Other)",
  "message": "string"
}
```

**2. TBA (The Blue Alliance) Competition Payload (Output from API):**
```json
{
  "eventName": "string",
  "startDate": "string (YYYY-MM-DD)",
  "endDate": "string (YYYY-MM-DD)",
  "location": "string",
  "status": "string (upcoming, active, completed)",
  "teamRecord": {
    "wins": "number",
    "losses": "number",
    "ties": "number"
  }
}
```

## Behavioral Rules
- Prioritize reliability over speed.
- Never guess at business logic.
- Follow B.L.A.S.T. protocol strictly.
- Strict adherence to the 3-layer architecture.
- Tone: Welcoming, community-focused, and inspiring. Highlighting determination and success without sounding aggressive or demanding.

## Architectural Invariants
- Layer 1: `architecture/` - Technical SOPs
- Layer 2: Navigation - Routing logic
- Layer 3: `tools/` - Python scripts for deterministic execution
- `.tmp/` for intermediates
- `.env` for secrets
- `gemini.md` is law.
