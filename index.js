#!/usr/bin/env nodejs

var HID = require('node-hid');

var settings = require('./settings.js');

var stripe = require('stripe')(settings.stripe.testing.api_key);

var scancodeDecode = require('./lib/scancode_decode.js');
var creditCardParse = require('./lib/credit_card_parse.js');



var dev = new HID.HID(settings.usb_device.vendor_id, settings.usb_device.product_id);

dev.on('error', function(err) {

});


dev.on('data', function(data) {
    var str = scancodeDecode(data);
    if(str) {
        var i;
        for(i=0; i < str.length; i++) {
            dev.emit('char', str[i]);
        }
    }
});

var lineBuffer = '';

dev.on('char', function(char) {
    lineBuffer += char;

    if(char == '\n') {
        dev.emit('line', lineBuffer);
        lineBuffer = '';
    }
});


// note: amount is in U.S. cents
function payWithCreditCard(card, amount, callback) {
    stripe.charges.create({
        amount: amount,
        currency: 'USD',
    card: card,
        description: "sudoroom hackomat purchase"
    }, callback);
}


var chargeAmount = 100; // in cents

dev.on('line', function(line) {
    var cc = creditCardParse(line);
    if(cc) {
        console.log(cc);
        cc = settings.stripe.testing.card; // Remove this when not testing
        payWithCreditCard(cc, chargeAmount, function(err) {
            if(err) {
                console.error("Credit card payment failed: " + err);
                process.exit(1);
            }
            console.log("Payment of " + chargeAmount + " cents succeeded!");
        });
    }
});
