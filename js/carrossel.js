document.addEventListener("DOMContentLoaded", function () {

  let index = 0;

  const slides = document.querySelector('.slides');
  const slideItems = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dots span');

  const total = slideItems.length;

  let interval;

  /* BOTÕES */
  document.querySelector('.next').onclick = function () {
    nextSlide();
  };

  document.querySelector('.prev').onclick = function () {
    prevSlide();
  };

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
    slides.style.transform = "translateX(-" + (index * 100) + "%)";
    updateDots();
  }

  function updateDots() {
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
    interval = setInterval(function () {
      nextSlide();
    }, 4000);
  }

  function stopAutoplay() {
    clearInterval(interval);
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  startAutoplay();

  const carousel = document.querySelector('.carousel');

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

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

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }

    restartAutoplay();
  });

});
