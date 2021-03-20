<template>
  <div class="pit" @click="move()">
    {{ stones }}
  </div>
</template>

<script>
export default {
  methods: {
    move() {
      // check if current player is owner and can start a 
      if (this.playerId !== this.playersTurn) {
        return alert('not your turn!');
      }

      // the move action will be emitted to the parent, because the parent knows the game board layout.
      // the default Kalaha game has a standard layout, but maybe it's extendable? who knows...
      this.$emit('do-move', this.playerId, this.pitId);
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
  border: 1px solid black;
}
</style>