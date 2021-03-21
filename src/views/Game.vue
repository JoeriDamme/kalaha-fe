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
        playerIdTurn: 1,
        players: [{
          name: 'Player one',
          score: 0,
          pits: [4, 4, 4, 4, 4, 4],
        }, {
          name: 'Player two',
          score: 0,
          pits: [4, 2, 4, 0, 4, 4],
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
      const stones = pits[pitId];

      // if no stones, don't move
      if (!stones) {
        return;
      }

      // clear selected pit 
      this.setStonesForPitByPlayerId(playerId, pitId, 0);

      this.dropStone(playerId, pitId, stones, playerId);
    },
    dropStone(playerId, pitId, stones, playerIdTurn) {
      // variable to keep track of the current player has a new turn.
      let newTurn = false;
      // variable to keep track if the current player ended (stones in hand === 0) on empty pit on his side.
      let getStonesAcross = false;
  
      // 1: get pitId next pit. if false, a score pit has been reached!
      const nextPitId = this.getNextPit(playerId, pitId);
      

      // 2: if next pit is a score pit, check if it is the score pit of the current player.
      if (nextPitId === false) {
        if (playerId === playerIdTurn) {
          // 2.A: next pit is a score pit of the player's turn! Update score.
          const player = this.getPlayerById(playerId);
          player.score++;
          --stones;

          // 2.B: if last stone and ended at players turn score pit, go another turn.
          if (!stones) {
            newTurn = true;
          }
        }

        // 2.C: get next player on board for dropping the stones, because we ended at score pit.
        playerId = this.getNextPlayerOnBoard(playerId);
      } else {
        // 3: if not a score pit, just drop a stone in the next pit.
        const currentStones = this.getStonesForPitByPlayerId(playerId, nextPitId);
        this.setStonesForPitByPlayerId(playerId, nextPitId, currentStones + 1);
        --stones;

        // 3.A: if no more stones and current player ended at own empty pit, get stones from pit across and add to score.
        if (!stones && !currentStones && playerId === playerIdTurn) {
          getStonesAcross = true;
        }
      }


      // 4: Does the current have a new turn or not? If not, Set next player.
      if (!newTurn) {
        this.setNextPlayer();
      }

      // 5: Does the current player get the stones across?
      if (getStonesAcross) {
        console.log('get stones across!!!');
        const { playerIdAcross, pitIdAcross } = this.getPitIdAcross(playerIdTurn, nextPitId);
        const stonesAcross = this.getStonesForPitByPlayerId(playerIdAcross, pitIdAcross);
        const player = this.getPlayerById(playerId);
        player.score = player.score + stonesAcross;
        this.setStonesForPitByPlayerId(playerIdAcross, pitIdAcross, 0);

      }

      // 6: Any stones left in hand? If no, stop the recursion
      if (!stones) {
        return;
      }

      // 7: we still have stones in our hands. Continue with next drop.
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
    getPitIdAcross(playerId, pitId) {
      // the logic is currently only for two players
      // get player across
      const playerIdAcross = this.getNextPlayerOnBoard(playerId);

      // get pitId across
      // 1. how many pits? The minus 1 is because we start counting at 0.
      const pitLength = this.game.players[playerId].pits.length - 1;
      // 2. get pitId across by total length minus current pitId. Remember we see reversed order as player.
      const pitIdAcross = pitLength - pitId;
      
      return {
        playerIdAcross,
        pitIdAcross,
      }
    }
  }
}
</script>

<style scoped>

</style>