var webusb = {};

(function () {
  'use strict';

  webusb.get = function () {
    return navigator.usb.getDevices().then(devices => {
      return devices.map(device => new webusb.Device(device));
    });
  };

  webusb.request = function () {
    const filters = [
      { 'vendorId': 0x2fe3, 'productId': 0x0100 },
      { 'vendorId': 0x2fe3, 'productId': 0x000a },
      { 'vendorId': 0x1915, 'productId': 0x0060 },
    ];
    return navigator.usb.requestDevice({ 'filters': filters }).then(
      device => new webusb.Device(device)
    );
  }

  webusb.Device = function (device) {
    this.device = device;
  };

  webusb.Device.prototype.connect = function () {
    let read = () => {
      const {
        endpointNumber
      } = this.device.configuration.interfaces[0].alternate.endpoints[0]
      this.device.transferIn(endpointNumber, 64).then(result => {
        this.onReceive(result.data);
        read();
      }, error => {
        this.onReceiveError(error);
      });
    };

    return this.device.open()
      .then(() => {
        if (this.device.configuration === null) {
          return this.device.selectConfiguration(1);
        }
      })
      .then(() => this.device.claimInterface(0))
      .then(() => {
        read();

        return Promise.resolve();
      });
  };

  webusb.Device.prototype.disconnect = function () {
    return this.device.close();
  };

  webusb.Device.prototype.send = function (data) {
    const {
      endpointNumber
    } = this.device.configuration.interfaces[0].alternate.endpoints[1]
    return this.device.transferOut(endpointNumber, data);
  };


  webusb.connect = function () {
    return webusb.request().then(device => {
      webusb.device = device;
      device.onReceive = data => {
        let textDecoder = new TextDecoder();
        console.log("Received:", textDecoder.decode(data));
      }
      device.onReceiveError = error => {
        console.error(error);
        webusb.device.disconnect();
      };
      return device.connect();
    });
  };

  webusb.send = function (string) {
    console.log("sending to webusb:" + string.length);
    if (string.length === 0)
      return;
    console.log("sending to webusb: [" + string + "]\n");

    let view = new TextEncoder('utf-8').encode(string);
    console.log(view);
    if (webusb.device) {
      webusb.device.send(view);
    }
  };

})();

export { webusb };
