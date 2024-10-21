// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/home/Home.vue";
import Login from "../views/Login/Login.vue";
import MovieDetails from "../views/MovieDetails/MovieDetails.vue";
import ActorDetails from "../views/person/ActorDetails.vue";
import KeywordMovies from "../views/keywords/KeywordMovies.vue";
import ShowDetails from "../views/ShowDetails/ShowDetails.vue";
import ShowSeasonDetails from "../views/ShowSeasonDetails/ShowSeasonDetails.vue";

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
    path: "/tv/:id",
    name: "ShowDetails",
    component: ShowDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/tv/:id/season/:seasonNumber",
    name: "ShowSeasonDetails",
    component: ShowSeasonDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/person/:id",
    name: "ActorDetails",
    component: ActorDetails,
    meta: { requiresAuth: true },
  },
  {
    path: "/keyword/:id-:name/:contentType?/:sortOrder?",
    name: "KeywordMovies",
    component: KeywordMovies,
    meta: { requiresAuth: true },
  },
  {
    path: "/genre/:id-:name/:contentType?/:sortOrder?",
    name: "GenreMovies",
    component: KeywordMovies,
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

export default router;
