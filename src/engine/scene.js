export function createSceneManager(game) {
  const factories = new Map();
  const stack = [];

  function create(id, params) {
    const factory = factories.get(id);
    if (!factory) throw new Error(`Unknown scene "${id}"`);
    const scene = factory(game, params);
    scene.enter?.();
    return scene;
  }

  return {
    register(id, factory) {
      factories.set(id, factory);
    },

    go(id, params = {}) {
      while (stack.length) stack.pop().exit?.();
      stack.push(create(id, params));
    },

    push(id, params = {}) {
      stack.push(create(id, params));
    },

    pop() {
      stack.pop()?.exit?.();
      stack.at(-1)?.resume?.();
    },

    update(dt) {
      stack.at(-1)?.update(dt);
    },

    render(r) {
      stack.forEach((scene) => scene.render(r));
    },

    get top() {
      return stack.at(-1) ?? null;
    },
  };
}
