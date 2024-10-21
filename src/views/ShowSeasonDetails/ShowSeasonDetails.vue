<template>
  <div class="season-cointer">
    <div class="season-header">
      <div class="season-title">
        <h2 class="title">Temporada {{ seasonNumber }}</h2>
      </div>
    </div>
    <div class="episode-seccion" v-if="latestSeason.length > 0">
      <div class="episode">
        <SeasonCard
          v-for="episode in latestSeason"
          :key="episode.id"
          :season="episode"
          :isEpisode="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import SeasonCard from "../../components/ui/SeasonCard/SeasonCard.vue";
import { getShowSeasonDetails } from "../../services/api";

export default {
  components: {
    SeasonCard,
  },
  data() {
    return {
      latestSeason: [],
      showId: this.$route.params.id,
      seasonNumber: this.$route.params.seasonNumber,
    };
  },
  async mounted() {
    await this.fetchSeasonDetails();
  },
  methods: {
    async fetchSeasonDetails() {
      try {
        const seasonDetails = await getShowSeasonDetails(
          this.showId,
          this.seasonNumber
        );
        this.latestSeason = seasonDetails.episodes;
        console.log(this.latestSeason);
      } catch (error) {
        console.error("Error al obtener los detalles de la temporada:", error);
      }
    },
  },
};
</script>

<style scoped src="./ShowSeasonDetails.css"></style>
