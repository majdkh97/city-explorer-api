const express = require('express'); // require the express package
const app = express(); // initialize your express app instance
const cors = require('cors');
const axios = require('axios');
app.use(cors()); // after you initialize your express app instance
require('dotenv').config();


// const weatherData = require('./data/weather.json');

class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}

class Movie {
  constructor(title, overview, average_votes, total_votes, image_url, popularity, released_on){
    this.title = title;
    this.overview = overview;
    this.average_votes = average_votes;
    this.total_votes = total_votes;
    this.image_url = image_url;
    this.popularity = popularity;
    this.released_on = released_on;
  }
}

const port = process.env.PORT;

// a server endpoint
app.get('/', // our endpoint name
  function (req, res) { // callback function of what we should do with our request
    res.send('Hello World'); // our endpoint function response
  });

app.get('/weather', (req, res) => {
  let latitude = req.query.lat;
  let longitude = req.query.lon;
  axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_KEY}&lat=${latitude}&lon=${longitude}`)
    .then(response => {
      const arrOfDays = [];
      response.data.data.map(item => {
        let description = `Low of ${item.low_temp}, High of ${item.high_temp} with ${item.weather.description}`;
        let dayWeather = new Forecast(item.valid_date, description);
        arrOfDays.push(dayWeather);
      });
      res.send(arrOfDays);
    })
    .catch(error => {
      res.send('KYS', error.message);
    });
});

app.get('/movies', (req, res) => {
  let cityName = req.query.city;
  axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`)
    .then(response => {
      const arrOfMovies = [];
      response.data.results.map(item => {
        let ImageUrl = 'https://image.tmdb.org/t/p/w500' + item.poster_path;
        let movieObject = new Movie(item.title, item.overview, item.vote_average, item.vote_count, ImageUrl, item.popularity, item.release_date);
        arrOfMovies.push(movieObject);
      });
      res.send(arrOfMovies);
    })
    .catch(error => {
      res.send('KYS', error.message);
    });
});

app.listen(port);
