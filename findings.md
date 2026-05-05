# Findings

## Discoveries
- **North Star:** A beautiful, polished website curated for driving sponsorships by businesses for Artemis 6621.
- **Integrations:** 
  - The Blue Alliance API (competition info)
  - Nexus (potential match schedule)
  - Email sending service (e.g., Resend or SendGrid) for sponsorship interest form.
- **Source of Truth:** Static data and API-fetched data. No CMS or user logins required.
- **Delivery Payload:** Deployed to Vercel.
- **Behavioral Rules:** "Whatever works best" -> Proceeding with Next.js (App Router) for Vercel compatibility, seamless API routes for email, and excellent performance.
- **Theme:** Black, White, Blue, Orange
- **Goal:** Raise funds ($65,395 budget), get sponsorships, showcase robot, grow community presence.

## Constraints
- No payment processors on site (interest-based email portal only).
