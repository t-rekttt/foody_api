# foody_api

A reverse engineered library from Foody Android app

Current functions:
- getPlacesByCityId(cityId, amount, offset = 0) -> Get places using cityId
- getPlacesByLocation = (lat, long, cityId, amount = 20, offset = 0) -> Get places by location coordinate
- getLocation = (lat, long) -> Get location info (cityId) from coordinate
- search = (keyword, cityId, amount = 20, offset = 0) -> Search for locations using keyword and cityId

Working examples:
- getPlacesByCityId(218, 1, 1).then(console.log);
- getPlacesByLocation('21.0228161', '105.8019441', 217, 1).then(console.log);
- getLocation('21.022815', '105.80194').then(console.log);
- search('kem', 218).then(console.log)
