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
import {
  getRequestToken,
  validateUser,
  createSession,
} from "../../services/api";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const requestToken = await getRequestToken();

        const validationResponse = await validateUser(
          this.username,
          this.password,
          requestToken
        );

        const sessionResponse = await createSession(
          validationResponse.request_token
        );
        localStorage.setItem("session_id", sessionResponse.session_id);

        this.$router.push({ name: "Home" });
      } catch (error) {
        this.error =
          "Error en el inicio de sesión. Por favor verifica tus credenciales.";
        console.error("Error en el inicio de sesión:", error);
      }
    },
  },
};
</script>

<style src="./Login.css" scoped></style>
