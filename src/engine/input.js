import { WIDTH } from "./renderer.js";

const JOYSTICK_ZONE_X = 200;
const JOYSTICK_RADIUS = 28;
const DEAD_ZONE = 0.2;
const BUTTON_TOUCH_PADDING = 6;

// "right" = distance from the right edge, so buttons stay under the thumb on any screen width.
const DEFAULT_BUTTONS = [
  { id: "punch", label: "P", right: 78, y: 228, r: 20, color: "#e04040", visible: true },
  { id: "kick", label: "K", right: 34, y: 196, r: 20, color: "#4070e0", visible: true },
  { id: "jump", label: "J", right: 28, y: 246, r: 15, color: "#40b060", visible: true },
  { id: "skill1", label: "1", right: 116, y: 196, r: 15, color: "#c08020", visible: false },
  { id: "skill2", label: "2", right: 80, y: 168, r: 15, color: "#a040c0", visible: false },
  { id: "bag", label: "BAG", right: 46, y: 16, r: 11, color: "#8a6a20", visible: true },
  { id: "mute", label: "SND", right: 18, y: 16, r: 11, color: "#606060", visible: true, system: true },
];

const buttonX = (button) => WIDTH - button.right;

const KEY_ACTIONS = {
  KeyJ: "punch",
  KeyZ: "punch",
  KeyK: "kick",
  KeyX: "kick",
  Space: "jump",
  KeyL: "jump",
  KeyC: "jump",
  KeyU: "skill1",
  KeyI: "skill2",
  KeyM: "mute",
  KeyB: "bag",
  Escape: "back",
  Enter: "confirm",
};

const KEY_AXES = {
  ArrowLeft: ["x", -1],
  KeyA: ["x", -1],
  ArrowRight: ["x", 1],
  KeyD: ["x", 1],
  ArrowUp: ["y", -1],
  KeyW: ["y", -1],
  ArrowDown: ["y", 1],
  KeyS: ["y", 1],
};

export function createInput(renderer) {
  const buttons = DEFAULT_BUTTONS.map((button) => ({ ...button }));
  const pointerButtons = new Map();
  const held = new Set();
  const pressed = new Set();
  const keysDown = new Set();
  const listeners = [];
  let taps = [];
  let controlsVisible = true;
  let joystick = null;

  const isActive = (button) => button.visible && (button.system || controlsVisible);
  const visibleButtonAt = (point) =>
    buttons.find((b) => isActive(b) && Math.hypot(point.x - buttonX(b), point.y - b.y) <= b.r + BUTTON_TOUCH_PADDING);

  function press(action) {
    if (!held.has(action)) pressed.add(action);
    held.add(action);
  }

  function release(action) {
    held.delete(action);
  }

  function onPointerDown(event) {
    event.preventDefault();
    listeners.forEach((listener) => listener());
    const point = renderer.toLogical(event.clientX, event.clientY);
    const button = visibleButtonAt(point);
    if (button) {
      pointerButtons.set(event.pointerId, button.id);
      press(button.id);
      return;
    }
    taps.push(point);
    if (controlsVisible && point.x < JOYSTICK_ZONE_X && !joystick) {
      joystick = { pointerId: event.pointerId, originX: point.x, originY: point.y, knobX: point.x, knobY: point.y };
    }
  }

  function onPointerMove(event) {
    if (!joystick || event.pointerId !== joystick.pointerId) return;
    const point = renderer.toLogical(event.clientX, event.clientY);
    const dx = point.x - joystick.originX;
    const dy = point.y - joystick.originY;
    const distance = Math.hypot(dx, dy);
    const clamp = distance > JOYSTICK_RADIUS ? JOYSTICK_RADIUS / distance : 1;
    joystick.knobX = joystick.originX + dx * clamp;
    joystick.knobY = joystick.originY + dy * clamp;
  }

  function onPointerUp(event) {
    const buttonId = pointerButtons.get(event.pointerId);
    if (buttonId) {
      pointerButtons.delete(event.pointerId);
      release(buttonId);
    }
    if (joystick && event.pointerId === joystick.pointerId) joystick = null;
  }

  function onKeyDown(event) {
    if (event.repeat) return;
    listeners.forEach((listener) => listener());
    keysDown.add(event.code);
    const action = KEY_ACTIONS[event.code];
    if (action) {
      press(action);
      event.preventDefault();
    }
    if (KEY_AXES[event.code]) event.preventDefault();
  }

  function onKeyUp(event) {
    keysDown.delete(event.code);
    const action = KEY_ACTIONS[event.code];
    if (action) release(action);
  }

  const canvas = renderer.canvas;
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("pointercancel", onPointerUp);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", () => {
    held.clear();
    keysDown.clear();
    pointerButtons.clear();
    joystick = null;
  });

  function keyboardAxis() {
    const axis = { x: 0, y: 0 };
    keysDown.forEach((code) => {
      const mapping = KEY_AXES[code];
      if (mapping) axis[mapping[0]] += mapping[1];
    });
    axis.x = Math.max(-1, Math.min(1, axis.x));
    axis.y = Math.max(-1, Math.min(1, axis.y));
    return axis;
  }

  function joystickAxis() {
    if (!joystick) return { x: 0, y: 0 };
    const x = (joystick.knobX - joystick.originX) / JOYSTICK_RADIUS;
    const y = (joystick.knobY - joystick.originY) / JOYSTICK_RADIUS;
    return {
      x: Math.abs(x) < DEAD_ZONE ? 0 : x,
      y: Math.abs(y) < DEAD_ZONE ? 0 : y,
    };
  }

  return {
    get axis() {
      const stick = joystickAxis();
      const keys = keyboardAxis();
      return { x: stick.x || keys.x, y: stick.y || keys.y };
    },

    held: (action) => held.has(action),
    pressed: (action) => pressed.has(action),

    consumeTaps() {
      const result = taps;
      taps = [];
      return result;
    },

    onFirstGesture(listener) {
      listeners.push(listener);
    },

    setControlsVisible(visible) {
      controlsVisible = visible;
      if (!visible) {
        joystick = null;
        pointerButtons.forEach((id) => release(id));
        pointerButtons.clear();
      }
    },

    setButtonVisible(id, visible) {
      const button = buttons.find((b) => b.id === id);
      if (button) button.visible = visible;
    },

    setButtonLabel(id, label) {
      const button = buttons.find((b) => b.id === id);
      if (button) button.label = label;
    },

    endFrame() {
      pressed.clear();
      taps = [];
    },

    render(r) {
      buttons
        .filter((b) => b.visible && b.system)
        .forEach((b) => {
          r.circle(buttonX(b), b.y, b.r, b.color, 0.5);
          r.text(b.label, buttonX(b), b.y - 3, { align: "center", size: 6 });
        });
      if (!controlsVisible) return;
      const baseX = joystick?.originX ?? 70;
      const baseY = joystick?.originY ?? 210;
      r.circle(baseX, baseY, JOYSTICK_RADIUS + 6, "#ffffff", 0.12);
      r.circle(joystick?.knobX ?? baseX, joystick?.knobY ?? baseY, 13, "#ffffff", joystick ? 0.45 : 0.25);
      buttons
        .filter((b) => b.visible && !b.system)
        .forEach((b) => {
          r.circle(buttonX(b), b.y, b.r, b.color, held.has(b.id) ? 0.7 : 0.35);
          const size = b.label.length > 1 ? 6 : 9;
          r.text(b.label, buttonX(b), b.y - size / 2, { align: "center", size, alpha: 0.9 });
        });
    },
  };
}
