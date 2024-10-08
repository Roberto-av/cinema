<!-- src/views/Home.vue -->
<template>
    <div class="home-container">
      <h1>Bienvenido a la Página de Películas</h1>
      <button @click="logout">Cerrar Sesión</button>
      <div v-if="movies.length">
        <h2>Películas Populares</h2>
        <div class="movies-grid">
          <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
        </div>
      </div>
      <div v-else>
        <p>Cargando películas...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { getPopularMovies } from '../services/api';
  import MovieCard from '../components/ui/MovieCard.vue';
  
  export default {
    name: 'Home',
    components: {
      MovieCard
    },
    data() {
      return {
        movies: []
      };
    },
    methods: {
      logout() {
        localStorage.removeItem('auth');
        this.$router.push({ name: 'Login' });
      },
      async fetchMovies() {
        try {
          this.movies = await getPopularMovies();
        } catch (error) {
          console.error('Error al cargar las películas:', error);
        }
      }
    },
    created() {
      this.fetchMovies();
    }
  };
  </script>
  
  <style scoped>
  .home-container {
    padding: 20px;
  }
  .home-container h1 {
    text-align: center;
  }
  .home-container button {
    display: block;
    margin: 0 auto 20px;
    padding: 10px 20px;
    cursor: pointer;
  }
  .movies-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  </style>
  