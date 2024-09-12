// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-04-03',
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			maps: {
				apiKey: 'AIzaSyDzxWs2TLXi9gEoJOQUBf9oLS6U6YIyrq4',
			},
		},
	},
	app: {
		head: {
		  link: [
			{
			  rel: 'stylesheet',
			  href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap",
			},
		  ],
		},
	  },
});
