<template>
  <div class="actor-conteiner">
    <div v-if="isLoading">
      <Loader />
    </div>
    <div v-else>
      <div class="actor-info">
        <img
          class="actor-img"
          :src="getActorImageUrl(actor?.profile_path)"
          :alt="actor?.name || 'Imagen no disponible'"
        />
        <div class="actor-details">
          <div class="actor-header">
            <h1 class="actor-name" v-if="actor">{{ actor.name }}</h1>
            <div class="actor-socials">
              <a
                v-if="actorSocials.twitter_id"
                :href="`https://twitter.com/${actorSocials.twitter_id}`"
                target="_blank"
              >
                <img
                  src="../../assets/icons/Twitter.svg"
                  alt="Twitter"
                  class="social-icon"
                />
              </a>
              <a
                v-if="actorSocials.instagram_id"
                :href="`https://instagram.com/${actorSocials.instagram_id}`"
                target="_blank"
              >
                <img
                  src="../../assets/icons/Instagram.svg"
                  alt="Instagram"
                  class="social-icon"
                />
              </a>
              <a
                v-if="actorSocials.facebook_id"
                :href="`https://facebook.com/${actorSocials.facebook_id}`"
                target="_blank"
              >
                <img
                  src="../../assets/icons/Facebook.svg"
                  alt="Facebook"
                  class="social-icon"
                />
              </a>
            </div>
          </div>
          <div class="actor-biography">
            <Accordion :actor="actor" />
          </div>
          <div class="actor-extra-details">
            <p class="actor-birthday">
              <strong>Conocido Por</strong>
              <span class="actor-detail">{{
                formatDepartment(actor.known_for_department)
              }}</span>
            </p>
            <p>
              <strong>Total de créditos:</strong>
              <span class="actor-detail">{{ totalCredits(actorMovies) }}</span>
            </p>
            <p class="actor-birthday">
              <strong>Fecha de nacimiento:</strong>
              <span class="actor-detail">{{ formatDate(actor.birthday) }}</span>
            </p>
            <p v-if="actor.deathday" class="actor-deathday">
              <strong>Fecha de fallecimiento:</strong>
              <span class="actor-detail">{{ formatDate(actor.deathday) }}</span>
            </p>
            <p class="actor-gender">
              <strong>Sexo: </strong>
              <span class="actor-detail">{{ formatGender(actor.gender) }}</span>
            </p>
            <p>
              <strong>Lugar de nacimiento: </strong>
              <span class="actor-detail">{{ actor.place_of_birth }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="known-for-section">
        <MovieCarousel :movies="listActorMovies" title="Conocid(o) Por" />
      </div>
      <div class="actor-movies">
        <h2>Películas</h2>
        <table class="credits-table">
          <thead>
            <tr>
              <th>Año</th>
              <th>Título</th>
              <th>Papel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movie in actorMovies" :key="movie.id">
              <td>{{ new Date(movie.release_date).getFullYear() }}</td>
              <td>
                <router-link class="link" :to="`/movie/${movie.id}`">{{
                  movie.title
                }}</router-link>
              </td>
              <td>{{ movie.character }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getActorDetails,
  getActorMovies,
  getActorMoviesCombined,
  getMovieDetails,
  getActorExternalIds,
} from "../../services/api";
import Loader from "../../components/ui/loader/Loader.vue";
import Accordion from "../../components/ui/accordion/Accordion.vue";
import MovieCarousel from "../../components/ui/carrusel/MovieCarousel.vue";

export default {
  name: "ActorDetails",
  components: {
    Loader,
    Accordion,
    MovieCarousel,
  },
  data() {
    return {
      actor: null,
      actorMovies: [],
      listActorMovies: [],
      isLoading: true,
      actorSocials: null,
      apiCallCount: 0,
    };
  },
  methods: {
    async fetchActorDetails() {
      const actorId = this.$route.params.id;
      this.isLoading = true;
      try {
        const [details, movies, socials] = await Promise.all([
          getActorDetails(actorId),
          getActorMoviesCombined(actorId),
          getActorExternalIds(actorId),
        ]);
        this.actor = details;
        this.actorMovies = movies.cast;
        this.actorSocials = socials;
      } catch (error) {
        console.error("Error al obtener los detalles del actor:", error);
        this.actor = null;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchRecommendedMovies() {
      const actorId = this.$route.params.id;
      this.apiCallCount++;
      try {
        const recommendations = await getActorMovies(actorId);
        const moviesWithDetails = await Promise.all(
          recommendations.cast.map(async (movie) => {
            const details = await getMovieDetails(movie.id);
            return {
              ...movie,
              runtime: details.runtime,
              genres: details.genres,
              popularity: details.popularity,
            };
          })
        );
        this.listActorMovies = moviesWithDetails
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 20);
      } catch (error) {
        console.error("Error al cargar las películas recomendadas:", error);
        this.listActorMovies = [];
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    getActorImageUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w500${path}`
        : "/img/notFound.png";
    },
    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    formatGender(gender) {
      const genderMapping = {
        1: "Mujer",
        2: "Hombre",
      };
      return genderMapping[gender] || "Sin especificar";
    },
    formatDepartment(department) {
      const departmentMapping = {
        Acting: "Actuación",
        Directing: "Dirección",
        Writing: "Guionismo",
        Production: "Producción",
        Camera: "Cámara",
        Editing: "Edición",
        Sound: "Sonido",
        Art: "Arte",
        Costume: "Vestuario",
      };
      return departmentMapping[department] || department;
    },
    totalCredits(movies) {
      return movies.length;
    },
    checkLoading() {
      if (this.apiCallCount === 0) {
        this.isLoading = false;
      }
    },
  },
  mounted() {
    this.fetchActorDetails();
    this.fetchRecommendedMovies();
  },
};
</script>

<style src="./actorDetails.css" scoped></style>
