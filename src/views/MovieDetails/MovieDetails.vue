<template>
  <div class="movie-details">
    <div v-if="isLoading">
        <Loader/>
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
      />
      <div class="movie-info">
        <h1 v-if="movie">{{ movie.title }}</h1>
        <div class="rating-runtime">
          <span class="rating" v-if="movie" >
            {{ formatRating(movie.vote_average) }} / 10
          </span>
          <span class="separator">|</span>
          <span class="runtime" v-if="movie">
            {{ formatRuntime(movie.runtime) }}
          </span>
          <span class="separator">•</span>
          <span class="release-date" v-if="movie">
            {{ formatReleaseYear(movie.release_date) }}
          </span>
        </div>
        <div class="genres" v-if="movie">
          <span v-for="genre in movie.genres" :key="genre.id" class="genre">
            {{ genre.name }}<span v-if="!$last"></span>
          </span>
        </div>
        <p v-if="movie" class="synopsis">{{ movie.overview }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { getMovieDetails, getMovieImages } from "../../services/api";
import Loader from "../../components/ui/loader/Loader.vue";

export default {
  name: "MovieDetails",
  components: {
    Loader,
  },
  data() {
    return {
      movie: null,
      backgroundImage: "", 
      isLoading: true,
      apiCallCount: 0, 
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
        if (backdrops.length > 0) {
          this.backgroundImage = `https://image.tmdb.org/t/p/original${backdrops[0].file_path}`; 
        }
      } catch (error) {
        console.error("Error al obtener las imágenes de la película:", error);
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    checkLoading() {
      if (this.apiCallCount === 0) {
        this.isLoading = false;
      }
    },
    formatRuntime(runtime) {
      if (!runtime) return "-";
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes} min`;
    },
    formatRating(rating) {
      return rating ? `${rating.toFixed(1)}` : "N/A";
    },
    formatReleaseYear(releaseDate) {
      if (!releaseDate) return "-";
      return new Date(releaseDate).getFullYear();
    },
    getImageUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "/img/notFound.png";
    },
  },
  mounted() {
    this.fetchMovieDetails();
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped src="./MovieDetails.css"></style>
