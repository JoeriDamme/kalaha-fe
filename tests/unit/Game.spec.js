import { mount } from '@vue/test-utils'
import Game from '../../src/views/Game.vue';

describe('views/Game.vue', () => {
  const dummyGame = {
    players: [{
      score: 0,
      pits: [6, 6, 6, 6, 6, 6],
      name: 'Test Player One',
    }, {
      score: 0,
      pits: [6, 6, 6, 6, 6, 6],
      name: 'Test Player Two'
    }],
    _id: "55d33f4b-867d-4e1d-9f4b-46b49d0525f6",
    playerIdTurn: 0,
    shortId: 'qu82ia',
  }

  it('should setup game board', async() => {
    const wrapper = mount(Game, {
      data() {
        return {
          game: dummyGame
        }
      },
      global: {
        $http: {
          get: () => Promise.resolve(),
        }
      }
    });

    expect(wrapper.findAll('.pit').length).toBe(12);
    expect(wrapper.findAll('.score-pit ').length).toBe(2);
    expect(wrapper.find('.game-message').text()).toBe('It\'s your turn, Test Player One!');
  });
})
