<template>
  <div class="modal-overlay" v-if="show" @keydown.esc="closeModal">
    <div class="modal" @click.stop>
      <h2>Calificar la película</h2>
      <div class="stars">
        <span
          v-for="star in 10"
          :key="star"
          class="star"
          @click="rateMovie(star)"
          :aria-label="'Calificar con ' + star + ' estrellas'"
        >
          <img
            :src="star <= selectedRating ? StarFilled : StarRegular"
            alt="Rate"
            class="icon"
          />
        </span>
      </div>
      <div class="buttons">
        <button class="cancel-btn" @click="closeModal">Cancelar</button>
        <button class="confirm-btn" @click="confirmRating">Confirmar</button>
      </div>
    </div>
  </div>
</template>

<script>
import StarFilled from "../../../assets/icons/StarFilled.svg";
import StarRegular from "../../../assets/icons/StarRegular.svg";

export default {
  name: "RatingModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedRating: 0,
      StarFilled,
      StarRegular,
    };
  },
  methods: {
    rateMovie(star) {
      this.selectedRating = star;
    },
    confirmRating() {
      this.$emit("confirm", this.selectedRating);
      this.closeModal();
    },
    closeModal() {
      this.$emit("close");
      this.selectedRating = 0;
    },
    handleKeydown(event) {
      if (event.key === "Escape") {
        this.closeModal();
      }
    },
  },
  mounted() {
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener("keydown", this.handleKeydown);
  },
};
</script>

<style src="./RaitingModal.css" scoped></style>
