<template>
  <div class="trailer-container">
    <div class="trailer-header">
      <h2>Trailer</h2>
    </div>
    <div class="trailer-content">
      <div v-if="trailer" class="trailer-preview" @click="showTrailer = true">
        <div v-if="!showTrailer" class="trailer-fake-iframe">
          <img
            :src="`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`"
            alt="Tráiler"
            class="trailer-thumbnail"
          />
          <button class="play-button">▶</button>
        </div>
        <div v-else class="trailer-real-iframe">
          <iframe
            :src="`https://www.youtube.com/embed/${trailer.key}?autoplay=1`"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
      <div v-else class="trailer-placeholder">
        <p>No hay tráiler disponible para esta película.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    trailer: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      showTrailer: false,
    };
  },
};
</script>

<style src="./trailerComponent.css" scoped></style>

