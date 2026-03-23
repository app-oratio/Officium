document.addEventListener("DOMContentLoaded", function () {

  let index = 0;

  const slides = document.querySelector('.slides');
  const slideItems = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dots span');
  const carousel = document.querySelector('.carousel');

  const total = slideItems.length;

  if (!slides || total === 0) return;

  let interval;

  /* BOTÕES */
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  if (nextBtn) {
    nextBtn.onclick = function () {
      nextSlide();
      restartAutoplay();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = function () {
      prevSlide();
      restartAutoplay();
    };
  }

  /* FUNÇÕES */
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

  function update() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    if (!dots.length) return;

    dots.forEach(function(dot, i) {
      dot.classList.remove('active');
      if (i === index) {
        dot.classList.add('active');
      }
    });
  }

  /* CLIQUE NAS BOLINHAS */
  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function () {
      goToSlide(i);
      restartAutoplay();
    });
  });

  /* AUTOPLAY */
  function startAutoplay() {
    stopAutoplay();
    interval = setInterval(function () {
      nextSlide();
    }, 4000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  function restartAutoplay() {
    startAutoplay();
  }

  startAutoplay();

  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
  }

  /* SWIPE */
  let startX = 0;
  let endX = 0;

  slides.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  });

  slides.addEventListener('touchmove', function (e) {
    endX = e.touches[0].clientX;
  });

  slides.addEventListener('touchend', function () {
    let diff = startX - endX;
    let threshold = window.innerWidth * 0.1;

    if (diff > threshold) {
      nextSlide();
    } else if (diff < -threshold) {
      prevSlide();
    }

    restartAutoplay();
  });

  /* INICIALIZA */
  update();

});
