<template>
  <div class="movie-details">
    <div v-if="isLoading">
      <Loader />
    </div>

    <div
      v-else
      class="movie-header"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <img
        v-if="show"
        :src="getImageUrl(show.poster_path)"
        :alt="show.name"
        class="img-poster"
      />
      <div class="movie-info">
        <h1 v-if="show" class="title">{{ show.name }}</h1>
        <div class="rating-runtime">
          <span class="rating" v-if="show"
            >{{ formatRating(show.vote_average) }} / 10</span
          >
          <span class="separator">|</span>
          <span class="release-date" v-if="show">{{
            formatReleaseDate(show.first_air_date)
          }}</span>
        </div>
        <div class="genres" v-if="show">
          <span
            v-for="(genre, index) in show.genres"
            :key="genre.id"
            class="genre"
          >
            <router-link
              :to="`/genre/${genre.id}-${genre.name.replace(
                /\s+/g,
                '-'
              )}/?contentType=tv`"
              class="keyword-link"
            >
              {{ genre.name }}
            </router-link>
            <span v-if="index !== show.genres.length - 1"></span>
          </span>
        </div>
        <div class="buttons">
          <button class="reaction-button" @click="handleFavorite">
            <span>
              <img
                :src="
                  userHasFavorited
                    ? '/src/assets/icons/HeartRed.svg'
                    : '/src/assets/icons/Heart.svg'
                "
                alt=""
                class="icon"
              />
            </span>
          </button>
          <button class="reaction-button" @click="handleRatingClick">
            <span>
              <img
                :src="
                  userHasVoted
                    ? '/src/assets/icons/StarFilled.svg'
                    : '/src/assets/icons/StarRegular.svg'
                "
                alt="Rate"
                class="icon"
              />
            </span>
          </button>
        </div>
        <RaitingModal
          v-if="!userHasVoted"
          :show="showRatingModal"
          @close="closeRatingModal"
          @confirm="submitRating"
        />
        <p v-if="show" class="synopsis">
          {{ show.overview ? show.overview : "Sin Sinopsis" }}
        </p>
      </div>
    </div>

    <div class="additional-sections" v-if="!isLoading && show">
      <div class="section-row">
        <div class="primary-container">
          <div class="cast-section">
            <CastCarousel :cast="cast" title="Reparto" />
          </div>
          <div class="season-section">
            <h2>Temporadas</h2>
            <div v-if="latestSeason" class="season-card">
              <router-link
                :to="`/tv/${show.id}/season/${latestSeason.season_number}`"
              >
                <SeasonCard :season="latestSeason" />
              </router-link>
            </div>
            <button
              v-if="!showAllSeasons && sortedSeasons.length > 1"
              @click="showAllSeasons = true"
              class="btn-all-seasons"
            >
              Mostrar Más
            </button>
            <div v-if="showAllSeasons" class="season-card">
              <div v-for="season in sortedSeasons" :key="season.id">
                <router-link
                  :to="`/tv/${show.id}/season/${season.season_number}`"
                >
                  <SeasonCard
                    v-if="season.id !== latestSeason.id"
                    :season="season"
                  />
                </router-link>
              </div>
            </div>
          </div>

          <div class="trailer-section">
            <TrailerComponent :trailer="trailers" />
          </div>
          <div class="recommendations-section">
            <MovieCarousel
              :movies="showRecommendations"
              title="Recomendación"
              :slidesPerView="slidesPerView"
              :breakpoints="breakpoints"
            />
          </div>
        </div>
        <div class="info-extra">
          <h2>Info</h2>
          <p v-if="show">
            <strong>ESTADO</strong>
            <span class="info-extra-s">{{ formatStatus(show.status) }}</span>
          </p>
          <p v-if="show">
            <strong>TIPO</strong>
            <span class="info-extra-s">{{ show.type }}</span>
          </p>
          <p v-if="show">
            <strong>IDIOMA ORIGINAL</strong>
            <span class="info-extra-s">{{
              formatLanguage(show.original_language)
            }}</span>
          </p>
          <div class="keywords" v-if="show">
            <p><strong>Palabras Clave</strong></p>
            <span
              v-for="(keyword, index) in keyWords"
              :key="keyword.id"
              class="keyword"
            >
              <router-link
                :to="`/keyword/${keyword.id}-${keyword.name.replace(
                  /\s+/g,
                  '-'
                )}/?contentType=tv`"
                class="keyword-link"
              >
                {{ keyword.name }}
              </router-link>
              <span v-if="index !== keyWords.length - 1"></span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getShowDetails,
  getShowImages,
  postVoteShow,
  deleteVoteShow,
  getAccountStatesShow,
  getAccountDetails,
  postFavorite,
  getShowCredits,
  getShowKeyWords,
  getShowVideos,
  getShowRecommendations,
} from "../../services/api";
import Loader from "../../components/ui/loader/Loader.vue";
import CastCarousel from "../../components/ui/carrusel/CastCarousel.vue";
import TrailerComponent from "../../components/ui/Trailer/TrailerComponent.vue";
import MovieCarousel from "../../components/ui/carrusel/MovieCarousel.vue";
import SeasonCard from "../../components/ui/SeasonCard/SeasonCard.vue";
import RaitingModal from "../../components/ui/RaitingModal/RaitingModal.vue";

export default {
  name: "ShowDetails",
  components: {
    Loader,
    CastCarousel,
    TrailerComponent,
    MovieCarousel,
    SeasonCard,
    RaitingModal,
  },
  data() {
    return {
      show: null,
      backgroundImage: "",
      isLoading: true,
      apiCallCount: 0,
      userHasVoted: false,
      userHasFavorited: false,
      showRatingModal: false,
      selectedRating: 0,
      cast: [],
      keyWords: [],
      trailers: [],
      showRecommendations: [],
      showAllSeasons: false,
      slidesPerView: 5,
      breakpoints: {
        1500: { slidesPerView: 5 },
        1400: { slidesPerView: 4 },
        992: { slidesPerView: 3 },
        768: { slidesPerView: 2 },
        425: { slidesPerView: 2 },
        0: { slidesPerView: 1 },
      },
    };
  },
  methods: {
    async fetchShowDetails() {
      const showId = this.$route.params.id;
      this.isLoading = true;
      this.apiCallCount++;
      try {
        const details = await getShowDetails(showId);
        if (!details) {
          return;
        }
        this.show = details;
        await this.fetchShowImages(showId);
        await this.fetchMovieCredits(showId);
        await this.fetchShowkeyWords(showId);
        await this.fetchShowVideos(showId);
        await this.checkUserVoteStatus();
      } catch (error) {
        console.error("Error al cargar los detalles de la película:", error);
        this.show = null;
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchShowImages(showId) {
      this.apiCallCount++;
      try {
        const backdrops = await getShowImages(showId);
        this.backgroundImage =
          backdrops.length > 0
            ? `https://image.tmdb.org/t/p/original${backdrops[0].file_path}`
            : "";
      } catch (error) {
        console.error("Error al obtener las imágenes de la película:", error);
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchMovieCredits(showId) {
      this.apiCallCount++;
      try {
        const cast = await getShowCredits(showId);
        this.cast = cast;
      } catch (error) {
        console.error("Error al cargar el reparto de la película:", error);
        this.cast = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchShowkeyWords(showId) {
      this.apiCallCount++;
      try {
        const response = await getShowKeyWords(showId);
        this.keyWords = response.results;
      } catch (error) {
        console.error("Error al cargar las palabras claves:", error);
        this.keyWords = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchShowVideos(showId) {
      this.apiCallCount++;
      try {
        const videos = await getShowVideos(showId);
        const trailer = videos.find((video) => {
          const title = video.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return title.includes("trailer");
        });
        this.trailers = trailer ? trailer : null;
      } catch (error) {
        console.error("Error al obtener los trailers:", error);
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchRecommendedShows() {
      const showId = this.$route.params.id;
      this.apiCallCount++;
      try {
        const recommendations = await getShowRecommendations(showId);
        const showsWithDetails = await Promise.all(
          recommendations.results.map(async (show) => {
            const details = await getShowDetails(show.id);
            return {
              ...show,
              number_of_seasons: details.number_of_seasons,
              genres: details.genres,
            };
          })
        );
        this.showRecommendations = showsWithDetails;
      } catch (error) {
        console.error("Error al cargar las películas recomendadas:", error);
        this.showRecommendations = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async submitRating(rating) {
      const showId = this.show.id;
      const sessionId = localStorage.getItem("session_id");

      try {
        await postVoteShow(showId, sessionId, { value: rating });
        this.userHasVoted = true;
        this.selectedRating = rating;
        this.closeRatingModal();
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
      }
    },
    async handleFavorite() {
      const showId = this.show.id;
      const sessionId = localStorage.getItem("session_id");
      const accountId = await getAccountDetails(sessionId).then(
        (data) => data.id
      );

      if (!this.userHasFavorited) {
        try {
          await postFavorite(accountId, sessionId, {
            mediaType: "tv",
            mediaId: showId,
            favorite: true,
          });
          this.userHasFavorited = true;
        } catch (error) {
          console.error("Error al agregar a favoritos:", error);
        }
      } else {
        try {
          await postFavorite(accountId, sessionId, {
            mediaType: "tv",
            mediaId: showId,
            favorite: false,
          });
          this.userHasFavorited = false;
        } catch (error) {
          console.error("Error al eliminar de favoritos:", error);
        }
      }
    },
    async checkUserVoteStatus() {
      const showId = this.show.id;
      const sessionId = localStorage.getItem("session_id");

      if (sessionId) {
        try {
          const accountStates = await getAccountStatesShow(showId, sessionId);
          this.userHasVoted = accountStates.rated;
          this.userHasFavorited = accountStates.favorite;
        } catch (error) {
          console.error("Error al verificar el estado del voto:", error);
        }
      }
    },
    async getAccountStates(showId, sessionId) {
      try {
        const accountStates = await getAccountStatesShow(showId, sessionId);
        return accountStates;
      } catch (error) {
        console.error("Error al obtener el estado de la cuenta:", error);
        return { rated: false };
      }
    },
    async deleteRating() {
      const showId = this.show.id;
      const sessionId = localStorage.getItem("session_id");

      try {
        await deleteVoteShow(showId, sessionId);
        this.userHasVoted = false;
        this.selectedRating = 0;
        console.log("Voto eliminado exitosamente.");
      } catch (error) {
        console.error("Error al eliminar el voto:", error);
      }
    },
    async handleRatingClick() {
      if (this.userHasVoted) {
        await this.deleteRating();
      } else {
        this.openRatingModal();
      }
    },
    openRatingModal() {
      this.showRatingModal = true;
    },
    closeRatingModal() {
      this.showRatingModal = false;
    },
    checkLoading() {
      this.isLoading = this.apiCallCount > 0;
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
    getImageUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "/src/assets/img/not.jpg";
    },
    formatStatus(status) {
      const statusMapping = {
        Released: "Estrenada",
        Upcoming: "Próximamente",
        Rumored: "Rumoreada",
        Canceled: "Cancelada",
      };
      return statusMapping[status] || status;
    },
    formatLanguage(language) {
      const languageMapping = {
        en: "Inglés",
        es: "Español",
        ja: "Japones",
      };
      return languageMapping[language] || language.toUpperCase();
    },
    formatCurrency(amount) {
      if (amount === 0) return "$0.00";
      return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00`;
    },
  },
  computed: {
    sortedSeasons() {
      return this.show.seasons
        .filter((season) => season.season_number > 0)
        .sort((a, b) => b.season_number - a.season_number);
    },
    latestSeason() {
      return this.sortedSeasons.length > 0 ? this.sortedSeasons[0] : null;
    },
  },
  watch: {
    "$route.params.id": function () {
      this.showAllSeasons = false;
      this.fetchShowDetails();
      this.fetchRecommendedShows();
      window.scrollTo(0, 0);
    },
  },
  mounted() {
    this.fetchShowDetails();
    this.fetchRecommendedShows();
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped src="./ShowDetails.css"></style>
