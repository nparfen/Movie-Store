import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as Icon from 'react-feather';
import { getPopularMovies } from '../actions/movies';
import { add, remove } from '../actions/watchlist';

class Popular extends Component {
 
  componentDidMount(){

    let { dispatch } = this.props

    dispatch(getPopularMovies());

  }

  doWatchlist(movieId) {

    let { dispatch, movies } = this.props;

    let targetMovie;
    
    let updatedMovies = movies.map((movieRow, index) => {
      return movieRow.map((movie, index)=>{
        if(movie.id === movieId){
          if(movie.inWatchlist){

            targetMovie = Object.assign({}, movie, {
              inWatchlist: false
            });
            return targetMovie;
          } else {

            targetMovie = Object.assign({}, movie, {
              inWatchlist: true
            });
            return targetMovie;
          }
        } else {
          return movie;
        }
      }).filter(movie => movie != null);
    }).filter(movieRow => movieRow != null);

    if (!targetMovie.inWatchlist){
      return dispatch(remove({'movies':updatedMovies, 'movie':targetMovie}));
    } else {
      return dispatch(add({'movies':updatedMovies, 'movie':targetMovie}));
    }
    
  }

  render() {

    const Movies = ({movies}) => (
      <div className="container">
        {movies.map((moviesRow, rowIndex) => {
          return (<div className="row" key={rowIndex}>
            {moviesRow.map((movie, index) => 
              <div className="col-md-3" key={index}>
                <div className="card mb-4 box-shadow">
                    <img className="card-img-top" src={'https://image.tmdb.org/t/p/w500'+movie.poster} alt={movie.title}/>
                    <div className="card-body">
                        <h5 className="card-title">{movie.title+' '}<Icon.Eye onClick={this.doWatchlist.bind(this, movie.id)} className={(movie.inWatchlist) ? "watchlist added": "watchlist"}/></h5>
                        {movie.genres.map((genre, index)=>
                          <span className="badge badge-dark mr-2" key={index}>{genre}</span>
                        )}
                        <div className="mt-2">
                          <small className="text-muted">Rating:</small>
                          <div className="progress">
                            <div className={(movie.rating > 8) ? "progress-bar bg-success": (movie.rating < 6) ? "progress-bar bg-danger": "progress-bar bg-info"} role="progressbar" style={{width:movie.rating*10+'%'}} aria-valuenow={movie.rating} aria-valuemin="0" aria-valuemax="100">{movie.rating}%</div>
                          </div>
                        </div>
                    </div>
                </div>
              </div>
            )}
          </div>);
        })}
      </div>
    ); 

    return (
      <div>
        <h1 className="h2">Popular</h1>
        <Movies movies={this.props.movies}/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    movies:state.movies.movies
  }
}

export default connect(mapStateToProps)(Popular);
