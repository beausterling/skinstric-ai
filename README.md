# Skinstric AI

A build of the Skinstric.ai skin analysis flow for the Frontend Simplified x Skinstric internship. You enter your name and location, take a selfie or upload a photo, and the A.I. gives its estimate of your demographics, which you can then correct.

Live site: https://skinstric-ai-six.vercel.app

## Built with

- Next.js (App Router) and React
- TypeScript
- Tailwind CSS
- GSAP for the animations
- Deployed on Vercel

## Features

**Phase 1: introduce yourself**

- Name and location form that matches the Figma design
- Validation so only letters are accepted (no numbers or symbols, and at least one letter)
- Sends the details to the Phase 1 API and saves them in local storage
- Back and proceed buttons

**Phase 2: upload your image**

- Upload a photo from your gallery, it is resized and sent to the Phase 2 API as Base64
- Demographics page with race, age and sex. Scores are whole numbers like the Figma file, race and sex are sorted from highest to lowest and ages from youngest to oldest
- Click any score to set your actual attribute, the sidebar and the confidence ring update
- Reset goes back to the A.I. estimate, Confirm saves your corrections and goes to a congratulations page

**Phase 3: take a selfie**

- Camera permission popup, live camera preview and a take picture button
- Retake or proceed with the photo, it goes through the same API as the upload
- Works on tablet and mobile

## Running it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Pages

| Route      | What it does                               |
| ---------- | ------------------------------------------ |
| `/`        | Landing page                               |
| `/testing` | Name and location form                     |
| `/result`  | Choose between the camera and the gallery  |
| `/camera`  | Take a selfie                              |
| `/select`  | Pick which part of the analysis to look at |
| `/summary` | Demographics results                       |
