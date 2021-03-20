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
            :stones="getStonesForPitByPlayerId(0, 6 - n)"
            :pitId="6 - n"
            :playerId="0"
            :playersTurn="getPlayerIdTurn"
            @do-move="doMove"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-2" v-for="n in 6" v-bind:key="n">
          <Pit 
            :stones="getStonesForPitByPlayerId(1, n - 1)"
            :pitId="n - 1"
            :playerId="1"
            :playersTurn="getPlayerIdTurn"
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
        playerIdTurn: 0,
        players: [{
          name: 'Player one',
          score: 0,
          turn: false,
          pits: [6, 6, 6, 6, 6, 6],
        }, {
          name: 'Player two',
          score: 0,
          turn: true,
          pits: [6, 6, 6, 6, 6, 10],
        }],
      }
    }
  },
  components: {
    ScorePit,
    Pit,
  },
  computed: {
    getPlayerIdTurn() {
      return this.game.playerIdTurn;
    },
    getNextPlayer() {
      const player = this.game.players[this.getPlayerIdTurn];
      return player;
    },
  },
  methods: {
    getPlayerById(id) {
      return this.game.players[id];
    },
    getScoreByPlayer(id) {
      return this.getPlayerById(id).score;
    },
    getStonesForPitByPlayerId(playerId, pitId) {
      const player = this.getPlayerById(playerId);
      return player.pits[pitId];
    },
    setStonesForPitByPlayerId(playerId, pitId, stones) {
      const player = this.getPlayerById(playerId);
      player.pits[pitId] = stones;
    },
    doMove(playerId, pitId) {
      const pits = this.getPlayerById(playerId).pits;
      const stones = pits[pitId]

      // clear selected pit 
      this.setStonesForPitByPlayerId(playerId, pitId, 0);

      this.dropStone(playerId, pitId, stones, playerId);

      this.setNextPlayer();
    },
    dropStone(playerId, pitId, stones, playerIdTurn) {
      // if stones is 0, stop
      if (!stones) {
        return;
      }

      // get pitId next pit. if false, a score pit has been reached!
      const nextPitId = this.getNextPit(playerId, pitId);

      if (nextPitId === false) {
        if (playerId === playerIdTurn) {
          // next pit is a score pit of the player's turn! Update score.
          const player = this.getPlayerById(playerId);
          player.score++;
          --stones; // dropped one stone
        }

        // get next player on board
        playerId = this.getNextPlayerOnBoard(playerId);
      } else {
        // drop stone in pit
        const currentStones = this.getStonesForPitByPlayerId(playerId, nextPitId)
        this.setStonesForPitByPlayerId(playerId, nextPitId, currentStones + 1);
        --stones; // dropped one stone
      }

      this.dropStone(playerId, nextPitId, stones, playerIdTurn);
    },
    getNextPit(playerId, pitId) {
      const player = this.getPlayerById(playerId);
      const nextId = pitId !== false ? pitId + 1 : 0; // if pitId is false, it's a score pit.
      return typeof player.pits[nextId] === 'undefined' ? false : nextId;
    },
    getNextPlayerOnBoard(playerId) {
      const nextPlayerId = playerId + 1;
      return typeof this.game.players[nextPlayerId] === 'undefined' ? 0 : nextPlayerId;
    },
    setNextPlayer() {
      const players = this.game.players;
      const index = typeof players[this.getPlayerIdTurn + 1] === 'undefined' ? 0 : this.getPlayerIdTurn + 1;
      this.game.playerIdTurn = index;
    },
  }
}
</script>

<style scoped>

</style>