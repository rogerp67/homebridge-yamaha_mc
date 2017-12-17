"# homebridge-yamaha_mc" 
Add this to the config.json, the last 3 items adjusted to your own situation
(although 'main' in general should work, not to be confused with rooms):

"accessories": [
        {
          "accessory": "YamahaMC",
          "name": "Yamaha RN-602",
          "host": "192.168.1.210",
          "zone": "main"
        }   
    ]
