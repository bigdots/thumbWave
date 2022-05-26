# thumbWave 高性能小程序直播点赞效果组件

采用 微信小程序最新版 canvas2d Api 和 requestAnimationFrame 实现的高性能直播点赞特效

## 效果

<image alt="效果图" src="/thumbwave.gif?raw=true" width="300px">

## 如何使用

1、下载该组件代码
解压——复制`wx-thumbWave`文件夹到我们的项目中

2、 在页面或组件中引入点赞组件

- [page].json

```json
{
  "usingComponents": {
    "thumbWave": "path/wx-thumbWave/index"
  }
}
```

- [page].wxml

```xml
<thumbWave
  btnwidth="60rpx"
  btnheight="60rpx"
  wavetype="{{wavetype}}"
  bindthumbclick="handleLikeClick"
/>
```

- [page].js

```js
Page({
  data: {
    wavetype: 1,
  },
  handleLikeClick(e) {
    this.setData({
      wavetype: 1, // 因为是点击事件，所以每次点赞数是1
    })
  },
})
```

3、 参数说明

- wavetype 必须，点赞类型，它决定了产生的气泡数量；**每次点赞操作一定要通过 setData 来设置该值，否则没有气泡效果；**

  - 1 一般来说，点击事情传 1 即可，会产生 1-3 个气泡
  - 2 如果是后端传来的，会有收到多个点赞的情况，会产生 2-6 个气泡

- btnwidth 非必须，按钮宽度，字符串格式，比如'60rpx'

- btnheight 非必须，按钮高度，字符串格式，比如'60rpx'

- btnsrc 非必须，按钮图片地址，支持网络图片和本地图片。
  **本地图片需要传入相对该组件 index.js 的相对路径**
