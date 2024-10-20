<template>
  <div class="keyword-movies">
    <div v-if="isLoading && currentPage === 1"><Loader /></div>
    <div v-else>
      <div class="keyword-header">
        <div class="keyword-header-c">
          <div class="keyword-header-title">
            <h2 class="title">
              <strong class="semi-bold">Resultados para</strong>
              <span class="keyword-name">{{ keywordName }}</span>
            </h2>
          </div>
          <div class="keyword-header-total-results">
            <p>
              <strong class="semi-bold">Coincidencias</strong>
              <span class="keyword-name">{{ totalResults }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="filters">
        <label for="content-type">Tipo:</label>
        <select id="content-type" v-model="contentType" @change="resetMovies">
          <option value="movie">Películas</option>
          <option value="tv">Series</option>
        </select>
        <label for="sort-order">Ordenar por:</label>
        <select id="sort-order" v-model="sortOrder" @change="resetMovies">
          <option value="asc">Popularidad (asc)</option>
          <option value="desc">Popularidad (desc)</option>
        </select>
      </div>
      <div class="movies-seccion">
        <div class="movies-seccion-c">
          <div class="movies-grid">
            <MovieCard
              v-for="item in items"
              :key="item.id"
              :movie="item"
              class="movie-card"
            />
          </div>
          <div class="pagination-seccion">
            <div v-if="isLoadingMore">
              <Loader />
            </div>
            <div class="btn-pagination" v-else>
              <button
                class="btn-pagination-b"
                @click="loadMore"
                :disabled="isLoadingMore"
              >
                <span>Cargar más</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getMoviesByKeyword,
  getMovieDetails,
  getTVShowsByKeyword,
  getShowDetails,
  getMoviesByGenre,
  getTVShowsByGenre,
} from "../../services/api";
import MovieCard from "../../components/ui/MovieCard/MovieCard.vue";
import Loader from "../../components/ui/loader/Loader.vue";

export default {
  name: "KeywordMovies",
  components: {
    MovieCard,
    Loader,
  },
  data() {
    return {
      items: [],
      keywordName: "",
      totalResults: 0,
      isLoading: true,
      apiCallCount: 0,
      currentPage: 1,
      isLoadingMore: false,
      contentType: null,
      sortOrder: "desc",
    };
  },
  methods: {
    async fetchItems(page = 1) {
      const id = this.$route.params.id;
      const name = this.$route.params.name.replace(/-/g, " ");
      this.keywordName = name;

      this.isLoading = true;
      this.apiCallCount++;
      try {
        let fetchedItems;
        if (this.contentType === "movie") {
          // Si se está buscando películas
          if (this.isKeywordSearch) {
            const keyWordsMovies = await getMoviesByKeyword(id, page, this.sortOrder);
            fetchedItems = await Promise.all(
              keyWordsMovies.results.map((movie) => getMovieDetails(movie.id))
            );
            this.totalResults = keyWordsMovies.total_results;
          } else {
            // Si se está buscando por género
            const genreMovies = await getMoviesByGenre(id, page, this.sortOrder);
            fetchedItems = await Promise.all(
              genreMovies.results.map((movie) => getMovieDetails(movie.id))
            );
            this.totalResults = genreMovies.total_results;
          }
        } else {
          // Si se está buscando series
          if (this.isKeywordSearch) {
            const keyWordsTVShows = await getTVShowsByKeyword(id, page, this.sortOrder);
            fetchedItems = await Promise.all(
              keyWordsTVShows.results.map((show) => getShowDetails(show.id))
            );
            this.totalResults = keyWordsTVShows.total_results;
          } else {
            // Si se está buscando por género
            const genreTVShows = await getTVShowsByGenre(id, page, this.sortOrder);
            fetchedItems = await Promise.all(
              genreTVShows.results.map((show) => getShowDetails(show.id))
            );
            this.totalResults = genreTVShows.total_results;
          }
        }

        this.items = page === 1 ? fetchedItems : [...this.items, ...fetchedItems];
      } catch (error) {
        console.error("Error al cargar elementos:", error);
      } finally {
        this.apiCallCount--;
        this.checkLoading();
      }
    },
    checkLoading() {
      this.isLoading = this.apiCallCount > 0;
    },
    async loadMore() {
      this.isLoadingMore = true;
      this.currentPage++;
      await this.fetchItems(this.currentPage);
      this.isLoadingMore = false;
    },
    resetMovies() {
      const queryParams = { contentType: this.contentType };
      if (this.sortOrder !== "desc") {
        queryParams.sortOrder = this.sortOrder;
      }

      this.$router.replace({
        name: this.$route.name, // Mantiene el mismo nombre de ruta
        params: {
          id: this.$route.params.id,
          name: this.$route.params.name,
        },
        query: queryParams,
      });

      this.currentPage = 1;
      this.items = [];
      this.fetchItems();
    },
  },
  mounted() {
    const contentTypeFromParams = this.$route.query.contentType || "movie";
    this.contentType = contentTypeFromParams;
    this.sortOrder = this.$route.query.sortOrder || "desc";
    this.isKeywordSearch = this.$route.name === 'KeywordMovies'; // Verifica si es búsqueda por palabra clave
    this.fetchItems();
    window.scrollTo(0, 0);
  },
};
</script>

<style scoped src="./keywordMovies.css"></style>
