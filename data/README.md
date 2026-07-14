# Data — Launch Checklist

Every file in this directory is typed stub content. Nothing here is
`Lorem Ipsum` — it's realistic placeholder copy meant to make the site look
real in review — but none of it is real company data. Replace before launch:

- **`products.ts`** — real product names, taglines, categories, statuses, and
  `externalUrl` values (point to the future portfolio site).
- **`services.ts`** — confirm/adjust the real service catalog.
- **`jobs.ts`** — real open full-time/part-time roles.
- **`internships.ts`** — real open internship roles.
- **`team.ts`** — real founder/leadership names, titles, bios, LinkedIn URLs.
  Swap the initials-based avatars for real headshots.
- **`testimonials.ts`** — real client/partner quotes (with permission).
- **`stats.ts`** — real company stats (products shipped, institutions served,
  team size, years operating).
- **`timeline.ts`** — real company milestones.
- **`tech-stack.ts`** — confirm the real tech stack and client logo list
  (client logos are text placeholders, not real marks — replace with actual
  logo assets/usage permission).
- **Contact details** — real address, phone, email, and social links live in
  `app/contact/page.tsx` and `components/layout/Footer.tsx`.
- **Logo** — see the comment in `components/ui/Logo.tsx`: drop the real logo
  file into `/public/brand/` and swap the placeholder mark.
- **Color tokens** — see the comment at the top of `app/globals.css`: confirm
  exact brand hex codes from the logo file and update that single block.
- **Forms** — `careers/apply` and `internships/apply` log submissions to the
  console only; no backend is wired up. See the `TODO` comments in
  `components/sections/ApplicationForm.tsx` and `app/contact/page.tsx`.
- **Newsletter signup** — client-side only stub in the footer; no backend.
