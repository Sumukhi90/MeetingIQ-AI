# MeetingIQ

MeetingIQ is an original meeting intelligence demo: **turn every meeting into searchable knowledge.** It presents a polished, seeded SaaS experience for browsing meetings, reviewing transcripts, finding decisions, managing action items, saving highlights, and sharing clips.

## Features

- Dashboard with meeting metrics, upcoming calendar, recent meetings, and deterministic Ask MeetingIQ answers
- Seeded 8-person, approximately 60-minute Q3 strategy meeting with transcript, topics, decisions, highlights, and action items
- Simulated playback with clickable timeline, speed control, timestamp navigation, transcript search, and highlight creation
- Cross-meeting search, highlights library, action item workflow, share clip page, calendar connection simulation, and recording simulation
- Responsive layout with persistent navigation and local session persistence for highlights, action item status, and calendar connection

## Setup

```bash
npm install
npm run dev
```

Production build: `npm run build`; preview it with `npm run preview`.

## Challenge implementation notes

Meeting capture/recording is simulated for this challenge. Calendar integrations are simulated. The product uses structured seeded meeting data and deterministic responses; no external AI API or credentials are required. This was intentionally scoped to prioritize the meeting intelligence UX within a 24-hour rebuild challenge. The UI is an original MeetingIQ implementation and does not use Fathom assets or proprietary code.

## Deployment

This is a Vite SPA and can deploy to Vercel, Netlify, or any static host. Build with `npm run build` and publish `dist/`. For Vercel, use the default Vite framework preset and add a rewrite from all routes to `/index.html` if deep links are enabled.

## Known limitations

The recording, audio, OAuth integrations, and AI generation layers are intentionally mocked. State is stored in the browser for the demo session; there is no authenticated backend.
