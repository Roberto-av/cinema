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
    <div class="movies-section">
      <h2>Películas Populares</h2>
      <div class="carousel-container">
        <button class="nav-button prev" @click="slideLeft"><</button>
        <swiper
          ref="swiperRef"
          :slides-per-view="slidesPerView"
          :space-between="20"
          pagination
          @swiper="onSwiper"
          :simulate-touch="false"
          :breakpoints="breakpoints"
        >
          <swiper-slide v-for="movie in filteredMovies" :key="movie.id">
            <MovieCard :movie="movie" class="movie-card" />
          </swiper-slide>
        </swiper>
        <button class="nav-button next" @click="slideRight">></button>
      </div>
      <div v-if="filteredMovies.length === 0">
        <p>Cargando películas...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getPopularMovies, getMovieDetails } from "../../services/api";
import MovieCard from "../../components/ui/MovieCard/MovieCard.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";

export default {
  name: "Home",
  components: {
    MovieCard,
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      searchQuery: "",
      swiperInstance: null,
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
        console.error("Error al cargar las películas:", error);
      }
    },
    filterMovies() {
      const query = this.searchQuery.toLowerCase();
      this.filteredMovies = this.movies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    },
    slideLeft() {
      if (this.swiperInstance) {
        this.swiperInstance.slidePrev();
      } else {
        console.error("Swiper no está disponible.");
      }
    },
    slideRight() {
      if (this.swiperInstance) {
        this.swiperInstance.slideNext();
      } else {
        console.error("Swiper no está disponible.");
      }
    },
    onSwiper(swiper) {
      this.swiperInstance = swiper;
    },
  },
  mounted() {
    this.fetchMovies();
  },
};
</script>

<style src="./home.css" scoped></style>
