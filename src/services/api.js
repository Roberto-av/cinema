import axios from "axios";

const API_KEY = import.meta.env.VITE_APP_MOVIE_DB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "es-ES",
  },
});

export const getPopularMovies = async () => {
  try {
    const response = await api.get("/movie/popular");
    console.log(response);
    return response.data.results;
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
    throw error;
  }
};

export async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
}
