import { DateWithUrl } from './DatesParser';
import { decode } from './decode';
/**
 * Base abstract class with common functionality and members for all SuplGetters
 *
 * @export
 * @abstract
 * @class SuplGetter
 */
export abstract class SuplGetter {
	public URL_SUPL = 'http://suplovani.gytool.cz/';
	public URL_ROZVRH = 'http://rozvrh.gytool.cz/index_Trida_Menu.html';
	public get URL_DATES(): string {
		return `${this.URL_SUPL}/!index_menu.html`;
	}
	/**
	 * getClasses
	 */
	public abstract getClassesPage(): Promise<string>;

	/**
	 * getSuplovani
	 */
	public abstract getSuplovaniPage(dateUrl: string): Promise<string>;

	/**
	 * getDatesPage
	 */
	public abstract getDatesPage(): Promise<string>;
}

/**
 * A SuplGetter that works in browser environment
 *
 * Uses only native browser APIs
 * Handles decoding of the responses
 * @class SuplGetterNode
 * @extends {SuplGetter}
 */
export class SuplGetterBrowser extends SuplGetter {
	private textDecoder: TextDecoder = new TextDecoder('cp1250');
	public async request(url: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const myInit: RequestInit = {
				method: 'GET'
			};
			fetch(url, myInit)
				.then(async (res) => {
					if (!res.ok) {
						reject({ error: 'res not ok' });
					}

					return res.arrayBuffer();
				})
				.then((arrayBuffer) => {
					return this.textDecoder.decode(arrayBuffer);
					// return decode(arrayBuffer);
				})
				.then((body) => {
					resolve(body);
				})
				.catch(reject);
		});
	}

	public async getClassesPage(): Promise<string> {
		return this.request(this.URL_ROZVRH);
	}

	public async getDatesPage(): Promise<string> {
		return this.request(this.URL_DATES);
	}

	public async getSuplovaniPage(dateUrl: string): Promise<string> {
		return this.request(this.URL_SUPL + dateUrl);
	}
}
