class ProgressBlock {
  constructor(root) {
    this.root = root;

    this.ring = root.querySelector("[progressed-ring]");
    this.valueInput = root.querySelector('[control="value"]');
    this.animateToggle = root.querySelector('[control="animate"]');
    this.hideToggle = root.querySelector('[control="hide"]');

    this.currentValue = 0;
    this.rafId = null;

    this.setup();
  }

  normal(value) {
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, n));
  }

  drawRing(percent) {
    this.ring.style.background = `conic-gradient(var(--ring-fg,#1d6bff) ${percent}%, var(--ring-bg,#eee) 0)`;
  }

  animateValueTo(target) {
    target = this.normal(target);

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    const from = this.currentValue;
    const to = target;
    const duration = 250;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const value = Math.round(from + (to - from) * progress);

      this.drawRing(value);

      if (progress < 1) {
        this.rafId = requestAnimationFrame(step);
      } else {
        this.currentValue = to;
        this.rafId = null;
      }
    };

    this.rafId = requestAnimationFrame(step);
  }
// скрытие через сиэсэс//
  setHidden(isHidden) {
    this.root.classList.toggle("is-content-hidden", isHidden);
  }

  setup() {
    this.currentValue = this.normal(this.valueInput.value);
    this.drawRing(this.currentValue);

    this.ring.classList.toggle("is-animated", this.animateToggle.checked);

    this.setHidden(this.hideToggle.checked);

  }
}
