const $ = require('cheerio');
const parseTable = require('./cheerio-tableparser');
const req = require('request');
const moment = require('moment');
const iconv = require('iconv-lite');

const URL_PROXY = 'https://cors-anywhere.herokuapp.com/';
const URL_SUPL = 'suplovani.gytool.cz/';
const URL_ROZVRH = 'rozvrh.gytool.cz/index_Trida_Menu.html';
const URL_DATES = URL_SUPL + '!index_menu.html';

var requestInstance = req.defaults({
	baseUrl: URL_PROXY,
	timeout: 10000,
	headers: { 'X-Requested-With': 'gytool.cz' },
	encoding: null // Output response as Buffer, then decode it using wrapper
});

/**
 * Request wrapper that automatically decodes every request 
 * Encoding: windows-1250
 * @param {any} url 
 * @param {any} callback 
 */
function request(url, callback) {
	requestInstance(url, (err, res, b) => {
		// Decode the response body
		let body = iconv.decode(b, 'win1250');
		callback(err, res, body);
	});
}

function getClasses() {
	return new Promise((resolve, reject) => {
		request(URL_ROZVRH, (err, res, body) => {
			if (err) {
				reject(err);
			}
			let options = $(body).find('option');
			let values = options.map((i, option) => {
				return $(option).text();
			});
			let classes = values.toArray();
			resolve(classes);
		});
	});
}

function getSuplovani(date_url) {
	return new Promise((resolve, reject) => {
		request(URL_SUPL + date_url, (err, res, body) => {
			if (err) {
				reject(err);
			}
			let page = $(body);
			let suplovani_table = $(page).find('div:contains("Suplování")').next();
			let supl = parseTable($, suplovani_table);
			resolve(supl);
		});
	});
}

function getDates() {
	return new Promise((resolve, reject) => {
		request(URL_DATES, (err, res, body) => {
			if (err) {
				reject(err);
			}
			let options = $(body).find('option');
			let data = options.map((i, option) => {
				return {
					url: $(option).attr('value'),
					date: moment($(option).text().split(' ').slice(2).toString(' ').replace(',', '').replace(',', '').replace('.', '/').replace('.', '/').replace('.', '/'), 'DD/MM/YYYY')
				};
			});
			resolve(data.toArray());
		});
	});
}

module.exports = { getClasses, getSuplovani, getDates };