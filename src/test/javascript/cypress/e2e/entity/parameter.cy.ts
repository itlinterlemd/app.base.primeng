import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Parameter e2e test', () => {
  const parameterPageUrl = '/parameter';
  const parameterPageUrlPattern = new RegExp('/parameter(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const parameterSample = { parameterName: 'Consultor Horacio uniforme', value: 'Ladrillo', code: 'Pollo Rústico' };

  let parameter;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/parameters+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/parameters').as('postEntityRequest');
    cy.intercept('DELETE', '/api/parameters/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (parameter) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/parameters/${parameter.id}`,
      }).then(() => {
        parameter = undefined;
      });
    }
  });

  it('Parameters menu should load Parameters page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('parameter');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Parameter').should('exist');
    cy.url().should('match', parameterPageUrlPattern);
  });

  describe('Parameter page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(parameterPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Parameter page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/parameter/new$'));
        cy.getEntityCreateUpdateHeading('Parameter');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parameterPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/parameters',
          body: parameterSample,
        }).then(({ body }) => {
          parameter = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/parameters+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/parameters?page=0&size=20>; rel="last",<http://localhost/api/parameters?page=0&size=20>; rel="first"',
              },
              body: [parameter],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(parameterPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Parameter page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('parameter');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parameterPageUrlPattern);
      });

      it('edit button click should load edit Parameter page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Parameter');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parameterPageUrlPattern);
      });

      it('edit button click should load edit Parameter page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Parameter');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parameterPageUrlPattern);
      });

      it('last delete button click should delete instance of Parameter', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('parameter').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', parameterPageUrlPattern);

        parameter = undefined;
      });
    });
  });

  describe('new Parameter page', () => {
    beforeEach(() => {
      cy.visit(`${parameterPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Parameter');
    });

    it('should create an instance of Parameter', () => {
      cy.get(`[data-cy="parameterName"]`).type('Violeta China');
      cy.get(`[data-cy="parameterName"]`).should('have.value', 'Violeta China');

      cy.get(`[data-cy="description"]`).type('holística');
      cy.get(`[data-cy="description"]`).should('have.value', 'holística');

      cy.get(`[data-cy="value"]`).type('Optimización Planificador Diseñador');
      cy.get(`[data-cy="value"]`).should('have.value', 'Optimización Planificador Diseñador');

      cy.get(`[data-cy="code"]`).type('Ucrania');
      cy.get(`[data-cy="code"]`).should('have.value', 'Ucrania');

      cy.get(`[data-cy="parentCode"]`).type('Creativo Bebes Rojo');
      cy.get(`[data-cy="parentCode"]`).should('have.value', 'Creativo Bebes Rojo');

      cy.get(`[data-cy="initDate"] input`).clear();
      cy.get(`[data-cy="initDate"] input`).type('10/20/2020 10:10');
      cy.get(`[data-cy="initDate"] input`).type('{esc}');
      cy.get(`[data-cy="initDate"] input`).should('have.value', '10/20/2020 10:10');

      cy.get(`[data-cy="endDate"] input`).clear();
      cy.get(`[data-cy="endDate"] input`).type('10/20/2020 10:10');
      cy.get(`[data-cy="endDate"] input`).type('{esc}');
      cy.get(`[data-cy="endDate"] input`).should('have.value', '10/20/2020 10:10');

      cy.get(`[data-cy="dataType"]`).type('Bacon');
      cy.get(`[data-cy="dataType"]`).should('have.value', 'Bacon');

      cy.setFieldSelectToLastOfEntity('status');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        parameter = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', parameterPageUrlPattern);
    });
  });
});
