    /* ======================================
       SLIDER BANNER
    ====================================== */

    const slides = document.querySelectorAll('.banner-slider .slide');

    let currentSlide = 0;

    function changeSlide() {

        slides[currentSlide].classList.remove('active');

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        slides[currentSlide].classList.add('active');
    }

    /* cambia cada 5 segundos */
    setInterval(changeSlide, 5000);