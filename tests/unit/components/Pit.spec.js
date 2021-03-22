import { mount } from '@vue/test-utils'
import Pit from '../../../src/components/Pit.vue';

describe('components/Pit.vue', () => {

  let wrapper;
  beforeAll(() => {
    wrapper = mount(Pit, {
      props: {
        stones: 6, // how many stones are in the pit
        playerId: 0, // which player can control this pit
        playersTurn: 0, // which player's turn it is
        pitId: 3, // id of pit
      }
    });
  });

  it('should move on click', async() => {
    const span = wrapper.find('div');
    await span.trigger('click');
    expect(wrapper.emitted()['do-move']).toBeTruthy();
    // check arguments
    expect(wrapper.emitted()['do-move'][0][0]).toBe(0);
    expect(wrapper.emitted()['do-move'][0][1]).toBe(3);
  });

  afterAll(() => {
    wrapper.destroy();
  });
});
