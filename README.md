# itz-h5
爱投资移动端开发规范、知识沉淀、经验积累、框架/库
- 开发规范见下方
- 相对零碎的知识整理在 issue 中
- 相对体系的知识和开发经验，整理在 md 文件中
- 内部自研的应用于移动端的框架/库单独存放于文件夹

### 移动端开发规范
#### header 设置
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <link rel="dns-prefetch" href="//css10-itzcdn-com.alikunlun.com">
  <link rel="dns-prefetch" href="//js10-itzcdn-com.alikunlun.com">
  <link rel="dns-prefetch" href="//img3-itzcdn-com.alikunlun.com">
  <meta name="keywords" content="爱投资,投资理财,P2C理财,P2P理财,个人理财,网上投资">
  <meta name="description" content="安全规范的互联网金融投资理财平台，丰富多样、本息全额保障的高收益理财产品，大众化的低门槛投资，全免费的服务体验。爱投资，值得爱">
  <meta name="screen-orientation" content="portrait">
  <meta name="x5-orientation" content="portrait">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="applicable-device" content="mobile">
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="Cache-Control" content="no-cache">
</head>
```

#### 基础库
- 所有移动端项目必须引入 base.css。使用 fis3 编译的项目，请用 __inline 形式引入
- 如需使用 $ 选择方法或 ajax 库，首选 sizzle.js 或 zepto，不推荐 jQuery、vue-resource、axios

### 参考
#### 主流网站 header 设置参考
注：省略了 TDK、script 等不具参考性的内容
```html
<!-- 百度移动端首页 -->
<head>
  <meta name="referrer" content="always">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta http-equiv="x-dns-prefetch-control" content="on">
  <meta name="format-detection" content="telephone=no">
</head>

<!-- 京东移动端首页 -->
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
  <meta http-equiv="Content-Type" content="text/html; charset=GBK">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <meta name="format-detection" content="telephone=no">
  <meta http-equiv="Expires" content="-1">
  <meta http-equiv="Cache-Control" content="no-cache">
  <meta http-equiv="Pragma" content="no-cache">
</head>

<!-- 淘宝移动端首页 -->
<header>
  <meta charset="utf-8">
  <link rel="dns-prefetch" href="//g.alicdn.com">
  <link rel="dns-prefetch" href="//gw.alicdn.com">
  <link rel="dns-prefetch" href="//cdn.tanx.com">
  <link rel="dns-prefetch" href="//log.mmstat.com">
  <link rel="dns-prefetch" href="//api.m.taobao.com">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta name="format-detection" content="telephone=no,email=no">
  <meta name="App-Config" content="fullscreen=yes,useHistoryState=yes,transition=yes">
  <meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
</header>
```