#!/usr/bin/env nodejs

var HID = require('node-hid');
var argv = require('minimist')(process.argv.slice(2), {
  boolean: ['live']
});

var settings = require('./settings.js');

var Stripe = require('stripe');

var scancodeDecode = require('./lib/scancode_decode.js');
var creditCardParse = require('./lib/credit_card_parse.js');

if(argv.live) {
  console.error("Live mode not yet implemented!");
  process.exit(1);
}

console.log("Running in testing mode");


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
function payWithCreditCard(group, card, amount, callback) {
    var api_key;
    if(argv.live) {
        api_key = group.stripe.live_api_key;
    } else {
        api_key = group.stripe.testing_api_key;
    }
    stripe = Stripe(api_key);
    stripe.charges.create({
        amount: amount,
        currency: 'USD',
    card: card,
        description: "sudonation-box donation"
    }, callback);
}

// read group from rotary dial 
function readGroup() {
  // TODO actually implement this
  if(!argv.live) {
    return settings.groups[settings.testing.group];
  }
}

// read charge amount from 
function readChargeAmount() {
  // TODO actually implement this
  if(!argv.live) {
    return settings.testing.amount;
  }
}

var chargeAmount;
var group;

dev.on('line', function(line) {
    var cc = creditCardParse(line);
    if(!cc) {
        console.error("failed to parse credit card");
        return;
    }
    if(!argv.live) {
        cc = settings.testing.stripe_card;
    }
    group = readGroup();
    chargeAmount = readChargeAmount();

    payWithCreditCard(group, cc, chargeAmount, function(err) {
        if(err) {
            console.error("Credit card payment failed: " + err);
            process.exit(1);
        }
        console.log("Payment of " + chargeAmount + " cents succeeded!");
    });
});
