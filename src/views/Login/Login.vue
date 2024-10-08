<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <input
          type="text"
          id="username"
          v-model="username"
          placeholder="Username"
        />
      </div>
      <div>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Contraseña"
        />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: ''
    };
  },
  methods: {
    handleLogin() {
      if (this.username && this.password) {
        localStorage.setItem('auth', 'true');
        this.$router.push({ name: 'Home' });
      } else {
        this.error = 'Por favor, ingresa username y contraseña.';
      }
    }
  }
};
</script>

<style src="./Login.css" scoped></style>
