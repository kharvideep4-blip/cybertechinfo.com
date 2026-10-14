export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { paper: '#F4F7FC', ink: '#0B1B45', brand: '#1F4FD8', sun: '#F58220', line: '#D8E0F0' },
    fontFamily: { display: ['"Bricolage Grotesque Variable"', 'sans-serif'], sans: ['"Figtree Variable"', 'sans-serif'] },
    keyframes: {
      marquee: { to: { transform: 'translateX(-50%)' } },
      grow: { from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } },
      float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      pageIn: { from: { opacity: 0.55, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } },
      draw: { to: { strokeDashoffset: 0 } },
      blink: { '50%': { opacity: 0 } },
    },
    animation: { marquee: 'marquee 40s linear infinite', grow: 'grow .9s cubic-bezier(.2,.8,.2,1) both', float: 'float 6s ease-in-out infinite',
      pageIn: 'pageIn .3s ease-out both', draw: 'draw 2s ease-out .4s forwards', blink: 'blink 1s steps(1) infinite' },
  } },
}
