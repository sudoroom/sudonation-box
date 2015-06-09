

THIS SOFTWARE IS NOT YET IN A WORKING STATE!


sudonation-box is a physical box that receives credit card donations for several different organizations or projects. It has one knob to selection organization or project, another to selection donation amount, a speaker that speaks out the transaction before confirmation, a button to explain what the project/group is about and a button to confirm the transaction. It of course also has a magnet card reader.

This repository includes the code for the node.js app and a laser-cuttable design for the box. The easy way to set this all up is to use the pre-made SD-card image for the raspberry pi (coming soon!).

# Software

## Setup

Set up an account with [Stripe](https://stripe.com) for each project/organization and get your API keys. You will need your test secret key and live secret key.

Plug in your magnetic stripe card reader and run list_usb_devices.js (with sudo) to get the vendor id and product id of the reader.

Make a settings file:

```
cp settings.js.example settings.js
chmod 600 settings.js
```

Edit the settings file:

* Fill out vendor_id and product_id for the card reader
* Add an entry in groups for each organization/project
* Fill out the testing and live API keys for each group

Now install the dependencies:

```
npm install
```

# Running

There are two modes. Testing mode is the default and will not actually charge any credit cards. It will also tolerate the lack of rotary encoder input and simply charge a default amount to a default group as specified in the settings.js file. 

To run in testing mode:

```
./index.js
```

To run in live mode:
```
./index.js --live
```

# Hardware

## Bill of materials

* One raspberry pi
* One SD card for the raspberry pi
* One USB magnetic stripe card reader (that acts like a keyboard)
* Two six-position rotary switches
* Two knobs for the rotary switches
* One set of powered speakers (5v powered preferred)
* Two buttons (built in light optional)
* One box/case (laser cuttable design included, but any box works)

Optional cash acceptor expansion:

* One bill acceptor with pulse output
* One Arduino Leonardo or equivalent