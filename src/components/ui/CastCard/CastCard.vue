<template>
  <div class="cast-card">
    <router-link :to="`/person/${actor.id}`">
    <img
      :src="getProfileUrl(actor.profile_path)"
      :alt="actor.name"
      class="actor-image"
    />
    <h4 class="actor-name">{{ actor.name }}</h4>
  </router-link>
  </div>
</template>

<script>
export default {
  name: "CastCard",
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
  methods: {
    getProfileUrl(path) {
      return path ? `https://image.tmdb.org/t/p/w300${path}` : null;
    },
  },
};
</script>

<style src="./CastCard.css" scoped></style>
