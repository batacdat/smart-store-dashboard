/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Cách 1: Ghi đè font mặc định của Tailwind (Khuyên dùng)
        sans: ['Inter', 'sans-serif'],
        // Cách 2: Vẫn giữ font-main của bạn nếu bạn chỉ muốn dùng ở vài nơi cụ thể
        main: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}