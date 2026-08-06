import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5EBD8',
          light: '#FAF5EC',
          dark: '#E8DBC3',
        },
        olive: {
          DEFAULT: '#707B67',
          light: '#8E9A84',
          dark: '#4A5340',
        },
        brick: {
          DEFAULT: '#A14C41',
          light: '#B86257',
          dark: '#7D3A32',
        },
        denim: {
          DEFAULT: '#324A66',
          light: '#4A6A8A',
          dark: '#213347',
        },
        charcoal: {
          DEFAULT: '#333333',
          light: '#666666',
          dark: '#1A1A1A',
        },
        parchment: {
          DEFAULT: '#EDE4D3',
          dark: '#D8CAB0',
        },
        'warm-white': '#FFFDF7',
        'vintage-paper': '#F4EAD5',
        'vintage-gold': '#C5A059',
        'emergency-red': '#C0392B',
        'success-green': '#5D8A5E',
        'warning-amber': '#D4A03C',
      },
      fontFamily: {
        serif: ['Merriweather', 'Noto Serif Gurmukhi', 'Noto Serif Devanagari', 'Georgia', 'serif'],
        sans: ['Inter', 'Noto Sans Gurmukhi', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        vintage: '0 4px 12px rgba(51, 33, 17, 0.12), 0 1px 3px rgba(51, 33, 17, 0.08)',
        'vintage-lg': '0 8px 24px rgba(51, 33, 17, 0.16), 0 2px 6px rgba(51, 33, 17, 0.1)',
        'vintage-inner': 'inset 0 2px 4px rgba(51, 33, 17, 0.1)',
        'pressed': 'inset 0 3px 6px rgba(0,0,0,0.2)',
      },
      backgroundImage: {
        'paper-grain': "radial-gradient(#d3c5aa 0.75px, transparent 0.75px), radial-gradient(#d3c5aa 0.75px, #F5EBD8 0.75px)",
      }
    },
  },
  plugins: [],
};

export default config;
