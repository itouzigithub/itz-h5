/**
 * Author @Bison
 * Doc: https://github.com/itouzigithub/itz-h5/blob/master/fullScreen.js
 */

(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory()
  } else {
    global.fullScreen = factory()
  }
})(window, function () {

  var ua = navigator.userAgent;

  var NOOP = function () {}

  var attr = function (node, value) {
    node.setAttribute('status', value);
    node.setAttribute('flag', value);
  }

  var extend = function (tar, src) {
    if (Object.prototype.toString.call(src) !== '[object Object]') return tar;
    for (var key in tar) {
      if (src[key] !== undefined) {
        tar[key] = src[key]
      }
    }
    return tar
  }

  var getName = function (node) {
    var name = node.getAttribute('name');
    return name ? name : ''
  }

  var fullScreen = function (id, option) {
    var el = document.getElementById(id);
    if (!el) {
      return new Error('cannot find element by id -' + id)
    }

    var result = extend({
      current: 0,
      duration: 1000,
      afterChange: NOOP,
      beforeChange: null,
      publicPath: '',
      max: 50,
      exclude: []
    }, option)

    this.lock = false;
    this.next = this.next.bind(this)
    this.dir = 1;                             // -1 向下滑 | 1 向上滑
    this.el = el;
    this.children = el.children;
    this.total = el.children.length;          // 总屏数
    this.last = 0;                            // 上一页 index
    this.current = 0;                         // 当前页 index
    this.loaded = [];                         // 已加载图片的页面的页数
    this.duration = result.duration           // 过渡期
    this.publicPath = result.publicPath;      // 文件资源公共路径
    this.max = result.max;                    // 滑动距离大于多少时触发翻页
    this.exclude = result.exclude;            // 某些页面需要解开滑动
    this.beforeChange = result.beforeChange;  // 钩子函数，页面变化前调用
    this.afterChange = result.afterChange;    // 钩子函数，页面变化后调用

    this.indexMap = {};

    var _this = this;

    Array.prototype.forEach.call(this.children, function (el, index) {
      if (getName(el)) {
        _this.indexMap[index] = getName(el)
      }
    })

    this.init();

    var cur = result.current;
    this.preload(cur + 1);

    if (cur && cur > 0 && cur < this.total) {
      this.goTo(cur)
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
      var name = _this.indexMap[_this.current];
      if (_this.exclude.indexOf(_this.current) < 0 && _this.exclude.indexOf(name) < 0)) {
        e.preventDefault();
      }
      if (_this.lock) return;
      distance = e.touches[0].pageY - start;
    }, false);

    document.addEventListener('touchend', function () {
      if (_this.lock) return;
      _this.lock = true;
      setTimeout(function () {
        _this.lock = false;
      }, _this.duration)

      if (distance > _this.max) {
        _this.handleStatus(-1);
      }
      if (distance < -_this.max) {
        _this.handleStatus(1);
      }

      distance = 0;
    }, false);
  }

  /**
   * @param dir { Number } -1 向下滑 | 1 向上滑
   */
  fullScreen.prototype.handleStatus = function (dir) {
    if (this.current === 0 && dir === -1) return;
    if (this.current === this.total - 1 && dir === 1) return;

    this.dir = dir;
    var name = getName(this.children[this.current]);

    if (this.beforeChange) {
      this.beforeChange(
        this.next,
        this.current,
        name,
        dir
      )
    } else {
      this.next()
    }
  }

  fullScreen.prototype.next = function (dir) {
    var direction = dir ? dir : this.dir;
    this.el.setAttribute('last', this.current.toString());
    this.el.setAttribute('dir', direction.toString())

    var curEl = this.children[this.current];
    curEl.setAttribute('status', direction);

    this.current += direction;

    var nextEl = this.children[this.current];
    nextEl.setAttribute('status', '0');

    setTimeout(function () {
      curEl.setAttribute('flag', direction.toString());
      nextEl.setAttribute('flag', '0');
    }, this.duration)

    // 预加载下一页的图片
    this.preload(this.current + direction);

    // 触发钩子函数
    this.afterChange(this.current, getName(nextEl))
  }

  /**
   * 图片预加载
   * index { Number } 预加载哪一页的资源
   */
  fullScreen.prototype.preload = function (index) {
    if (index >= this.total || index < 0 || this.loaded.indexOf(index) > -1) return;

    var page = this.children[index];
    var targets = page.querySelectorAll('[data-src]');

    for (var i = 0, len = targets.length; i < len; i++) {
      var url = targets[i].getAttribute('data-src');
      if (url) {
        url = this.publicPath + url;
        if (targets[i].nodeName === "IMG") {
          targets[i].src = url;
        } else {
          targets[i].style.backgroundImage = 'url(' + url + ')';
        }
        targets[i].removeAttribute('data-src');
      }
    }

    this.loaded.push(index)
  }

  /**
   * 直接跳转到某个页面，可用于开发调试
   */
  fullScreen.prototype.goTo = function (index) {
    var last = index - 1 >= 0 ? index - 1 : index + 1;
    this.current = index;
    this.el.setAttribute('last', last.toString());

    this.preload(index)
    this.preload(index - 1)
    
    attr(this.children[index], '0');

    var copy = index;

    while (index-- > 0) {
      attr(this.children[index], '1');
    }

    while (++copy < this.total) {
      attr(this.children[copy], '-1');
    }

    this.afterChange(
      this.current, 
      getName(this.children[this.current])
    )
  }

  return fullScreen
});