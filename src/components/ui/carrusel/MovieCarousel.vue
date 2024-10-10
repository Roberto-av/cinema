<template>
    <div class="movies-section">
    <h2 class="section-title">{{ title }}</h2> <!-- Añadir clase aquí -->
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
          <swiper-slide v-for="movie in movies" :key="movie.id">
            <MovieCard :movie="movie" class="movie-card" />
          </swiper-slide>
        </swiper>
        <button class="nav-button next" @click="slideRight">></button>
      </div>
      <div v-if="movies.length === 0">
        <p>Cargando películas...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { Swiper, SwiperSlide } from "swiper/vue";
  import "swiper/swiper-bundle.css";
  import MovieCard from "../MovieCard/MovieCard.vue";

  export default {
    name: "MovieCarousel",
    components: {
      MovieCard,
      Swiper,
      SwiperSlide,
    },
    props: {
      movies: Array,
      title: String,
      slidesPerView: {
        type: Number,
        default: 7,
      },
      breakpoints: {
        type: Object,
        default: () => ({
          1500: { slidesPerView: 7 },
          1400: { slidesPerView: 6 },
          992: { slidesPerView: 4 },
          768: { slidesPerView: 3 },
          425: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }),
      },
    },
    data() {
      return {
        swiperInstance: null,
      };
    },
    methods: {
      slideLeft() {
        if (this.swiperInstance) {
          this.swiperInstance.slidePrev();
        }
      },
      slideRight() {
        if (this.swiperInstance) {
          this.swiperInstance.slideNext();
        }
      },
      onSwiper(swiper) {
        this.swiperInstance = swiper;
      },
    },
  };
  </script>
  
  <style scoped src="./MovieCarousel.css"></style>
  