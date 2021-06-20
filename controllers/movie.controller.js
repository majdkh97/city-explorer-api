const axios = require('axios');
const Movie = require('../models/movie.model');
require('dotenv').config();

const Cache = require('../helper/cache');
const movieObj = new Cache();


const movieController = (req,res) => {
  let cityName = req.query.city;
  let requestKey = `movie-${cityName}`;


  if(movieObj[requestKey] && Date.now()-movieObj[requestKey].timeStamp < 3000){
    res.json(movieObj[requestKey]);
    console.log('sent from cache');
  }else{
    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${cityName}`)
      .then(response => {
        const arrOfMovies = [];
        response.data.results.map(item => {
          let imageURL = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
          let movieObject = new Movie(item.title, item.overview, item.vote_average, item.vote_count, imageURL, item.popularity, item.release_date);
          arrOfMovies.push(movieObject);
        });
        movieObj[requestKey] = {};
        movieObj[requestKey].content = [];
        movieObj[requestKey].content = arrOfMovies;
        movieObj[requestKey].timeStamp = Date.now();
        res.send(arrOfMovies);
        console.log('sent from axios');
      })
      .catch(error => {
        res.send('Error hahahahahaha  ', error.message);
      });
  }
};

module.exports = movieController;
