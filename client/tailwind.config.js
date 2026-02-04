/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                display: ['"Outfit"', 'sans-serif'],
            },
            colors: {
                'aq-blue': '#032D5F',
                'aq-gold': '#D4AF37',
            },
        },
    },
    plugins: [
        require('@tailwindcss/postcss')
    ],
}
