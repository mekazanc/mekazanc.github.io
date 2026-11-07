/*
 * Dithered avatar
 * Builds a two-colour, pixelated (Bayer-dithered) copy of the avatar in the
 * browser and lays it over the real photo. CSS fades it out on hover.
 *
 * Tune with data attributes on <span class="dither-avatar">:
 *   data-dark="#111111"   ink colour
 *   data-light="#a9d3dd"  paper colour
 *   data-cells="82"       pixels across (fewer = chunkier)
 *   data-gamma="1.35"     higher = darker face
 */
(function () {
  var BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ];

  function hexToRgb(hex) {
    var n = parseInt(hex.replace("#", ""), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function dither(wrapper, img) {
    var dark = hexToRgb(wrapper.dataset.dark || "#111111");
    var light = hexToRgb(wrapper.dataset.light || "#a9d3dd");
    var cells = parseInt(wrapper.dataset.cells || "82", 10);
    var gamma = parseFloat(wrapper.dataset.gamma || "1.35");
    var scale = 4;

    // 1. shrink the photo to cells x cells (centre crop, like object-fit: cover)
    var c = document.createElement("canvas");
    c.width = c.height = cells;
    var ctx = c.getContext("2d");
    var s = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, cells, cells);

    var data;
    try {
      data = ctx.getImageData(0, 0, cells, cells);
    } catch (e) {
      return; // image from another domain without CORS: leave the photo as is
    }
    var px = data.data;
    var n = cells * cells;

    // 2. greyscale + histogram equalisation (spreads tones so the face gets texture)
    var grey = new Uint8Array(n);
    var hist = new Array(256).fill(0);
    for (var i = 0; i < n; i++) {
      var g = Math.round(0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]);
      grey[i] = g;
      hist[g]++;
    }
    var cdf = [], acc = 0;
    for (var v = 0; v < 256; v++) { acc += hist[v]; cdf[v] = acc; }
    var cdfMin = cdf.find(function (x) { return x > 0; });

    // 3. ordered (Bayer) dithering to two colours
    for (var y = 0; y < cells; y++) {
      for (var x = 0; x < cells; x++) {
        var k = y * cells + x;
        var eq = (cdf[grey[k]] - cdfMin) / Math.max(1, n - cdfMin);
        var val = 255 * Math.pow(eq, gamma);
        var threshold = (BAYER[y % 4][x % 4] + 0.5) * 16;
        var col = val > threshold ? light : dark;
        px[k * 4] = col[0]; px[k * 4 + 1] = col[1]; px[k * 4 + 2] = col[2]; px[k * 4 + 3] = 255;
      }
    }
    ctx.putImageData(data, 0, 0);

    // 4. enlarge with hard edges and place it over the photo as an <img>
    var big = document.createElement("canvas");
    big.width = big.height = cells * scale;
    var bctx = big.getContext("2d");
    bctx.imageSmoothingEnabled = false;
    bctx.drawImage(c, 0, 0, big.width, big.height);

    var overlay = new Image();
    overlay.className = "dither-avatar__overlay";
    overlay.alt = "";
    overlay.setAttribute("aria-hidden", "true");
    overlay.src = big.toDataURL("image/png");
    wrapper.appendChild(overlay);
  }

  function init() {
    document.querySelectorAll(".dither-avatar").forEach(function (wrapper) {
      var img = wrapper.querySelector("img");
      if (!img) return;
      if (img.complete && img.naturalWidth) dither(wrapper, img);
      else img.addEventListener("load", function () { dither(wrapper, img); }, { once: true });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
