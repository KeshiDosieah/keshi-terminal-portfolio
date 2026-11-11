# Keshi Dosieah — React portfolio

A multi-page React portfolio that opens with a short terminal boot sequence and then invites visitors to type commands. It uses a graphite terminal palette with restrained macOS-inspired red, amber, and mint accents, plus cool blue and lilac highlights for project categories. Cards and timeline entries keep the code-editor character without sacrificing recruiter-friendly readability. A small conventional navigation remains available for visitors who prefer clicking.

## Features

- React + Vite + React Router
- Separate routes: `/`, `/projects`, `/projects/:slug`, `/experience`, `/about`, `/toolkit`, `/contact`
- Interactive terminal with `help`, `ls`, `open <project>`, `cat about.md`, `experience`, `toolkit`, `contact`, `whoami`, `pwd`, `git log`, and `clear`
- Project data-driven from `src/data.ts`; add projects to the `projects` array and each one automatically appears in the project index and receives a detail route
- Terminal boot sequence, command history, Tab completion, plain-English aliases, keyboard focus states, and reduced-motion support
- Selected projects presented in a responsive, filterable case-study card grid with subtle code-editor artwork
- Experience and education presented as a chronological, colour-coded timeline
- Restrained colour accents, including macOS-style terminal controls, with readable high-contrast surfaces
- Separate conventional navigation for projects, experience, about, and contact
- SPA fallback configuration for Netlify (`public/_redirects`) and Vercel (`vercel.json`)

