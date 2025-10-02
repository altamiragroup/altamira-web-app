(function () {
  // Debug rápido: abre consola y fijate estos mensajes
  try {
    console.log("[zoom] init - jQuery:", typeof jQuery !== 'undefined' ? 'present' : 'absent');
  } catch (e) { }

  // si existe jQuery, lo usamos y nos aseguramos que el DOM esté listo
  if (typeof jQuery !== 'undefined') {
    jQuery(function ($) {
      const $sliders = $(".slider.wrap");
      console.log("[zoom] sliders encontrados (jQuery):", $sliders.length);

      $sliders.each(function () {
        const $s = $(this);
        const scale = parseFloat($s.attr('data-scale')) || 1.6;
        const $img = $s.children(".foto.wrap").children("img");

        if ($img.length === 0) {
          console.warn("[zoom] no se encontró <img> dentro de .foto.wrap para:", $s);
          return;
        }

        let raf = null;
        $s.on("mouseenter", function () {
          $img.css({ transform: "scale(" + scale + ")" });
        });

        $s.on("mouseleave", function () {
          $img.css({ transform: "scale(1)", "transform-origin": "50% 50%" });
        });

        $s.on("mousemove", function (e) {
          // throttle con rAF
          const el = this;
          if (raf) cancelAnimationFrame(raf);
          raf = requestAnimationFrame(function () {
            const ox = ((e.pageX - $s.offset().left) / $s.width()) * 100;
            const oy = ((e.pageY - $s.offset().top) / $s.height()) * 100;
            $img.css({ "transform-origin": ox + "% " + oy + "%" });
          });
        });
      });
    });
    return;
  }

  // Si no hay jQuery, fallback en JS puro
  document.addEventListener("DOMContentLoaded", function () {
    const sliders = document.querySelectorAll(".slider.wrap");
    console.log("[zoom] sliders encontrados (vanilla):", sliders.length);

    sliders.forEach(function (slider) {
      const scale = parseFloat(slider.getAttribute("data-scale")) || 1.6;
      const img = slider.querySelector(".foto.wrap img");
      if (!img) {
        console.warn("[zoom] no se encontró <img> dentro de .foto.wrap para:", slider);
        return;
      }

      let raf = null;
      slider.addEventListener("mouseenter", function () {
        img.style.transform = "scale(" + scale + ")";
      });

      slider.addEventListener("mouseleave", function () {
        img.style.transform = "scale(1)";
        img.style.transformOrigin = "50% 50%";
      });

      slider.addEventListener("mousemove", function (e) {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          const rect = slider.getBoundingClientRect();
          const ox = ((e.clientX - rect.left) / rect.width) * 100;
          const oy = ((e.clientY - rect.top) / rect.height) * 100;
          img.style.transformOrigin = ox + "% " + oy + "%";
        });
      });
    });
  });
})();
(function () {
  jQuery(function ($) {
    const $sliders = $(".slider.wrap");
    $sliders.each(function () {
      const $s = $(this);
      const scale = parseFloat($s.attr("data-scale")) || 1.6;
      const $img = $s.find(".foto.wrap img");

      // Hover zoom
      $s.on("mouseenter", function () {
        $img.css({ transform: "scale(" + scale + ")" });
      });
      $s.on("mouseleave", function () {
        $img.css({ transform: "scale(1)", "transform-origin": "100% 100%" });
      });
      $s.on("mousemove", function (e) {
        const ox = ((e.pageX - $s.offset().left) / $s.width()) * 500;
        const oy = ((e.pageY - $s.offset().top) / $s.height()) * 500;
        $img.css({ "transform-origin": ox + "% " + oy + "%" });
      });

      // Click: abre modal
      $img.on("click", function () {
        const src = $(this).data("large") || $(this).attr("src");
        $("#zoomModalImg").attr("src", src);
        const modal = new bootstrap.Modal(document.getElementById("zoomModal"));
        modal.show();
      });
    });
  });
})();
window.onload = function () {
  let button = document.querySelector('#menuButton');
  let menu = document.querySelector('.container-fluid.menu');
  let articulos = document.querySelector('.articulos');

  if (button) {
    button.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    })
  }
  // capturamos los clicks de todo el documento
  document.addEventListener('click', (e) => {
    // capturamos el objetivo del click
    let click = e.target;
    // comprobamos que se haga click fuera del boton o el menu
    if (menu.style.height != '0px' && click != button && click != menu) {

      menu.classList.add('hidden')
    }
  })


}