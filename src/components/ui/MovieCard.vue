<!-- src/components/MovieCard.vue -->
<template>
    <div class="movie-card">
      <img :src="getImageUrl(movie.poster_path)" :alt="movie.title" />
      <h3>{{ movie.title }}</h3>
      <p>{{ movie.overview }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MovieCard',
    props: {
      movie: {
        type: Object,
        required: true
      }
    },
    methods: {
      getImageUrl(path) {
        return path ? `https://image.tmdb.org/t/p/w500${path}` : 'img/notFound.png';
      }
    }
  };
  </script>
  
  <style scoped>
  .movie-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 10px;
    text-align: center;
    background-color: #f9f9f9;
  }
  .movie-card img {
    max-width: 100%;
    border-radius: 5px;
  }
  .movie-card h3 {
    margin: 10px 0 5px;
  }
  .movie-card p {
    font-size: 14px;
    color: #555;
  }
  </style>
  