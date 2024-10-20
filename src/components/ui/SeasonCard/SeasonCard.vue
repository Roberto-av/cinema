<template>
    <div class="season-card">
      <img
        :src="getImageUrl(season.poster_path)"
        :alt="season.name"
        class="season-poster"
      />
      <div class="season-header">
        <div class="season-info">
          <h3>Temporada {{ season.season_number }}</h3>
          <div class="rating-episodes">
            <span class="rating">{{ formatRating(season.vote_average) }} / 10</span>
            <span class="separator">•</span>
            <span class="episodes">{{ season.episode_count }} episodios</span>
            <span class="separator">•</span>
            <span class="release-date">{{ formatReleaseDate(season.air_date) }}</span>
          </div>
        </div>
        <p class="synopsis">{{ season.overview || "Sin sinopsis disponible" }}</p>
      </div>
    </div>
  </template>
  

<script>
export default {
  name: "SeasonCard",
  props: {
    season: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getImageUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "/src/assets/img/not.jpg";
    },
    formatRating(rating) {
      return rating ? `${rating.toFixed(1)}` : "NA";
    },
    formatReleaseDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
};
</script>

<style src="./SeasonCard.css" scoped></style>
