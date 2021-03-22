<template>
  <div class="resume-game-form">
    <form>
      <div class="form-group">
        <input type="text" class="form-control" placeholder="Example: 7c22b512-f7df-4609-936b-a0c359f01b49" v-model="id" />
      </div>
      <div class="form-group">
        <input type="button" @click="getGame" :disabled="isDisabled" class="btn btn-light" value="Continue" />
      </div>
    </form>
  </div>
</template>

<script>
import router from '../router';
import { uuidSchema } from '../helpers/validation/uuid-schema';

export default {
  data() {
    return {
      saving: false,
      id: '',
    }
  },
  methods: {
    async getGame() {
      this.saving = true;
      let result;
      try {
        result = await this.$http.get(`/games/${this.id}`);
      } catch (error) {
        // handle error
      } finally {
        // for interaction purposes, show spinner a little but longer.

        if (result) {
          // redirect
          router.push({ name: 'Game', query: { id: result.data._id } });
        }
      }
    }
  },
  computed: {
    isDisabled() {
      const result = uuidSchema.validate({ id: this.id });
      return !!result.error;
    }
  }
}
</script>