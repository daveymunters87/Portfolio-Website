module.exports = {
  content: [
    "./public/**/*.{html,js,php}",
    "./src/**/*.{html,js,php}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C43D3D',
        secondary: '#F4DDDE',
      },
      fontFamily: {
        banner: ['Banner', 'serif'],
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
};