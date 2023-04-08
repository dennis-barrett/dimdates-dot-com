const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        "Raleway": ["Raleway", ...defaultTheme.fontFamily.sans],
        "Fira": ["Fira Code", ...defaultTheme.fontFamily.sans]
      },
      lineHeight: {
        '1': '0.1'
      },
      colors: {
        'caribbean-green': '#195190',
        'caribbean-red': '#606060'
      }
    }
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: { 
    styled: true,
    themes: [
      {
        // dimdates: {
        //   primary: "#00CC99",
        //   secondary: "#cc0033",
        //   accent: "#37cdbe",
        //   neutral: "#3d4451",
        //   "base-100": "#ffffff",
        // },
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#195190",
          secondary: "#606060"
        },
      },
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
    darkTheme: false,
  }
}
