import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'medical-teal': '#008B8B',
        'medical-blue': '#0066CC',
        'medical-green': '#00AA66',
        'medical-yellow': '#FFB81C',
        'medical-orange': '#FF8C00',
        'medical-red': '#DD0000',
      },
      fontSize: {
        'clinical-large': '1.25rem',
        'clinical-xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
export default config
