<template>
  <div class="container landing">
    <VideoBackground />
    
    <div class="row p-3 start">
      <div class="col-12">
        <img class="logo" src="../assets/logo-small.png" />
      </div>
      <div class="col-md-5 col-12 shadow-lg rounded bg-light p-3  start-new-game-form">
        <h4 class="text-info">Start a new game...</h4>
        <form>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Player one" value="" />
          </div>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Player two" value="" />
          </div>
          <div class="form-group">
            <input type="submit" class="btn btn-info" value="Start" />
          </div>
        </form>
      </div>
      <div class="col-md-2 col-12"></div>
      <div class="col-md-5 col-12 shadow-lg rounded p-3 bg-info continue-game-form">
        <h4 class="text-light">...or continue a game</h4>
        <form>
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Game Id: ABCDEF" value="" />
          </div>
          <div class="form-group">
            <input type="submit" class="btn btn-light" value="Continue" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import VideoBackground from '../components/VideoBackground.vue';
export default {
  name: 'App',
  components: {
    VideoBackground
  }
}
</script>

<style>
html {
  background: darkgray;
}

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
