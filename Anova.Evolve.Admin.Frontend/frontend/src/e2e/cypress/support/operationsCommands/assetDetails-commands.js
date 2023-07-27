import '@testing-library/cypress/add-commands';
import moment from 'moment';
const routes = require('../../fixtures/routes.json');
import UtilFunctions from '../utils/UtilFunctions';
const utilFunctions = new UtilFunctions();
let LevelMappedPrescaling = null;
let assetTitle = null;
const URL = Cypress.config('baseUrl')
var environment = URL.match("https://(.*).transcend");
switch (environment[1]) {
  case 'test':
    LevelMappedPrescaling = routes.qa_retriveLevelMappedPrescaling;
    assetTitle = 'Aliquid aspernatur aut quis eos et optio. Mohr LLC';
    break;
  case 'staging':
    LevelMappedPrescaling = routes.staging_retriveLevelMappedPrescaling;
    assetTitle = 'Analog Asset Bulk Strata Ltd.';
    break;
}

Cypress.Commands.add('linkedToSetpoints', () => {
  cy.get('td[aria-label="Description"]').eq(0).click({ force: true })
  cy.wait(200)
  cy.contains('General Information').parent().siblings('Div').eq(0).click();
  cy.contains('Set as Primary').parent().next('Div').then((boxMsg) => {
    const SetasPrimary = boxMsg.text();
    if (SetasPrimary !== "Yes") {
      cy.wait(200)
      cy.contains('Set as Primary').parent().next().find('div > label > span').eq(0).click();
      cy.get('button:contains("Yes")').click({ force: true });
    }
    cy.get('button:contains("Save & Close")').click({ force: true });
  });
  cy.wait(200)
  cy.contains('General Information').should('be.visible').click()
  cy.contains('Primary').should('be.visible')
  cy.get('.MuiTableHead-root > .MuiTableRow-root > .MuiTableCell-root').eq(5).should('have.text', 'Set Point')
  cy.get('.MuiTableContainer-root').eq(1).find('table > thead > tr > .MuiTableCell-root').eq(4).should('have.text', 'Set Point')
});

Cypress.Commands.add('backToAssetDetail', () => {
  cy.get('.MuiIconButton-label .MuiSvgIcon-root').click()
});

Cypress.Commands.add('notLinkedToSetpoints', () => {
  cy.get('td[aria-label="Description"]').eq(1).click({ force: true })
  cy.wait(200)
  cy.contains('General Information').should('be.visible').click()
  cy.contains('Secondary').should('be.visible')
  cy.get('.MuiTableHead-root > .MuiTableRow-root > .MuiTableCell-root').eq(5).should('not.have.text', 'Set Point')
  cy.get('.MuiTableContainer-root').eq(1).find('table > thead > tr > .MuiTableCell-root').eq(4).should('not.have.text', 'Set Point')
});

Cypress.Commands.add('assetDescriptionCell', () => {
  cy.get('[aria-label="Asset Description"] a', { timeout: 5000 });
});

Cypress.Commands.add('assetInfoHeaderPanel', () => {
  cy.get('[id="panel1a-header"]', { timeout: 10000 });
});

Cypress.Commands.add('assetInfoEditBtn', () => {
  cy.get('[id="panel1a-header"] button', { timeout: 5000 });
});

Cypress.Commands.add('assetInfoDetailsSection', () => {
  cy.get('[aria-labelledby="panel1a-header"]');
});

Cypress.Commands.add('stateCell', () => {
  cy.get('[aria-label="State"]', { timeout: 5000 });
});

Cypress.Commands.add('statusCell', () => {
  cy.get('[aria-label="Status"]', { timeout: 5000 });
});

Cypress.Commands.add('countryCell', () => {
  cy.get('[aria-label="Country"]', { timeout: 5000 });
});

Cypress.Commands.add('cityCell', () => {
  cy.get('[aria-label="City"]', { timeout: 5000 });
});

Cypress.Commands.add('streetAddressCell', () => {
  cy.get('[aria-label="Street Address"]', { timeout: 5000 });
});

Cypress.Commands.add('dataChannelDescription', () => {
  cy.get('[aria-label="Data channel description"]', { timeout: 5000 });
});

Cypress.Commands.add('emptyEventDescription', () => {
  cy.get('[aria-label="Empty event configuration"]', { timeout: 5000 });
});


Cypress.Commands.add('readingTimeStamp', () => {
  cy.get('[aria-label="Latest reading timestamp"]');
});

Cypress.Commands.add('valueAndUnitsOld', () => {
  cy.get('[aria-label="Events accordion details"]');
});

Cypress.Commands.add('valueAndUnits', () => {
  cy.get('[aria-label="Value and units"]');
});
//

Cypress.Commands.add('eventDescription', () => {
  cy.get('[aria-label="Event descriptions"]');
});

// Asset Information locators

Cypress.Commands.add('assetInformationPanel', () => {
  cy.get('[id="panel1a-header"]', { timeout: 5000 });
});

Cypress.Commands.add('assetInformationContent', () => {
  cy.get('[id="panel1a-content"]', { timeout: 5000 });
});

Cypress.Commands.add('assetCustomerName', () => {
  cy.get('[aria-label="Customer name"]', { timeout: 5000 });
});

Cypress.Commands.add('siteAddressCell', () => {
  cy.get('[aria-label="Site address"]', { timeout: 5000 });
});

Cypress.Commands.add('postalCodeAndCountry', () => {
  cy.get('[aria-label="Postal code and country"]', { timeout: 5000 });
});

Cypress.Commands.add('contactInfo', () => {
  cy.get('[aria-label="Contact info"]', { timeout: 5000 });
});

Cypress.Commands.add('siteNotes', () => {
  cy.get('[aria-label="Site notes"]', { timeout: 5000 });
});

Cypress.Commands.add('assetNotesCell', () => {
  cy.get('[aria-label="Asset notes"]', { force: true });
});

Cypress.Commands.add('customPropertiesList', () => {
  cy.get('[aria-label="asset information list"]', { timeout: 5000 });
});

Cypress.Commands.add('rtuDeviceId', () => {
  cy.get('[aria-controls="Rtu device id"]', { timeout: 5000 });
});

Cypress.Commands.add('rtuPanelHeader', () => {
  cy.get('[id="rtu-panel-header"]', { timeout: 5000 });
});

Cypress.Commands.add('eventsPanelHeader', () => {
  cy.get('[id="events-panel-header"]', { timeout: 5000 });
});

Cypress.Commands.add('rtuPanelHeader', () => {
  cy.get('[id="rtu-panel-header"]', { timeout: 5000 });
});

Cypress.Commands.add('rtuPanelHeader', () => {
  cy.get('[id="rtu-panel-header"]', { timeout: 5000 });
});

// Data channel table locators
Cypress.Commands.add('descriptionCell', () => {
  cy.get('td[aria-label="Description"]', { timeout: 5000 });
});

Cypress.Commands.add('rtuDeviceCell', () => {
  cy.get('td[aria-label="RTU device ID"]', { timeout: 5000 });
});

Cypress.Commands.add('latestReadingValue', () => {
  cy.get('td[aria-label="Latest reading value"]', { timeout: 5000 });
});

Cypress.Commands.add('readingTime', () => {
  cy.get('td[aria-label="Reading time"]', { timeout: 5000 });
});

Cypress.Commands.add('eventStatus', () => {
  cy.get('td[aria-label="Event status"]', { timeout: 5000 });
});

Cypress.Commands.add('productDesc', () => {
  cy.get('td[aria-label="Product description"]', { timeout: 5000 });
});

Cypress.Commands.add('assetDetailsPanelHeader', () => {
  cy.get('[aria-label="Asset details panel header"]', { timeout: 5000 });
});

Cypress.Commands.add('rtuPanelDetails', () => {
  cy.get('[aria-label="RTU accordion details"]', { timeout: 5000 });
});

// Events panel locators

Cypress.Commands.add('eventDataChannelDesc', () => {
  cy.get('[aria-label="Events accordion details"] [aria-label="Data channel description"]', { timeout: 5000 });
});

Cypress.Commands.add('eventsDescription', () => {
  cy.get('[aria-label="Event description"]', { timeout: 5000 });
});

Cypress.Commands.add('eventConfig', (event) => {
  cy.get(`[aria-label="${event} event configuration"]`);
});

Cypress.Commands.add('rtuPanelContent', () => {
  cy.get('[aria-controls="rtu-panel-content"]', { timeout: 5000 });
});

Cypress.Commands.add('verticalPanelContent', () => {
  cy.get('[aria-controls="vertical-panel-content"]', { timeout: 5000 });
});

Cypress.Commands.add('panelHeader', () => {
  cy.get('[id="panel1a-header"]', { timeout: 5000 });
});

Cypress.Commands.add('eventView', () => {
  cy.get('[aria-labelledby="view-input"]', { timeout: 5000 });
});

Cypress.Commands.add('editnewRosters', () => {
  cy.get('[aria-label= "Edit Rosters"]', { timeout: 5000 }).eq(0);
});

Cypress.Commands.add('rostersEntry', () => {
  cy.get('[id="rosters.0.rosterId-input"]', { timeout: 5000 });
});

Cypress.Commands.add('clickOnTable', () => {
  cy.get('[aria-pressed="false"]');
})


Cypress.Commands.add('verifyTimeWithinRequiredHours', (time, hours) => {

  const timeSubtractedWithRequiredHours = moment().subtract(hours, 'hours');
  const timeDifferenceInHours = moment(time).diff(timeSubtractedWithRequiredHours, 'hours');
  const timeWithinRequiredHours = 0 <= timeDifferenceInHours && timeDifferenceInHours <= hours;


  if (timeWithinRequiredHours == true) {
    assert.isTrue(true, 'The time stamp reading is within ' + hours + ' hours')
  }

  else {
    assert.isFalse(false, 'The time stamp reading is not within ' + hours + '  hours')
  }

});


Cypress.Commands.add('verifyDCTimeStamp', (hours) => {


  cy.clickOnTable().click();
  cy.readingTimeStamp().first().then((timeStamp) => {
    const time = timeStamp.text()
    cy.verifyTimeWithinRequiredHours(time, hours);

  });

});


Cypress.Commands.add('verifyReadingTimeWithDataChannelCard', (hours) => {

  cy.findByRole('tab', { name: /Readings/i }).click();
  cy.wait(3000);
  cy.waitProgressBarToDisappear();
  cy.get('tbody tr td').first().then((time) => {
    const readingTime = time.text()

    cy.readingTimeStamp().eq(0).then((timeStamp) => {
      const cardtime = timeStamp.text()
      expect(readingTime).to.be.equal(cardtime);
    });
    cy.verifyTimeWithinRequiredHours(readingTime, hours);
  });

});

Cypress.Commands.add('verifyNewReadingTimeWithDataChannelCard', (hours) => {
  cy.server();
  // cy.findAllByText('Details').click({ force: true });
  cy.route('POST', routes.saveAssetDetails).as('saveAssetDetails');
  cy.findAllByText('4W').click();
  cy.wait('@saveAssetDetails').should('have.property', 'status', 200);
  cy.findByRole('tab', { name: /Readings/i }).click();
  cy.wait(3000);
  cy.waitProgressBarToDisappear();
  cy.get('[type="checkbox"]').eq(2).check();
  cy.wait(5000);
  cy.get('tbody tr td').first().then((time) => {
    const readingTime = time.text()

    cy.readingTimeStamp().eq(2).then((timeStamp) => {
      const cardtime = timeStamp.text()
      expect(readingTime).to.be.equal(cardtime);
    });
    cy.verifyTimeWithinRequiredHours(readingTime, hours);
  });

});


Cypress.Commands.add('verifyTimeForMissingDataEvent', () => {

  cy.get('tr').then((eventsLength) => {
    const items = Cypress.$(eventsLength).length;

    if (Number(items) > 1) {
      cy.get('tbody [aria-label="Created on"]').first().then((time) => {
        const readingTime = time.text()
        cy.verifyIfTimeNotWithinRequiredHoursCheckInactiveEvents(readingTime);
      });
    }

    else {
      cy.verifyLatestTimeForInactiveEvents(2);
    }
  });

});


Cypress.Commands.add('verifyTimeForLevelEvent', () => {


  cy.get('tbody [aria-label="Created on"]').first().then((time) => {
    const readingTime = time.text()
    cy.verifyIfTimeNotWithinRequiredHoursCheckInactiveEvents(readingTime);
  });

});

Cypress.Commands.add('verifyActiveTimeForLevelEvent', (hours) => {


  cy.get('tbody [aria-label="Created on"]').first().then((time) => {
    const readingTime = time.text()
    cy.verifyTimeWithinRequiredHours(readingTime, hours);
  });

});




Cypress.Commands.add('verifyIfTimeNotWithinRequiredHoursCheckInactiveEvents', (time) => {


  const timeSubtractedWithRequiredHours = moment().subtract(2, 'hours');
  const timeDifferenceInHours = moment(time).diff(timeSubtractedWithRequiredHours, 'hours');
  const timeWithinRequiredHours = 0 <= timeDifferenceInHours && timeDifferenceInHours <= 2;


  if (timeWithinRequiredHours == true) {
    assert.isTrue(true, 'The time stamp reading is within 2 hours')
  }

  else {
    assert.isFalse(false, 'The time stamp reading is not within 2 hours, Checking the latest time for Inactive Events')
    cy.verifyLatestTimeForInactiveEvents(2);
  }


});



Cypress.Commands.add('selectEventsCheckBox', (text) => {
  cy.get('[role="listbox"]')
    .find('li')
    .each(($el, index) => {
      const level = $el.text();

      if (level === text) {
        cy.get('[role="listbox"]')
          .find('[type="checkbox"]')
          .eq(index - 1)
          .click({
            force: true,
          });
      }
    });
});




Cypress.Commands.add('verifyLatestTimeForInactiveEvents', (hours) => {

  cy.server();
  cy.route('POST', routes.retrieveInactiveEventByOptionsUrl).as('eventRecords');
  cy.viewDropdown().click();
  cy.verifyViewDropdownFields();
  cy.levelDropdown('Inactive');
  cy.wait('@eventRecords').should('have.property', 'status', 200);
  cy.get('tbody [aria-label="Created on"]').first().then((time) => {
    const readingTime = time.text()
    cy.verifyTimeWithinRequiredHours(readingTime, hours);
  });

});


Cypress.Commands.add('executeRTUReading', (reading) => {

  var timestamp = new Date();
  var inverseOffset = moment(timestamp).utcOffset() * -1;
  timestamp = moment().utcOffset(inverseOffset);

  const utcTime = timestamp.toISOString().slice(0, -4) + '0000000';

  cy.request({
    method: 'POST',
    url: Cypress.config('apiBaseUrl') + '/WebServices/api/Readings',
    body: {
      "ProviderId": "0000010",
      "Readings": [
        {
          "DeviceId": "F0000646",
          "ChannelNumber": "1",
          "Reading": reading,
          "UnitOfMeasure": "Ins WC",
          "ReadingTime": utcTime
        }
      ]
    },
    auth: {
      username: 'file@TestAutomation',
      password: 'KAi7f7LCqpVxfK@nCL4aKTfYv$kW3d'
    }
  })
    .then(response => {
      expect(response.status).equal(200)
    });


  cy.wait(3000)
});


let assetDescTitle, custName, siteAddress, siteNote;
Cypress.Commands.add('verifyAssetInformationDetails', () => {
  cy.get('@assetDetails').then((xhr) => {
    cy.log('asset title from response: ' + xhr.response.body.asset.assetTitle);

    //verify asset title from API response
    cy.pageHeader().then((header) => {
      assetDescTitle = header.text();
      expect(assetDescTitle).to.be.equal(xhr.response.body.asset.assetTitle);
    });

    //verify Customer Name
    cy.assetCustomerName().then(($field) => {
      custName = $field.text();

      if ($field.text().includes('None')) {
        expect(xhr.response.body.asset.siteInfo.customerName).to.be.undefined;
      } else {
        expect(custName).to.be.equal(
          xhr.response.body.asset.siteInfo.customerName
        );
      }
    });

    //verify Address details
    cy.siteAddressCell().then(($field) => {
      siteAddress = $field.text();

      if ($field.text().includes('None')) {
        expect(xhr.response.body.asset.siteInfo.address1).to.be.undefined;
        expect(xhr.response.body.asset.siteInfo.city).to.be.undefined;
        expect(xhr.response.body.asset.siteInfo.state).to.be.undefined;
        expect(xhr.response.body.asset.siteInfo.country).to.be.undefined;
        expect(xhr.response.body.asset.siteInfo.postalCode).to.be.undefined;
      } else {
        expect(siteAddress).to.include(
          xhr.response.body.asset.siteInfo.address1,
          xhr.response.body.asset.siteInfo.city,
          xhr.response.body.asset.siteInfo.state
        );
      }
    });

    //verify site notes
    cy.siteNotes().then(($field) => {
      siteNote = $field.text();

      if ($field.text().includes('None')) {
        expect(xhr.response.body.asset.siteInfo.siteNotes).to.be.undefined;
      } else {
        expect(siteNote).to.be.equal(
          xhr.response.body.asset.siteInfo.siteNotes
        );
      }
    });

  });
});

let dcDesc, valueUnits, readingTimeStamp, dcValue;
Cypress.Commands.add('getDataChannelCardDetails', () => {

  cy.dataChannelDescription().first().scrollIntoView().then((field) => {
    dcDesc = field.text()
  })

  cy.valueAndUnitsOld().first().then((field) => {
    valueUnits = field.text()
  })

  cy.readingTimeStamp().first().then((field) => {
    readingTimeStamp = field.text()
  })

  cy.clickOnTable().click();
  cy.dataChannelValuePanel().first().then((field) => {
    dcValue = field.text()
  })

});



Cypress.Commands.add('verifyMapsAssetDetailsPanelRecords', () => {
  cy.wait(1000)

  //Verify Data channel card details
  cy.dataChannelTypePanel().then((field) => {
    const dcType = field.text()
    expect(dcType).to.include(dcDesc)
  })

  cy.readingTimeStamp().then((field) => {
    const time = field.text()
    expect(time).to.be.eq(readingTimeStamp)
  })

  cy.dataChannelValuePanel().then((field) => {
    const dcIconValue = field.text()
    expect(dcIconValue).to.be.eq(dcValue)
  })

  //Verify Customer asset details 
  cy.assetCustomerName().then((field) => {
    const name = field.text()
    expect(name).to.be.eq(custName)
  })

  cy.siteAddressCell().then((field) => {
    const address = field.text()
    expect(address).to.include(siteAddress)
  })

  cy.siteNotes().then((field) => {
    const notes = field.text()
    expect(notes).to.be.eq(siteNote)
  })

  //Verify lat,long and time zone from API
  cy.get('@assetDetails').then((xhr) => {

    cy.siteLatitude().then(($field) => {
      const latitude = $field.text();

      if ($field.text() == 'None' || $field.text() == '-') {
        expect(xhr.response.body.asset.siteInfo.latitude).to.be.undefined;
      } else {
        expect(Number(latitude)).to.be.equal(
          xhr.response.body.asset.siteInfo.latitude
        );
      }
    });

    cy.siteLongitude().then(($field) => {
      const longitude = $field.text();

      if ($field.text() == 'None' || $field.text() == '-') {
        expect(xhr.response.body.asset.siteInfo.longitude).to.be.undefined;
      } else {
        expect(Number(longitude)).to.be.equal(
          xhr.response.body.asset.siteInfo.longitude
        );
      }
    });

    cy.timeZonePanel().then(($field) => {
      const timeZone = $field.text();

      if ($field.text() == 'None' || $field.text() == '-') {
        expect(xhr.response.body.asset.siteInfo.siteTimeZoneDisplayName).to.be.undefined;
      } else {
        expect(timeZone).to.be.equal(
          xhr.response.body.asset.siteInfo.siteTimeZoneDisplayName
        );
      }
    });

    cy.contact().then(($field) => {
      const contact = $field.text();

      if ($field.text() == 'None' || $field.text() == '-') {
        expect(xhr.response.body.asset.siteInfo.customerContactName).to.be.undefined;
        expect(xhr.response.body.asset.siteInfo.customerContactPhone).to.be.undefined;
      } else {
        expect(contact).to.include(
          xhr.response.body.asset.siteInfo.customerContactName,
          xhr.response.body.asset.siteInfo.customerContactPhone
        );
      }
    });

  })



});




Cypress.Commands.add('verifyDataChannelTableFromAPI', () => {
  cy.get('@assetDetails').then((xhr) => {
    cy.log('asset title from response: ' + xhr.response.body.asset.assetTitle);

    cy.rtuDeviceCell().each(($el, index) => {
      if ($el.text() == null || $el.text() == '-' || $el.text() == '') {
        expect(xhr.response.body.asset.dataChannels[index].rtuDeviceId).to.be.null
      }
      else if ($el.text() == undefined) {
        expect(xhr.response.body.asset.dataChannels[index].rtuDeviceId).to.be.undefined
      }
      else {
        expect($el.text()).to.be.equal(
          xhr.response.body.asset.dataChannels[index].rtuDeviceId);
      }
    })


    cy.productDesc().each(($el, index) => {
      if ($el.text() == null || $el.text() == '-' || $el.text() == '') {
        expect(xhr.response.body.asset.dataChannels[index].productDescription).to.be.null
      }
      else if ($el.text() == undefined) {
        expect(xhr.response.body.asset.dataChannels[index].productDescription).to.be.undefined
      }
      else {
        expect($el.text()).to.be.equal(
          xhr.response.body.asset.dataChannels[index].productDescription);
      }
    })
  })

});


Cypress.Commands.add('verifyRTUPanelDetails', () => {

  cy.get('@assetDetails').then((xhr) => {

    cy.rtuDeviceId().then(($field) => {
      const rtuID = $field.text();
      expect(rtuID).to.include(
        xhr.response.body.asset.dataChannels[0].rtuDeviceId
      );
    });

    cy.clickOnTable().click();
    cy.rtuPanelDetails().find('[aria-label="Latest reading timestamp"]').then(($field) => {
      const time = $field.text();
      const utcTime = xhr.response.body.asset.dataChannels[0].latestReadingTimestamp;

      var date = new Date(utcTime);
      const readingDateTime = moment(date).format('M/D/YYYY h:mm:ss A')

      expect(time).to.be.eq(readingDateTime);
    });

  });

});

Cypress.Commands.add('verifyEventsPanelDetails', (eName) => {
  let description;


  cy.get('@assetDetails').then((xhr) => {

    cy.eventConfig(eName).then((config) => {
      const eventsValue = config.text();
      cy.log("*********************" + eventsValue);


      for (var i = 0; i < ((xhr.response.body.asset.dataChannels.length) - 2); i++) {
        cy.log(xhr.response.body.asset.dataChannels.length);
        if (xhr.response.body.asset.dataChannels[i].description == description) {
          for (var j = 0; j <= ((xhr.response.body.asset.dataChannels[i].uomParams.eventRules.length) - 1); j++) {
            cy.log("second block" + xhr.response.body.asset.dataChannels[i].uomParams.eventRules.length);
            if (xhr.response.body.asset.dataChannels[i].uomParams.eventRules[j].description == eName) {

              expect(eventsValue).to.include(xhr.response.body.asset.dataChannels[i].uomParams.eventRules[j].eventValue)
            }
          }
        }
      }
    })


  })

});



Cypress.Commands.add('verifyReadingsCountFromAPIResponse', () => {

  //Count of readings count from API response
  cy.wait('@dcReadings').then((xhr) => {

    cy.itemCount()
      .then(function (itemsCount) {
        const items = itemsCount.text();
        var itemsList = items.split('f');
        itemsList = itemsList[1].trim();

        expect(Number(itemsList)).to.be.equal(
          xhr.response.body.length
        );
      });

  });

});

Cypress.Commands.add('verifyCollapseFunctionality', (eventsDelivery, asset) => {

  cy.verticalPanelContent().then((verticalPanel) => {

    const verticalPanelTxt = verticalPanel.text();
    expect(verticalPanelTxt.includes(eventsDelivery)).to.be.true;
  })

  cy.panelHeader().then((headerPanel) => {

    const headerPanelTxt = headerPanel.text();
    expect(headerPanelTxt.includes(asset)).to.be.true;
  })

});


Cypress.Commands.add('verifyCheckAndUnCheckDataChannels', () => {

  cy.wait(2000);
  cy.get('[aria-label="data channel card"] [type="checkbox"]').each(($el, index) => {

    if ($el.attr('checked')) {
      cy.get('[aria-label="Data channel description"]').eq(index).then((dataChannel) => {
        const dataChannelTxt = dataChannel.text().toLowerCase();
        cy.wait(2000);
        cy.get('[role="columnheader"]', { timeout: 90000 }).each(($el) => {

          const columnName = $el.text().toLowerCase();
          if (columnName.includes(dataChannelTxt)) {
            assert.isTrue(true, 'The selected Data Channel column is displayed in the Reading Table')
          }
        })
      });

    }

    else {
      cy.get('[aria-label="data channel card"] [type="checkbox"]').eq(index).check().should('be.checked');

      cy.waitProgressBarToDisappear();
      cy.wait(1000);

      cy.get('[aria-label="Data channel description"]').eq(index).then((dataChannel) => {
        const dataChannelTxt = dataChannel.text().toLowerCase();

        cy.get('[role="columnheader"]').each(($el) => {

          const columnName = $el.text().toLowerCase();
          if (columnName.includes(dataChannelTxt)) {
            assert.isTrue(true, 'The selected Data Channel column is displayed in the Reading Table')
          }
        })
      });

    }
  })

  cy.get('[aria-label="data channel card"] [type="checkbox"]').first().uncheck();
  cy.get('[aria-label="Data channel description"]').first().then((dataChannel) => {
    const dataChannelTxt = dataChannel.text().toLowerCase();

    cy.get('[role="columnheader"]').each(($el) => {

      const columnName = $el.text().toLowerCase();
      if (!columnName.includes(dataChannelTxt)) {
        assert.isTrue(true, 'The unchecked Data Channel column is not displayed in the Reading Table')
      }
    })

  });
});


let notes, createdDateGrid, assetGrid, dataChannelGrid, readingTimeGrid, readingGrid, messageGrid, eventNameGrid, importanceLevel,
  acknowledgedOn, acknowledgedBy;
Cypress.Commands.add('getEventsFields', (index) => {

  cy.server();
  cy.route('POST', routes.retrieveEventByIdUrl).as('messageRecord');

  //has Notes
  cy.notesGrid()
    .eq(index)
    .then((field) => {
      notes = field.text();
    });


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
  cy.get('p[aria-label="Asset title"]')
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

  //Message
  cy.messageGrid()
    .eq(index)
    .then((field) => {
      messageGrid = field.text();
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

  //Acknowledged On
  cy.acknowledgedOnContainer()
    .eq(index)
    .then((field) => {
      acknowledgedOn = field.text();
    });

  //Acknowledged By
  cy.acknowledgedByContainer()
    .eq(index)
    .then((field) => {
      acknowledgedBy = field.text();
    });


});

Cypress.Commands.add('verifyFieldsFromEventsScreen', (assetTitleName) => {

  cy.server();
  cy.route('POST', routes.retrieveEventByIdUrl).as('messageRecord');

  //Search for that specific asset
  cy.assetsGrid().each(($el, index) => {
    if ($el.text() == assetTitleName) {
      const indexRow = index + 1;

      //has Notes
      cy.notesGrid()
        .eq(indexRow)
        .then((field) => {
          const hasNotes = field.text();
          expect(hasNotes).to.be.equal(notes);
        });


      //Created on
      cy.createdOnGrid()
        .eq(indexRow)
        .then((field) => {
          const date = field.text();
          expect(date).to.be.equal(createdDateGrid);
        });

      //Event Name
      cy.eventNameGrid()
        .eq(indexRow)
        .then((field) => {
          const event = field.text();
          expect(event).to.be.equal(eventNameGrid);

        });

      //Importance Level
      cy.importanceLevelGrid()
        .eq(indexRow)
        .then((field) => {
          const impLevel = field.text();
          expect(impLevel).to.be.equal(importanceLevel);

        });

      //Asset
      cy.assetsGrid()
        .eq(index)
        .then((field) => {
          const asset = field.text();
          expect(asset).to.be.equal(assetGrid);

        });

      //Data Channel
      cy.dataChannelsGrid()
        .eq(indexRow)
        .then((field) => {
          const dc = field.text();
          expect(dc).to.be.equal(dataChannelGrid);
        });

      //Message
      cy.messageGrid()
        .eq(indexRow)
        .then((field) => {
          const msg = field.text();
          expect(msg).to.be.equal(messageGrid);
        });

      //Reading Time
      cy.readingTimestampGrid()
        .eq(indexRow)
        .then((field) => {
          const reading = field.text();
          expect(reading).to.be.equal(readingTimeGrid);
        });

      //Reading
      cy.readingsGrid()
        .eq(indexRow)
        .then((field) => {
          const value = field.text();
          expect(value).to.be.equal(readingGrid);
        });

      //Acknowledged On
      cy.acknowledgedOnContainer()
        .eq(indexRow)
        .then((field) => {
          const ackOn = field.text();
          expect(ackOn).to.be.equal(acknowledgedOn);
        });

      //Acknowledged By
      cy.acknowledgedByContainer()
        .eq(indexRow)
        .then((field) => {
          const ackBy = field.text();
          expect(ackBy).to.be.equal(acknowledgedBy);
        });

      return false;

    }

  })
})


Cypress.Commands.add('verifyActiveOrInactiveEventsFromAPI', (apiCall, index) => {
  cy.get(apiCall).then((xhr) => {

    cy.notesGrid()
      .eq(index)
      .then((field) => {

        if (field.text() == 'Yes') {
          expect(xhr.response.body[0].hasNotes).to.be.true
        }
        else if (field.text() == 'No') {
          expect(xhr.response.body[0].hasNotes).to.be.false
        }

      });


    //Created on
    cy.createdOnGrid()
      .eq(index)
      .then((field) => {
        const utcTime = xhr.response.body[0].createdOn;

        var date = new Date(utcTime);
        const dateTime = moment(date).format('M/D/YYYY h:mm:ss A');
        expect(field.text()).to.be.eq(dateTime);
      });


    //Event Name
    cy.eventNameGrid()
      .eq(index)
      .then((field) => {
        expect(field.text()).to.be.eq(xhr.response.body[0].eventDescription);
      });

    //Asset Title
    cy.get('p[aria-label="Asset title"]')
      .eq(index - 1)
      .then((field) => {
        expect(field.text()).to.be.eq(xhr.response.body[0].assetTitle);
      });

    //Data Channel
    cy.dataChannelsGrid()
      .eq(index)
      .then((field) => {
        expect(field.text()).to.be.eq(xhr.response.body[0].dataChannelDescription);

      });

    //Message
    cy.messageGrid()
      .eq(index)
      .then((field) => {
        expect(field.text()).to.be.eq(xhr.response.body[0].message);
      });

    //Reading Time
    cy.readingTimestampGrid()
      .eq(index)
      .then((field) => {
        const utcReadingTime = xhr.response.body[0].readingTimestamp;

        var date = new Date(utcReadingTime);
        const dateTime = moment(date).format('M/D/YYYY h:mm:ss A');
        expect(field.text()).to.be.eq(dateTime);
      });

    //Reading
    cy.readingsGrid()
      .eq(index)
      .then((field) => {
        expect(field.text()).to.include(xhr.response.body[0].readingValue);
      });

    //Acknowledged On
    cy.acknowledgedOnContainer()
      .eq(index)
      .then((field) => {
        const utcAckTime = xhr.response.body[0].acknowledgedOn;
        var date = new Date(utcAckTime);
        const dateTime = moment(date).format('M/D/YYYY h:mm:ss A');

        if (field.text() == null || field.text() == '-' || field.text() == '') {
          expect(utcAckTime).to.be.null
        }
        else {
          expect(field.text()).to.be.eq(dateTime);
        }
      });

    //Acknowledged By
    cy.acknowledgedByContainer()
      .eq(index)
      .then((field) => {

        if (field.text() == null || field.text() == '-' || field.text() == '') {
          expect(xhr.response.body[0].acknowledgeUserName).to.be.null
        }
        else {
          expect(field.text()).to.include(xhr.response.body[0].acknowledgeUserName);
        }

      });

  })

})


Cypress.Commands.add('verifyInactiveEventsCountFromAPI', (index) => {
  cy.get('@inactiveEvents').then((xhr) => {

    cy.itemCount()
      .then(function (itemsCount) {
        const items = itemsCount.text();
        var itemsList = items.split(' ');
        itemsList = itemsList[0].trim();

        expect(Number(itemsList)).to.be.equal(
          xhr.response.body.length
        );

      })

  })
})


Cypress.Commands.add('verifySiteAndAssetNotesHiddenFunctionality', () => {

  cy.server();
  cy.route('POST', routes.retrieveSiteByIdUrl).as('getAssetInfo');

  cy.assetInfoEditBtn().click();
  cy.wait('@getAssetInfo').should('have.property', 'status', 200);

  cy.get('[id="siteId-input-label"] button').should('not.exist');
  cy.get('[id="siteNotes-input"]').should('have.text', '').and('be.disabled');
  cy.get('[id="siteNotes-input"]').should('have.text', '').and('be.disabled');

  cy.clickAddButton('Save & Close', routes.saveEditAssetDetails);
  cy.verifyNotesOnAssetDetailsScreen('Site Notes');
  cy.verifyNotesOnAssetDetailsScreen('Asset Notes');

});

Cypress.Commands.add('verifyNotesOnAssetDetailsScreen', (text) => {

  cy.get('[id="panel1a-content"] div').each(($el, index) => {
    const div = $el.text();
    if (div === text) {

      cy.get('[id="panel1a-content"] div')
        .eq(index).then((divSection) => {
          const divText = divSection.text();
          expect(divText).to.be.equal(text)
        })
    }
  });

});

Cypress.Commands.add('enterAndVerifyEventRules', () => {

  const eventFullValue = utilFunctions.randomNumber(1, 9),
    highPressureValue = utilFunctions.randomNumber(1, 20),
    lowPressureValue = utilFunctions.randomNumber(1, 25),
    usageRateNotLinked = utilFunctions.randomNumber(1, 50),
    hour = utilFunctions.randomNumber(0, 10),
    min = utilFunctions.randomNumber(5, 59);

  cy.intercept("GET", "/DataChannel/36c24898-0d3a-eb11-86c4-00155d55772b/conversion").as("set1");
  cy.intercept("GET", "/DataChannel/3ac24898-0d3a-eb11-86c4-00155d55772b/conversion").as("set2");
  cy.intercept("GET", "/DataChannel/04523d61-9c9e-eb11-86cc-00155d55772b/conversion").as("set3");
  //Level with Inventory State linked to setpoint
  cy.get('[id="dataChannels.0.inventoryEvents.0.eventValue-input"]').should('be.enabled');
  //Usage Rate linked to setpoint
  cy.get('[id="dataChannels.0.usageRateEvent.eventValue-input"]').should('be.enabled');

  //Level without Inventory State NOT linked to setpoint
  cy.wait(2000);
  cy.get('[id="dataChannels.1.levelEvents.0.eventValue-input"]').clear().type(highPressureValue);
  cy.get('[id="dataChannels.1.levelEvents.1.eventValue-input"]').clear().type(lowPressureValue);

  //Level with Inventory State linked to setpoint
  cy.get('[id="dataChannels.2.inventoryEvents.0.eventValue-input"]').clear().type(eventFullValue);
  //Usage Rate NOT linked to setpoint
  cy.get('[name="dataChannels.2.usageRateEvent.eventValue"]').clear().type(usageRateNotLinked);
  //Missing Data 
  cy.get('[id="dataChannels.2.missingDataEvent.maxDataAgeByHour-input"]').clear().type(hour);
  cy.get('[id="dataChannels.2.missingDataEvent.maxDataAgeByMinute-input"]').clear().type(min);

  cy.findByText('Save & Close').click();
  cy.wait("@set1");
  cy.wait("@set2");
  cy.wait("@set3");

  //Verify event values on Asset details screen
  cy.get('[aria-label="Event description"]', { timeout: 10000 }).contains("Full").then((fullEventValue) => {
    const eventValueTxt = fullEventValue.text();
    cy.log("Full event value: " + eventValueTxt);
    cy.log(eventFullValue);
    expect(eventValueTxt.includes(eventFullValue)).to.be.true;
  });

  cy.log(2000);

  cy.get('[aria-label="Event description"]', { timeout: 10000 }).contains("High Pressure").then((highPressure) => {
    const highPressureTxt = highPressure.text();
    cy.log("High Pressure Value: " + highPressureTxt);
    cy.log(highPressureValue);
    expect(highPressureTxt.includes(highPressureValue)).to.be.true;
  });

  cy.log(2000);

  cy.get('[aria-label="Event description"]', { timeout: 10000 }).contains("Low Pressure").then((lowPressure) => {
    const lowPressureTxt = lowPressure.text();
    cy.log("Low Pressure Value: " + lowPressureTxt);
    cy.log(lowPressureValue);
    expect(lowPressureTxt.includes(lowPressureValue)).to.be.true;
  });

  cy.log(2000);

  cy.get('[aria-label="Event description"]', { timeout: 10000 }).contains("Missing Data").then((missingData) => {
    const missingDataTxt = missingData.text();
    const minutes = (hour * 60) + min;
    cy.log("Missing Data: " + missingDataTxt);
    cy.log(minutes);
    expect(missingDataTxt.includes(minutes)).to.be.true;
  });

  cy.log(2000);

  cy.get('[aria-label="Event description"]', { timeout: 10000 }).contains("High Usage").then((highUsage) => {
    const highUsageTxt = highUsage.text();
    cy.log("High Usage Rate: " + highUsageTxt);
    cy.log(usageRateNotLinked)
  });

});


Cypress.Commands.add('verifyQuickEditEventDisabledFunctionality', () => {

  cy.intercept('GET', routes.quickEditEvents).as('retrieveQuickEvents');

  //events panel cannot be edited for published assets
  cy.get('[id="events-panel-header"] button').should('not.exist');

});


Cypress.Commands.add('enterAndVerifyIntegrationID', () => {

  cy.intercept('GET', routes.quickEditEvents).as('retrieveQuickEvents');

  const integrationID = utilFunctions.randomNumber(1, 10),
    integrationIDLevel = utilFunctions.randomNumber(1, 20),
    integrationIDPressure = utilFunctions.randomNumber(1, 20),
    integrationIDMissingData = utilFunctions.randomNumber(1, 30);


  //Level Data Channel linked to setpoints
  cy.get('[id="dataChannels.0.inventoryEvents.0.integrationName-input"]').clear({ force: true }).type(integrationIDLevel);
  cy.get('[id="dataChannels.0.usageRateEvent.integrationName-input"]').clear({ force: true }).type(integrationID);

  //Pressure Data Channel
  cy.get('[id="dataChannels.1.levelEvents.0.integrationName-input"]').clear({ force: true }).type(integrationIDPressure);
  cy.get('[id="dataChannels.1.levelEvents.1.integrationName-input"]').clear({ force: true }).type(integrationID);

  //level Data Channel not linked to setpoints
  cy.get('[id="dataChannels.2.inventoryEvents.0.integrationName-input"]').clear({ force: true }).type(integrationID);
  cy.get('[id="dataChannels.2.inventoryEvents.1.integrationName-input"]').clear({ force: true }).type(integrationID);
  //Missing Data and High usage
  cy.get('[id="dataChannels.2.usageRateEvent.integrationName-input"]').clear({ force: true }).type(integrationID);
  cy.get('[id="dataChannels.2.missingDataEvent.integrationName-input"]').clear({ force: true }).type(integrationIDMissingData);

  cy.findByText('Save & Close').click();

  //Go to the events drawer and verify the Integration ID
  cy.get('[id="events-panel-header"] button').click();
  cy.wait('@retrieveQuickEvents').then(({ response }) => { expect(response.statusCode).to.eq(200) });

  cy.get('[id="dataChannels.0.inventoryEvents.0.integrationName-input"]', { timeout: 10000 }).invoke('val')
    .then((actIntegrationIDLevel) => {
      const actIntegrationIDLevelVal = actIntegrationIDLevel;
      expect((integrationIDLevel).toString()).to.be.equal((actIntegrationIDLevelVal).toString());
    });
  cy.get('[id="dataChannels.1.levelEvents.0.integrationName-input"]', { timeout: 10000 }).invoke('val')
    .then((actIntegrationIDPressure) => {
      const actIntegrationIDPressureVal = actIntegrationIDPressure;
      expect((integrationIDPressure).toString()).to.be.equal((actIntegrationIDPressureVal).toString());
    });

  cy.get('[id="dataChannels.2.missingDataEvent.integrationName-input"]', { timeout: 10000 }).invoke('val')
    .then((actIntegrationIDMissingData) => {
      const actIntegrationIDMissingDataVal = actIntegrationIDMissingData;
      expect((integrationIDMissingData).toString()).to.be.equal((actIntegrationIDMissingDataVal).toString());
    });

  cy.get('[id="dataChannels.2.inventoryEvents.0.integrationName-input"]', { timeout: 10000 }).invoke('val')
    .then((actintegrationID) => {
      const actintegrationIDVal = actintegrationID;
      expect((integrationID).toString()).to.be.equal((actintegrationIDVal).toString());
    });

  //Once Verified, Click on cancel button
  cy.clickButton('Cancel');

});


Cypress.Commands.add('goToQuickEditEventsPanel', () => {

  cy.intercept('GET', routes.quickEditEvents).as('retrieveQuickEvents');
  cy.get('[id="events-panel-header"] button').click();
  cy.wait('@retrieveQuickEvents').then(({ response }) => { expect(response.statusCode).to.eq(200) });

});
Cypress.Commands.add('addRosters', (hours) => {

  cy.rostersEntry().click();
  cy.selectDropdown('test roster domain');

});

Cypress.Commands.add('editRosters', (hours) => {

  cy.rostersEntry().click();
  cy.selectDropdown('testramsha');

});

Cypress.Commands.add('deleteRosters', (hours) => {

  cy.findAllByText('Remove').eq(0).click();

});

Cypress.Commands.add('checkForAvailableRosters', () => {

  cy.get('body').then($body => {
    if ($body.find('div[aria-haspopup="listbox"]').length > 7) {
      let count = $body.find('div[aria-haspopup="listbox"]').length;
      for (var i = 0; i < count - 7; i++) {
        cy.findAllByText('Remove').eq(0).click();
      }
    }
  });


});

Cypress.Commands.add('CreateProblemReportdoesnotappear', () => {
  cy.server().route('GET', routes.retrieveAssetDetailById).as('assetDetails');
  cy.clearNavItemIfVisible();
  cy.findAllByText('Show Filters').click({ force: true });
  cy.filterByDropdown().click();
  cy.selectDropdown('Asset Title');
  cy.filterByDropdown().should('have.text', 'Asset Title');
  cy.enterName(assetTitle + '{enter}');
  cy.assetDescriptionCell().first().click({ force: true });
  cy.wait('@assetDetails').should('have.property', 'status', 200);
  cy.assetInfoHeaderPanel().findAllByText('Asset Information').should('be.visible');
  cy.contains('[aria-label="Description"]', 'Level').prev().click();
  cy.contains('[role="menuitem"]', 'Create Problem Report').should('not.exist');
  cy.get('[aria-label="back"]').click({ force: true });

});
Cypress.Commands.add('openLevelMAppedPrescaling', () => {
  cy.intercept('GET', LevelMappedPrescaling).as('levelMapped')
  cy.contains('[aria-label="Description"]', 'Level - Mapped - prescaling').click()
  cy.wait('@levelMapped')
})
Cypress.Commands.add('openConfiguration', (rawMin, rawMax, scaleMin, scaleMax) => {
  cy.contains('Tank and Sensor Configuration').parent().siblings().find('button').click({ force: true });
  cy.get('#scalingModeId-input').click({ force: true })
  cy.get('[data-value="4"]').click()
  cy.get('#rawUnitsAtScaleMin-input').clear().type(rawMin)
  cy.get('#rawUnitsAtScaleMax-input').clear().type(rawMax)
  cy.get('#scaledMin-input').clear().type(scaleMin)
  cy.get('#scaledMax-input').clear().type(scaleMax)
  cy.get('[id="advanced-settings-header"]').contains('Show Additional Settings').click({ force: true })
  cy.get('#generateWithFunction-input').click({ force: true })
  cy.get('[data-value="horizontalTankWithFlatEnds"]').click({ force: true })
  cy.contains('Apply').click({ force: true })
})

Cypress.Commands.add('verifyScalingMap', (rawMin, rawMax, scaleMin, scaleMax) => {
  cy.get('[name="scalingdMap[0].item1"]').should('have.value', rawMin)
  cy.get('[name="scalingdMap[0].item2"]').should('have.value', scaleMin)
  cy.get('[name="scalingdMap[19].item1"]').should('have.value', rawMax)
  cy.get('[name="scalingdMap[19].item2"]').should('have.value', scaleMax)
  cy.contains('Save & Close').click();
  cy.wait(2000)
  cy.get('body').then($body => {
    if ($body.find('[role="dialog"]').length > 0) {
      cy.contains('OK').click();
      cy.wait(2000)
      cy.get('[aria-label="back"]').click()
      cy.wait(2000)
    }
  })
  cy.intercept('GET', LevelMappedPrescaling).as('levelMapped')
  cy.get('[aria-label="back"]').click()
  // cy.wait(4000)
  cy.wait('@levelMapped')
})
Cypress.Commands.add('rawValuesOnReport', () => {
  cy.contains('Raw Min - Max').siblings().should('have.text', '3 - 19 mA')
})

Cypress.Commands.add('scaleValuesOnReport', () => {
  cy.contains('Scaled Min - Max').siblings().should('have.text', '5 - 500 Ins WC')
})

Cypress.Commands.add('CSVDownloadReadingNorthAmerica', () => {
  cy.findByRole('tab', { name: /Readings/i }).should('exist');
  cy.findByRole('tab', { name: /Readings/i }).click();
  cy.get('[aria-label="Page header"]').should('have.text', 'Analog Asset Bulk Strata Ltd.');
  cy.findAllByText('Download').parent().invoke('attr', 'tabindex').should('eq', '0');
  cy.findAllByText('Download').click();
  cy.findAllByText('North America').click();
  cy.wait(8000);
  cy.task('countFiles', 'cypress/downloads').each((filename, index) => {
    if (filename.includes(' forecast readings ')) { }
    else {
      cy.readFile('cypress/downloads/' + filename).then((textLines) => {
        let row = textLines.split("\n").map(val => (val || '').trim()).filter(val => !!val)
        if (row[0] === '"Time","Level 1 (Ins WC)"') {
          let rowsLength = (row).length
          if (rowsLength > 100) {
            rowsLength = 100;
          }
          for (let i = 1; i < rowsLength; i++) {
            let documentDate = row[i];
            expect(documentDate).to.match(/^["]\d{4}-(0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])(\s)(?:0?[0-9]|1[0-2])[-:][0-5][0-9](\s)*[AP]M["][,]["](([0]["])|(\d*\.?\d*[1-9]+\d*["]$)|(\d*\.?\d*[0]+\d*["]$))/)
          }
        }
      })
    }
  })
})

Cypress.Commands.add('CSVDownloadReadingEurope', () => {
  cy.findByRole('tab', { name: /Readings/i }).should('exist');
  cy.findByRole('tab', { name: /Readings/i }).click();
  cy.get('[aria-label="Page header"]').should('have.text', 'Analog Asset Bulk Strata Ltd.');
  cy.findAllByText('Download').parent().invoke('attr', 'tabindex').should('eq', '0');
  cy.findAllByText('Download').click();
  cy.findAllByText('Europe').click();
  cy.wait(8000);
  cy.task('countFiles', 'cypress/downloads').each((filename, index) => {
    if (filename.includes(' forecast readings ')) { }
    else {
      cy.readFile('cypress/downloads/' + filename).then((textLines) => {
        let row = textLines.split("\n").map(val => (val || '').trim()).filter(val => !!val)
        if (row[0] === '"Time";"Level 1 (Ins WC)"') {
          let rowsLength = (row).length
          if (rowsLength > 100) {
            rowsLength = 100;
          }
          for (let i = 1; i < rowsLength; i++) {
            let documentDate = row[i];
            expect(documentDate).to.match(/^["]\d{4}-(0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])(\s)([01]?[0-9]|2[0-3]):[0-5][0-9]["][;]["](([0]["])|(\d*\,?\d*[1-9]+\d*["]$)|(\d*\,?\d*[0]+\d*["]$))/)
          }
        }
      })
    }
  })
})

Cypress.Commands.add('CSVDownloadForecastReadingNorthAmerica', () => {
  cy.findByRole('tab', { name: /Forecast/i }).should('exist');
  cy.findByRole('tab', { name: /Forecast/i }).click();
  cy.get('[aria-label="Page header"]').should('have.text', 'Analog Asset Bulk Strata Ltd.');
  cy.findAllByText('Download').parent().invoke('attr', 'tabindex').should('eq', '0');
  cy.findAllByText('Download').click();
  cy.findAllByText('North America').click();
  cy.wait(8000);
  cy.task('countFiles', 'cypress/downloads').each((filename, index) => {
    if (filename.includes(' forecast readings ')) {
      cy.readFile('cypress/downloads/' + filename).then((textLines) => {
        let row = textLines.split("\n").map(val => (val || '').trim()).filter(val => !!val)
        if (row[0] === '"Time","Level 1 (Ins WC)"') {
          let rowsLength = (row).length
          if (rowsLength > 100) {
            rowsLength = 100;
          }
          for (let i = 1; i < rowsLength; i++) {
            let documentDate = row[i];
            expect(documentDate).to.match(/^["]\d{4}-(0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])(\s)(?:0?[0-9]|1[0-2])[-:][0-5][0-9](\s)*[AP]M["][,]["](([0]["])|(\d*\.?\d*[1-9]+\d*["]$)|(\d*\.?\d*[0]+\d*["]$))/)
          }
        }
      })
    }
  })
})

Cypress.Commands.add('CSVDownloadForecastReadingEurope', () => {
  cy.findByRole('tab', { name: /Forecast/i }).should('exist');
  cy.findByRole('tab', { name: /Forecast/i }).click();
  cy.get('[aria-label="Page header"]').should('have.text', 'Analog Asset Bulk Strata Ltd.');
  cy.findAllByText('Download').parent().invoke('attr', 'tabindex').should('eq', '0');
  cy.findAllByText('Download').click();
  cy.findAllByText('Europe').click();
  cy.wait(8000);
  cy.task('countFiles', 'cypress/downloads').each((filename, index) => {
    if (filename.includes(' forecast readings ')) {
      cy.readFile('cypress/downloads/' + filename).then((textLines) => {
        let row = textLines.split("\n").map(val => (val || '').trim()).filter(val => !!val)
        if (row[0] === '"Time";"Level 1 (Ins WC)"') {
          let rowsLength = (row).length
          if (rowsLength > 100) {
            rowsLength = 100;
          }
          for (let i = 1; i < rowsLength; i++) {
            let documentDate = row[i];
            expect(documentDate).to.match(/^["]\d{4}-(0[1-9]|1[0-2])-([1-9]|0[1-9]|[12][0-9]|3[01])(\s)([01]?[0-9]|2[0-3]):[0-5][0-9]["][;]["](([0]["])|(\d*\,?\d*[1-9]+\d*["]$)|(\d*\,?\d*[0]+\d*["]$))/)
          }
        }
      })
    }
  })
})