<template>
	<div class="container">
		<div class="sidebar">
			<h2>Choose a category</h2>
			<div class="accordion">
				<div v-for="category in categories" :key="category.ID" class="accordion-item">
					<div class="accordion-header" @click="toggleAccordion(category)"
						:class="{ active: activeAccordion === category.ID }">
						<h3>{{ category.name }}</h3>
					</div>
					<div class="accordion-body" v-if="activeAccordion === category.ID">

						<ul>
							<button v-for="item in category.items" :key="item.ID"
								@click="selectSubCategory(item, category)">
								<li class="category-item">{{ item.header }}</li>
							</button>
						</ul>

					</div>
				</div>
			</div>
		</div>
		<div class="map-container">
			<div id="gmap" ref="gmap"></div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFetch } from '#app';
import { Loader } from '@googlemaps/js-api-loader';
import '@/assets/css/styles.css';

const config = useRuntimeConfig();
const gmap = ref(null);
let map = null;
let vallettaHotelMarker = null;
let vallettaInfoWindow = null;
let infoWindows = [];

const activeAccordion = ref(null);
const categories = ref([]);
let markers = [];

const { data: categoryData, error } = await useFetch('/api/highlights');
if (error.value) {
	console.error('Error fetching categories:', error.value);
	categories.value = [];
} else {
	categories.value = categoryData.value || [];
}
categories.value = categoryData.value || [];

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
	const loader = new Loader({
		apiKey: config.public.maps.apiKey,
		version: "weekly",
	});

	try {
		await loader.importLibrary("maps");

		map = new google.maps.Map(gmap.value, mapConfig);

		addVallettaHotelMarker();

		vallettaInfoWindow.open(map, vallettaHotelMarker);
	} catch (error) {
		console.error("Error loading the Google Maps library:", error);
	}
});

function closeAllInfoWindows() {
	infoWindows.forEach(window => window.close());

	if (vallettaInfoWindow) {
		vallettaInfoWindow.close();
	}
}

function addMarker(position, title = '', content = '') {
	const marker = new google.maps.Marker({
		position,
		map,
		title,
		icon: '/marker-item.png',
	});

	const infoWindow = new google.maps.InfoWindow({
		content: `<h3 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 28px;margin:0;">${title}</h3><p>${content}</p>`,
	});

	marker.addListener('click', () => {
		closeAllInfoWindows();
		infoWindow.open(map, marker);
	});

	markers.push(marker);
	infoWindows.push(infoWindow);
}

function addVallettaHotelMarker() {
	const vallettaPosition = mapConfig.center;

	vallettaHotelMarker = new google.maps.Marker({
		position: vallettaPosition,
		map,
		title: 'Valletta Hotel',
		icon: '/marker.png',
	});

	vallettaInfoWindow = new google.maps.InfoWindow({
		content: `<h3 style="font-family: 'Cormorant Garamond', serif; font-weight: 300; font-size: 28px;margin:0;">Valletta Hotel</h3><p class="address">Streetname 123<br>1234 AB Valletta</p>`,
	});

	infoWindows.push(vallettaInfoWindow);

	vallettaHotelMarker.addListener('click', () => {
		closeAllInfoWindows();
		vallettaInfoWindow.open(map, vallettaHotelMarker);
	});
}

function deleteMarkers() {
	markers.forEach(marker => marker.setMap(null));
	markers = [];
	infoWindows = [];
}

function adjustMapToFitMarkers() {
	const bounds = new google.maps.LatLngBounds();

	if (vallettaHotelMarker) {
		bounds.extend(vallettaHotelMarker.getPosition());
	}

	markers.forEach(marker => {
		bounds.extend(marker.getPosition());
	});

	if (markers.length > 0 || vallettaHotelMarker) {
		map.fitBounds(bounds);
	}
}

const showCategoryMarkers = (category) => {
	deleteMarkers();

	category.items.forEach(item => {
		const position = { lat: item.location.latitude, lng: item.location.longitude };
		addMarker(position, item.header, item.description);
	});

	adjustMapToFitMarkers();
};

const toggleAccordion = (category) => {
	if (activeAccordion.value === category.ID) {
		activeAccordion.value = null;
		deleteMarkers();
	} else {
		activeAccordion.value = category.ID;
		showCategoryMarkers(category);

		if (vallettaInfoWindow) {
			vallettaInfoWindow.close();
		}
	}
};

const selectSubCategory = (item) => {
	const newCenter = {
		lat: item.location.latitude,
		lng: item.location.longitude,
	};

	if (map && newCenter) {
		map.panTo(newCenter);

		const markerIndex = markers.findIndex(
			marker => marker.getPosition().lat() === newCenter.lat && marker.getPosition().lng() === newCenter.lng
		);

		if (markerIndex >= 0) {
			closeAllInfoWindows();
			infoWindows[markerIndex].open(map, markers[markerIndex]);
		}
	}
};
</script>

<style scoped></style>
