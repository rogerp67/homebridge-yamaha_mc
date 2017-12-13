var request = require("request");
var YamahaYXC = require("./yamahayxc.js");


var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  
  homebridge.registerAccessory("homebridge-yamaha_mc", "YamahaMC", Yamaha_mcAccessory);
}

function Yamaha_mcAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.host = config["host"];
  this.zone = config["zone"];
  var yamaha = new YamahaYXC(host);
  var zone = this.zone;
  
  this.service = new Service.YMCMechanism(this.name);
  
  this.service
    .getCharacteristic(Characteristic.YMCCurrentState)
    .on('get', this.getState.bind(this));
  
  this.service
    .getCharacteristic(Characteristic.YMCTargetState)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

Yamaha_mcAccessory.prototype.getState = function(callback) {
  this.log("Getting current state...");
  
  yamaha.getStatus(zone);
  
  yamaha.getStatus().done(function(result){
        //console.log('result:' + result);
      var json = JSON.parse(result);
      var state = json.power; // "on" or "off"
      this.log("YMC state is %s", state);
      var onState = state == "on"
      callback(null, onState); // success
  }.bind(this));
}
  
Yamaha_mcAccessory.prototype.setState = function(state, callback) {
  var ymcState = (state == Characteristic.YMCCurrentState.ON) ? "on" : "off";

  this.log("Set state to %s", ymcState);

  if (ymcState == "on") yamaha.powerOn(zone);
  else yamaha.powerOff(zone);
    
   // we succeeded, so update the "current" state as well
   var currentState = (state == Characteristic.YMCCurrentState.ON) ?
   Characteristic.YMCCurrentState.ON : Characteristic.YMCCurrentState.OFF;
      
   this.service
        .setCharacteristic(Characteristic.YMCCurrentState, currentState);
   callback(null); // success

  }.bind(this);
}

Yamaha_mcAccessory.prototype.getServices = function() {
  return [this.service];
}
