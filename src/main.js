// Webpack imports
require('./index.html');
require('./style.css');
require('./style.js');

// Bootstrap imports
require('./bootstrap-reboot.min.css');
require('./bootstrap.min.css');

let $ = require('jquery');
let moment = require('moment');
let Cookies = require('js-cookie');

const API_URL = 'https://zastupovani.herokuapp.com/api';
const COOKIE_FILTER = 'trida';

// Create global state
window.state = {
	suplovani: [],
	classes: [],
	currentDate: moment().format('YYYY-MM-DD'),
	currentFilter: ''
};

// MAIN ENTRY POINT
$(document).ready(() => {
	registerEventHandlers();

	// Remember class
	let classCookie = Cookies.get(COOKIE_FILTER);
	if (classCookie !== undefined && classCookie !== '') {
		let newState = Object.assign(getState(), {
			currentFilter: classCookie
		});
		updateState(newState);
		renderClasses();
	}

	// Update state from server
	getStateFromServer().then((state) => {
		// overwrite state
		updateState(state);
		render();
	}).catch((err) => {
		console.log(err);
	});
});

function setState(newState, overwrite) {
	if (overwrite) {
		window.state = newState;
	} else {
		window.state = Object.assign(getState(), newState);
	}
	render();
}

function updateState(newState, overwrite) {
	if (overwrite) {
		window.state = newState;
	} else {
		window.state = Object.assign(getState(), newState);
	}
}

function getState() {
	return window.state;
}

function getStateFromServer() {
	return new Promise((resolve, reject) => {
		$.get(API_URL + '/data').then((res) => {
			// revive dates to moment objects
			let revivedSuplovani = res.suplovani.map((supl) => {
				return Object.assign(supl, {
					date: moment(supl.date)
				});
			});
			let revivedState = Object.assign(res, {
				suplovani: revivedSuplovani
			});
			resolve(revivedState);
		}, reject);
	});
}

function registerEventHandlers() {
	$('#selector_filter').on('keyup', function () {
		let newValue = this.value;
		updateState({
			currentFilter: newValue
		});
		Cookies.set(COOKIE_FILTER, newValue);
		render();
	});

	$('#selector_date').on('change', function () {
		let newValue = this.value;
		updateState({
			currentDate: newValue
		});
		render();
	});
}

function render() {
	renderClasses();
	renderDates();
	renderSuplovani();
}

function renderSuplovani() {
	// clear the table
	$('#table_suplovani > tbody').empty();

	let currentSuplovani = getState().suplovani.find((suplovani) => {
		return moment(suplovani.date.format('YYYY-MM-DD')).isSame(getState().currentDate);
	});

	let filter = getState().currentFilter;
	let contentToAppend = '';
	const noSupl = `<tr>
	<td colspan="8">Žádné suplování</td>
	</tr>
	`;
	if (!currentSuplovani) {
		contentToAppend = noSupl;
	} else {
		let filteredSuplovani = currentSuplovani.suplovani.filter((elem) => {
			return suplovaniRowContainsFilter(elem, filter);
		});
		if (!filteredSuplovani.length) {
			contentToAppend = SuplToTrs(currentSuplovani.suplovani);
		} else {
			contentToAppend = SuplToTrs(filteredSuplovani);
		}
	}

	$('#table_suplovani').append(contentToAppend);
}

function suplovaniRowContainsFilter(suplovaniRow, filter) {
	return Object.keys(suplovaniRow).some((element, index, array) => {
		return suplovaniRow[element].toLowerCase().includes(filter.toLowerCase());
	});
}

function SuplToTrs(suplovani) {
	return suplovani.map((element) => {
		return `<tr>
			<td>${element.hodina}</td>
			<td>${element.trida}</td>
			<td>${element.predmet}</td>
			<td>${element.ucebna}</td>
			<td>${element.nahucebna}</td>
			<td>${element.vyuc}</td>
			<td>${element.zastup}</td>
			<td>${element.pozn}</td>
		</tr>
		`;
	});
}

function renderDates() {
	// Extract dates from context
	let dates = getState().suplovani.map((suplovani) => {
		return suplovani.date;
	});

	// Set current value
	$('#selector_date').val(getState().currentDate);

	// Sort dates ascending
	let sorted = dates.sort(function (a, b) {
		return a - b;
	});

	// Set Max and Min value
	let min = sorted[0];
	let max = sorted[sorted.length - 1];
	$('#selector_date').attr({
		"max": max.format('YYYY-MM-DD'),
		"min": min.format('YYYY-MM-DD')
	});
}

function renderClasses() {
	$('#selector_class').empty();
	let html = classesToOptions(getState().classes);
	$('#selector_class').append(html);
	if (getState().currentFilter) {
		$('#selector_class').val(getState().currentFilter);
	}
}

function classesToOptions(classes) {
	var option = '';
	for (var i = 0; i < classes.length; i++) {
		option += '<option value="' + classes[i] + '">' + classes[i] + '</option>';
	}
	return option;
}