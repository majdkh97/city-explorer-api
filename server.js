const express = require('express'); // require the express package
const app = express(); // initialize your express app instance
const cors = require('cors');
app.use(cors()); // after you initialize your express app instance
require('dotenv').config();


const weatherData = require('./data/weather.json');

class Forecast {
  constructor(data, description) {
    this.data = data;
    this.description = description;
  }
}

const port = process.env.PORT;

// a server endpoint
app.get('/', // our endpoint name
  function (req, res) { // callback function of what we should do with our request
    res.send('Hello World'); // our endpoint function response
  });

app.get('/weather',(req,res) => {
  const arrOfDays =[];
  weatherData.data.forEach(obj=>{
    let descriptionDay = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description}`;
    let weatherDay = new Forecast(obj.valid_date, descriptionDay);
    arrOfDays.push(weatherDay);
  });
  res.send(arrOfDays);
});

app.listen(port); // kick start the express server to work
