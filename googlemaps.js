/**
 * Google Maps wrapper
 *
 */
export default class GoogleMaps {
	/**
	 * Constructor
	 *
	 * @param {*} google The Google API object
	 * @param {*} mapElement The map HTML element
	 * @param {*} options Options
	 */
	constructor(google, mapElement, options) {
		this.google = google;
		this.mapElement = mapElement;

		this.markerImage = null;
		this.markers = [];
		this.openInfowindows = [];
		this.categories = [];

		this.setOptions(options);
		this.show();
	}

	/**
	 * Set the options for google maps
	 *
	 * @param {dict}    options               The settings
	 * @param {string}  [options.coordinates] The coordinates as
	 *                                        required by Google Maps
	 * @param {integer} [options.mapTypeId]   The map type as required
	 *                                        by Google Maps
	 * @param {integer} [options.zoom]        Zoom level
	 *
	 * @return {void}
	 */
	setOptions(options) {
		if (options.mapTypeId === null) {
			options.mapTypeId = this.google.maps.MapTypeId.ROADMAP;
		}

		if (options.zoom === null) {
			options.zoom = 8;
		}

		this.options = options;
	}

	/**
	 * Show the google maps initially
	 *
	 * @return {void}
	 */
	show() {
		this.map = new this.google.maps.Map(this.mapElement, this.options);
		this.map.panTo(this.options.center);
	}

	/**
	 * Set the marker icon. All newly created markers will use
	 * this image instead of the default marker
	 *
	 * @param {Object}  image         Object containing marker information
	 * @param {string}  image.src     The source of the marker, eg
	 *                                /images/marker.png
	 * @param {integer} image.width   The width in px, eg 24
	 * @param {integer} image.height  The height in px, eg 24
	 * @param {integer} image.anchorX The anchor X position
	 * @param {integer} image.anchorY The anchor Y position
	 *
	 * @return {void}
	 */
	setMarkerIcon(image) {
		this.markerImage = new this.google.maps.MarkerImage(
			image.src,
			new this.google.maps.Size(image.width, image.height),
			new this.google.maps.Point(0, 0),
			new this.google.maps.Point(image.anchorX, image.anchorY),
		);
	}

	/**
	 * Append a marker to the map.
	 *
	 * @param {array}  latlng         Location in form [number, number]
	 * @param {string} title          The title of the marker
	 * @param {string} [category]     Name of category for the marker (optional)
	 * @param {Object} [icon]         Icon, defaults to MarkerImage (optional)
	 * @param {string} [icon.src]     The source of the marker, eg
	 *                                /images/marker.png
	 * @param {string} [icon.width]   The width in px, eg 24
	 * @param {string} [icon.height]  The height in px, eg 24
	 * @param {string} [icon.anchorX] The anchor X position
	 * @param {string} [icon.anchorY] The anchor Y position
	 *
	 * @return {object} The marker as object
	 */
	addMarker(latlng, title, category = undefined, icon = undefined) {
		if (typeof icon === 'undefined') {
			icon = this.markerImage;
		} else {
			icon = new this.google.maps.MarkerImage(
				icon.src,
				new this.google.maps.Size(icon.width, icon.height),
				new this.google.maps.Point(0, 0),
				new this.google.maps.Point(icon.anchorX, icon.anchorY),
			);
		}

		const marker = new this.google.maps.Marker({
			position: new this.google.maps.LatLng(latlng[0], latlng[1]),
			map: this.map,
			icon: icon,
			title: title,
		});

		this.markers.push(marker);

		if (typeof category !== 'undefined') {
			if (typeof this.categories[category] === 'undefined') {
				this.categories[category] = [];
			}
			this.categories[category].push(marker);
		}

		return marker;
	}

	/**
	 * Add an info window and attach this to the specified marker
	 *
	 * @param {object}   marker      A marker object
	 * @param {string}   content     The string (HTML) to put in the
	 *                               infoWindow
	 * @param {function} [doOnClick] Optional function to execute on
	 *                               click. If not specified, open the
	 *                               infoWindow
	 *
	 * @return {object} The infowindow object
	 */
	addInfoWindow(marker, content, doOnClick) {
		const infowindow = new this.google.maps.InfoWindow({
			content: content,
		});

		if (typeof doOnClick !== 'function') {
			doOnClick = () => {
				this.openInfowindow(infowindow, marker);
			};
		}

		this.google.maps.event.addListener(marker, 'click', doOnClick);

		return infowindow;
	}

	/**
	 * Opens the specified infowindow with marker
	 *
	 * @param {Object} infowindow The infowindow object
	 * @param {Object} marker     The marker object
	 *
	 * @return {void}
	 */
	openInfowindow(infowindow, marker) {
		let obj;

		while ((obj = this.openInfowindows.pop())) {
			obj.close();
		}

		infowindow.open(this.map, marker);

		this.openInfowindows.push(infowindow);
	}

	/**
	 * Hide marker(s). You can specify a category,
	 * 'allcategory' or 'all'
	 *
	 * @param {mixed} toHide The category name, the
	 *                       string 'allcategory' or 'all'
	 *
	 * @return {void}
	 */
	hideMarkers(toHide) {
		this.setMarkerVisibility(toHide, false);
	}

	/**
	 * Set markers visiblity . You can specify a
	 * category, 'allcategory' or 'all'
	 *
	 * @param {mixed}   toHide     The category name, the string 'allcategory' or 'all'
	 * @param {boolean} visibility True if marker should be visible,
	 *                             false otherwise
	 *
	 * @return {void}
	 */
	setMarkerVisibility(toHide, visibility) {
		let markers = [];

		if (toHide === 'all') {
			markers = this.markers;
		} else if (toHide === 'allcategory') {
			for (let i in this.categories) {
				for (let j in this.categories[i]) {
					markers.push(this.categories[i][j]);
				}
			}
		} else if (typeof toHide === 'string') {
			for (let i in this.categories) {
				if (i !== toHide) {
					continue;
				}
				for (let j in this.categories[i]) {
					markers.push(this.categories[i][j]);
				}
			}
		}

		for (let i in markers) {
			markers[i].setVisible(visibility);
		}
	}

	/**
	 * Show marker(s). You can specify a category,
	 * 'allcategory' or 'all'
	 *
	 * @param {mixed} toShow The marker object, a category name, the
	 *                       string 'allcategory' or 'all'
	 *
	 * @return {void}
	 */
	showMarkers(toShow) {
		this.setMarkerVisibility(toShow, true);
	}

	/**
	 * Auto center and zoom the map based on all visible markers
	 *
	 * @return {void}
	 */
	autoCenter() {
		const bounds = new this.google.maps.LatLngBounds();

		for (let i = 0; i < this.markers.length; i++) {
			if (this.markers[i].visible) {
				bounds.extend(this.markers[i].position);
			}
		}

		this.map.fitBounds(bounds);
	}
}
