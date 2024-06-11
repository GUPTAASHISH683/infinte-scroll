import React, { useState, useRef, useCallback } from "react";
import useMovie from './useMovie';

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';

export default function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const { movies, loading, hasMore, error } = useMovie(query, pageNumber);

  const observer = useRef();
  const lastMovieElementRef = useCallback(node => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  function handleSearch(e) {
    setQuery(e.target.value);
    setPageNumber(1);
  }

  function getClassByRate(vote) {
    if (vote >= 8) return 'green';
    else if (vote >= 5) return 'orange';
    else return 'red';
  }

  return (
    <div className="App">
      <header>
        <form id="form">
          <input type="text" id="search" className="search" value={query} onChange={handleSearch} placeholder="Search for movies..." />
        </form>
      </header>
      <main className="main">{movies.map((movie, index) => {
        if (movies.length === index + 1) {
          return (
            <div ref={lastMovieElementRef} key={movie.id} className="movie">
              <img src={IMG_PATH + movie.poster_path} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className={getClassByRate(movie.vote_average)}>{movie.vote_average}</span>
              </div>
              <div className="overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
            </div>
          );
        } else {
          return (
            <div key={movie.id} className="movie">
              <img src={IMG_PATH + movie.poster_path} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <span className={getClassByRate(movie.vote_average)}>{movie.vote_average}</span>
              </div>
              <div className="overview">
                <h3>Overview</h3>
                <p>{movie.overview}</p>
              </div>
            </div>
          );
        }
      })}</main>

      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </div>
  );
}
