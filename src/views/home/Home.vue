<template>
  <div class="home-container">
    <!-- Contenedor del buscador -->
    <h2 class="title">Cinema Club tiene las mejores peliculas</h2>

    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Buscar Película"
        @input="filterMovies"
      />
    </div>

    <!-- Contenedor de las películas -->
    <div class="movies-section">
      <div v-if="filteredMovies.length">
        <h2>Películas Populares</h2>
        <div class="movies-grid">
          <MovieCard v-for="movie in filteredMovies" :key="movie.id" :movie="movie" />
        </div>
      </div>
      <div v-else>
        <p>Cargando películas...</p>
      </div>
    </div>
  </div>
</template>


<script>
import { getPopularMovies } from '../../services/api';
import MovieCard from '../../components/ui/MovieCard/MovieCard.vue';

export default {
  name: 'Home',
  components: {
    MovieCard
  },
  data() {
    return {
      movies: [],
      filteredMovies: [],
      searchQuery: ''
    };
  },
  methods: {
    async fetchMovies() {
      try {
        this.movies = await getPopularMovies();
        this.filteredMovies = this.movies;
      } catch (error) {
        console.error('Error al cargar las películas:', error);
      }
    },
    filterMovies() {
      const query = this.searchQuery.toLowerCase();
      this.filteredMovies = this.movies.filter(movie =>
        movie.title.toLowerCase().includes(query)
      );
    }
  },
  created() {
    this.fetchMovies();
  }
};
</script>

<!-- CSS Import -->
<style src="./home.css" scoped></style>
