let request = require('request-promise');
let jsontoxml = require('jsontoxml');
let hmacSHA256 = require('crypto-js/hmac-sha256');
let CryptoJS = require('crypto-js');

request = request.defaults({
  headers: {
    'X-Foody-Client-Name': 'FoodyApp_Android',
    'X-Foody-Client-Version': '5.0.3',
    'User-Agent': 'Foody/5.0.3 (OPPO LG-H961N; Android 5.1.1; density xhdpi)',
    'X-Foody-Client-Type': 'Android',
    'Content-Type': 'text/xml',
    'Accept': 'application/json',
    'Accept-Language': 'vi'
  },
  // proxy: 'http://localhost:8080',
  // strictSSL: false
});

const secret = '2ueirh439djwus832jdnsi28s';

let sign = (data, secret) => {
  let signed = hmacSHA256(data, secret);
  
  return signed.toString(CryptoJS.enc.Base64);
}

let signRequest = (url, secret, data = '') => {
  return sign(url+data, secret);
}

let getPlacesByCityId = (cityId, amount, offset = 0) => {
  let body = {
    Request: [
      { name: 'SortType', text: 1 },
      { name: 'City', attrs: { Id: cityId } },
      { name: 'CategoryGroup', attrs: { Id: 1 } },
      { name: 'RequestCount', text: amount },
      { name: 'NextItemId', text: offset }
    ]
  };

  body = jsontoxml(body);

  let url = 'https://api.foody.vn/api/directory/discover';

  return request.post(url, {
    body,
    headers: {
      'X-Foody-Access-Token': signRequest(url, secret, body)
    }
  })
  .then(res => JSON.parse(res));
}

let getPlacesByLocation = (lat, long, cityId, amount = 20, offset = 0) => {
  let body = {
    Request: [
      { name: 'SortType', text: 1 },
      { name: 'City', attrs: { Id: cityId } },
      { name: 'Position', attrs: { Lat: lat, Long: long } },
      { name: 'CategoryGroup', attrs: { Id: 1 } },
      { name: 'RequestCount', text: amount },
      { name: 'NextItemId', text: offset }
    ]
  };

  body = jsontoxml(body);

  let url = 'https://api.foody.vn/api/directory/discover';

  return request.post(url, {
    body,
    headers: {
      'X-Foody-Access-Token': signRequest(url, secret, body)
    }
  })
  .then(res => JSON.parse(res));
}

let getLocation = (lat, long) => {
  let url = `https://api.foody.vn/api/location/city?latitude=${lat}&longitude=${long}`;

  return request(url, {
    headers: {
      'X-Foody-Access-Token': signRequest(url, secret)
    }
  })
  .then(res => JSON.parse(res));
}

let search = (keyword, cityId, amount = 20, offset = 0) => {
  let body = {
    Request: [
      { name: 'City', attrs: { Id: cityId } },
      { name: 'CategoryGroup', attrs: { Id: 1 } },
      { name: 'RequestCount', text: amount },
      { name: 'NextItemId', text: offset },
      { name: 'Keywords', 
        children: [
          { Item: keyword }
        ] 
      },
      { name: 'ExpandCity', text: 'no' }
    ]
  };

  body = jsontoxml(body);

  let url = 'https://api.foody.vn/api/directory/search';

  return request.post(url, {
    body,
    headers: {
      'X-Foody-Access-Token': signRequest(url, secret, body)
    }
  })
  .then(res => JSON.parse(res));
}

// getPlacesByCityId(218, 1, 1).then(console.log);
// getPlacesByLocation('21.0228161', '105.8019441', 217, 1).then(console.log);
// getLocation('21.022815', '105.80194').then(console.log);
// search('kem', 218).then(console.log)

module.exports = { getLocation, getPlacesByCityId, getPlacesByLocation, search };