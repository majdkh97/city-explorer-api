const axios = require('axios');
const Forecast = require('../models/weather.model');
require('dotenv').config();

const Cache = require('../helper/cache');
const cacheObj = new Cache();


const weatherController = (req,res) => {
  let latitude = req.query.lat;
  let longitude = req.query.lon;
  let requestKey = `${latitude}-${longitude}`;

  if (cacheObj[requestKey] && (Date.now()-cacheObj[requestKey].timeStamp < 3000)){
    res.json(cacheObj[requestKey].content);
    console.log('sent from the cache', cacheObj[requestKey]);
  }else{
    axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&lat=${latitude}&lon=${longitude}`).then(response => {
      const content = response.data.data.map(item => {
        let description = `Low of ${item.low_temp}, high of ${item.high_temp} with ${item.weather.description}`;
        return new Forecast(item.valid_date, description);
      });
      cacheObj[requestKey] = {};
      cacheObj[requestKey].content = [];
      cacheObj[requestKey].content = content;
      cacheObj[requestKey].timeStamp = Date.now();
      console.log('sent from the axios request',cacheObj[requestKey]);
      res.send(cacheObj[requestKey].content);
    }).catch(error => {
      res.send('Error hahahahahaha  ', error.message);
    });
  }
};


module.exports = weatherController;