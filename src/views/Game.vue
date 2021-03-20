<template>
  <div class="game row">
    <div class="col-12">
      It's your turn now, {{ getNextPlayer.name }}
    </div>
    <div class="col-1">
      <ScorePit :score="getScoreByPlayer(0)"  />
    </div>

    <div class="col-10">

      <div class="row">
        <div class="col-2" v-for="n in 6" v-bind:key="n">
          <Pit
            :stones="getStonesForPit(0, n - 1)"
            :coordinate="[0, n - 1]"
            :owner="0"
            :playersTurn="getNextPlayer.index"
            @do-move="doMove"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-2" v-for="n in 6" v-bind:key="n">
          <Pit 
            :stones="getStonesForPit(1, n - 1)"
            :coordinate="[1, n - 1]"
            :owner="1"
            :playersTurn="getNextPlayer.index"
            @do-move="doMove"
          />
        </div>
      </div>
    </div>

    <div class="col-1">
      <ScorePit :score="getScoreByPlayer(1)" />
    </div>

  </div>
</template>

<script>
import ScorePit from '../components/ScorePit';
import Pit from '../components/Pit';

export default {
  data() {
    return {
      game: {
        players: [{
          name: 'Player one',
          score: 0,
          turn: false,
        }, {
          name: 'Player two',
          score: 0,
          turn: true,
        }],
        board: [[6, 6, 6, 6, 6, 6], [6, 6, 6, 6, 6, 6]],
      }
    }
  },
  components: {
    ScorePit,
    Pit,
  },
  computed: {
    getNextPlayer() {
      const players = this.game.players;
      // need to get the index to pass it to the Pit component.
      // otherwise, we could just use a find on the collection.
      const index = players.findIndex(player => player.turn);
      return Object.assign({ index }, players[index]);
    }
  },
  methods: {
    getScoreByPlayer(player) {
      return this.game.players[player].score;
    },
    getStonesForPit(x, y) {
      return this.game.board[x][y];
    },
    doMove(coordinate) {
      console.log(coordinate)
      const [x, y] = coordinate;
      console.log(x, y);
    }
  }
}
</script>

<style scoped>

</style>