<template>
  <TopBar v-if="!isLoginPage" />
  <router-view />
</template>

<script>
import TopBar from './components/topbar/TopBar.vue';

export default {
  name: 'App',
  components: {
    TopBar
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'Login';
    }
  }
};
</script>