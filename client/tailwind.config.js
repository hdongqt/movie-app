/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            container: {
                screens: {
                    xs: '640px',
                    sm: '768px',
                    md: '1024px',
                    lg: '1220px',
                    xl: '1280px'
                }
            }
        }
    },
    plugins: []
};
