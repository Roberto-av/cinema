<template>
  <div class="accordion">
    <div class="accordion-item">
      <div
        class="accordion-header"
        @click="toggleAccordion"
        :class="{ 'has-border': isOpen }"
      >
        <h3>Biografía</h3>
      </div>
      <div ref="accordionBody" class="accordion-body" :class="{ open: isOpen }">
        <div v-if="actor.biography">
            <p class="accordion-biography">{{ actor.biography }}</p>
        </div>
        <div v-else>
            <p class="accordion-biography">No se encontro Biografía</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    actor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleAccordion() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style src="./accordion.css" scoped></style>
