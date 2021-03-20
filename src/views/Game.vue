<template>
  <div class="game row">
    <div class="col-1">
      <ScorePit />
    </div>

    <div class="col-10">

      <div class="row">
        <div class="col-2" v-for="n in 6" v-bind:key="n">
          <Pit />
        </div>
      </div>

      <div class="row">
        <div class="col-2" v-for="n in 6" v-bind:key="n">
          <Pit />
        </div>
      </div>
    </div>

    <div class="col-1">
      <ScorePit />
    </div>

  </div>
</template>

<script>
import ScorePit from '../components/ScorePit';
import Pit from '../components/Pit';

export default {
  components: {
    ScorePit,
    Pit,
  }
}
</script>

<style scoped>

</style>