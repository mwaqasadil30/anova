// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './administrationCommands/assetCommands/product-commands';
import './administrationCommands/assetCommands/poll-schedule-commands';
import './administrationCommands/assetCommands/site-commands';
import './administrationCommands/assetCommands/tree-commands';
import './administrationCommands/assetCommands/group-commands';
import './administrationCommands/assetCommands/tank-dimension-commands';
import './operationsCommands/asset-summary-commands';
import './operationsCommands/events-commands';
import './administrationCommands/assetCommands/heliumISOContainer-commands';
import './administrationCommands/assetCommands/asset-configuration-commands';
import './administrationCommands/assetCommands/asset-editor-commands';
import './administrationCommands/assetCommands/quick-tank-commands';
import './administrationCommands/assetCommands/asset-editor-commands';
import './operationsCommands/assetDetails-commands';
import './operationsCommands/maps-commands';
import './administrationCommands/assetCommands/domainCommands/user-domain-commands';
import './administrationCommands/eventsCommands/roster-commands';
import './operationsCommands/watchlist-commands';
import './operationsCommands/problemReports-commands';
import './administrationCommands/eventsCommands/messageTemplate-commands';
import './administrationCommands/eventsCommands/geofencing-command';
import './operationsCommands/dataChannel-commands';
import './freezerCommands/freezerDetailsCommands';
import './administrationCommands/assetCommands/newAPSiteList-commands';
import './operationsCommands/fullEditEvents-commands';
import './operationsCommands/contactSupport-commands';
import './administrationCommands/assetCommands/rtu-editor-commands';
import './operationsCommands/airProductAssetDetail-commands';
import './operationsCommands/assetQuickEdit-commands';
import './systemSearchCommands/rtuSearchCommands';
import 'cypress-localstorage-commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')
