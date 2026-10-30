import { WIDTH } from "../engine/renderer.js";
import { Fighter, DEAD_FADE_TIME } from "../core/fighter.js";
import { createBrain } from "../core/ai.js";
import { calcDamage, canHit } from "../core/combat.js";
import { computeStats, scaleStats } from "../core/stats.js";
import { addXp, rollDrops } from "../core/progression.js";
import { createInventory, pickUp, equippedItems } from "../core/inventory.js";
import { heroes, enemies, levels, items, moves, fx } from "../../data/registry.js";
import { drawBackground, drawShadow, drawFighter, drawEffect, drawPickup, STREET_TOP, STREET_BOTTOM } from "./draw.js";
import { drawHud, drawBanner, drawGoArrow } from "./hud.js";

const MAX_ATTACKERS = 2;
const HERO_LEAD_X = 200;
const EDGE_MARGIN = 12;
const OFFSCREEN_MARGIN = 60;
const SPAWN_INTERVAL = 0.7;
const LEVEL_UP_HEAL = 0.3;
const STAGE_CLEAR_HEAL = 0.4;
const BANNER_SECONDS = 3;
const CAMERA_EASE = 5;
const PICKUP_RADIUS_X = 16;
const PICKUP_RADIUS_Y = 10;
const DUPLICATE_ITEM_XP = 20;

export function heroStatsFor(run) {
  const mike = heroes.get("mike");
  return computeStats({ base: mike.stats, growth: mike.growth, level: run.progress.level, gear: equippedItems(run.inventory, items) });
}

export function createLevelScene(game, { run }) {
  const level = levels[run.levelIndex];
  const mike = heroes.get("mike");
  run.inventory ??= createInventory();
  const hero = new Fighter({ def: mike, team: "hero", x: 60, y: 220, stats: heroStatsFor(run), moves, level: run.progress.level });
  hero.gear = equippedItems(run.inventory, items);
  if (run.heroHp) hero.hp = Math.min(run.heroHp, hero.stats.hp);

  const state = {
    phase: "walk",
    waveIndex: 0,
    spawnQueue: [],
    spawnTimer: 0,
    camX: 0,
    lockX: null,
    hitstop: 0,
    banner: { text: level.name.toUpperCase(), t: 0, color: "#ffd040" },
    goTime: 0,
    endTimer: 0,
    boss: null,
  };
  const foes = [];
  const brains = new Map();
  const effects = [];
  const pickups = [];
  const tokens = new Set();

  const world = {
    get hero() {
      return hero;
    },

    clamp(f) {
      f.y = Math.max(STREET_TOP, Math.min(STREET_BOTTOM, f.y));
      const margin = f.team === "hero" ? -EDGE_MARGIN : OFFSCREEN_MARGIN;
      const minX = Math.max(EDGE_MARGIN, state.camX - margin);
      const maxX = Math.min(level.length - EDGE_MARGIN, state.camX + WIDTH + margin);
      f.x = Math.max(minX, Math.min(maxX, f.x));
    },

    requestToken(f) {
      if (tokens.has(f)) return true;
      if (tokens.size >= MAX_ATTACKERS) return false;
      tokens.add(f);
      return true;
    },

    releaseToken(f) {
      tokens.delete(f);
    },

    resolveAttack(attacker, move) {
      const targets = attacker.team === "hero" ? foes : [hero];
      targets.forEach((target) => {
        if (!target.alive || attacker.hitIds.has(target.id) || !canHit(attacker, target, move.hitbox)) return;
        attacker.hitIds.add(target.id);
        const { damage, crit } = calcDamage({ attacker: attacker.stats, defender: target.stats, strength: move.strength });
        if (!target.takeHit({ damage, knockback: move.knockback, knockdown: move.knockdown, fromX: attacker.x })) return;
        const h = move.hitbox.y + move.hitbox.h / 2 + attacker.z;
        effects.push({ kind: "spark", x: target.x - attacker.facing * 6, y: target.y, h, t: 0, life: 0.15, heavy: move.heavy });
        effects.push({ kind: "text", text: crit ? `${damage}!` : `${damage}`, x: target.x, y: target.y, h: h + 12, t: 0, life: 0.7, color: crit ? "#ffd040" : "#fff" });
        game.sfx(move.heavy ? "hit_heavy" : "hit_light");
        state.hitstop = move.heavy ? 0.07 : 0.035;
        if (target.hp <= 0 && target !== hero) onKill(target);
      });
    },
  };

  function addFloatingText(text, color, size = 10) {
    effects.push({ kind: "text", text, x: hero.x, y: hero.y, h: hero.def.body.h + 16, t: 0, life: 1.2, color, size });
  }

  function gainXp(amount) {
    const result = addXp(run.progress, amount);
    run.progress = { level: result.level, xp: result.xp };
    run.totalXp += amount;
    if (result.gained > 0) {
      hero.setStats(heroStatsFor(run));
      hero.heal(Math.round(hero.stats.hp * LEVEL_UP_HEAL));
      addFloatingText("LEVEL UP!", "#ffd040");
      game.sfx("level_up");
    }
  }

  function refreshGear() {
    hero.gear = equippedItems(run.inventory, items);
    hero.setStats(heroStatsFor(run));
  }

  function onKill(enemy) {
    tokens.delete(enemy);
    run.kills = (run.kills ?? 0) + 1;
    gainXp(enemy.def.xp);
    rollDrops(enemy.def.drops).forEach((itemId, i) => {
      pickups.push({ item: items.get(itemId), x: enemy.x + i * 14, y: enemy.y, t: 0 });
      game.sfx("item_drop");
    });
  }

  function collect(pickup) {
    const { inventory, result } = pickUp(run.inventory, pickup.item);
    run.inventory = inventory;
    if (result === "duplicate") {
      gainXp(DUPLICATE_ITEM_XP);
      addFloatingText(`+${DUPLICATE_ITEM_XP} XP`, "#ffd040", 8);
    } else if (result === "equipped") {
      refreshGear();
      addFloatingText(pickup.item.name.toUpperCase(), "#80ff80", 8);
    } else {
      addFloatingText(`BAG: ${pickup.item.name.toUpperCase()}`, "#80c0ff", 8);
    }
    game.sfx("item_pickup");
  }

  function updatePickups(dt) {
    for (let i = pickups.length - 1; i >= 0; i -= 1) {
      const pickup = pickups[i];
      pickup.t += dt;
      const near = Math.abs(pickup.x - hero.x) < PICKUP_RADIUS_X && Math.abs(pickup.y - hero.y) < PICKUP_RADIUS_Y;
      if (near && hero.alive && !hero.airborne) {
        pickups.splice(i, 1);
        collect(pickup);
      }
    }
  }

  function spawnEnemy({ id, fromLeft }) {
    const def = enemies.get(id);
    const stats = scaleStats(def.stats, level.enemyScale);
    const x = fromLeft ? state.camX - 30 : state.camX + WIDTH + 30;
    const y = STREET_TOP + 8 + Math.random() * (STREET_BOTTOM - STREET_TOP - 16);
    const enemy = new Fighter({ def, team: "enemy", x, y, stats, moves });
    enemy.facing = fromLeft ? 1 : -1;
    foes.push(enemy);
    brains.set(enemy, createBrain(def.ai));
    if (Math.random() < 0.5) game.sfx(def.sounds?.taunt);
    return enemy;
  }

  function startWave(wave) {
    state.phase = "fight";
    state.lockX = Math.max(0, Math.min(level.length - WIDTH, wave.at - WIDTH / 2));
    state.spawnQueue = wave.enemies.map((id, i) => ({ id, fromLeft: i % 3 === 2 }));
    state.spawnTimer = 0;
  }

  function finishLevel() {
    pickups.splice(0).forEach(collect);
    state.phase = "clear";
    state.endTimer = 0;
    hero.celebrate();
    run.heroHp = Math.min(hero.stats.hp, hero.hp + Math.round(hero.stats.hp * STAGE_CLEAR_HEAL));
    state.banner = { text: "STAGE CLEAR", t: 0, color: "#ffd040" };
    game.music?.("victory");
  }

  function updatePhase(dt) {
    const waves = level.waves;
    if (state.phase === "walk") {
      const wave = waves[state.waveIndex];
      if (wave && hero.x >= wave.at) startWave(wave);
      else if (!wave) finishLevel();
    } else if (state.phase === "fight") {
      state.spawnTimer -= dt;
      if (state.spawnQueue.length && state.spawnTimer <= 0) {
        spawnEnemy(state.spawnQueue.shift());
        state.spawnTimer = SPAWN_INTERVAL;
      }
      if (!state.spawnQueue.length && foes.every((f) => !f.alive)) {
        state.waveIndex += 1;
        state.lockX = null;
        state.phase = "walk";
        state.goTime = waves[state.waveIndex] ? 3 : 0;
      }
    }
    if (state.phase !== "dead" && !hero.alive) {
      state.phase = "dead";
      state.endTimer = 0;
      state.banner = { text: "K.O.", t: 0, color: "#ff4040" };
      game.music?.("gameover");
    }
    if (state.phase === "clear" || state.phase === "dead") {
      state.endTimer += dt;
      if (state.endTimer >= BANNER_SECONDS) {
        if (state.phase === "clear") game.flow.levelComplete(run);
        else game.flow.heroDied(run);
      }
    }
  }

  function updateCamera(dt) {
    const target = state.lockX ?? Math.max(state.camX, Math.min(level.length - WIDTH, hero.x - HERO_LEAD_X));
    state.camX += (target - state.camX) * Math.min(1, dt * CAMERA_EASE);
    if (Math.abs(target - state.camX) < 0.5) state.camX = target;
  }

  function readHeroIntent() {
    const { input } = game;
    if (state.phase !== "walk" && state.phase !== "fight") {
      hero.intent = { x: 0, y: 0, attack: null, jump: false, face: 0 };
      return;
    }
    const { x, y } = input.axis;
    const attack = ["punch", "kick", "skill1", "skill2"].find((button) => input.pressed(button)) ?? null;
    hero.intent = { x, y, attack, jump: input.pressed("jump"), face: 0 };
  }

  function dispatchEvents(fighter) {
    fighter.drainEvents().forEach((event) => {
      if (event.type === "sound") game.sfx(event.id);
      else if (event.type === "down") game.sfx("body_fall");
      else if (event.type === "attack") game.sfx("whoosh");
    });
  }

  return {
    level,
    world,
    debugFoes: () => foes,
    debugPickups: () => pickups,

    enter() {
      game.music?.(level.music);
    },

    resume() {
      refreshGear();
    },

    update(dt) {
      state.banner.t += dt;
      state.goTime = Math.max(0, state.goTime - dt);
      effects.forEach((effect) => (effect.t += dt));
      for (let i = effects.length - 1; i >= 0; i -= 1) if (effects[i].t >= effects[i].life) effects.splice(i, 1);

      if (state.hitstop > 0) {
        state.hitstop -= dt;
        return;
      }

      if (game.input.pressed("bag") && (state.phase === "walk" || state.phase === "fight")) {
        game.sfx("ui_tap");
        game.scenes.push("equip", { run });
        return;
      }
      readHeroIntent();
      hero.update(dt, world);
      dispatchEvents(hero);
      updatePickups(dt);
      foes.forEach((enemy) => {
        brains.get(enemy)(enemy, world, dt);
        enemy.update(dt, world);
        dispatchEvents(enemy);
      });
      for (let i = foes.length - 1; i >= 0; i -= 1) {
        if (!foes[i].alive && foes[i].stateTime > DEAD_FADE_TIME) {
          brains.delete(foes[i]);
          foes.splice(i, 1);
        }
      }
      updatePhase(dt);
      updateCamera(dt);
    },

    render(r) {
      const camX = Math.round(state.camX);
      drawBackground(r, level, camX);
      const actors = [hero, ...foes].sort((a, b) => a.y - b.y);
      actors.forEach((f) => drawShadow(r, f, camX, f.def.body.w / 2 + 2));
      pickups.forEach((pickup) => drawPickup(r, pickup, camX));
      actors.forEach((f) => drawFighter(r, f, camX));
      effects.forEach((effect) => drawEffect(r, effect, camX, fx));
      drawHud(r, { hero, progress: run.progress, boss: state.boss, levelName: level.name });
      if (state.goTime > 0) drawGoArrow(r, state.goTime);
      if (state.banner.t < BANNER_SECONDS || state.phase === "clear" || state.phase === "dead") {
        drawBanner(r, state.banner.text, state.banner.t, state.banner.color);
      }
    },
  };
}
