import { H as Hls } from './hls-dru42stk.js';

function preparePlayer(shell) {
  var video = shell.querySelector('video');
  var cover = shell.querySelector('.player-cover');
  var stream = shell.getAttribute('data-stream');
  var hls = null;

  if (!video || !stream) {
    return;
  }

  function bindStream() {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(stream);
      hls.attachMedia(video);
    }
  }

  function play() {
    if (cover) {
      cover.classList.add('is-hidden');
    }

    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {
        if (cover) {
          cover.classList.remove('is-hidden');
        }
      });
    }
  }

  bindStream();

  if (cover) {
    cover.addEventListener('click', play);
  }

  video.addEventListener('play', function () {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && cover) {
      cover.classList.remove('is-hidden');
    }
  });

  video.addEventListener('ended', function () {
    if (cover) {
      cover.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.querySelectorAll('.player-shell').forEach(preparePlayer);
