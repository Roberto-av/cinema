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
    return response.data.results;
  } catch (error) {
    console.error("Error al obtener películas populares:", error);
    throw error;
  }
};

export const getTopRatedMovies = async () => {
  try {
    const response = await api.get("/movie/top_rated");
    return response.data.results;
  } catch (error) {
    console.error("Error al obtener películas mejor calificadas:", error);
    throw error;
  }
};

export const getUpcomingMovies = async () => {
  try {
    const response = await api.get("/movie/upcoming");
    return response.data.results;
  } catch (error) {
    console.error("Error al obtener ultimas películas agregadas:", error);
    throw error;
  }
};

export async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=es-ES`
    );
    return response.data;
  } catch (error) {
    console.error("Error en la API:", error);
    throw error;
  }
}

export const getMovieImages = async (movieId) => {
  try {
    const response = await api.get(`/movie/${movieId}/images`, {
      params: {
        include_image_language: "en",
      },
    });
    return response.data.backdrops;
  } catch (error) {
    console.error("Error al obtener imágenes de la película:", error);
    throw error;
  }
};

export const getRequestToken = async () => {
  try {
    const response = await api.get("/authentication/token/new");
    return response.data.request_token;
  } catch (error) {
    console.error("Error al obtener el token de solicitud:", error);
    throw error;
  }
};

export const validateUser = async (username, password, requestToken) => {
  try {
    const response = await api.post(
      "/authentication/token/validate_with_login",
      {
        username,
        password,
        request_token: requestToken,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al validar el usuario:", error);
    throw error;
  }
};

export const createSession = async (requestToken) => {
  try {
    const response = await api.post("/authentication/session/new", {
      request_token: requestToken,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear la sesión:", error);
    throw error;
  }
};

export const postVote = async (movieId, sessionId, { value }) => {
  try {
    const response = await api.post(
      `/movie/${movieId}/rating`,
      {
        value,
      },
      {
        params: {
          session_id: sessionId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al votar:", error);
    throw error;
  }
};

export const deleteVote = async (movieId, sessionId) => {
  try {
    const response = await api.delete(`/movie/${movieId}/rating`, {
      params: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el voto:", error);
    throw error;
  }
};

export const getAccountStates = async (movieId, sessionId) => {
  try {
    const response = await api.get(`/movie/${movieId}/account_states`, {
      params: {
        session_id: sessionId,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al obtener el estado de la cuenta:", error);
    throw error;
  }
};
