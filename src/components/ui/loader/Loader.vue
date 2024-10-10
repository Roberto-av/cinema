<template>
    <div class="loader-container">
      <img src="../../../assets/icons/Loader.svg" alt="Cargando..." class="loader-icon" />
    </div>
  </template>
  
  <script>
  export default {
    name: "Loader",
  };
  </script>
  
  <style scoped>
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50vh;
  }
  
  .loader-icon {
    width: 50px;
    height: auto;
    animation: rotate 1s linear infinite; /* Aplicar la animación de rotación */
  }
  
  @keyframes rotate {
    0% {
      transform: rotate(0deg); /* Inicia en 0 grados */
    }
    100% {
      transform: rotate(360deg); /* Gira hasta 360 grados */
    }
  }
  </style>
  