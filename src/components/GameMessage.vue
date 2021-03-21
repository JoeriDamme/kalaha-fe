<template>
  <span class="text-center">{{ message }}</span>  
</template>

<script>
export default {
  props: {
    message: String,
  }
}
</script>

<style scoped>
span {
  font-size: 2rem;
  color: white;
  display: block;
}
</style>

