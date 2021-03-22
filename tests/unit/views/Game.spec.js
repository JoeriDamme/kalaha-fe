import { mount } from '@vue/test-utils'
import Game from '../../../src/views/Game.vue';

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

describe('views/Game.vue', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(Game, {
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
  });

  it('should setup game board', () => {
    const pits = wrapper.findAll('.pit');
    expect(pits.length).toBe(12);
    pits.forEach((element) => {
      expect(element.text()).toBe('6');
    });
    const scorePits = wrapper.findAll('.score-pit');
    expect(scorePits.length).toBe(2);
    scorePits.forEach((element) => {
      expect(element.text()).toBe('0');
    });
    expect(wrapper.find('.game-message').text()).toBe('It\'s your turn, Test Player One!');
    expect(wrapper.find('.game-stats').text()).toBe('If you want to continue, please save the following id: 55d33f4b-867d-4e1d-9f4b-46b49d0525f6');
  });

  it('should setNextPlayer()', () => {
    wrapper.vm.setNextPlayer();
    expect(wrapper.vm.game.playerIdTurn).toBe(1);
  });

  it('should doMove()', async() => {
    wrapper.vm.doMove(1, 2);
    await wrapper.vm.$forceUpdate(); // force render again to update stones in pit

    // so we select player 1, and grab pit 2, which hsa 6 stones, so it should drop stones in:
    // player 1 pit 2 should be 0
    // player 1 pits 3, 4, 5
    // player 1 score pit
    // player 0 pits 0, 1
    expect(wrapper.vm.game.players[1].pits).toStrictEqual([6, 6, 0, 7, 7, 7]);
    expect(wrapper.vm.game.players[1].score).toBe(1);
    expect(wrapper.vm.game.players[0].pits).toStrictEqual([7, 7, 6, 6, 6, 6]);

    // view should be updated to
    const orderOnView = ['6', '6', '6', '6', '7', '7', '6', '6', '0', '7', '7', '7'];
    const pits = wrapper.findAll('.pit');
    pits.forEach((element, index) => {
      expect(element.text()).toBe(orderOnView[index]);
    });
  });

  afterAll(() => {
    wrapper.destroy();
  });
})
