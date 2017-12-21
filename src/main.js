// Webpack imports
require('./index.html');
require('./style.css');
require('./style.js');

// Bootstrap imports
require('./bootstrap-reboot.min.css');
require('./bootstrap.min.css');

let $ = require('cash-dom');
let Cookies = require('js-cookie');

let dfnsFormat = require('date-fns/format');
let dfnsIsEqual = require('date-fns/is_equal');
let dfnsCompareAsc = require('date-fns/compare_asc');

const API_URL = 'https://zastupovani.herokuapp.com/api';
const COOKIE_FILTER = 'trida';

// Create global state
window.state = {
	suplovani: [],
	classes: [],
	currentDate: dfnsFormat(new Date(), 'YYYY-MM-DD'),
	currentFilter: ''
};

// MAIN ENTRY POINT
$(() => {
	registerEventHandlers();

	// Remember filter
	let filterCookie = Cookies.get(COOKIE_FILTER);
	if (filterCookie !== undefined && filterCookie !== '') {
		let newState = Object.assign(getState(), {
			currentFilter: filterCookie
		});
		setState(newState);
	}

	// Update state from server
	getStateFromServer().then((state) => {
		// overwrite state
		setState(state);
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

function getState() {
	return window.state;
}

function getStateFromServer() {
	return new Promise((resolve, reject) => {
		fetch(API_URL + '/data')
			.then((res) => {
				res.json().then((data) => {
					resolve({ suplovani: data.suplovani });
				}, reject);
			});
	});
}

function registerEventHandlers() {
	$('#selector_filter').on('keyup', function () {
		let newValue = this.value;
		setState({
			currentFilter: newValue
		});
		Cookies.set(COOKIE_FILTER, newValue);
	});

	$('#selector_date').on('change', function () {
		let newValue = this.value;
		setState({
			currentDate: newValue
		});
	});
}

function render() {
	renderFilter();
	renderDates();
	renderSuplovani();
}

function renderSuplovani() {
	// clear the table
	$('#table_suplovani > tbody').empty();
	let contentToAppend = '';
	const noSupl = `<tr>
	<td colspan="8">Žádné suplování</td>
	</tr>
	`;

	let selectedSuplovani = getSelectedSuplovani();
	contentToAppend = selectedSuplovani.length ? SuplovaniRowToTrs(selectedSuplovani) : noSupl;

	$('#table_suplovani > tbody').append(contentToAppend);
}

function getSelectedSuplovani() {
	let suplovani = getState().suplovani;
	if (!suplovani) {
		return [];
	}
	let currentSuplovani = getSuplovaniForSelectedDate(getState().suplovani, getState().currentDate);
	if (!currentSuplovani) {
		return [];
	}
	let filter = getState().currentFilter;
	return filterSuplovani(currentSuplovani.suplovani, filter);
}

function getSuplovaniForSelectedDate(suplovani, date) {
	return suplovani.find((supl) => {
		return dfnsIsEqual(dfnsFormat(supl.date, 'YYYY-MM-DD'), date);
	});
}

function filterSuplovani(suplovani, filter) {
	return suplovani.filter((elem) => {
		return suplovaniRowContainsString(elem, filter);
	});
}

function suplovaniRowContainsString(suplovaniRow, filter) {
	return Object.keys(suplovaniRow).some((element, index, array) => {
		return suplovaniRow[element].toLowerCase().includes(filter.toLowerCase());
	});
}

function SuplovaniRowToTrs(suplovaniRow) {
	return suplovaniRow.map((element) => {
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

	if (!dates.length) {
		return;
	}

	// Set current value
	$('#selector_date').val(getState().currentDate);

	// Sort dates ascending
	let sorted = dates.sort(function (a, b) {
		return dfnsCompareAsc(a, b);
	});

	// Set Max and Min value
	let min = sorted[0];
	let max = sorted[sorted.length - 1];
	$('#selector_date').prop({
		"max": dfnsFormat(max, 'YYYY-MM-DD'),
		"min": dfnsFormat(min, 'YYYY-MM-DD'),
	});
}

function renderFilter() {
	$('#selector_filter').val(getState().currentFilter);
}