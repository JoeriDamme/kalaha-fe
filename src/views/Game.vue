<template>
  <div class="row">
    <div class="col-12">
      <GameMessage :message="getMessage" />
    </div>
  </div>
  <div class="game align-self-center row mt-1 pb-2 pt-2">
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

      <div class="row mt-3">
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
import GameMessage from '../components/GameMessage'

export default {
  data() {
    return {
      game: {
        playerIdTurn: 0,
        players: [{
          name: 'Player one',
          score: 0,
          pits: [6, 6, 6, 6, 6, 6],
        }, {
          name: 'Player two',
          score: 0,
          pits: [6, 6, 6, 6, 6, 6],
        }],
      }
    }
  },
  components: {
    ScorePit,
    Pit,
    GameMessage,
  },
  computed: {
    getMessage() {
      const player = this.getPlayerById(this.getPlayerIdTurn);
      return `It's your turn, ${player.name}!`;
    },
    getPlayerIdTurn() {
      return this.game.playerIdTurn;
    },
    getNextPlayer() {
      const player = this.game.players[this.getPlayerIdTurn];
      return player;
    },
    getPlayerMostPoints() {
      let leadingPlayer;
      let total = -1;

      // loop over each player, check if score is higher than earlier player.
      this.game.players.forEach(player => {
        const score = player.score;
        if (score > total) {
          total = score;
          leadingPlayer = player;
        }
      });

      return leadingPlayer;
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
      // 1. get stones in selected pit to pick up.
      const pits = this.getPlayerById(playerId).pits;
      const stones = pits[pitId];

      // 1a. if no stones, don't move
      if (!stones) {
        return;
      }

      // 2. clear selected pit.
      this.setStonesForPitByPlayerId(playerId, pitId, 0);

      // 3. start dropping stones.
      this.dropStone(playerId, pitId, stones, playerId);

      // 4. after finishing dropping stones, check if game is over
      this.handleGameEnding();

    },
    dropStone(playerId, pitId, stones, playerIdTurn) {
      // variable to keep track of the current player has a new turn.
      let newTurn = false;
      // variable to keep track if the current player ended (stones in hand === 0) on empty pit on his side.
      let getStonesAcross = false;
  
      // 1. get pitId next pit. if false, a score pit has been reached!
      const nextPitId = this.getNextPit(playerId, pitId);

      // 2. if next pit is a score pit, check if it is the score pit of the current player.
      if (nextPitId === false) {
        if (playerId === playerIdTurn) {
          // 2a. next pit is a score pit of the player's turn! Update score.
          const player = this.getPlayerById(playerId);
          player.score++;
          --stones;

          // 2b. if last stone and ended at players turn score pit, go another turn.
          if (!stones) {
            newTurn = true;
          }
        }

        // 2c. get next player on board for dropping the stones, because we ended at score pit.
        playerId = this.getNextPlayerOnBoard(playerId);
      } else {
        // 3. if not a score pit, just drop a stone in the next pit.
        const currentStones = this.getStonesForPitByPlayerId(playerId, nextPitId);
        this.setStonesForPitByPlayerId(playerId, nextPitId, currentStones + 1);
        --stones;

        // 3a. if no more stones and current player ended at own empty pit, get stones from pit across and add to score.
        if (!stones && !currentStones && playerId === playerIdTurn) {
          getStonesAcross = true;
        }
      }

      // 4. Does the current player get the stones across?
      if (getStonesAcross) {
        this.handleStonesAcross(playerIdTurn, nextPitId);
      }

      // 5. Any stones left in hand? If no, stop the recursion
      if (!stones) {
        // 5a. Does the current have a new turn or not? If not, Set next player.
        if (!newTurn) {
          this.setNextPlayer();
        }
        return;
      }

      // 6. we still have stones in our hands. Continue with next drop.
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
    },
    handleStonesAcross(playerId, pitId) {
      // 1. get pitId across.
      const { playerIdAcross, pitIdAcross } = this.getPitIdAcross(playerId, pitId);
      // 2. get number of stones across.
      const stonesAcross = this.getStonesForPitByPlayerId(playerIdAcross, pitIdAcross);
      // 3. get player.
      const player = this.getPlayerById(playerId);
      // 4. update player score.
      player.score = player.score + stonesAcross;
      // 5. set stones across to 0.
      this.setStonesForPitByPlayerId(playerIdAcross, pitIdAcross, 0);
    },
    handleGameEnding() {
      // 1. get player with no stones.
      const playerIdNoStones = this.isCompleted();

      // 2. if no player found, resume.
      if (playerIdNoStones === false) {
        return;
      }

      // 3. filter players that are remaining, so except with player with no stones.
      const remainingPlayers = this.game.players.filter((player, index) => index !== playerIdNoStones ? true : false);

      // 4. add stones to total score of player.
      remainingPlayers.forEach(player => {
        // 4a. get all pits.
        const pits = player.pits;
        // 4b. sum all stones.
        const sum = pits.reduce((a, b) => a + b, 0);
        // 4c. add to total player score.
        player.score = player.score + sum;
        // 4e. reset pits to 0
        pits.fill(0); // praise ES6 for fill.
      });

      alert(`Winner is ${this.getPlayerMostPoints.name}`)
    },
    isCompleted() {
      // the current logic is based in two players
      // 1. get all player pits
      const pits = this.game.players.map(player => player.pits);

      // 2. find player with 0 stones in pit. if -1, no player found.
      // TODO: basically doing reduce twice now, also in handleGameEnding. Fix?
      const playerIdWithNoStones = pits.findIndex(pit => !pit.reduce((a, b) => a + b, 0));

      // 3. return false if no player found, otherwise playerId
      return playerIdWithNoStones === -1 ? false : playerIdWithNoStones;
    }
  }
}
</script>

<style>
body { 
  background: url('../assets/kalaha-bg-2.png') no-repeat center center fixed; 
  background-size: cover;
}

.game {
  background: url('../assets/wood.jpg') no-repeat center center fixed;
  background-size: cover;
  border-radius: 0.5rem;
}
</style>