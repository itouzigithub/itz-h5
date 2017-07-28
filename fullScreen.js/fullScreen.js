/**
 * author Bison
 * update 2017-07
 */

function fullScreen (id, option) {
  var el = document.getElementById(id);
  if (!el) {
    return new Error('cannot find element by id -' + id)
  }

  var result = this.extend({
    current: 0,
    duration: 1000
  }, option)

  this.el = el;
  this.total = el.children.length;          // 总屏数
  this.last = 0;                            // 上一页 id
  this.current = 0;                         // 当前页 id
  this.duration = result.duration           // 过渡期
  this.loaded = [];                         // 已加载图片的页面 id
  this.lock = false;
  this.init();

  if (result.current && result.current > 0 && result.current < this.total) {
    this.debug(result.current)
  } else {
    el.setAttribute('last', this.last.toString());
  }
}

fullScreen.prototype.init = function () {
  var start = 0;      // 手指触碰起点
  var distance = 0;   // 手指滑动距离
  var _this = this;

  document.addEventListener('touchstart', function (e) {
    if (_this.lock) return;
    start = e.touches[0].pageY;
  }, false);

  document.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (_this.lock) return;
    distance = e.touches[0].pageY - start;
  }, false);

  document.addEventListener('touchend', function () {
    if (_this.lock) return;
    _this.lock = true;

    setTimeout(function () {
      _this.lock = false;
    }, _this.duration)

    if (distance > 50) {
      _this.handleStatus(-1);
    }
    if (distance < -50) {
      _this.handleStatus(1);
      _this.preload(_this.current);
    }
  }, false);
}

/**
 * @param dir { Number } -1 向下滑 | 1 向上滑
 */
fullScreen.prototype.handleStatus = function (dir) {
  if (this.current === 0 && dir === -1) return;
  if (this.current === this.total - 1 && dir === 1) return;

  this.last = this.current;
  this.el.setAttribute('last', this.last.toString());

  var id = this.current.toString();
  var cur = document.getElementById(id);
  cur.setAttribute('status', dir.toString());

  this.current += dir;

  id = this.current.toString();
  var next = document.getElementById(id);
  next.setAttribute('status', '0');

  if (cur.getAttribute('flag') !== undefined) {
    setTimeout(function () {
      cur.setAttribute('flag', dir.toString());
    }, this.duration)
  }

  if (next.getAttribute('flag') !== undefined) {
    setTimeout(function () {
      next.setAttribute('flag', '0');
    }, this.duration)
  }
}

/**
 * 图片预加载
 */
fullScreen.prototype.preload = function (current) {
  var id = current + 1;
  if (id === this.total || this.loaded.indexOf(id) > -1) return;
  var page = document.getElementById(id.toString());
  var imgs = page.querySelectorAll('[data-src]');

  for (var i = 0, len = imgs.length; i < len; i++) {
    var url = imgs[i].getAttribute('data-src');
    if (url) {
      if (imgs[i].nodeName === "IMG") {
        imgs[i].src = url;
      } else {
        imgs[i].style.backgroundImage = 'url(' + url + ')';
      }
    }
  }

  this.loaded.push(id)
}

fullScreen.prototype.debug = function (id) {
  var last = id - 1;
  this.current = id;
  this.el.setAttribute('last', last.toString());

  attr(document.getElementById(id.toString()), '0');

  while (id-- > 0) {
    attr(document.getElementById(id.toString()), '1');
  }

  for (var i = 1; i < this.total; i++) {
    this.preload(i);
  }

  function attr (node, value) {
    node.setAttribute('status', value);
    if (node.getAttribute('flag') !== undefined) {
      node.setAttribute('flag', value);
    }
  }
}

fullScreen.prototype.extend = function (tar, src) {
  if (Object.prototype.toString.call(src) !== '[object Object]') return tar;
  for (var key in tar) {
    if (src[key] !== undefined) {
      tar[key] = src[key]
    }
  }
  return tar
}