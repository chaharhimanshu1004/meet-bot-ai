module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "dark-bg": "#0f0f1e",
                "dark-secondary": "#1a1a2e",
                "dark-accent": "#667eea",
                "dark-accent-secondary": "#764ba2",
            },
        },
    },
    plugins: [],
}
