<template>
  <div class="season-card">
    <img
      :src="getImageUrl(season)"
      :alt="isEpisode ? season.name : `Temporada ${season.season_number}`"
      class="season-poster"
    />
    <div class="season-header">
      <div class="season-info">
        <h3>
          {{
            isEpisode
              ? `${season.episode_number} • ${season.name}`
              : `Temporada ${season.season_number}`
          }}
        </h3>
        <div class="rating-episodes">
          <span class="rating"
            >{{ formatRating(season.vote_average) }} / 10</span
          >
          <span class="separator">•</span>
          <span class="episodes">
            {{
              isEpisode
                ? `${formatRuntime(season.runtime)}`
                : `${season.episode_count} episodios`
            }}
          </span>
          <span class="separator">•</span>
          <span class="release-date">{{
            formatReleaseDate(season.air_date)
          }}</span>
        </div>
      </div>
      <p class="synopsis">{{ season.overview || "Sin sinopsis disponible" }}</p>
    </div>
  </div>
</template>

<script>
import not from "../../../assets/img/not.jpg";

export default {
  name: "SeasonCard",
  props: {
    season: {
      type: Object,
      required: true,
    },
    isEpisode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      not,
    };
  },
  methods: {
    getImageUrl(season) {
      return this.isEpisode && season.still_path
        ? `https://image.tmdb.org/t/p/w500${season.still_path}`
        : season.poster_path
        ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
        : this.not;
    },
    formatRating(rating) {
      return rating ? `${rating.toFixed(1)}` : "NA";
    },
    formatRuntime(runtime) {
      if (!runtime) return "-";
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes} min`;
    },
    formatReleaseDate(date) {
      if (!date) return "-";
      const [year, month, day] = date.split("-");
      const monthNames = [
        "enero",
        "febrero",
        "marzo",
        "abril",
        "mayo",
        "junio",
        "julio",
        "agosto",
        "septiembre",
        "octubre",
        "noviembre",
        "diciembre",
      ];
      return `${day} de ${monthNames[parseInt(month) - 1]} de ${year}`;
    },
  },
};
</script>

<style src="./SeasonCard.css" scoped></style>
