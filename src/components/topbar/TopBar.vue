<template>
  <div class="top-bar">
    <router-link to="/" class="link-logo">
      <div class="logo">Cinema</div>
    </router-link>
    <div class="nav-links">
      <router-link to="/" class="nav-link">
        <img src="../../assets/icons/Home.svg" alt="Inicio" class="icon" />
        Inicio
      </router-link>
    </div>
    <div class="user-icon" @click="toggleMenu">
      <img src="../../assets/icons/User.svg" alt="User" class="icon" />

      <div v-if="menuVisible" class="dropdown">
        <button @click="logout">Cerrar Sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TopBar",
  data() {
    return {
      menuVisible: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    logout() {
      localStorage.removeItem("auth");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>

<style scoped src="./topbar.css"></style>
