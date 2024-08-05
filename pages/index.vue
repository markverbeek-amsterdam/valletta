<template>
	<div id="gmap" ref="gmap" />
</template>

<script setup>
import { Loader } from '@googlemaps/js-api-loader';
import GoogleMaps from '~/googlemaps.js';

const config = useRuntimeConfig();
const gmap = ref(null);
const activeCategory = ref(null);
let map = null;

const mapConfig = {
	zoom: 15,
	center: { lat: 35.8993453, lng: 14.5140004 },
	draggable: true,
	mapTypeControl: false,
	zoomControl: true,
	streetViewControl: true,
	scrollwheel: true,
	styles: [
		{
			featureType: 'poi',
			elementType: 'all',
			stylers: [
				{
					visibility: 'off',
				},
			],
		},
	],
};

onMounted(async () => {
	const loader = new Loader({ apiKey: config.public.maps.apiKey });
	loader.importLibrary('maps').then(() => {
		map = new GoogleMaps(google, gmap.value, mapConfig);
		initializeMap();
	});
});

const initializeMap = () => {
	map.setMarkerIcon({
		src: '/marker.png',
		width: 30,
		height: 42,
		anchorX: 15,
		anchorY: 21,
	});

	map.addInfoWindow(
		map.addMarker(Object.values(mapConfig.center), 'Valletta Hotel'),
		'<h3>Valletta Hotel</h3>' + '<p class="address">Streetname 123<br>1234 AB Valletta</p>',
	);
};
</script>

<style scoped>
#gmap {
	height: 600px;
}
</style>
