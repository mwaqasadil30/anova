import UtilFunctions from '../../support/utils/UtilFunctions';
const routes = require('../../fixtures/routes.json');

describe.skip('Special Cases API Automation', function () {

   let domainId = null;

   const utilFunctions = new UtilFunctions();

   beforeEach(function () {
      // Preserve only the session cookie in every test
      Cypress.Cookies.defaults({
        preserve: (cookie) => {
            return cookie && cookie.name === '.AspNetCore.Session';
         },
      });
   });

   it('POST - Login User', () => {
      var loginPayload = {
         "username": Cypress.env('USERNAME'),
         "password": Cypress.env('PASS')
      }
      cy.request(
         'POST',Cypress.config('apiUrl')+'/AuthenticateAndRetrieveApplicationInfo',
         loginPayload,
      ).then(response => {
         expect(response.status).equal(200)
         expect(response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.username.toLowerCase()).equal(loginPayload.username.toLowerCase())
         domainId = response.body.authenticateAndRetrieveApplicationInfoResult.userInfo.domainId;
      });
   });

   it('OPERATIONS - Assets Summary Page',() => {

    cy.request(
       'GET','Operations',Cypress.config('apiUrl')+routes.getAssetSummaryByOptionUrl)
       .then(response => {
       expect(response.status).equal(200);
    });
  });

  it('OPERATIONS - Assets Summary - HOUSING - lvl--2020-',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'E0541A6C-368C-E811-80CD-E0071BF7AF6E'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
          'POST',Cypress.config('apiUrl')+routes.assetFilters,
          {"options":{"domainId":"e0541a6c-368c-e811-80cd-e0071bf7af6e","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*E10028BA*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,4,12,17,18],"inventoryStates":["Normal","TOP Alarm","LOW Alarm","Full","Empty","Reorder","Critical"],"assetSearchDomainId":"e0541a6c-368c-e811-80cd-e0071bf7af6e"}})
          .then(response => {
        expect(response.status).equal(200); 
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/ff44786c-7875-e911-80d1-e0071bf7af6e')
           .then(response => {
            expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - MORTARS - N2 LEVEL',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'c2ec1877-0bbd-e811-80ce-e0071bf7af6e'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"c2ec1877-0bbd-e811-80ce-e0071bf7af6e","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FE11BF90*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,7,8,9,12,13,16,18],"inventoryStates":["Normal","Critical","Full","Empty","Reorder"],"assetSearchDomainId":"c2ec1877-0bbd-e811-80ce-e0071bf7af6e"}})
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/5042877c-b8c5-ea11-80d7-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - MORTARS - LNG LEVEL',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'c2ec1877-0bbd-e811-80ce-e0071bf7af6e'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"c2ec1877-0bbd-e811-80ce-e0071bf7af6e","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FE11BF90*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,7,8,9,12,13,16,18],"inventoryStates":["Normal","Critical","Full","Empty","Reorder"],"assetSearchDomainId":"c2ec1877-0bbd-e811-80ce-e0071bf7af6e"}})
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/5042877c-b8c5-ea11-80d7-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - PUNJAB - Level',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'3b169efa-0743-e811-80cd-e0071bf7af6e'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"3b169efa-0743-e811-80cd-e0071bf7af6e","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*E100618D*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,4,5],"inventoryStates":["Normal","Full","Empty","Reorder","Critical"],"assetSearchDomainId":"3b169efa-0743-e811-80cd-e0071bf7af6e"}})       
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/30a4949a-1378-ea11-80d5-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - BLOGTAG - Level',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'23918bf5-19e9-e911-80d3-e0071bf7af6d'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"23918bf5-19e9-e911-80d3-e0071bf7af6d","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*E1004786*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,4,5,10],"inventoryStates":["Normal","Critical","Empty","Reorder","Full"],"assetSearchDomainId":"23918bf5-19e9-e911-80d3-e0071bf7af6d"}})    
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/517f0bb6-2e18-ea11-80d3-e0071bf7af6d')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - GROUND - Level',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'864778b9-924a-e011-aa4e-003048d78b07'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"864778b9-924a-e011-aa4e-003048d78b07","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF7601A0*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,4],"inventoryStates":["Normal","Empty","Reorder","Critical","Full"],"assetSearchDomainId":"864778b9-924a-e011-aa4e-003048d78b07"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/c38c39c0-cc05-e311-b7f0-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - HARWOOD - Level (RTU: 01-008)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'c1fb75cc-c46c-e311-8186-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"c1fb75cc-c46c-e311-8186-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*01-008*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1],"inventoryStates":["Normal","Full","Empty","Reorder","Critical"],"assetSearchDomainId":"c1fb75cc-c46c-e311-8186-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/67ba852a-8878-e311-8186-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - HARWOOD - Level (RTU: 02-034)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'c1fb75cc-c46c-e311-8186-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"c1fb75cc-c46c-e311-8186-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*02-034*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1],"inventoryStates":["Normal","Full","Empty","Reorder","Critical"],"assetSearchDomainId":"c1fb75cc-c46c-e311-8186-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/66ba852a-8878-e311-8186-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - HARWOOD - Level (RTU: FE119590)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'c1fb75cc-c46c-e311-8186-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"c1fb75cc-c46c-e311-8186-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FE119590*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1],"inventoryStates":["Normal","Full","Empty","Reorder","Critical"],"assetSearchDomainId":"c1fb75cc-c46c-e311-8186-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/64ba852a-8878-e311-8186-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - INDEPENDENT - Level',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'c00880b3-924a-e011-aa4e-003048d78b07'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"c00880b3-924a-e011-aa4e-003048d78b07","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF79EA58*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,4],"inventoryStates":["Normal","Critical","Empty","Reorder","Full"],"assetSearchDomainId":"c00880b3-924a-e011-aa4e-003048d78b07"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/be7c9465-8af8-e311-b538-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - PRIX - Level (RTU: FF172ED0)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'08802fd6-58f5-e211-85b8-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"08802fd6-58f5-e211-85b8-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF172ED0*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4],"inventoryStates":["Normal","Critical","Full","Empty","Reorder"],"assetSearchDomainId":"08802fd6-58f5-e211-85b8-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/8e698dbd-7719-e311-b7f0-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - PRIX - Level (RTU: FF1787E8)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'08802fd6-58f5-e211-85b8-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"08802fd6-58f5-e211-85b8-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF1787E8*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4],"inventoryStates":["Normal","Critical","Full","Empty","Reorder"],"assetSearchDomainId":"08802fd6-58f5-e211-85b8-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/21358a98-bc77-e711-80cd-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - ADAPTIVE - Level (RTU: FF7A20C0)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'28c52b9e-6ed3-e211-85b8-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"28c52b9e-6ed3-e211-85b8-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF7A20C0*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,4,10],"inventoryStates":["Normal","Empty","Reorder","Critical","Pre-Reorder","Full"],"assetSearchDomainId":"28c52b9e-6ed3-e211-85b8-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/879a195b-9bc3-e311-955f-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - ADAPTIVE - Level (RTU: FF7A1F88)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'28c52b9e-6ed3-e211-85b8-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"28c52b9e-6ed3-e211-85b8-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF7A1F88*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,4,10],"inventoryStates":["Normal","Empty","Reorder","Critical","Pre-Reorder","Full"],"assetSearchDomainId":"28c52b9e-6ed3-e211-85b8-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/fc7e0e01-9094-e411-9784-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - ADAPTIVE - LAr-Level (RTU: FF7874D0)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'28c52b9e-6ed3-e211-85b8-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"28c52b9e-6ed3-e211-85b8-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FF7874D0*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,4,10],"inventoryStates":["Normal","Empty","Reorder","Critical","Pre-Reorder","Full"],"assetSearchDomainId":"28c52b9e-6ed3-e211-85b8-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/ca61dba0-a98f-e311-8098-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - THRELFALL - Level (RTU: FE104960)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'53e1c5a9-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"53e1c5a9-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FE104960*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,5,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Safety Stock Level","High Level","ON SEMICONDUCTOR RUNOUT ALARM","ON SEMICONDUCTOR LOW LEVEL ALARM","Level EMPTY","Low Level","Level Low","Refill Storage","Level Very Low","Plan Point"],"assetSearchDomainId":"53e1c5a9-2b02-e411-b538-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/772e156d-ea09-e511-8d0c-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - THRELFALL - Level (RTU: FE10A4A0)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'53e1c5a9-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"53e1c5a9-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FE10A4A0*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,5,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Safety Stock Level","High Level","ON SEMICONDUCTOR RUNOUT ALARM","ON SEMICONDUCTOR LOW LEVEL ALARM","Level EMPTY","Low Level","Level Low","Refill Storage","Level Very Low","Plan Point"],"assetSearchDomainId":"53e1c5a9-2b02-e411-b538-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/bf6a1761-ea09-e511-8d0c-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - THRELFALL - Level (RTU: FE109D20)',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'53e1c5a9-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"53e1c5a9-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":1,"filterText":"*FE109D20*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,5,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Safety Stock Level","High Level","ON SEMICONDUCTOR RUNOUT ALARM","ON SEMICONDUCTOR LOW LEVEL ALARM","Level EMPTY","Low Level","Level Low","Refill Storage","Level Very Low","Plan Point"],"assetSearchDomainId":"53e1c5a9-2b02-e411-b538-bc305bf0f098"}})        
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/32db165b-ea09-e511-8d0c-bc305bf0f098')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - LAR TK-22483',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*11055147*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/a69edf79-e302-e811-80cd-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - LIN DW-23501',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*11055848*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/16e7e96c-e302-e811-80cd-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - LIN DW-23763',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*11070807*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/49b06061-e464-e811-80cd-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - LAR DW-24490 3000L',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*11114570*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/c3491e7c-8267-e911-80d1-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - CO2 TK-23760',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*11069762*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/a27f2008-938e-e811-80cd-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - LIN TK-23507',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*11056068*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/85ad8f8f-cf05-e811-80cd-e0071bf7af6e')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - FITZGIBBON - MLX TK-18272',() => {

    cy.request(
       'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'eaf57f7e-2b02-e411-b538-bc305bf0f098'})
       .then(response => {
       expect(response.status).equal(200);
       cy.request(
        'POST',Cypress.config('apiUrl')+routes.assetFilters,
        {"options":{"domainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":6,"filterText":"*1306062*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4,6,7,8,9,10,12,13,14,17,18],"inventoryStates":["Normal","Level 4","Empty","Reorder","Critical","Level 3","Runout","Full","Level 1","Level 2","PEL - Low level alarm","Target Refill"],"assetSearchDomainId":"eaf57f7e-2b02-e411-b538-bc305bf0f098"}})        .then(response => {
        expect(response.status).equal(200);
        cy.request(
           'GET',Cypress.config('apiUrl')+'/Asset/Detail/18de194b-98b3-e411-8908-bc305bf039fc')
           .then(response => {
           expect(response.status).equal(200);
        });
      });
    });
  });

  it('OPERATIONS - Assets Summary - Published Asset Group - BRISTOLL & PRIX',() => {

    cy.request(
        'POST',Cypress.config('apiUrl')+routes.retrieveGroupByDomainUrl,{'domainId' :'56d84567-924a-e011-aa4e-003048d78b07'})
        .then(response => {
        expect(response.status).equal(200);
        cy.request(
          'POST',Cypress.config('apiUrl')+routes.retrieveGroupEditByIdUrl,{"assetGroupId":"11754c59-a802-e711-80cc-e0071bf7af6e","loadEditComponents":true})
          .then(response => {
          expect(response.status).equal(200);
          cy.request(
            'POST',Cypress.config('apiUrl')+routes.retrieveGroupEditByOptionsUrl,{"options":{"searchType":2,"prefixText":"Barrell Transformers Ltd."}})
            .then(response => {
            expect(response.status).equal(200);
            cy.request(
              'POST',Cypress.config('apiUrl')+routes.retrieveDomainApplicationInfoById,{'domainId' :'08802fd6-58f5-e211-85b8-bc305bf0f098'})
              .then(response => {
              expect(response.status).equal(200);
              cy.request(
                'POST',Cypress.config('apiUrl')+routes.retrieveGroupByDomainUrl,{"domainId":"08802fd6-58f5-e211-85b8-bc305bf0f098"})
                .then(response => {
                expect(response.status).equal(200);
                cy.request(
                  'POST',Cypress.config('apiUrl')+routes.retrieveGroupEditByIdUrl,{"assetGroupId":"11754c59-a802-e711-80cc-e0071bf7af6e","loadEditComponents":true})
                  .then(response => {
                  expect(response.status).equal(200);
                  cy.request(
                    'POST',Cypress.config('apiUrl')+routes.assetFilters,
                    {"options":{"domainId":"08802fd6-58f5-e211-85b8-bc305bf0f098","userId":"a9633469-1c73-4cbe-8971-e3f844b105f8","pageNumber":1,"pageSize":50,"sortBy":"assetTitle","sortDirection":0,"filterBy":5,"filterText":"*Barrell Transformers Ltd.*","groupBy":0,"groupSortDirection":0,"assetSearchExpression":"","dataChannelTypes":[1,2,3,4],"inventoryStates":["Normal","Critical","Empty","Full","Reorder"],"assetSearchDomainId":"08802fd6-58f5-e211-85b8-bc305bf0f098"}})                
                    .then(response => {
                    expect(response.status).equal(200);
                    cy.request(
                      'GET',Cypress.config('apiUrl')+'/Asset/Detail/efb0bf3f-df14-e711-80cd-e0071bf7af6e')
                      .then(response => {
                      expect(response.status).equal(200); 
                  });
                });    
              });   
            });  
          });
        });
      }); 
    });
  });
})
