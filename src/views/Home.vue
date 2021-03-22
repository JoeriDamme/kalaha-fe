<template>
  <div class="container landing">
    <VideoBackground />
    <div class="row p-3 start">
      <div class="col-12">
        <img class="logo" src="../assets/logo-small.png" />
      </div>
      <div class="col-md-5 col-12 shadow-lg rounded bg-light p-3">
        <h4 class="text-info">Start a new game...</h4>
        <NewGameForm />
      </div>
      <div class="col-md-2 col-12"></div>
      <div class="col-md-5 col-12 shadow-lg rounded p-3 bg-info">
        <h4 class="text-light">...or continue a game</h4>
        <ResumeGameForm />
      </div>
    </div>
  </div>
</template>

<script>
import VideoBackground from '../components/VideoBackground.vue';
import NewGameForm from '../components/NewGameForm.vue';
import ResumeGameForm from '../components/ResumeGameForm.vue';

export default {
  name: 'App',
  components: {
    VideoBackground,
    NewGameForm,
    ResumeGameForm,
  }
}
</script>

<style scoped>
.start {
  position: relative;
  height: 100vh;
  text-align: center;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.logo {
  width: 10rem;
}
</style>
