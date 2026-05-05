# API & Technical SOPs (Layer 1)

## Architecture Map
- **Layer 1 (Architecture):** Contains this SOP file for reference.
- **Layer 2 (Navigation/App):** The Next.js `app` directory. Pages route directly to components.
- **Layer 3 (Tools/Lib):** The `tools/` and `lib/` directories handling actual deterministic API logic.

## 1. The Blue Alliance (TBA) API SOP
- **File Location:** `lib/tba.ts`
- **Goal:** Fetch the team's matches, current status, and stats using `X-TBA-Auth-Key`.
- **Logic:**
  - Execute fetch requests using Next.js caching or revalidation.
  - Parse the JSON payload according to the TBA Data Schema defined in `gemini.md`.
- **Edge Cases:**
  - If the TBA API returns `401 Unauthorized`, verify the key in `.env`.
  - If the TBA API returns `503 Service Unavailable`, gracefully display a fallback message on the UI instead of crashing the build.

## 2. Sponsorship Email SOP
- **File Location:** `app/api/sponsorship/route.ts` (or `lib/email.ts`)
- **Goal:** Receive a POST request from the client and dispatch an email notifying the team of a new sponsor.
- **Logic:**
  - Read incoming JSON payload.
  - Validate fields against the Sponsorship Data Schema (`gemini.md`).
  - Use Resend/Nodemailer to construct and send the email template.
- **Edge Cases:**
  - Catch empty submissions and reject with `400 Bad Request`.
  - Ensure API keys for email sending are not exposed to the client bundle.
