const defaultConfig = require('tailwindcss/defaultConfig')
const formsPlugin = require('@tailwindcss/forms')
const daisyui = require('daisyui')
const typographyPlugin = require('@tailwindcss/typography')

/** @type {import('tailwindcss/types').Config} */
const config = {
	darkMode: 'class',
	content: ['index.html', 'src/**/*.tsx'],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['Poppins', 'sans-serif'],
				vt323: ['VT323', 'monospace']
			}
		}
	},
	experimental: { optimizeUniversalDefaults: true },
	plugins: [formsPlugin, daisyui, typographyPlugin]
}
module.exports = config
