
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "mx.ferreyra.callnumber.CallNumber",
          "file": "plugins/mx.ferreyra.callnumber/www/CallNumber.js",
          "pluginId": "mx.ferreyra.callnumber",
        "clobbers": [
          "call"
        ]
        },
      {
          "id": "cordova-plugin-contacts.Contact",
          "file": "plugins/cordova-plugin-contacts/www/Contact.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "Contact"
        ]
        },
      {
          "id": "cordova-plugin-contacts.ContactAddress",
          "file": "plugins/cordova-plugin-contacts/www/ContactAddress.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "ContactAddress"
        ]
        },
      {
          "id": "cordova-plugin-contacts.ContactError",
          "file": "plugins/cordova-plugin-contacts/www/ContactError.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "ContactError"
        ]
        },
      {
          "id": "cordova-plugin-contacts.ContactField",
          "file": "plugins/cordova-plugin-contacts/www/ContactField.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "ContactField"
        ]
        },
      {
          "id": "cordova-plugin-contacts.ContactFindOptions",
          "file": "plugins/cordova-plugin-contacts/www/ContactFindOptions.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "ContactFindOptions"
        ]
        },
      {
          "id": "cordova-plugin-contacts.ContactName",
          "file": "plugins/cordova-plugin-contacts/www/ContactName.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "ContactName"
        ]
        },
      {
          "id": "cordova-plugin-contacts.ContactOrganization",
          "file": "plugins/cordova-plugin-contacts/www/ContactOrganization.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "ContactOrganization"
        ]
        },
      {
          "id": "cordova-plugin-contacts.contacts",
          "file": "plugins/cordova-plugin-contacts/www/contacts.js",
          "pluginId": "cordova-plugin-contacts",
        "clobbers": [
          "navigator.contacts"
        ]
        },
      {
          "id": "cordova-sms-plugin.Sms",
          "file": "plugins/cordova-sms-plugin/www/sms.js",
          "pluginId": "cordova-sms-plugin",
        "clobbers": [
          "window.sms"
        ]
        },
      {
          "id": "cordova-plugin-contacts.convertUtils",
          "file": "plugins/cordova-plugin-contacts/www/convertUtils.js",
          "pluginId": "cordova-plugin-contacts"
        },
      {
          "id": "cordova-plugin-contacts.ContactFieldType",
          "file": "plugins/cordova-plugin-contacts/www/ContactFieldType.js",
          "pluginId": "cordova-plugin-contacts",
        "merges": [
          ""
        ]
        },
      {
          "id": "cordova-plugin-contacts.Contact-iOS",
          "file": "plugins/cordova-plugin-contacts/www/ios/Contact.js",
          "pluginId": "cordova-plugin-contacts",
        "merges": [
          "Contact"
        ]
        },
      {
          "id": "cordova-plugin-contacts.contacts-ios",
          "file": "plugins/cordova-plugin-contacts/www/ios/contacts.js",
          "pluginId": "cordova-plugin-contacts",
        "merges": [
          "navigator.contacts"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "mx.ferreyra.callnumber": "0.0.2",
      "cordova-plugin-contacts": "3.0.1",
      "cordova-sms-plugin": "1.0.3"
    };
    // BOTTOM OF METADATA
    });
    