# 移动端全屏滑动式应用框架
针对全屏滑动型的展示性页面，灵活处理进场、退场动效<br>
> author Bison<br>
> update 2017-07

### 设计思路
任何时刻，页面上的任何元件，只有两种状态：在视区中，在视区外<br>
在视区外又分两种情况：手指向上滑屏时，当前页面元件离开视区到上方；手指向下滑屏时，当前页面元件离开视区到下方<br>
因此可以用 status 属性来标记元素的状态：
- -1：页面在视区外的下方
- 0： 页面在视区内
- 1： 页面在视区外的上方
元件的进入和离开均用 css 实现：

```css
.el {
  transition: all 1s;
}
.el[status="1"] {
  transform: translateY(-1000px);
}
.el[status="0"] {
  animation: ...;
}
.el[status="-1"] {
  transform: translateY(1000px);
}
```

于是使用 js 切换元素的 status，就能实现元素的进入和离开<br>

当然，上述方法仍有一定问题，因为页面内动效元素很多，每一个元素都要设置 status 属性显然很麻烦，因此 fullScreen.js 要求只能给父节点设置 status，页面内元素进场和退场动效的 css 实现就变成了：

```css
.el-1,
.el-2 {
  transition: all 1s;
}
[status="1"] .el-1,
[status="1"] .el-2 {
  transform: translateY(-1000px);
}
[status="-1"] .el-1,
[status="-1"] .el-2 {
  transform: translateY(1000px);
}
```

- fullScreen.js 要求每一页的父节点都必须有一个 id，id 值就是当前页的页数，从 0 开始计
- fullScreen.js 会给最外层节点添加一个 last 属性，用于表示上一页的页数（刚离开的页面的 id）
- fullScreen.js 仅仅处理 touch 事件，并相应的改变 status、flag 和 last 属性，所有的 CSS 需要自己实现

### HTML 结构
```html
<!-- last 属性由 fullScreen 自动添加，其它的需要手写 -->
<div id="fullScreen" last="0">
  <!-- 封面 -->
  <div id="0" status="0" flag="0"></div>
  <!-- 第一页 -->
  <div id="1" status="-1" flag="-1"></div>
  <!-- 第二页 -->
  <div id="2" status="-1" flag="-1">
    <img data-src="url">
    <div data-src="url"></div>
  </div>
</div>
<script src="fullScreen.js"></script>
<script>
  var fs = new fullScreen('fullScreen', options);
</script>
```

- 最外层节点（#fullScreen）的直属子节点只能是每个页面组件的父节点，不能掺杂其它的节点

- id 和 status 是必填的，flag 是选填的

- fullScreen.js 内置了图片懒加载功能，该方法在滑屏时调用，默认预先加载当前页下一页的图片资源，因此懒加载只对从 0 算起的第 2 页及以后的页面有用，前两屏的资源必须直接加载。
设置懒加载的方法就是将图片 url 写在 data-src 属性中，fullScreen.js 会检测，如果是 img 节点，则设置 src，否则会设置成背景图

- flag 属性值会与 status 保持同步，它们之间唯一的区别在于：滑屏动作结束时（touchend），status 的值会立即改变，而 flag 的值是在滑屏切换过渡期（默认为 1 秒）结束时才改变

```css
/* 当前页面还没有离开，下一页的 el 元素就立即显示 */
.el {
  opacity: 0;
}
[status="0"] .el {
  opacity: 1;
}
```
```css
/* 当前页面完全离开以后，下一页的 el 元素才显示 */
.el {
  opacity: 0;
}
[flag="0"] .el {
  opacity: 1;
}
```

### CSS 结构
页面元件的动画可以通过 transition 或 animation 实现，利用 last、status 和 flag 的组合，可以灵活的操控页面动画的执行，这也是 fullScreen.js 的核心思想

```css
/* 假设当前页面页数为 3 */
/* 元素在上一个页面离开后才进入页面 */
/* 方法一 */
[status="0"] .el {
  animation: ...;
  animation-delay: 1s;
}
/* 方法二 */
[flag="0"] .el {
  animation: ...;
}

/* 从上到下进场 */
[last="4"] [flag="0"] .el {
  animation: ...;
}
/* 从下当上进场 */
[last="2"] [flag="0"] .el {
  animation: ...;
}

/* 元素的退场动效 */
/* 方法一 */
.el {
  opacity: 1;
  transition: all 1s;
}
[status="-1"] .el {
  opacity: 0;
  transform: translateY(1000px);
}
[status="1"] .el {
  opacity: 0;
  transform: translateY(-1000px);
}
/* 方法二 */
[last="3"] .el {
  animation: ...;
}
/* 元素向上退场 */
[last="3"] [status="1"] .el {
  animation: ...;
}
/* 元素向下退场 */
[last="3"] [status="-1"] .el {
  animation: ...;
}
```

### CSS 代码参考
```css
html,
body {
  height: 100%;
  touch-action: none;
}
.fullScreen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform-style: preserve-3d;
  backface-visibility: hidden;
}
.fullScreen > div {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
}
```

### API
```js
// @id { String } 节点 id 名称，必填
// @option { Object } 所有属性选填
var fs = new fullScreen(id, {
  duration: 1000,  // { Number } 滑屏过渡时间，单位 ms
  current: 0       // { Number } 当前页面处于哪一屏，用于调试
})
```

说明：
- duration 期间滑动事件会被锁住，因为动效可能还没有执行完
- 在调试阶段，为了看到第 n 页的动效，每次刷新后都要手动滑屏滑 n 次才能看到，或者必须自己手动修改 status 的值，这是非常麻烦的，因此调试阶段设置 current 属性，可以直接跳到第 n 页

### 可能的缺陷
- 所有页面滑屏切换的过渡期是一样的，当然，如果不一样，应视为设计的缺陷
- 从 0 开始计算页数，可能违背通常的计数习惯