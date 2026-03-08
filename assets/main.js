window.addEventListener("load", () => {
  const loader = document.getElementById("pageLoader");
  const parallaxDivider = document.querySelector(".parallax-divider");

  document.body.classList.remove("is-loading");
  document.body.classList.add("is-loaded");

  if (loader) {
    setTimeout(() => {
      loader.remove();
    }, 700);
  }

  if (parallaxDivider) {
    const updateParallax = () => {
      const rect = parallaxDivider.getBoundingClientRect();
      const offset = rect.top * -0.18;
      parallaxDivider.style.backgroundPosition = `center calc(50% + ${offset}px)`;
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
  }
});
