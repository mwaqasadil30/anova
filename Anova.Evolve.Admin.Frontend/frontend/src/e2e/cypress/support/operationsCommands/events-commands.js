import '@testing-library/cypress/add-commands';
import moment from 'moment';
import UtilFunctions from '../utils/UtilFunctions';
const routes = require('../../fixtures/routes.json');
const utilFunctions = new UtilFunctions();

var today = moment().format('M/D/YYYY');

Cypress.Commands.add('eventIcon', () => {
  cy.get('[aria-label="event nav"]');
});

Cypress.Commands.add('viewDropdown', () => {
  cy.get('[aria-haspopup="listbox"]').eq(0);
});

Cypress.Commands.add('eventTypesDropdown', () => {
  cy.get('[aria-haspopup="listbox"]').eq(1);
});

Cypress.Commands.add('notesTab', () => {
  cy.findByRole('tab', { name: 'Notes' });
});

Cypress.Commands.add('notificationsTab', () => {
  cy.findByRole('tab', { name: 'Notifications' });
});

Cypress.Commands.add('msgCreatedDate', () => {
  cy.get('[aria-label="Event created on"]');
});

Cypress.Commands.add('assetNameContainer', () => {
  cy.get('[aria-label="Asset title"] a');
});

Cypress.Commands.add('dataChannelContainer', () => {
  cy.get('[aria-label="Data channel type"]');
});

Cypress.Commands.add('readingValueContainer', () => {
  cy.get('[aria-label="Reading value"]');
});

Cypress.Commands.add('readingTimestampContainer', () => {
  cy.get('[aria-label="Reading timestamp"]');
});

Cypress.Commands.add('eventMessageContainer', () => {
  cy.get('[aria-label="Event message"]');
});

Cypress.Commands.add('importanceLevelContainer', () => {
  cy.get('[aria-label="Event importance level"]');
});

Cypress.Commands.add('acknowledgedByContainer', () => {
  cy.get('[aria-label="Acknowledged by"]', { timeout: 20000 });
});

Cypress.Commands.add('acknowledgedOnContainer', () => {
  cy.get('[aria-label="Acknowledged on"]', { timeout: 20000 });
});

Cypress.Commands.add('clickBackArrow', () => {
  cy.get('[aria-label="back"]', { timeout: 20000 });
});

Cypress.Commands.add('notesGrid', () => {
  cy.get('[aria-label="Has notes"]', { timeout: 20000 });
});

Cypress.Commands.add('createdOnGrid', () => {
  cy.get('[aria-label="Created on"]', { timeout: 20000 });
});

Cypress.Commands.add('eventNameGrid', () => {
  cy.get('[aria-label="Event rule description"]', { timeout: 20000 });
});

Cypress.Commands.add('importanceLevelGrid', () => {
  cy.get('[aria-label="Event importance level"]');
});

Cypress.Commands.add('assetsGrid', () => {
  cy.get('[aria-label="Asset title"] a', { timeout: 20000 });
});

Cypress.Commands.add('assetTitleGrid', () => {
  cy.get('[aria-label="Asset title"] a', { timeout: 20000 });
});

Cypress.Commands.add('dataChannelsGrid', () => {
  cy.get('[aria-label="Data channel type"]', { timeout: 20000 });
});

Cypress.Commands.add('messageGrid', () => {
  cy.get('[aria-label="Message"]', { timeout: 5000 });
});

Cypress.Commands.add('readingTimestampGrid', () => {
  cy.get('[aria-label="Reading timestamp"]', { timeout: 20000 });
});

Cypress.Commands.add('readingsGrid', () => {
  cy.get('[aria-label="Reading scaled value"]', { timeout: 20000 });
});

Cypress.Commands.add('rostersGrid', () => {
  cy.get('[aria-label="First roster name"]', { timeout: 20000 });
});

Cypress.Commands.add('eventTypeGrid', () => {
  cy.get('[aria-label="Event rule type"]', { timeout: 20000 });
});

Cypress.Commands.add('rosterNameCol', () => {
  cy.get('[aria-label="Roster name"]', { timeout: 20000 });
});

Cypress.Commands.add('rosterEmailAddCol', () => {
  cy.get('[aria-label="Email address"]', { timeout: 20000 });
});

Cypress.Commands.add('notesDate', () => {
  cy.get('[aria-label="Note create date"]', { timeout: 20000 });
});

Cypress.Commands.add('addNotes', () => {
  cy.get('[id="note-input"]', { timeout: 20000 });
});

Cypress.Commands.add('assetDetailsTab', () => {
  cy.findByRole('tab', { name: 'Details' });
});

Cypress.Commands.add('tankContainerIcon', () => {
  cy.get('[aria-label="Fillable tank icon"]');
});

Cypress.Commands.add('missingDataIcon', () => {
  cy.get('[aria-label="Missing data icon"]');
});

Cypress.Commands.add('verifyViewDropdownFields', () => {
  cy.get('[data-value="1"]').should('be.visible').and('have.text', 'Active');
  cy.get('[data-value="2"]').should('be.visible').and('have.text', 'Inactive');
});

Cypress.Commands.add('verifyMessageDetails', (index) => {
  var createdDateGrid,
    assetGrid,
    dataChannelGrid,
    readingTimeGrid,
    readingGrid,
    messageGrid,
    eventNameGrid,
    importanceLevel;

  cy.server();
  cy.route('POST', routes.retrieveEventByIdUrl).as('messageRecord');

  //Created on
  cy.createdOnGrid()
    .eq(index)
    .then((field) => {
      createdDateGrid = field.text();
    });

  //Event Name
  cy.eventNameGrid()
    .eq(index)
    .then((field) => {
      eventNameGrid = field.text();
    });

  //Importance Level
  cy.importanceLevelGrid()
    .eq(index)
    .then((field) => {
      importanceLevel = field.text();
      if (importanceLevel === 'High')
        expect(field.find('[aria-label="Event importance high icon"]')).to.exist;
      else if (importanceLevel === 'Urgent')
        expect(field.find('[aria-label="Event importance urgent icon"]')).to.exist;
      else if (importanceLevel === 'Information')
        expect(field.find('[aria-label="Event importance information icon"]')).to.exist;
      else if (importanceLevel === 'Warning')
        expect(field.find('[aria-label="Event importance warning icon"]')).to.exist;
    });

  //Asset
  cy.assetsGrid()
    .eq(index - 1)
    .then((field) => {
      assetGrid = field.text();
    });

  //Data Channel
  cy.dataChannelsGrid()
    .eq(index)
    .then((dataChannel) => {
      dataChannelGrid = dataChannel.text();
    });

  //Reading Time
  cy.readingTimestampGrid()
    .eq(index)
    .then((reading) => {
      readingTimeGrid = reading.text();
    });

  //Reading
  cy.readingsGrid()
    .eq(index)
    .then((field) => {
      readingGrid = field.text();
    });

  //Message
  cy.messageGrid()
    .eq(index)
    .then((field) => {
      messageGrid = field.text();
    });
  cy.messageGrid().eq(index).click({
    force: true,
  });

  cy.wait('@messageRecord').should('have.property', 'status', 200);


  //Verify title
  cy.pageHeader().then((eventName) => {
    expect(eventName).to.contain(eventNameGrid);
  });

  cy.assetNameContainer().then((field) => {
    const asset = field.text();
    expect(asset).to.be.equal(assetGrid);
  });

  cy.dataChannelContainer().then((field) => {
    const dataChannel = field.text();
    expect(dataChannel).to.be.equal(dataChannelGrid);
  });

  cy.readingValueContainer().then((field) => {
    const readingValue = field.text();
    expect(readingValue).to.be.equal(readingGrid);
  });

  cy.readingTimestampContainer().then((field) => {
    const readingTimeStamp = field.text();
    expect(readingTimeStamp).to.be.equal(readingTimeGrid);
  });

  cy.eventMessageContainer().then((field) => {
    const eventMessage = field.text();
    expect(eventMessage).to.be.equal(messageGrid);
  });

  cy.msgCreatedDate().then((date) => {
    const created = date.text();
    expect(created).to.be.equal(createdDateGrid);
  });

  cy.findAllByText('Active').should('be.visible');
});

Cypress.Commands.add('clickOnAssetTitle', () => {
  cy.get('[aria-label="Asset title"] a', { timeout: 5000 })
    .first()
    .click({ force: true })
    .then((asset) => {
      let assetTitle = asset.text();
      cy.waitProgressBarToDisappear();

      cy.findAllByText(assetTitle).should('be.visible');
    });
});

Cypress.Commands.add('verifyAllMessageDetailsAfterAcknowledged', (index) => {
  var acknowledgedDate, acknowledgedName;

  //Acknowledged
  cy.acknowledgedOnContainer()
    .eq(index)
    .then((ack) => {
      acknowledgedDate = ack.text();
    });

  //Acknowledged Name
  cy.get('[aria-label="Acknowledged by"]')
    .eq(index)
    .then((ack) => {
      acknowledgedName = ack.text();
    });

  cy.verifyMessageDetails(index);

  cy.acknowledgedOnContainer().then((field) => {
    const acknowledgedOn = field.text();

    expect(acknowledgedOn.slice(0, -8).trim()).to.be.equal(
      acknowledgedDate.slice(0, -8).trim()
    );
  });

  cy.acknowledgedByContainer().then((field) => {
    const acknowledgedBy = field.text();

    expect(acknowledgedBy).to.be.equal(acknowledgedName);
  });
});

Cypress.Commands.add('verifyAcknowledgeColumnsEmpty', (index) => {
  cy.get('[aria-label="Acknowledged on"]').eq(index).should('have.value', '');
  cy.get('[aria-label="Acknowledged by"]').eq(index).should('have.value', '');
});

Cypress.Commands.add('verifyNotesAndNotificationsTabs', () => {
  cy.notesTab().should('be.visible');
  cy.notificationsTab().should('be.visible').click();
  cy.notesTab().click();
});

Cypress.Commands.add('selectRosterIfExistAndVerifyNotificationDetails', () => {
  cy.get('tbody tr', { timeout: 20000 }).each(($el, index) => {
    const roasterTxt = $el.find('[aria-label="First roster name"]').text();

    if (roasterTxt.length > 1) {
      assetTitle = index;
      assetIndex = index + 1;
      cy.verifyNotificationDetails();
      return false;
    } else {
      cy.log('Roaster does not exist');
    }
  });
});

let assetTitle, assetIndex;
Cypress.Commands.add('selectAssetInGrid', (text) => {
  cy.assetsGrid()
    .each(($el, index) => {
      const msg = $el.text();

      if (msg === text) {
        cy.messageGrid().eq(index);
        assetIndex = index;
        return false;
      }
    })
    .then(() => {
      cy.log(assetIndex);
    });
});

Cypress.Commands.add('verifyNotificationDetails', () => {
  var createdDateGrid,
    assetGrid,
    dataChannelGrid,
    readingTimeGrid,
    readingGrid,
    eventNameGrid,
    messageGrid,
    roastersGrid;

  cy.server();
  cy.route('POST', routes.retrieveEventByIdUrl).as('notificationDetails');

  //Created on
  cy.createdOnGrid()
    .eq(assetIndex)
    .then((field) => {
      createdDateGrid = field.text();
    });

  //Event Name
  cy.eventNameGrid()
    .eq(assetIndex)
    .then((field) => {
      eventNameGrid = field.text();
    });

  //Asset
  cy.assetTitleGrid()
    .eq(assetTitle)
    .then((field) => {
      assetGrid = field.text();
    });

  //Data Channel
  cy.dataChannelsGrid()
    .eq(assetIndex)
    .then((dataChannel) => {
      dataChannelGrid = dataChannel.text();
    });

  //Reading Time
  cy.readingTimestampGrid()
    .eq(assetIndex)
    .then((reading) => {
      readingTimeGrid = reading.text();
    });

  //Reading
  cy.readingsGrid()
    .eq(assetIndex)
    .then((field) => {
      readingGrid = field.text();
    });

  //Roasters
  cy.rostersGrid()
    .eq(assetIndex)
    .then((field) => {
      roastersGrid = field.text();
    });

  //Message
  cy.messageGrid()
    .eq(assetIndex)
    .then((field) => {
      messageGrid = field.text();
    });
  cy.messageGrid().eq(assetIndex).click({
    force: true,
  });

  cy.wait('@notificationDetails').should('have.property', 'status', 200);

  //Verify title
  cy.pageHeader().then((eventName) => {
    expect(eventName).to.contain(eventNameGrid);
  });

  cy.assetNameContainer().then((field) => {
    const asset = field.text();
    expect(asset).to.be.equal(assetGrid);
  });

  cy.dataChannelContainer().then((field) => {
    const dataChannel = field.text();

    expect(dataChannel).to.be.equal(dataChannelGrid);
  });

  cy.eventNameGrid().then((field) => {
    const eventRule = field.text();

    expect(eventRule).to.be.equal(eventNameGrid);
  });

  cy.readingValueContainer().then((field) => {
    const readingValue = field.text();

    expect(readingValue).to.be.equal(readingGrid);
  });

  cy.readingTimestampContainer().then((field) => {
    const readingTimeStamp = field.text();

    expect(readingTimeStamp).to.be.equal(readingTimeGrid);
  });

  cy.msgCreatedDate().then((date) => {
    const created = date.text();

    expect(created).to.be.equal(createdDateGrid);
  });

  cy.findAllByText('Active').should('be.visible');

  cy.findByText('Notifications').click();


  //Count of product items from API response
  cy.get('@notificationDetails').then((xhr) => {
    cy.rosterEmailAddCol()
      .first()
      .should(
        'contain',
        xhr.response.body.retrieveEventDetailByIdResult.eventRosterDetails[0]
          .emailAddress
      );
  });
});

Cypress.Commands.add('verifyNotesDetails', (user) => {
  cy.get('[aria-label="Note author username"]')
    .first()
    .then((userName) => {
      var userNameTxt = userName.text().toString().toLowerCase();

      expect(userNameTxt.includes(user.toString().toLowerCase())).to.be.true;
    });

  cy.notesDate()
    .first()
    .then((time) => {
      var timeTxt = time.text();
      cy.log('timeTxt' + timeTxt);
      cy.log('today' + today);

      expect(timeTxt.includes(today)).to.be.true;
    });
});

Cypress.Commands.add('clickOptionsOfViewDropdown', (viewDropdown) => {
  cy.get('[aria-haspopup="listbox"]')
    .first()
    .find('li')
    .each(($el) => {
      if ($el.text() === viewDropdown) {
        $el.click();
      }
    });
});

Cypress.Commands.add('clickOptionsOfEventTypesDropdown', (viewEventType) => {
  cy.get('[aria-haspopup="listbox"]')
    .eq(1)
    .find('li')
    .each(($el) => {
      if ($el.text() === viewEventType) {
        $el.click();
      }
    });
});

Cypress.Commands.add('verifyMsgColumn', (recordtext) => {
  cy.messageGrid().each(($el) => {
    const cellName = $el.text();

    if (cellName.toLowerCase(recordtext)) {
      expect(true).to.be.true;
      cy.log('The filter matches the substring');
    } else {
      cy.log('The filter doesnt match the substring');
      cy.log(cellName);
    }
  });

  Cypress.Commands.add('selectAssetWithNoMsg', (text) => {
    cy.notesGrid().each(($el, index) => {
      const msg = $el.text();

      if (msg === text) {
        cy.notesGrid().eq(index).click({
          force: true,
        });
      }
    });

    cy.log(index);
  });
});

Cypress.Commands.add('addEventNotes', () => {
  cy.server();
  cy.route('GET', routes.retrieveActiveEventByOptionsUrl).as('eventRecords');

  const notesText = 'Events Test ' + utilFunctions.randomString();

  cy.addNotes().clear().type(notesText);
  cy.clickAddButton('Save Note', routes.saveEventNoteUrl);
  cy.verifyNotesDetails(Cypress.env('USERNAME'));
  cy.clickBackArrow().click();
  cy.wait('@eventRecords').should('have.property', 'status', 200);
  cy.url().should('includes', '/ops/events');
  cy.selectIndex('Yes');
  cy.get('[aria-label="Note text"]', { timeout: 30000 }).each(($el, index) => {
    const actNotesTxt = $el.text();
    if (actNotesTxt === notesText) {
      expect(actNotesTxt).to.be.equal(notesText);
      return false;
    }
  });
});

Cypress.Commands.add('addNotesAndVerifyDetails', () => {
  cy.get('tbody tr', { timeout: 20000 }).each(($el, index) => {
    const msgTxt = $el.find('[aria-label="Has notes"]').text();

    if (msgTxt === 'No') {
      cy.messageGrid()
        .eq(index + 1)
        .click({ force: true });
      noteIndex = index + 1;
      cy.log(noteIndex);
      cy.addEventNotes();
      return false;
    } else if (msgTxt === 'Yes') {
      cy.messageGrid()
        .eq(index + 1)
        .click({ force: true });
      noteIndex = index + 1;
      cy.log(noteIndex);
      cy.addEventNotes();
      return false;
    }
  });
});

var noteIndex;
Cypress.Commands.add('selectNoteInGrid', (text) => {
  cy.notesGrid()
    .each(($el, index) => {
      const msg = $el.text();

      if (msg === text) {
        cy.messageGrid().eq(index).click({
          force: true,
        });
        noteIndex = index;
        return false;
      }
    })
    .then(() => {
      cy.log(noteIndex);
    });
});

Cypress.Commands.add('selectIndex', (text) => {
  cy.get('tbody tr [aria-label="Has notes"]').each(($el) => {
    const msg = $el.text();

    if (msg === text) {
      cy.messageGrid().eq(noteIndex).click({
        force: true,
      });
      return false;
    }
  });
});

Cypress.Commands.add('clickOnGridColumn', (text) => {

  cy.get('[role="columnheader"]').each(($el) => {
    if ($el.text() === text) {
      $el.click();
    }
  });
  cy.wait(2000);
});
Cypress.Commands.add('verifyEventTypeIcon', () => {
  cy.get('[aria-label="Event rule description"]').then((ruleDescription) => {
    if (ruleDescription.text() === 'Missing Data') return cy.missingDataIcon();
    else return cy.tankContainerIcon();
  });
});
