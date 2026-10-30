import { Animator } from "./animation.js";

export const GRAVITY = 900;
export const JUMP_SPEED = 300;
export const HURT_TIME = 0.28;
export const DOWN_TIME = 0.8;
export const GETUP_INVULN = 1;
export const DEAD_FADE_TIME = 1.2;
const INPUT_BUFFER = 0.18;
const DEPTH_SPEED_RATIO = 0.6;
const KNOCKBACK_SPEED_RATIO = 4;
const KNOCKBACK_FRICTION = 420;
const HIT_FLASH_TIME = 0.12;

const CONTROL_STATES = new Set(["idle", "walk"]);
const UNHITTABLE_STATES = new Set(["down", "getup", "dead", "victory"]);

let nextId = 1;

const noIntent = () => ({ x: 0, y: 0, attack: null, jump: false, face: 0 });

export class Fighter {
  constructor({ def, team, x, y, stats, moves, level = 1 }) {
    this.id = nextId++;
    this.def = def;
    this.team = team;
    this.moves = moves;
    this.level = level;
    this.x = x;
    this.y = y;
    this.z = 0;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0;
    this.kx = 0;
    this.facing = team === "hero" ? 1 : -1;
    this.stats = stats;
    this.hp = stats.hp;
    this.animator = new Animator(def.sprite.anims);
    this.state = "idle";
    this.stateTime = 0;
    this.move = null;
    this.hitIds = new Set();
    this.comboQueued = false;
    this.buffer = null;
    this.invuln = 0;
    this.cooldown = 0;
    this.poiseHits = 0;
    this.hitFlash = 0;
    this.telegraph = 0;
    this.airAttackUsed = false;
    this.intent = noIntent();
    this.events = [];
  }

  get alive() {
    return this.state !== "dead";
  }

  get canAct() {
    return CONTROL_STATES.has(this.state);
  }

  get vulnerable() {
    return this.invuln <= 0 && !UNHITTABLE_STATES.has(this.state);
  }

  get airborne() {
    return this.z > 0 || this.vz > 0;
  }

  setStats(stats) {
    const ratio = this.hp / this.stats.hp;
    this.stats = stats;
    this.hp = Math.max(1, Math.round(stats.hp * ratio));
  }

  heal(amount) {
    this.hp = Math.min(this.stats.hp, this.hp + amount);
  }

  setState(state, anim = state, speed = 1) {
    if (this.state !== state) this.stateTime = 0;
    this.state = state;
    this.animator.play(anim, { restart: state === "attack", speed });
  }

  emit(type, data = {}) {
    this.events.push({ type, fighter: this, ...data });
  }

  update(dt, world) {
    const intent = this.intent;
    this.stateTime += dt;
    this.invuln = Math.max(0, this.invuln - dt);
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt);
    this.bufferInput(intent, dt);

    const wasAirborne = this.airborne;
    this.updateState(intent);
    this.applyPhysics(dt, world);
    const landed = wasAirborne && !this.airborne;
    this.animator.update(dt);
    this.afterAnimation(world, landed);
  }

  bufferInput(intent, dt) {
    if (intent.attack) {
      this.buffer = { button: intent.attack, time: INPUT_BUFFER };
    } else if (this.buffer) {
      this.buffer.time -= dt;
      if (this.buffer.time <= 0) this.buffer = null;
    }
  }

  updateState(intent) {
    const speed = this.stats.speed;
    switch (this.state) {
      case "idle":
      case "walk": {
        this.faceToward(intent);
        if (this.buffer && this.cooldown <= 0 && this.startAttack(this.buffer.button)) return;
        this.vx = intent.x * speed;
        this.vy = intent.y * speed * DEPTH_SPEED_RATIO;
        if (intent.jump && this.def.moveset.air) {
          this.vz = JUMP_SPEED;
          this.airAttackUsed = false;
          this.setState("jump");
          this.emit("sound", { id: this.def.sounds?.jump });
          return;
        }
        this.setState(intent.x || intent.y ? "walk" : "idle");
        return;
      }
      case "jump":
        if (this.buffer && !this.airAttackUsed && this.startAttack(this.buffer.button)) this.airAttackUsed = true;
        return;
      case "attack": {
        const move = this.move;
        if (move.dash) this.vx = this.facing * move.dash;
        else if (!move.aerial && !move.leap) this.vx = this.vy = 0;
        if (this.buffer && move.next && this.buffer.button === this.lastButton) {
          this.comboQueued = true;
          this.buffer = null;
        }
        return;
      }
      default:
        this.vx = 0;
        this.vy = 0;
    }
  }

  faceToward(intent) {
    if (intent.face) this.facing = Math.sign(intent.face);
    else if (intent.x) this.facing = Math.sign(intent.x);
  }

  applyPhysics(dt, world) {
    if (this.airborne) {
      this.vz -= GRAVITY * dt;
      this.z = Math.max(0, this.z + this.vz * dt);
      if (this.z === 0) this.vz = 0;
    }
    if (this.kx) {
      this.x += this.kx * dt;
      const decay = KNOCKBACK_FRICTION * dt;
      this.kx = Math.abs(this.kx) <= decay ? 0 : this.kx - Math.sign(this.kx) * decay;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    world.clamp?.(this);
  }

  afterAnimation(world, landed) {
    switch (this.state) {
      case "jump":
        if (landed) this.setState("idle");
        return;
      case "attack":
        this.updateAttack(world, landed);
        return;
      case "hurt":
        if (this.stateTime >= HURT_TIME) this.setState("idle");
        return;
      case "down":
        if (!this.airborne && this.stateTime >= DOWN_TIME) {
          if (this.hp <= 0) this.setState("dead", "down");
          else this.setState("getup");
        }
        return;
      case "getup":
        if (this.animator.done) {
          this.invuln = GETUP_INVULN;
          this.setState("idle");
        }
        return;
      default:
    }
  }

  updateAttack(world, landed) {
    const move = this.move;
    if (move.activeFrames.includes(this.animator.frame)) world.resolveAttack(this, move);
    const airborneMove = move.aerial || move.leap;
    const finished = airborneMove ? landed || (!this.airborne && this.animator.done) : this.animator.done;
    if (!finished) return;
    if (this.comboQueued && move.next) {
      this.startMove(this.moves.get(move.next));
      return;
    }
    this.cooldown = (move.cooldown ?? 0) / this.stats.atkSpeed;
    this.move = null;
    this.setState(this.airborne ? "jump" : "idle");
  }

  startAttack(button) {
    const set = this.airborne ? this.def.moveset.air : this.def.moveset.ground;
    const moveId = set?.[button] ?? this.def.moveset.skills?.[button];
    if (!moveId) return false;
    this.buffer = null;
    this.lastButton = button;
    this.startMove(this.moves.get(moveId));
    return true;
  }

  startMove(move) {
    if (!move) throw new Error(`Fighter ${this.def.id} has a missing move`);
    this.move = move;
    this.hitIds = new Set();
    this.comboQueued = false;
    this.telegraph = 0;
    if (move.leap) {
      this.vz = move.leap.vz;
      this.vx = this.facing * move.leap.vx;
    }
    this.setState("attack", move.anim, this.stats.atkSpeed);
    this.emit("attack", { move });
    if (move.sound) this.emit("sound", { id: move.sound });
  }

  takeHit({ damage, knockback = 0, knockdown = false, fromX }) {
    if (!this.vulnerable) return false;
    this.hp = Math.max(0, this.hp - damage);
    this.hitFlash = HIT_FLASH_TIME;
    this.telegraph = 0;
    const away = Math.sign(this.x - fromX) || -this.facing;
    this.poiseHits += 1;

    if (this.hp > 0 && this.poiseHits < (this.def.poise ?? 1)) {
      this.emit("sound", { id: this.def.sounds?.hurt });
      return true;
    }
    this.poiseHits = 0;
    this.facing = -away;
    this.move = null;
    this.vx = 0;
    this.vy = 0;

    if (this.hp <= 0 || knockdown || this.airborne) {
      this.vz = 150;
      this.z = Math.max(this.z, 0.01);
      this.kx = away * Math.max(knockback, 70) * KNOCKBACK_SPEED_RATIO * 0.5;
      this.setState("down");
      this.emit("down", { lethal: this.hp <= 0 });
      this.emit("sound", { id: this.hp <= 0 ? this.def.sounds?.ko ?? this.def.sounds?.hurt : this.def.sounds?.hurt });
    } else {
      this.kx = away * knockback * KNOCKBACK_SPEED_RATIO;
      this.setState("hurt");
      this.emit("sound", { id: this.def.sounds?.hurt });
    }
    return true;
  }

  celebrate() {
    this.vx = 0;
    this.vy = 0;
    this.move = null;
    if (this.def.sprite.anims.victory) this.setState("victory");
    this.emit("sound", { id: this.def.sounds?.victory });
  }

  drainEvents() {
    const events = this.events;
    this.events = [];
    return events;
  }
}
