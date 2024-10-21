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
        v-if="movie"
        :src="getImageUrl(movie.poster_path)"
        :alt="movie.title"
        class="img-poster"
      />
      <div class="movie-info">
        <h1 v-if="movie" class="title">{{ movie.title }}</h1>
        <div class="rating-runtime">
          <span class="rating" v-if="movie"
            >{{ formatRating(movie.vote_average) }} / 10</span
          >
          <span class="separator">|</span>
          <span class="runtime" v-if="movie">{{
            formatRuntime(movie.runtime)
          }}</span>
          <span class="separator">•</span>
          <span class="release-date" v-if="movie">{{
            formatReleaseDate(movie.release_date)
          }}</span>
        </div>
        <div class="genres" v-if="movie">
          <span
            v-for="(genre, index) in movie.genres"
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
            <span v-if="index !== movie.genres.length - 1"></span>
          </span>
        </div>
        <div class="buttons">
          <button class="reaction-button" @click="handleFavorite">
            <span>
              <img
                :src="userHasFavorited ? HeartRed : Heart"
                alt="Favorite"
                class="icon"
              />
            </span>
          </button>
          <button class="reaction-button" @click="handleRatingClick">
            <span>
              <img
                :src="userHasVoted ? StarFilled : StarRegular"
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
        <p v-if="movie" class="synopsis">
          {{ movie.overview ? movie.overview : "Sin Sinopsis" }}
        </p>
      </div>
    </div>

    <div class="additional-sections" v-if="!isLoading && movie">
      <div class="section-row">
        <div class="primary-container">
          <div class="cast-section">
            <CastCarousel :cast="cast" title="Reparto" />
          </div>
          <div class="trailer-section">
            <TrailerComponent :trailer="trailers" />
          </div>
          <div class="recommendations-section">
            <MovieCarousel
              :movies="movieRecommendations"
              title="Recomendación"
              :slidesPerView="slidesPerView"
              :breakpoints="breakpoints"
            />
          </div>
        </div>
        <div class="info-extra">
          <h2>Info</h2>
          <p v-if="movie">
            <strong>ESTADO</strong>
            <span class="info-extra-s">{{ formatStatus(movie.status) }}</span>
          </p>
          <p v-if="movie">
            <strong>IDIOMA ORIGINAL</strong>
            <span class="info-extra-s">{{
              formatLanguage(movie.original_language)
            }}</span>
          </p>
          <p v-if="movie">
            <strong>PRESUPUESTO</strong>
            <span class="info-extra-s">{{ formatCurrency(movie.budget) }}</span>
          </p>
          <p v-if="movie">
            <strong>INGRESOS</strong>
            <span class="info-extra-s">{{
              formatCurrency(movie.revenue)
            }}</span>
          </p>
          <div class="keywords" v-if="movie">
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
                )}/?contentType=movie`"
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
  getMovieDetails,
  getMovieImages,
  postVote,
  postFavorite,
  deleteVote,
  getAccountStates,
  getAccountDetails,
  getMovieCredits,
  getMovieKeyWords,
  getMovieVideos,
  getMovieRecommendations,
} from "../../services/api";
import Loader from "../../components/ui/loader/Loader.vue";
import CastCarousel from "../../components/ui/carrusel/CastCarousel.vue";
import TrailerComponent from "../../components/ui/Trailer/TrailerComponent.vue";
import MovieCarousel from "../../components/ui/carrusel/MovieCarousel.vue";
import RaitingModal from "../../components/ui/RaitingModal/RaitingModal.vue";

import StarFilled from "../../assets/icons/StarFilled.svg";
import StarRegular from "../../assets/icons/StarRegular.svg";

import HeartRed from "../../assets/icons/HeartRed.svg";
import Heart from "../../assets/icons/Heart.svg";

import not from "../../assets/img/not.jpg";

export default {
  name: "MovieDetails",
  components: {
    Loader,
    CastCarousel,
    TrailerComponent,
    MovieCarousel,
    RaitingModal,
  },
  data() {
    return {
      movie: null,
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
      movieRecommendations: [],
      HeartRed,
      Heart,
      StarFilled,
      StarRegular,
      not,
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
    async fetchMovieDetails() {
      const movieId = this.$route.params.id;
      this.isLoading = true;
      this.apiCallCount++;
      try {
        const details = await getMovieDetails(movieId);
        if (!details) {
          return;
        }
        this.movie = details;
        await this.fetchMovieImages(movieId);
        await this.fetchMovieCredits(movieId);
        await this.fetchMoviekeyWords(movieId);
        await this.fetchMovieVideos(movieId);
        await this.checkUserVoteStatus();
      } catch (error) {
        console.error("Error al cargar los detalles de la película:", error);
        this.movie = null;
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchMovieImages(movieId) {
      this.apiCallCount++;
      try {
        const backdrops = await getMovieImages(movieId);
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
    async fetchMovieCredits(movieId) {
      this.apiCallCount++;
      try {
        const cast = await getMovieCredits(movieId);
        this.cast = cast;
      } catch (error) {
        console.error("Error al cargar el reparto de la película:", error);
        this.cast = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchMoviekeyWords(movieId) {
      this.apiCallCount++;
      try {
        const response = await getMovieKeyWords(movieId);
        this.keyWords = response.keywords;
      } catch (error) {
        console.error("Error al cargar las palabras claves:", error);
        this.keyWords = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchMovieVideos(movieId) {
      this.apiCallCount++;
      try {
        const videos = await getMovieVideos(movieId);
        const trailer = videos.find((video) => {
          const title = video.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          return title.startsWith("trailer");
        });
        this.trailers = trailer ? trailer : null;
      } catch (error) {
        console.error("Error al obtener los trailers:", error);
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async fetchRecommendedMovies() {
      const movieId = this.$route.params.id;
      this.apiCallCount++;
      try {
        const recommendations = await getMovieRecommendations(movieId);
        const moviesWithDetails = await Promise.all(
          recommendations.results.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return {
              ...movie,
              runtime: details.runtime,
              genres: details.genres,
            };
          })
        );
        this.movieRecommendations = moviesWithDetails;
      } catch (error) {
        console.error("Error al cargar las películas recomendadas:", error);
        this.movieRecommendations = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    async submitRating(rating) {
      const movieId = this.movie.id;
      const sessionId = localStorage.getItem("session_id");

      try {
        await postVote(movieId, sessionId, { value: rating });
        this.userHasVoted = true;
        this.selectedRating = rating;
        this.closeRatingModal();
      } catch (error) {
        console.error("Error al enviar la calificación:", error);
      }
    },
    async handleFavorite() {
      const movieId = this.movie.id;
      const sessionId = localStorage.getItem("session_id");
      const accountId = await getAccountDetails(sessionId).then(
        (data) => data.id
      );

      if (!this.userHasFavorited) {
        try {
          await postFavorite(accountId, sessionId, {
            mediaType: "movie",
            mediaId: movieId,
            favorite: true,
          });
          this.userHasFavorited = true;
        } catch (error) {
          console.error("Error al agregar a favoritos:", error);
        }
      } else {
        try {
          await postFavorite(accountId, sessionId, {
            mediaType: "movie",
            mediaId: movieId,
            favorite: false,
          });
          this.userHasFavorited = false;
        } catch (error) {
          console.error("Error al eliminar de favoritos:", error);
        }
      }
    },
    async checkUserVoteStatus() {
      const movieId = this.movie.id;
      const sessionId = localStorage.getItem("session_id");

      if (sessionId) {
        try {
          const accountStates = await getAccountStates(movieId, sessionId);
          this.userHasVoted = accountStates.rated;
          this.userHasFavorited = accountStates.favorite;
        } catch (error) {
          console.error("Error al verificar el estado del voto:", error);
        }
      }
    },
    async getAccountStates(movieId, sessionId) {
      try {
        const accountStates = await getAccountStates(movieId, sessionId);
        return accountStates;
      } catch (error) {
        console.error("Error al obtener el estado de la cuenta:", error);
        return { rated: false };
      }
    },
    async deleteRating() {
      const movieId = this.movie.id;
      const sessionId = localStorage.getItem("session_id");

      try {
        await deleteVote(movieId, sessionId);
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
        : this.not;
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
      };
      return languageMapping[language] || language.toUpperCase();
    },
    formatCurrency(amount) {
      if (amount === 0) return "$0.00";
      return `$${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.00`;
    },
  },
  watch: {
    "$route.params.id": function () {
      this.fetchMovieDetails();
      this.fetchRecommendedMovies();
      window.scrollTo(0, 0);
    },
  },
  mounted() {
    this.fetchMovieDetails();
    this.fetchRecommendedMovies();
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped src="./MovieDetails.css"></style>
