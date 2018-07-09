"# homebridge-yamaha_mc" 
Based on the Yamaha Extended Control API Spec (https://github.com/samvdb/php-musiccast-api/blob/master/yxc-api-spec-advanced.pdf)
With this homebridge module you you can switch on and switch off your Yamaha Networked devices, in my case MusicCast devices.
Since version 1.1 you can also use the Speaker functionality, beside the Switch functionality. Unfortunately HomeKit does not yet support this speaker accessory, it only sees the switch.
An app like Legato Eve does support it. You will see 2 devices on for your device: a switch and a speaker. Hopefully the next homekit app will too.
 
 
Add this to the config.json, for each device you want to add. Just adjust the name and the IP address for each accessory. 
The zone 'main' in general should work, not to be confused with room names.
For my Yamaha RN-602 the maximum volume setting is 161, for the W-030 it is 60. 
Check the max volume setting by using this url in your homenetwork: http://192.168.1.220/YamahaExtendedControl/v1/system/getFeatures (with your own IP of course)
Find the value at  "range step", volume, max in the JSON string result.

"accessories": [
        {
          "accessory": "YamahaMC",
          "name": "Yamaha RN-602",
          "host": "192.168.1.210",
          "zone": "main",
		  "maxvol":161
        }   
    ]
