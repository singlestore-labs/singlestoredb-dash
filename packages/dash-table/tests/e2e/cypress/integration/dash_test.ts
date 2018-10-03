import DashTable from 'cypress/DashTable';
import DOM from 'cypress/DOM';
import Key from 'cypress/Key';

describe('dash basic', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8081');
    });

    it('can get cell', () => {
        DashTable.getCell(0, 2).click();
        DashTable.getCell(0, 2).within(() => cy.get('input').should('have.value', '0'));

        cy.get('button.next-page').click();
        DashTable.getCell(0, 2).within(() => cy.get('input').should('have.value', '250'));
    });

    it('cell click selects all text', () => {
        DashTable.getCell(0, 3).click();
        DashTable.getCell(0, 3).within(() =>
            cy.get('input').then($inputs => {
                const $input = $inputs[0];

                expect($input.selectionStart).to.equal(0);
                expect($input.selectionEnd).to.equal($input.value.length);
            })
        );
    });

    // https://github.com/plotly/dash-table/issues/50
    it('can edit last and update dataframe on "enter"', () => {
        DashTable.getCell(249, 2).click();
        DOM.focused.then($input => {
            const initialValue = $input.val();

            DOM.focused.type(`abc${Key.Enter}`);

            cy.get('#container').should($container => {
                expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
            });
        });
    });

    // https://github.com/plotly/dash-table/issues/107
    it.only('can edit last and update dataframe on "tab"', () => {
        DashTable.getCell(249, 2).click();
        DOM.focused.then($input => {
            const initialValue = $input.val();

            DOM.focused.type(`abc`);

            cy.tab()

            cy.get('#container').should($container => {
                expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
            });
        });
    });

    it('can edit last and update dataframe when clicking outside of cell', () => {
        DashTable.getCell(249, 2).click();
        DOM.focused.then($input => {
            const initialValue = $input.val();

            DOM.focused.type(`abc`);
            DashTable.getCell(248, 2).click();

            cy.get('#container').should($container => {
                expect($container.first()[0].innerText).to.equal(`[249][0] = ${initialValue} -> abc`);
            });
        });
    });

    it('can get cell with double click', () => {
        DashTable.getCell(3, 3).within(() => cy.get('div').dblclick());
        DashTable.getCell(3, 3).should('have.class', 'focused');
    });
});