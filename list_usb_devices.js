#!/usr/bin/env nodejs

var HID = require('node-hid');

var devices = HID.devices();

var i, key, device;
for(i=0; i < devices.length; i++) {
    device = devices[i];
    if(!device['manufacturer']) {
        console.error("Error getting USB device info. Try running this script as root.");
        process.exit(1);
    }

    for(key in device) {
        if(['vendorId', 'productId', 'manufacturer', 'product'].indexOf(key) > -1) {
            console.log(key + ": " + device[key]);
        }
    }
    console.log('');
}
