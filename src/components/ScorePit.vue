<template>
  <div class="score-pit">
    {{ score }}
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
  border: 1px solid black;
}
</style>