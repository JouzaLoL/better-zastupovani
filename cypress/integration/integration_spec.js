import { isWeekend, isFriday } from 'date-fns';

const sha256 = require('js-sha256');

describe('Integration Tests', () => {
	it('loads successfully', () => {
		cy.visit(Cypress.env("TEST_SERVER") || '192.168.1.200:8080');
	});

	describe('Tutorial', () => {
		it('displays tutorial on first visit', () => {
			cy.get('#driver-popover-item').should('be.visible');
		});

		it('goes to next and previous steps', () => {
			cy.get('.driver-next-btn').click();
			cy.wait(500);
			cy.get('.driver-prev-btn').click();
			cy.wait(500);
		});

		it('cancels the tutorial on overlay click', () => {
			cy.get('#driver-page-overlay').click();
		});

		it('cancels the tutorial on cancel button click', () => {
			cy
				.clearCookies()
				.reload()
				.get('#driver-popover-item > div.driver-popover-footer > button')
				.click();
		});
	});


	describe('Date buttons', () => {
		beforeEach(() => {
			cy.get(test('button_today')).as('todayButton');
			cy.get(test('button_tomorrow')).as('tomorrowButton');
			cy.get(test('suplovaniTable')).as('suplovaniTable');
		});

		it('displays buttons', () => {
			cy.get('@todayButton').should('exist');
			cy.get('@tomorrowButton').should('exist');
		});

		it('disables buttons during the weekend and on friday', () => {
			const today = new Date();
			if (isWeekend(today)) {
				cy.get('@todayButton').should('have.attr', 'disabled');
			} else if (isFriday(today)) {
				cy.get('@tomorrowButton').should('have.attr', 'disabled');
			}
		});

		it("changes data on day buttons click", () => {
			checkButtonChangesData("@todayButton");
			checkButtonChangesData("@tomorrowButton");

			function checkButtonChangesData(button) {
				selectLastDate();
				cy
					.get(button)
					.then((btn) => {
						if (btn[0].getAttribute("disabled") === "") {
							return "";
						} else {
							return cy.get("@suplovaniTable").then((suplovaniTable) => suplovaniTable[0].innerHTML);
						}
					})
					.then((oldHtml) => {
						if (oldHtml === "") {
							return;
						} else {
							cy
								.get(button)
								.click()
								.then(waitForSuplTableDataLoad)
								.then(() => {
									checkSuplTableChanged(oldHtml);
								});
						}
					});
			}
		});
	});

	// TODO: test hiding empty columns on mobile
	// TODO: Add tests for the best date picking logic when time mocking is working
	describe('Date Picker', () => {
		beforeEach(() => {
			cy.get(test('datePicker')).as('datePicker');
			cy.get(test('suplovaniTable')).as('suplovaniTable');
			cy.get(test('filterTextbox')).as('filterTextbox');
		});

		it('displays datePicker', () => {
			cy.get('@datePicker').should('exist');
		});

		it('loads some date and corresponding data on startup', () => {
			cy.get(test('filterTextbox')).clear();
			waitForSuplTableDataLoad();
		});

		/* it('changes data on datePicker date change', () => {
			selectFirstDate();
			cy
				.get('@suplovaniTable')
				.then((el) => el[0].innerHTML)
				.then((oldHTML) => {
					selectLastDate();
					checkSuplTableChanged(oldHTML);
				});
		}); */
	});

	describe('Filter textbox', () => {
		beforeEach(() => {
			cy.get(test('suplovaniTable')).as('suplovaniTable');
			cy.get(test('filterTextbox')).as('filterTextbox');
		});

/* 		it('changes data on filter text change', () => {
			cy
				.get('@suplovaniTable')
				.then((el) => {
					return el[0].innerHTML;
				})
				.then((innerHTML) => {
					return sha256(innerHTML);
				})
				.then((hash) => {
					cy
						.get('[data-test=suplovaniTable] > tbody > :nth-child(1) > :nth-child(2)')
						.then((tds) => tds[0].innerText)
						.then((text) => {
							cy
								.get('@filterTextbox')
								.type(text);
							cy
								.get('@suplovaniTable')
								.then((el) => el[0].innerHTML)
								.then((innerHTML) => {
									expect(hash).to.not.equal(sha256(innerHTML));
								});
						});
				});
		}); */
	});

	describe('Tertiary tests', () => {
		it('goes back to top on clicking back to top button', () => {
			cy
				.get("#pruvodce")
				.scrollIntoView()
				.get("#back-to-top")
				.click({ force: true })
				.get("#header")
				.should("be.visible");
		});
	});
});

function checkSuplTableChanged(oldHTML) {
	cy
		.get('@suplovaniTable')
		.then((el) => {
			return el[0].innerHTML;
		})
		.then((currentHTML) => {
			expect(sha256(currentHTML)).to.not.equal(sha256(oldHTML));
		});
}

function selectLastDate() {
	cy
		.get(test('datePicker'))
		.children()
		.invoke('attr', 'selected', false)
		.get(test('datePicker'))
		.children()
		.filter(`:last-child`)
		.invoke('attr', 'selected', true);
	triggerDateChange();
}

/**
 * Wait for loading spinner to disappear
 *
 * @returns
 */
function waitForSuplTableDataLoad() {
	return cy.get('[data-test=suplovaniTable] .ph-item').should('not.exist');
}

function triggerDateChange() {
	cy
		.get(test('datePicker'))
		.trigger('change');
	waitForSuplTableDataLoad();
}

function selectFirstDate() {
	cy.log("Selecting first date");
	cy
		.get(test('datePicker'))
		.children()
		.invoke('attr', 'selected', false)
		.get(test('datePicker') + ' > option')
		.filter(`:first-child`)
		.invoke('attr', 'selected', true);
	triggerDateChange();
}

function test(testID) {
	return `[data-test="${testID}"]`;
}
