# PDF Form Generator (Next.js)

A modern web app built with Next.js, React, and Tailwind CSS that lets users fill out a form, preview their data, and generate a PDF. Icons are custom SVGs, and form data is preserved between navigation.

## Features
- Responsive form with validation (name, email, phone, position, description)
- PDF generation using jsPDF
- Preview page for user data
- Download PDF button
- Custom SVG icons for all fields
- Data persistence using localStorage (form data is restored if you go back from preview)
- Built with Next.js 15, React 18, Tailwind CSS, react-hook-form, zod

## Folder Structure
```
project/
├── app/
│   ├── page.tsx         # Main form page
│   └── preview/
│       └── page.tsx     # Preview and download page
├── components/
│   └── ui/              # Reusable UI components (Button, Input, etc.)
├── public/
│   └── Icons/           # All SVG icons used in the UI
│   └── favicon.ico      # App favicon
├── README.md            # This file
├── package.json         # Project dependencies and scripts
├── tailwind.config.ts   # Tailwind CSS config
├── ...
```

## Getting Started
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the development server:**
   ```sh
   npm run dev
   ```
3. **Build for production:**
   ```sh
   npm run build
   ```
4. **Open in browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage
- Fill out the form on the home page.
- Click "View PDF" to preview your data.
- Click "Download PDF" to save as PDF.
- Click the back button on preview to return to the form with your data intact.

## Customization
- To change icons, replace SVG files in `public/Icons/`.
- To add fields, update the form schema and UI in `app/page.tsx` and `app/preview/page.tsx`.

## Tech Stack
- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [react-hook-form](https://react-hook-form.com/)
- [zod](https://zod.dev/)
- [jsPDF](https://github.com/parallax/jsPDF)


