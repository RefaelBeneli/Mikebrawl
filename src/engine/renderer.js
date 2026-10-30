export const HEIGHT = 270;
export const MIN_WIDTH = 480;
export const MAX_WIDTH = 720;
// Live binding: the view widens to match the screen's shape, so read WIDTH at draw time, never cache it.
export let WIDTH = MIN_WIDTH;

export function viewWidthFor(screenWidth, screenHeight) {
  const width = Math.round((HEIGHT * screenWidth) / screenHeight / 2) * 2;
  return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, width));
}

export function createRenderer(canvas, safeArea = document.getElementById("safe-area")) {
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");

  function fit() {
    const area = safeArea?.getBoundingClientRect() ?? { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };
    WIDTH = viewWidthFor(area.width, area.height);
    canvas.width = WIDTH;
    const scale = Math.min(area.width / WIDTH, area.height / HEIGHT);
    canvas.style.width = `${Math.floor(WIDTH * scale)}px`;
    canvas.style.height = `${Math.floor(HEIGHT * scale)}px`;
    canvas.style.left = `${area.left + area.width / 2}px`;
    canvas.style.top = `${area.top + area.height / 2}px`;
    ctx.imageSmoothingEnabled = false;
  }

  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", () => setTimeout(fit, 100));
  fit();

  return {
    ctx,
    canvas,

    toLogical(clientX, clientY) {
      const bounds = canvas.getBoundingClientRect();
      return {
        x: ((clientX - bounds.left) * WIDTH) / bounds.width,
        y: ((clientY - bounds.top) * HEIGHT) / bounds.height,
      };
    },

    clear(color = "#000") {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    },

    rect(x, y, w, h, color, alpha = 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
      ctx.globalAlpha = 1;
    },

    strokeRect(x, y, w, h, color, lineWidth = 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(w) - 1, Math.round(h) - 1);
    },

    circle(x, y, radius, color, alpha = 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    },

    ellipse(x, y, radiusX, radiusY, color, alpha = 1) {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    },

    text(value, x, y, { color = "#fff", size = 8, align = "left", shadow = true, alpha = 1 } = {}) {
      ctx.globalAlpha = alpha;
      ctx.font = `bold ${size}px monospace`;
      ctx.textAlign = align;
      ctx.textBaseline = "top";
      if (shadow) {
        ctx.fillStyle = "#000";
        ctx.fillText(value, Math.round(x) + 1, Math.round(y) + 1);
      }
      ctx.fillStyle = color;
      ctx.fillText(value, Math.round(x), Math.round(y));
      ctx.globalAlpha = 1;
    },

    image(img, x, y, w = img.width, h = img.height) {
      ctx.drawImage(img, Math.round(x), Math.round(y), w, h);
    },

    cell(img, cellW, cellH, col, row, x, y, { flip = false, alpha = 1 } = {}) {
      ctx.globalAlpha = alpha;
      const dx = Math.round(x);
      const dy = Math.round(y);
      if (flip) {
        ctx.save();
        ctx.translate(dx + cellW, dy);
        ctx.scale(-1, 1);
        ctx.drawImage(img, col * cellW, row * cellH, cellW, cellH, 0, 0, cellW, cellH);
        ctx.restore();
      } else {
        ctx.drawImage(img, col * cellW, row * cellH, cellW, cellH, dx, dy, cellW, cellH);
      }
      ctx.globalAlpha = 1;
    },
  };
}
