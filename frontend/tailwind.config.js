/** @type {import('tailwindcss').Config} */
// Tailwind scans the following files to generate only the CSS used in the app.
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
    extend: {}
    },
    plugins: []
}
