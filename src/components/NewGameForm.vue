<template>
  <div class="new-game-form">
    <form>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Player one" v-model="game.players[0].name" maxlength="64" />
      </div>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Player two" v-model="game.players[1].name" maxlength="64" />
      </div>
      <div class="form-group">
        <input type="button" :disabled="isDisabled" @click="postGame" class="btn btn-info" value="Start" />
      </div>
    </form>
  </div>
</template>

<script>
import { gamePostSchema } from '../helpers/validation/game-post-schema';
import router from '../router';

export default {
  data() {
    return {
      saving: false,
      game: {
        players: [{
          name: '',
        }, {
          name: '',
        }]
      }
    }
  },
  methods: {
    async postGame() {
      this.saving = true;
      let result;
      try {
        result = await this.$http.post(`/games`, this.game);
      } catch (error) {
        // handle error
      } finally {
        // for interaction purposes, show spinner a little but longer.
        setTimeout(() => {
          this.game.players.forEach(player => player.name = '');
          this.saving = false;
        }, 500);

        if (result) {
          // redirect
          router.push({ name: 'Game', query: { id: result.data._id } });
        }
      }
    }
  },
  computed: {
    isDisabled() {
      const result = gamePostSchema.validate(this.game);
      return !!result.error;
    }
  }
}
</script>