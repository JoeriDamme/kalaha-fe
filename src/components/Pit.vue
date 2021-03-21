<template>
  <div
    class="pit d-flex justify-content-center align-items-center" 
    @click="move()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    :class="{'pit-hover': hover && isPlayerTurn, 'pit-inactive': !isPlayerTurn, 'pit-active': isPlayerTurn}"
  >
    <span>{{ stones }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      hover: false
    }
  },
  methods: {
    move() {
      // check if current player is owner and can start a 
      if (!this.isPlayerTurn) {
        return alert('not your turn!');
      }

      // the move action will be emitted to the parent, because the parent knows the game board layout.
      // the default Kalaha game has a standard layout, but maybe it's extendable? who knows...
      this.$emit('do-move', this.playerId, this.pitId);
    }
  },
  computed: {
    isPlayerTurn() {
      return this.playerId === this.playersTurn;
    }
  },
  emits: ['do-move'],
  props: {
    stones: Number, // how many stones are in the pit
    playerId: Number, // which player can control this pit
    playersTurn: Number, // which player's turn it is
    pitId: Number,
  }
}
</script>

<style scoped>
.pit {
  background-size: cover;
  height: 128px;
}

.pit-active {
  background-image: url('../assets/pit.png');
}

.pit-hover {
  background-image: url('../assets/pit-hover.png');
  cursor: pointer;
}

.pit-inactive {
  background-image: url('../assets/pit-inactive.png');
}

span {
  color: white;
  font-size: 2rem;
}
</style>