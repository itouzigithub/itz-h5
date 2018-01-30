# 移动端全屏滑动式应用框架
针对全屏滑动型的展示性页面，灵活处理进场、退场动效<br>
> author Bison<br>
> update 2018-1

### 设计思路

任何时刻，页面上的任何元件，只有两种状态：在视区中，在视区外
<br>
在视区外又分两种情况：手指向上滑屏时，当前页面元件离开视区到上方；手指向下滑屏时，当前页面元件离开视区到下方
<br>
因此可以用 status 属性来标记元素的状态：
- -1：页面在视区外的下方
- 0： 页面在视区内
- 1： 页面在视区外的上方
<br>
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

于是使用 js 切换元素的 status，就能实现元素的进入和离开
<br>
当然，上述方法仍有一定问题，因为页面内动效元素很多，每一个元素都要设置 status 属性显然很麻烦，因此 fullScreen.js 只会给父节点设置 status，页面内元素进场和退场动效的 css 实现就变成了：

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


### HTML 结构
```html
<!-- last 和 dir 属性由 fullScreen 自动添加，其它的需要手写，其中 name 是自定义的 -->
<div id="fullScreen" last="0" dir="1">
  <!-- 封面 -->
  <div status="0" flag="0" name="page1"></div>
  <!-- 第一页 -->
  <div status="-1" flag="-1" name="page2"></div>
  <!-- 第二页 -->
  <div status="-1" flag="-1" name="page3">
    <img data-src="url">
    <div data-src="url"></div>
  </div>
</div>
<script src="fullScreen.js"></script>
<script>
  var fs = new fullScreen('fullScreen', options);
</script>
```

- 最外层节点（#fullScreen）的直属子节点都会被视为页面节点，每个页面按顺序编号（index），第一个子节点 index 值为 0，第二个 index 为 1，以此类推

- fullScreen.js 会给最外层节点添加一个 last 属性，用于表示上一页的页数（刚离开的页面的 index 序号）

- fullScreen.js 仅仅处理 touch 事件，并相应的改变 status、flag 和 last 属性，所有的 CSS 需要自己实现

- fullScreen.js 内置了图片懒加载功能，该方法在滑屏时调用，默认预先加载当前页下一页的图片资源。

- 设置懒加载的方法就是将图片 url 写在 data-src 属性中，fullScreen.js 会检测，如果是 img 节点，则设置 src，否则会设置成背景图 `background-image: url()`

- flag 属性值会与 status 保持同步，它们之间唯一的区别在于：滑屏动作结束时（touchend），status 的值会立即改变，而 flag 的值是在滑屏切换过渡期（默认为 1 秒）结束时才改变

- dir 属性表示滑动的方向，-1 表示手指向下滑，1 表示手指向上滑

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
/* 当前页面完全离开以后，下一页的 el 元素才显示（推荐） */
.el {
  opacity: 0;
}
[flag="0"] .el {
  opacity: 1;
}
```


### CSS 结构

页面元件的动画可以通过 transition 或 animation 实现，利用 last、status 和 flag 的组合，可以灵活的操控页面动画的执行，这就是 fullScreen.js 的核心思想

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
  position: absolute;
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
/* 页面进入 */
[flag="0"] {
  transform: translateY(0);
}
/* 页面离开 */
[status][flag="1"] {
  transform: translateY(-100%);
}
[status][flag="-1"] {
  transform: translateY(100%);
}
```

### API
```js
// @id { String } 节点 id 名称，必填
// @option { Object } 所有属性选填
var fs = new fullScreen(id, {
  // options
})
```

#### Options

- duration: 1000
  + { Number } 滑屏过渡时间，单位 ms
- current: 0   
  + { Number } 框架初始化时展现哪一页，默认展现第一页
- max: 50 
  + { Number } 滑动距离为多少 px 时触发翻页
- publicPath: ''   
  + 资源路径的公共前缀，通常由构建工具自动添加。针对没有构建工具的简单场景，可设置该选项
- exclude: []
  + 为了防止 IOS 浏览器中，上滑下滑导致整个页面位移，fullScreen.js 针对 IOS，在 touchmove 事件中使用了 `event.preventDefault()`
  + 由此导致的结果是：如果某些页面存在 `overflow-y: scroll` 的子元素，子元素内容将无法上下滑动，尽管 touchmove 事件是注册在 document 上的，但子元素的滑动仍会受到 `event.preventDefault()` 的影响，而这种情况只有 IOS 存在，安卓不存在此问题
  + 为了兼容这种情况，需要将相应的 index 添加到 exclude 中，表示：对该页的滑动事件不要使用 `event.preventDefault()`
- beforeChange: function (next, current, name, dir) {}
  + next { Function } 如果给 beforeChange 传入了函数参数，则必须在函数中调用 next 才能继续翻页
  + current { Number } 当前页的 index
  + name { String } 当前页的 name 属性，如果有的话
  + dir { Number } 用户滑动的方向，-1 表示手指向下滑，1 表示手指向上滑

```js
// 在某些情况下取消滑动翻页
beforeChange: function (next, current, name, dir) {
  // 如果是 somePage 页并且滑动方向是向上滑，则取消翻页
  if (name === 'somePage' && dir === 1) return
  // 否则正常执行翻页
  next()
}

// 另一种方法
// 因为页面滑动的方法注册在 document 上，并且是冒泡阶段
// 因此只要给页面内部子元素添加 touchend 方法，并阻止冒泡，即可取消滑动翻页
el.addEventListener('touchend', function (e) {
  if (/* condition */) {
    e.stopPropagation()
  }
})
```

- afterChange: function (current, name) {}
  + 触发翻页后的钩子函数
  + current { Number } 翻页后的当前页的 index
  + name { String } 翻页后的当前页的 name，如果有的话

#### Methods

- fs.next(direction)
  + 调用该方法，可以指定页面向上翻一页或向下翻一页
  + direction { Number } -1 表示手指向下滑（翻到上一页），1 表示手指向上滑（翻到下一页）
- fs.goTo(index)
  + 调用该方法，可以指定跳转至任意页面


### 其它说明
- 使用序号来标记页面，在应对需求变化时可能非常被动，比如删除中间的某个页面，会导致后续所有页面的序号都需要修改。因此最好使用 name
- duration 期间滑动事件会被锁住，因为动效可能还没有执行完
- 在调试阶段，为了看到第 n 页的动效，每次刷新后都要手动滑屏滑 n 次才能看到，或者必须自己手动修改 status 的值，这是非常麻烦的，因此调试阶段设置 current 选项，可以直接跳到第 n 页


### 可能的扩展方向

- 目前所有页面滑屏切换的过渡期时长是一样的，可考虑新增配置选项，给某些页面单独设置过渡期
- exclude 参数和 fs.goTo() 方法的参数允许指定为 name，以更好的应对需求变更的情况
- 目前 fullScreen.js 仅支持移动端，可以考虑兼容 PC 端（增加 mousedown、mousemove、mouseup）