import axios from 'axios';

const API_KEY = import.meta.env.VITE_APP_MOVIE_DB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'es-ES'
  }
});

export const getPopularMovies = async () => {
  try {
    const response = await api.get('/movie/popular');
    return response.data.results;
  } catch (error) {
    console.error('Error al obtener películas populares:', error);
    throw error;
  }
};
