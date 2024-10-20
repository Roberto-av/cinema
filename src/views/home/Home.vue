<template>
  <div class="home-container">
    <!-- Sección del Banner -->
    <div
      v-if="bannerMovie"
      class="banner"
      :style="{
        backgroundImage: `url(${getBackgroundImage(
          bannerMovie.backdrop_path
        )})`,
      }"
    >
      <div class="banner-overlay">
        <div class="banner-content">
          <router-link :to="`/movie/${bannerMovie.id}`">
            <h1 class="banner-title">{{ bannerMovie.title }}</h1>
          </router-link>
          <div class="banner-details">
            <span class="rating"
              >{{ formatRating(bannerMovie.vote_average) }} / 10</span
            >
            <span class="separator">|</span>
            <span class="runtime">{{
              formatRuntime(bannerMovie.runtime)
            }}</span>
            <span class="separator">•</span>
            <span class="release-date">{{
              formatReleaseDate(bannerMovie.release_date)
            }}</span>
          </div>
          <div class="banner-genres">
            <span
              v-for="genre in bannerMovie.genres"
              :key="genre.id"
              class="genre"
            >
              <router-link
                :to="`/genre/${genre.id}-${genre.name.replace(
                  /\s+/g,
                  '-'
                )}/?contentType=movie`"
                class="keyword-link"
              >
                {{ genre.name }}
              </router-link>
            </span>
          </div>
          <p class="banner-synopsis">{{ bannerMovie.overview }}</p>
        </div>
      </div>
    </div>

    <!-- Loader -->
    <div v-if="isLoading">
      <Loader />
    </div>

    <!-- Carousels de Películas -->
    <div v-else class="carrusel">
      <MovieCarousel
        :movies="filteredTrendingMovies"
        title="Películas En Tendencia"
        :slides-per-view="slidesPerView"
        :breakpoints="breakpoints"
      />

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
        :movies="filteredPopularShows"
        title="Series En Tendencia"
        :slides-per-view="slidesPerView"
        :breakpoints="breakpoints"
      />
    </div>
  </div>
</template>

<script>
import {
  getPopularMovies,
  getPopularShows,
  getMovieDetails,
  getUpcomingMovies,
  getTrendingMovies,
  getShowDetails,
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
      filteredTrendingMovies: [],
      filteredUpcomingMovies: [],
      filteredPopularShows: [],
      bannerMovie: null,
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
      totalApiCalls: 4,
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
            return {
              ...movie,
              runtime: details.runtime,
              genres: details.genres,
            };
          })
        );
        this.movies = moviesWithDetails;
        this.filteredMovies = this.movies;

        if (this.movies.length > 0) {
          this.bannerMovie = this.movies[0];
        }
      } catch (error) {
        console.error("Error al cargar las películas populares:", error);
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchTrendingMovies() {
      this.apiCallCount++;
      try {
        const trendingMovies = await getTrendingMovies();
        const moviesWithDetails = await Promise.all(
          trendingMovies.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return {
              ...movie,
              runtime: details.runtime,
              genres: details.genres,
            };
          })
        );
        this.filteredTrendingMovies = moviesWithDetails;
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
    async fetchShows() {
      this.isLoading = true;
      this.apiCallCount++;
      try {
        const popularShows = await getPopularShows();
        const showsWithDetails = await Promise.all(
          popularShows.map(async (show) => {
            const details = await getShowDetails(show.id);
            return {
              ...show,
              number_of_seasons: details.number_of_seasons,
              first_air_date: show.first_air_date,
            };
          })
        );
        this.shows = showsWithDetails;
        this.filteredPopularShows = this.shows;

        if (this.shows.length > 0) {
          this.bannerShow = this.shows[0];
        }
      } catch (error) {
        console.error("Error al cargar las series populares:", error);
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
            return {
              ...movie,
              runtime: details.runtime,
              genres: details.genres,
            };
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
    formatRuntime(runtime) {
      if (!runtime) return "-";
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes} min`;
    },
    formatRating(rating) {
      return rating ? `${rating.toFixed(1)}` : "NA";
    },
    formatReleaseDate(releaseDate) {
      if (!releaseDate) return "-";
      return new Date(releaseDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    getBackgroundImage(path) {
      return path
        ? `https://image.tmdb.org/t/p/original${path}`
        : "/img/notFound.png";
    },
  },
  mounted() {
    this.fetchMovies();
    this.fetchTrendingMovies();
    this.fetchShows();
    this.fetchUpcomingMovies();
  },
};
</script>

<style src="./home.css" scoped></style>
