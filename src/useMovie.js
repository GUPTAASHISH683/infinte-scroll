import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useMovie(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    console.log('Resetting movies for new query:', query);
    setMovies([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    const endpoint = query
      ? 'https://api.themoviedb.org/3/search/movie'
      : 'https://api.themoviedb.org/3/discover/movie';

    const params = {
      api_key: '3fd2be6f0c70a2a598f084ddfb75487c',
      page: pageNumber,
      ...(query && { query }),
    };

    console.log('Fetching data from API:', endpoint, params);

    axios({
      method: 'GET',
      url: endpoint,
      params,
      cancelToken: new axios.CancelToken(c => (cancel = c)),
    })
      .then(res => {
        console.log('Data fetched:', res.data);
        setMovies(prevMovies => {
          const newMovies = [];
          for (const newMovie of res.data.results) {
            if (!prevMovies.some(prevMovie => prevMovie.id === newMovie.id)) {
              newMovies.push(newMovie);
            }
          }
          console.log('New movies added:', newMovies);
          return [...prevMovies, ...newMovies];
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      })
      .catch(e => {
        if (axios.isCancel(e)) return;
        console.error('Error fetching data:', e);
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return { loading, error, movies, hasMore };
}
