<template>
  <div class="score-pit d-flex justify-content-center align-items-center">
    <span>{{ score }}</span>
  </div>
</template>

<script>
export default {
  props: {
    score: Number,
  }
}
</script>

<style scoped>
.score-pit {
  background: url('../assets/pit-score.png');
  background-size: cover;
  height: 260px;
}

span {
  color: white;
  font-size: 2rem;
}
</style>