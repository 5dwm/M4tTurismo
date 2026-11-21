(() => {
  const frameCount = 358;
  const intro = document.querySelector(".intro");
  const canvas = document.querySelector(".intro__canvas");
  const context = canvas.getContext("2d", { alpha: false });
  const layers = Array.from(document.querySelectorAll(".hero__layer"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const frames = new Array(frameCount);
  let frameRequested = false;
  let lastFrame = -1;

  function frameUrl(index) {
    return `intro/frame_${String(index).padStart(6, "0")}.jpg`;
  }

  function drawFrame(index) {
    const frame = frames[index];
    if (!frame || index === lastFrame) return;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const ratio = Math.min(width / frame.naturalWidth, height / frame.naturalHeight);
    const drawWidth = frame.naturalWidth * ratio;
    const drawHeight = frame.naturalHeight * ratio;
    canvas.width = Math.round(width * devicePixelRatio);
    canvas.height = Math.round(height * devicePixelRatio);
    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.fillStyle = "#090b18";
    context.fillRect(0, 0, width, height);
    context.drawImage(frame, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight);
    lastFrame = index;
  }

  function loadFrame(index) {
    if (index < 0 || index >= frameCount || frames[index]) return;
    const image = new Image();
    image.src = frameUrl(index);
    image.onload = () => {
      frames[index] = image;
      if (index === currentFrame()) drawFrame(index);
    };
  }

  function currentFrame() {
    const rect = intro.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / (intro.offsetHeight - innerHeight)));
    return Math.round(progress * (frameCount - 1));
  }

  function render() {
    const index = currentFrame();
    for (let i = Math.max(0, index - 2); i <= Math.min(frameCount - 1, index + 3); i++) loadFrame(i);
    drawFrame(index);

    const distance = Math.min(Math.max(0, window.scrollY - intro.offsetHeight), document.querySelector(".hero").offsetHeight);
    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed);
      const scale = Number(layer.dataset.scale || 1);
      const offset = Number(layer.dataset.offset || 0) * document.querySelector(".hero").offsetHeight;
      layer.style.transform = `translate3d(0, ${distance * speed + offset}px, 0) scale(${scale})`;
      layer.style.transformOrigin = scale === 1 ? "center" : "center bottom";
    });
    frameRequested = false;
  }

  function onScroll() {
    if (frameRequested) return;
    frameRequested = true;
    requestAnimationFrame(render);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => { lastFrame = -1; onScroll(); });
  loadFrame(0);
  for (let i = 1; i < frameCount; i++) loadFrame(i);
  render();
})();
