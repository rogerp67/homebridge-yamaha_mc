"# homebridge-yamaha_mc" 
Based on the Yamaha Extended Control API Spec (https://github.com/samvdb/php-musiccast-api/blob/master/yxc-api-spec-advanced.pdf)
With this homebridge module you you can switch on and switch off your Yamaha Networked devices, in my case MusicCast devices.
 
Add this to the config.json, for each device you want to add. Just adjust the name and the IP address for each accessory. 
(The zone 'main' in general should work, not to be confused with room names):

"accessories": [
        {
          "accessory": "YamahaMC",
          "name": "Yamaha RN-602",
          "host": "192.168.1.210",
          "zone": "main"
        }   
    ]
