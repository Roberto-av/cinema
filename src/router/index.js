// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home/Home.vue";
import Login from "../views/Login/Login.vue";
import MovieDetails from "../views/MovieDetails/MovieDetails.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/movie/:id",
    name: "MovieDetails",
    component: MovieDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Middleware para proteger rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("session_id");
  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router; // Exporta la instancia creada con createRouter
