var Service, Characteristic;

const request = require('request');
const url = require('url');
 
var yamaha;



module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-yamaha_mc", "YamahaMC", Yamaha_mcAccessory);
}

function Yamaha_mcAccessory(log, config) {
  this.currentState = false;
  this.log = log;
  this.name = config["name"];
  this.host = config["host"];
  this.zone = config["zone"];
  this.maxVol = config["maxvol"];
}

Yamaha_mcAccessory.prototype = {
  getServices: function () {
    let informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer, "Cambit")
      .setCharacteristic(Characteristic.Model, "Yamaha MC")
      .setCharacteristic(Characteristic.SerialNumber, "6710160330");
 
    let switchService = new Service.Switch("Receiver");
    switchService
      .getCharacteristic(Characteristic.On)
        .on('get', this.getSwitchOnCharacteristic.bind(this))
        .on('set', this.setSwitchOnCharacteristic.bind(this));

    let speakerService = new Service.Speaker("Receiver");
    speakerService
      .getCharacteristic(Characteristic.Mute)
        .on('get', this.getSpeakerMutedCharacteristic.bind(this))
        .on('set', this.setSpeakerMutedCharacteristic.bind(this));

    speakerService
      .getCharacteristic(Characteristic.Volume)
        .on('get', this.getSpeakerVolumeCharacteristic.bind(this))
        .on('set', this.setSpeakerVolumeCharacteristic.bind(this));

    this.informationService = informationService;
    this.switchService = switchService;
	this.speakerService = speakerService;
    return [informationService, switchService, speakerService];
  },
  
  getSwitchOnCharacteristic: function (next) {
    const me = this;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  me.log('HTTP GetStatus result:' + (att.power=='on' ? "On" : "Off"));
      return next(null, (att.power=='on'));
    });
  },
   
  setSwitchOnCharacteristic: function (on, next) {
    var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setPower?power=' + (on ? 'on' : 'standby');
	const me = this;
    request({
      url: url  ,
      method: 'GET',
      body: ""
    },
    function (error, response) {
      if (error) {
        //me.log('error with HTTP url='+url);
        me.log(error.message);
        return next(error);
      }
	  //me.log('HTTP setPower succeeded with url:' + url);
      return next();
    });
  },
  
  // speaker characteristics
  
  getSpeakerMutedCharacteristic: function (next) {
    const me = this;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  me.log('HTTP GetStatus result:' + (att.mute=='true' ? "On" : "Off"));
      return next(null, (att.mute=='true'));
    });
  },
   
  setSpeakerMutedCharacteristic: function (muted, next) {
    var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setMute?enable=' + (muted ? 'true' : 'false');
	const me = this;
    request({
      url: url  ,
      method: 'GET',
      body: ""
    },
    function (error, response) {
      if (error) {
        //me.log('error with HTTP url='+url);
        me.log(error.message);
        return next(error);
      }
	  //me.log('HTTP setMuted succeeded with url:' + url);
      return next();
    });
  },
  
  getSpeakerVolumeCharacteristic: function (next) {
    const me = this;
	var res;
    request({
        method: 'GET',
            url: 'http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/getStatus',
            headers: {
                'X-AppName': 'MusicCast/1.0',
                'X-AppPort': '41100',
			},
    }, 
    function (error, response, body) {
      if (error) {
        //me.log('HTTP get error ');
        me.log(error.message);
        return next(error);
      }
	  att=JSON.parse(body);
	  res = Math.floor(att.volume / this.maxVol * 100);
	  me.log('HTTP GetStatus result:' + res);
      return next(null, res);
    });
  },
   
  setSpeakerVolumeCharacteristic: function (volume, next) {
    var url='http://' + this.host + '/YamahaExtendedControl/v1/' + this.zone + '/setVolume?volume=' + Math.floor(volume/100 * this.maxVol);
	const me = this;
    request({
      url: url  ,
      method: 'GET',
      body: ""
    },
    function (error, response) {
      if (error) {
        //me.log('error with HTTP url='+url);
        me.log(error.message);
        return next(error);
      }
	  //me.log('HTTP setVolume succeeded with url:' + url);
      return next();
    });
  }
};
