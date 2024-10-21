<template>
  <div class="cast-card">
    <router-link :to="`/person/${actor.id}`">
      <img
        :src="getProfileUrl(actor.profile_path)"
        :alt="actor.name"
        class="actor-image"
      />
      <h4 class="actor-name">{{ actor.name }}</h4>
      <p class="actor-character">{{ actor.character }}</p>
    </router-link>
  </div>
</template>

<script>
import not from "../../../assets/img/not.jpg";

export default {
  name: "CastCard",
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      not,
    };
  },
  methods: {
    getProfileUrl(path) {
      return path
        ? `https://image.tmdb.org/t/p/w300${path}`
        : this.not;
    },
  },
};
</script>

<style src="./castCard.css" scoped></style>
