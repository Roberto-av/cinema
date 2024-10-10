<template>
  <TopBar v-if="!isLoginPage" />
  <router-view />
</template>

<script>
import TopBar from "./components/topbar/TopBar.vue";

export default {
  name: "App",
  components: {
    TopBar,
  },
  computed: {
    isLoginPage() {
      return this.$route.name === "Login";
    },
  },
  created() {
    const sessionId = localStorage.getItem("session_id");

    if (!sessionId && this.$route.name !== "Login") {
      this.$router.push({ name: "Login" });
    }
  },
};
</script>
