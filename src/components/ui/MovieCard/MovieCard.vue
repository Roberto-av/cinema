<template>
  <div class="movie-card">
    <router-link :to="`/movie/${movie.id}`">
      <div class="image-container">
        <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
        <span class="release-year">{{
          movie.release_date
            ? formatReleaseYear(movie.release_date)
            : movie.first_air_date
            ? formatReleaseYear(movie.first_air_date)
            : "-"
        }}</span>
      </div>
      <h3>{{ movie.title }}</h3>
      <div class="movie-info">
        <span class="rating">{{ formatRating(movie.vote_average) }} / 10</span>
        <span class="separator">•</span>
        <span class="seasons">
          {{
            movie.number_of_seasons
              ? `${movie.number_of_seasons} temporada${
                  movie.number_of_seasons > 1 ? "s" : ""
                }`
              : formatRuntime(movie.runtime)
          }}
        </span>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "MovieCard",
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
        : "/img/notFound.png";
    },
    formatRating(rating) {
      return rating ? `${rating.toFixed(1)}` : "N/A";
    },
    formatRuntime(runtime) {
      if (!runtime) return "-";
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes} min`;
    },
    formatReleaseYear(releaseDate) {
      if (!releaseDate) return "-";
      return new Date(releaseDate).getFullYear();
    },
  },
};
</script>

<style src="./MovieCard.css" scoped></style>
