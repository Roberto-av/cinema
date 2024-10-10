<template>
  <div class="home-container">
    <h2 class="title">Cinema Club tiene las mejores películas</h2>
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar Película"
        @input="filterMovies"
      />
    </div>
    
    <MovieCarousel
      :movies="filteredMovies"
      title="Películas Populares"
      :slides-per-view="slidesPerView"
      :breakpoints="breakpoints"
    />

    <MovieCarousel
      :movies="filteredUpcomingMovies"
      title="Películas en Cartelera"
      :slides-per-view="slidesPerView"
      :breakpoints="breakpoints"
    />
    
    <MovieCarousel
      :movies="filteredTopRatedMovies"
      title="Películas Mejor Calificadas"
      :slides-per-view="slidesPerView"
      :breakpoints="breakpoints"
    />
  </div>
</template>

<script>
import { getPopularMovies, getTopRatedMovies, getMovieDetails, getUpcomingMovies } from "../../services/api";
import MovieCarousel from "../../components/ui/carrusel/MovieCarousel.vue";

export default {
  name: "Home",
  components: {
    MovieCarousel,
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      filteredTopRatedMovies: [],
      filteredUpcomingMovies: [],
      searchQuery: "",
      slidesPerView: 7,
      breakpoints: {
        1500: { slidesPerView: 7 },
        1400: { slidesPerView: 6 },
        992: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        425: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
    };
  },
  methods: {
    async fetchMovies() {
      try {
        const popularMovies = await getPopularMovies();
        const moviesWithDetails = await Promise.all(
          popularMovies.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return { ...movie, runtime: details.runtime };
          })
        );
        this.movies = moviesWithDetails;
        this.filteredMovies = this.movies;
      } catch (error) {
        console.error("Error al cargar las películas populares:", error);
      }
    },
    async fetchTopRatedMovies() {
      try {
        const topRatedMovies = await getTopRatedMovies();
        const moviesWithDetails = await Promise.all(
          topRatedMovies.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return { ...movie, runtime: details.runtime };
          })
        );
        this.filteredTopRatedMovies = moviesWithDetails;
      } catch (error) {
        console.error("Error al cargar las películas mejor calificadas:", error);
      }
    },
    async fetchUpcomingMovies() {
      try {
        const upcomingMovies = await getUpcomingMovies();
        const moviesWithDetails = await Promise.all(
          upcomingMovies.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return { ...movie, runtime: details.runtime };
          })
        );
        this.filteredUpcomingMovies = moviesWithDetails;
      } catch (error) {
        console.error("Error al cargar las películas mejor calificadas:", error);
      }
    },
    filterMovies() {
      const query = this.searchQuery.toLowerCase();
      this.filteredMovies = this.movies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    },
  },
  mounted() {
    this.fetchMovies();
    this.fetchTopRatedMovies();
    this.fetchUpcomingMovies();
  },
};
</script>


<style src="./home.css" scoped></style>
