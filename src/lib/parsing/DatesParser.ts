import { parse } from "date-fns";
import { load } from "../utils/DOMUtils";
// TODO: Test this
/**
 * Date information corresponding to one suplovaniPage
 *
 */
export class DateWithUrl {
	public url: string;
	/**
	 * Used for sorting
	 *
	 * @type {Date}
	 * @memberof DateWithUrl
	 */
	public date: Date;
	/**
	 * Used as display value
	 *
	 * @type {string}
	 * @memberof DateWithUrl
	 */
	public dateString: string;
	constructor(url: string, dateString: string) {
		this.url = url;
		const extractedDate = url.slice(7, 17).replace(new RegExp("_", "g"), "-");
		this.date = parse(extractedDate);
		this.dateString = dateString;
	}
}

/**
 * Parses a dates page string into a DateWithUrl array
 *
 */
export function parseDatesPage(datesPage: string): DateWithUrl[] {
	const $ = load(datesPage);
	const options = $("option");

	return [...options].map((option) => {
		return new DateWithUrl(option.getAttribute("value"), option.innerHTML);
	});
}
