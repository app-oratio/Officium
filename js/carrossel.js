function initCarousel() {
  let index = 0;

  const slides = document.querySelector('.slides');
  const slideItems = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dots span');
  const carousel = document.querySelector('.carousel');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  if (!slides || !slideItems.length) return;

  const total = slideItems.length;

  let interval = null;

  let startX = 0;
  let currentX = 0;
  let startTime = 0;
  let isDragging = false;

  function update() {
    const offset = -index * slides.offsetWidth;
    slides.style.transform = 'translateX(' + offset + 'px)';
    updateDots();
  }

  function updateDots() {
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    index++;
    if (index >= total) index = 0;
    update();
  }

  function prevSlide() {
    index--;
    if (index < 0) index = total - 1;
    update();
  }

  function goToSlide(i) {
    index = i;
    update();
  }

  function stopAutoplay() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(function () {
      nextSlide();
    }, 4000);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      nextSlide();
      restartAutoplay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      prevSlide();
      restartAutoplay();
    });
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      restartAutoplay();
    });
  });

  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  // Swipe com drag + velocity

  slides.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    currentX = startX;
    startTime = Date.now();
    isDragging = true;

    slides.style.transition = 'none';
    stopAutoplay();
  });

  slides.addEventListener('touchmove', function (e) {
    if (!isDragging) return;

    currentX = e.touches[0].clientX;
    const diff = currentX - startX;

    const offset = -index * slides.offsetWidth + diff;
    slides.style.transform = 'translateX(' + offset + 'px)';
  });

  slides.addEventListener('touchend', function () {
    if (!isDragging) return;

    isDragging = false;

    const diff = currentX - startX;
    const time = Date.now() - startTime;

    const velocity = Math.abs(diff / time);

    const threshold = slides.offsetWidth * 0.2;
    const velocityThreshold = 0.5;

    slides.style.transition = 'transform 0.4s ease';

    if (diff < -threshold || (velocity > velocityThreshold && diff < 0)) {
      nextSlide();
    } else if (diff > threshold || (velocity > velocityThreshold && diff > 0)) {
      prevSlide();
    } else {
      update();
    }

    restartAutoplay();
  });

  update();
  startAutoplay();
}
