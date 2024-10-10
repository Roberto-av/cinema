<template>
  <div class="home-container">
    <h2 class="title">Cinema Club tiene las mejores películas</h2>

    <div v-if="isLoading">
      <Loader />
    </div>

    <div v-else>
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
  </div>
</template>

<script>
import {
  getPopularMovies,
  getTopRatedMovies,
  getMovieDetails,
  getUpcomingMovies,
} from "../../services/api";
import MovieCarousel from "../../components/ui/carrusel/MovieCarousel.vue";
import Loader from "../../components/ui/loader/Loader.vue";

export default {
  name: "Home",
  components: {
    MovieCarousel,
    Loader,
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
      isLoading: false, 
      apiCallCount: 0, 
      totalApiCalls: 3,
    };
  },
  methods: {
    async fetchMovies() {
      this.isLoading = true;
      this.apiCallCount++;
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
      } finally {
        this.apiCallCount--; 
        this.checkLoading(); 
      }
    },
    async fetchTopRatedMovies() {
      this.apiCallCount++;
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
        console.error(
          "Error al cargar las películas mejor calificadas:",
          error
        );
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchUpcomingMovies() {
      this.apiCallCount++;
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
        console.error("Error al cargar las películas en cartelera:", error);
      } finally {
        this.apiCallCount--; 
        this.checkLoading(); 
      }
    },
    filterMovies() {
      const query = this.searchQuery.toLowerCase();
      this.filteredMovies = this.movies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    },
    checkLoading() {
      if (this.apiCallCount === 0) {
        this.isLoading = false;
      }
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
