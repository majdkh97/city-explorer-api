class Movie {
  constructor(title, overview, averageVotes, totalVotes, imgUrl, popularity, releasedOn){
    this.title = title;
    this.overview = overview;
    this.average_votes = averageVotes;
    this.total_votes = totalVotes;
    this.image_url = imgUrl;
    this.popularity = popularity;
    this.released_on = releasedOn;
  }
}
module.exports = Movie;
