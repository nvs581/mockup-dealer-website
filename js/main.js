document.addEventListener("DOMContentLoaded", () => {
  //
  // 1️⃣ ScrollSpy
  //
  new bootstrap.ScrollSpy(document.body, {
    target: ".custom-navbar",
    offset: 70,
  });

  //
  // 2️⃣ Featured Vehicles: indicators + swipe/drag
  //
  (function setupFeaturedVehicles() {
    const carouselEl = document.getElementById("featuredVehiclesCarousel");
    const indicators = carouselEl.querySelector(".carousel-indicators");
    const slides = carouselEl.querySelectorAll(".carousel-item");
    const inner = carouselEl.querySelector(".carousel-inner");
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
    const SWIPE_THRESHOLD = 150;
    let isDown = false,
      startX = 0;

    // build dots
    if (slides.length > 1) {
      indicators.style.display = "flex";
      slides.forEach((_, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-bs-target", "#featuredVehiclesCarousel");
        btn.setAttribute("data-bs-slide-to", idx);
        btn.setAttribute("aria-label", `Slide ${idx + 1}`);
        if (idx === 0) {
          btn.classList.add("active");
          btn.setAttribute("aria-current", "true");
        }
        indicators.appendChild(btn);
      });
    } else {
      indicators.remove();
    }

    // swipe/drag handlers
    inner.style.cursor = "grab";
    inner.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX;
      inner.style.cursor = "grabbing";
      e.preventDefault();
      carousel.pause();
    });
    inner.addEventListener("mouseup", (e) => {
      if (!isDown) return;
      const diff = e.pageX - startX;
      if (diff > SWIPE_THRESHOLD) carousel.prev();
      else if (diff < -SWIPE_THRESHOLD) carousel.next();
      isDown = false;
      inner.style.cursor = "grab";
      carousel.cycle();
    });
    inner.addEventListener("mouseleave", () => {
      if (isDown) {
        isDown = false;
        inner.style.cursor = "grab";
        carousel.cycle();
      }
    });
    inner.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].pageX;
        carousel.pause();
      },
      { passive: true }
    );
    inner.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].pageX - startX;
      if (diff > SWIPE_THRESHOLD) carousel.prev();
      else if (diff < -SWIPE_THRESHOLD) carousel.next();
      carousel.cycle();
    });
  })();

  //
  // 3️⃣ Team Carousel: responsive rebuild into 2‑up or 3‑up slides
  //
  (function setupTeamCarousel() {
    const carouselEl = document.getElementById("teamCarousel");
    const inner = carouselEl.querySelector(".carousel-inner");
    const indicators = carouselEl.querySelector(".carousel-indicators");
    const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl);
    // grab your photo containers
    const items = Array.from(inner.querySelectorAll(".col-6.col-md-4"));
    let currentPerSlide = null;

    function rebuild() {
      const perSlide = window.innerWidth < 768 ? 2 : 3;
      if (perSlide === currentPerSlide) return;
      currentPerSlide = perSlide;

      inner.innerHTML = "";
      indicators.innerHTML = "";

      items.forEach((el, idx) => {
        if (idx % perSlide === 0) {
          const slide = document.createElement("div");
          slide.className = "carousel-item" + (idx === 0 ? " active" : "");
          const row = document.createElement("div");
          row.className = "row justify-content-center g-4";
          slide.appendChild(row);
          inner.appendChild(slide);

          const btn = document.createElement("button");
          btn.type = "button";
          btn.setAttribute("data-bs-target", "#teamCarousel");
          btn.setAttribute("data-bs-slide-to", String(idx / perSlide));
          if (idx === 0) {
            btn.classList.add("active");
            btn.setAttribute("aria-current", "true");
          }
          indicators.appendChild(btn);
        }
        inner.lastElementChild.querySelector(".row").appendChild(el);
      });
    }

    window.addEventListener("resize", rebuild);
    rebuild();

    // ——— START swipe/drag FOR TEAM CAROUSEL ———
    const SWIPE_THRESHOLD = 100;
    let isDown = false,
      startX = 0;

    // prevent the img from hijacking drags
    inner.querySelectorAll("img").forEach((img) => {
      img.style.pointerEvents = "none";
    });

    inner.style.cursor = "grab";

    inner.addEventListener("mousedown", (e) => {
      isDown = true;
      startX = e.pageX;
      inner.style.cursor = "grabbing";
      carousel.pause();
      e.preventDefault();
    });
    document.addEventListener("mousemove", (e) => {
      if (isDown) e.preventDefault();
    });
    document.addEventListener("mouseup", (e) => {
      if (!isDown) return;
      const diff = e.pageX - startX;
      if (diff > SWIPE_THRESHOLD) carousel.prev();
      else if (diff < -SWIPE_THRESHOLD) carousel.next();
      isDown = false;
      inner.style.cursor = "grab";
      carousel.cycle();
    });
    inner.addEventListener("mouseleave", () => {
      if (isDown) {
        isDown = false;
        inner.style.cursor = "grab";
        carousel.cycle();
      }
    });

    inner.addEventListener(
      "touchstart",
      (e) => {
        startX = e.changedTouches[0].pageX;
        carousel.pause();
      },
      { passive: true }
    );
    inner.addEventListener(
      "touchmove",
      (e) => {
        if (isDown) e.preventDefault();
      },
      { passive: false }
    );
    inner.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].pageX - startX;
      if (diff > SWIPE_THRESHOLD) carousel.prev();
      else if (diff < -SWIPE_THRESHOLD) carousel.next();
      carousel.cycle();
    });
    // ——— END swipe/drag FOR TEAM CAROUSEL ———
  })();
});

//
// 4️⃣ Featured Vehicles: responsive rebuild into 1‑up, 3‑up, or 4‑up slides
//
(function setupFeaturedVehiclesResponsive() {
  const carouselEl = document.getElementById("featuredVehiclesCarousel");
  const inner = carouselEl.querySelector(".carousel-inner");
  const indicators = carouselEl.querySelector(".carousel-indicators");
  // grab all your existing item containers
  const items = Array.from(
    carouselEl.querySelectorAll(".carousel-item .col-6.col-md-3")
  );
  let currentPerSlide = null;

  function rebuild() {
    // choose per‑slide count by width
    const w = window.innerWidth;
    let perSlide;
    if (w < 768) perSlide = 1;
    else if (w < 992) perSlide = 3;
    else perSlide = 4;

    if (perSlide === currentPerSlide) return;
    currentPerSlide = perSlide;

    // clear old
    inner.innerHTML = "";
    indicators.innerHTML = "";

    // build new slides & dots
    items.forEach((el, idx) => {
      if (idx % perSlide === 0) {
        const slide = document.createElement("div");
        slide.className = "carousel-item" + (idx === 0 ? " active" : "");
        const row = document.createElement("div");
        row.className = "row g-4 justify-content-center";
        slide.appendChild(row);
        inner.appendChild(slide);

        // dot button
        const btn = document.createElement("button");
        btn.type = "button";
        btn.setAttribute("data-bs-target", "#featuredVehiclesCarousel");
        btn.setAttribute("data-bs-slide-to", String(idx / perSlide));
        if (idx === 0) {
          btn.classList.add("active");
          btn.setAttribute("aria-current", "true");
        }
        indicators.appendChild(btn);
      }
      // move the item into the last slide’s row
      inner.lastElementChild.querySelector(".row").appendChild(el);
    });
  }

  window.addEventListener("resize", rebuild);
  rebuild();
})();

document.addEventListener("DOMContentLoaded", () => {
  const carouselEl = document.getElementById("featuredReviewsCarousel");
  const inner = carouselEl.querySelector(".carousel-inner");
  const indicators = carouselEl.querySelector(".carousel-indicators");
  const items = Array.from(inner.querySelectorAll(".review-item"));
  let current = 0;

  function build() {
    const w = window.innerWidth;
    let perSlide = w < 768 ? 1 : w < 992 ? 3 : 5;
    if (perSlide === current) return;
    current = perSlide;

    inner.innerHTML = "";
    indicators.innerHTML = "";

    items.forEach((item, i) => {
      if (i % perSlide === 0) {
        const slide = document.createElement("div");
        slide.className = "carousel-item" + (i === 0 ? " active" : "");
        const wrapper = document.createElement("div");
        wrapper.className = "slide-wrapper";
        slide.appendChild(wrapper);
        inner.appendChild(slide);

        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("data-bs-target", "#featuredReviewsCarousel");
        dot.setAttribute("data-bs-slide-to", String(i / perSlide));
        if (i === 0) {
          dot.classList.add("active");
          dot.setAttribute("aria-current", "true");
        }
        indicators.append(dot);
      }
      inner.lastElementChild.querySelector(".slide-wrapper").appendChild(item);
    });

    // ←— Add this:
    const slideCount = inner.querySelectorAll(".carousel-item").length;
    indicators.style.display = slideCount < 2 ? "none" : "flex";
  }

  window.addEventListener("resize", build);
  build();
});
