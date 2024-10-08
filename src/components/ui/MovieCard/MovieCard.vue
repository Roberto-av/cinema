<template>
  <div class="movie-card">
    <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
    <h3>{{ movie.title }}</h3>
    <div class="movie-info">
      <span class="rating">{{ formatRating(movie.vote_average) }} / 10</span>
      <span class="separator">•</span>
      <span class="release-date">{{ formatReleaseDate(movie.release_date) }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getImageUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : '/img/notFound.png';
    },
    formatRating(rating) {
      return rating ? `${rating.toFixed(1)}` : 'N/A';
    },
    formatReleaseDate(date) {
      if (!date) return 'Fecha no disponible';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString('es-ES', options);
    },
  },
};
</script>

<style src="./MovieCard.css" scoped></style>
