<template>
  <div class="cast-section">
    <h2 class="cast-section-title">{{ title }}</h2>
    <div class="cast-carousel-container">
      <button class="cast-nav-button prev" @click="slideLeft"><</button>
      <swiper
        ref="swiperRef"
        :slides-per-view="adjustedSlidesPerView"
        :space-between="20"
        pagination
        @swiper="onSwiper"
        :simulate-touch="false"
        :breakpoints="breakpoints"
      >
        <swiper-slide v-for="actor in cast" :key="actor.id">
          <CastCard :actor="actor" class="cast-card" />
        </swiper-slide>
        <swiper-slide
          v-if="cast.length < slidesPerView"
          v-for="n in slidesPerView - cast.length"
          :key="`empty-${n}`"
        >
          <div class="empty-card"></div>
        </swiper-slide>
      </swiper>
      <button class="cast-nav-button next" @click="slideRight">></button>
    </div>
    <div v-if="cast.length === 0">
      <div class="not-found-conteiner">
        <p>Cargando Reparto...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
import CastCard from "../CastCard/CastCard.vue";

export default {
  name: "MovieCarousel",
  components: {
    CastCard,
    Swiper,
    SwiperSlide,
  },
  props: {
    cast: Array,
    title: String,
    slidesPerView: {
      type: Number,
      default: 7,
    },
    breakpoints: {
      type: Object,
      default: () => ({
        1500: { slidesPerView: 7 },
        1400: { slidesPerView: 5 },
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
  computed: {
    adjustedSlidesPerView() {
      return Math.min(this.slidesPerView, this.cast.length);
    },
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

<style scoped src="./CastCarousel.css"></style>
