(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-site-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        start();
      });
    });

    show(0);
    start();
  });

  document.querySelectorAll('[data-card-filter]').forEach(function (form) {
    var scope = form.closest('main') || document;
    var input = form.querySelector('input[type="search"]');
    var sort = form.querySelector('[data-card-sort]');
    var list = scope.querySelector('[data-card-list]');

    if (!input || !list) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (query && input.name === 'q') {
      input.value = query;
    }

    function applySort() {
      if (!sort) {
        return;
      }

      var mode = sort.value;
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      cards.sort(function (a, b) {
        if (mode === 'year') {
          return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
        }

        if (mode === 'views') {
          return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
        }

        if (mode === 'rating') {
          return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
        }

        return 0;
      });

      cards.forEach(function (card) {
        list.appendChild(card);
      });
    }

    function applyFilter() {
      var keyword = input.value.trim().toLowerCase();
      var cards = Array.prototype.slice.call(list.querySelectorAll('.movie-card'));

      cards.forEach(function (card) {
        var text = (card.dataset.search || '').toLowerCase();
        card.hidden = Boolean(keyword && text.indexOf(keyword) === -1);
      });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      applySort();
      applyFilter();
    });

    input.addEventListener('input', applyFilter);

    if (sort) {
      sort.addEventListener('change', function () {
        applySort();
        applyFilter();
      });
    }

    applySort();
    applyFilter();
  });
})();
