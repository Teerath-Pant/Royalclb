/** Port of the games' confetti.js: a canvas on <body> that fires confetti from both edges when you win. */

const DEG_TO_RAD = Math.PI / 180;
const COLORS = ["#fcf403", "#62fc03", "#f4fc03", "#03e7fc", "#03fca5", "#a503fc", "#fc03ad", "#fc03c2"];

const random = (min: number, max: number, precision = 0) => {
  const m = 10 ** precision;
  return Math.floor((Math.random() * (max - min) + min) * m) / m;
};
const scaleFactor = () => Math.log(window.innerWidth) / Math.log(1920);

class Piece {
  speed: { x: number; y: number };
  finalSpeedX = random(0.2, 0.6, 3);
  rotationSpeed = random(0.03, 0.07, 3) * scaleFactor();
  dragCoefficient = random(0.0005, 0.0009, 6);
  radius: { x: number; y: number };
  rotationAngle: number;
  radiusYDirection: "down" | "up" = "down";
  absCos: number;
  absSin: number;
  position: { x: number; y: number };
  initialPosition: { x: number; y: number };
  color = COLORS[Math.floor(Math.random() * COLORS.length)]!;
  createdAt = Date.now();

  constructor(
    initial: { x: number; y: number },
    private direction: "left" | "right",
    private initialRadius: number
  ) {
    const speed = random(0.9, 1.7, 3) * scaleFactor();
    this.speed = { x: speed, y: speed };
    this.radius = { x: initialRadius, y: initialRadius };
    this.rotationAngle = direction === "left" ? random(0, 0.2, 3) : random(-0.2, 0, 3);
    const angle = (direction === "left" ? random(82, 15) : random(-15, -82)) * DEG_TO_RAD;
    this.absCos = Math.abs(Math.cos(angle));
    this.absSin = Math.abs(Math.sin(angle));
    const offset = random(-150, 0);
    this.position = {
      x: initial.x + (direction === "left" ? -offset : offset) * this.absCos,
      y: initial.y - offset * this.absSin,
    };
    this.initialPosition = { ...this.position };
  }

  draw(ctx: CanvasRenderingContext2D) {
    const scale = window.devicePixelRatio;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(this.position.x * scale, this.position.y * scale, this.radius.x * scale, this.radius.y * scale, this.rotationAngle, 0, 2 * Math.PI);
    ctx.fill();
  }

  update(delta: number, now: number) {
    const elapsed = now - this.createdAt;
    if (this.speed.x > this.finalSpeedX) {
      this.speed.x -= this.dragCoefficient * delta;
    }
    this.position.x += this.speed.x * (this.direction === "left" ? -this.absCos : this.absCos) * delta;
    this.position.y = this.initialPosition.y - this.speed.y * this.absSin * elapsed + (0.00125 * elapsed ** 2) / 2;

    this.rotationSpeed = Math.max(this.rotationSpeed - 1e-5 * delta, 0);
    if (this.radiusYDirection === "down") {
      this.radius.y -= delta * this.rotationSpeed;
      if (this.radius.y <= 0) {
        this.radius.y = 0;
        this.radiusYDirection = "up";
      }
    } else {
      this.radius.y += delta * this.rotationSpeed;
      if (this.radius.y >= this.initialRadius) {
        this.radius.y = this.initialRadius;
        this.radiusYDirection = "down";
      }
    }
  }
}

let manager: { burst: () => void } | null = null;

function createManager() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 99999; pointer-events: none;";
  document.body.append(canvas);
  const ctx = canvas.getContext("2d")!;
  let pieces: Piece[] = [];
  let last = Date.now();
  const resize = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
  };
  window.addEventListener("resize", resize);
  resize();

  const loop = () => {
    const now = Date.now();
    const delta = now - last;
    last = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter((p) => {
      p.update(delta, now);
      p.draw(ctx);
      return p.position.y < canvas.height + 100;
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  return {
    burst() {
      const baseY = (5 * window.innerHeight) / 7;
      for (let i = 0; i < 125; i++) {
        pieces.push(new Piece({ x: 0, y: baseY }, "right", 6), new Piece({ x: window.innerWidth, y: baseY }, "left", 6));
      }
    },
  };
}

/** Shows the "You Win" / "You Lose" banner for three seconds; a win also fires the confetti. */
export function showConfetti(type: "win" | "lose", banner: HTMLElement | null, heading: HTMLElement | null) {
  if (!banner || !heading) {
    return;
  }
  heading.style.color = "";
  if (type === "win") {
    heading.innerText = "You Win";
    manager ??= createManager();
    manager.burst();
  } else {
    heading.innerText = "You Lose";
    heading.style.color = "red";
  }
  banner.style.display = "flex";
  setTimeout(() => {
    banner.style.display = "none";
  }, 3000);
}
