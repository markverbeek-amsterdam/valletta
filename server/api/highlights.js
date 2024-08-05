export default defineEventHandler(() => {
	return [
		{
			name: 'Culture',
			ID: 1,
			items: [
				{
					active: true,
					header: "St. John's Co-Cathedral",
					description: '16th century high baroque cathedral',
					location: {
						address: 'Triq San Gwann, Il-Belt ',
						postalCode: '',
						city: 'Il-Belt Valletta',
						latitude: 35.8982663,
						longitude: 14.5114173,
					},
					ID: 1,
				},
				{
					active: true,
					header: 'National Museum of Archeology',
					description: 'Ancient artifacts in a historic building',
					location: {
						address: 'Republic street, Valletta',
						postalCode: '',
						city: 'Valletta',
						latitude: 35.9000093,
						longitude: 14.5153466,
					},
					ID: 2,
				},
				{
					active: true,
					header: 'Grand Harbour',
					description: 'Busy historical port with scenic views',
					location: {
						address: 'Valletta waterfront, Valletta',
						postalCode: '',
						city: 'Floriana',
						latitude: 35.8900757,
						longitude: 14.5080042,
					},
					ID: 4,
				},
				{
					active: true,
					header: 'National War Museum',
					description: 'The national war museum is located in Fort Saint Elmo',
					location: {
						address: '',
						postalCode: 'VLT 1741',
						city: 'Valletta',
						latitude: 35.900995,
						longitude: 14.518823,
					},
					ID: 6,
				},
			],
		},
		{
			name: 'Shopping',
			ID: 2,
			items: [
				{
					active: true,
					header: 'Republic Street Shopping',
					description: 'Republic street is a principal street in the vapital city of Valletta, Malta.',
					location: {
						address: 'Republic street, Valletta',
						postalCode: '',
						city: 'Valletta',
						latitude: 35.9000093,
						longitude: 14.5153466,
					},
					ID: 3,
				},
				{
					active: true,
					header: 'Savoy Shopping centre ',
					description: 'Shopping centre with several kinds of shops',
					location: {
						address: 'Republic Street 267',
						postalCode: '',
						city: 'Valletta',
						latitude: 35.8995607,
						longitude: 14.5145075,
					},
					ID: 5,
				},
			],
		},
		{
			name: 'Golf',
			ID: 3,
			items: [
				{
					active: true,
					header: 'Royal Malta Golf Club',
					description: 'Golf club with a beautiful 18 hole course and excellent services',
					location: {
						address: 'Aldo Moro Street',
						postalCode: 'MRS9064',
						city: 'Marsa',
						latitude: 35.8735822,
						longitude: 14.492712,
					},
					ID: 7,
				},
			],
		},
	];
});
