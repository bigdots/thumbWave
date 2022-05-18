# thumbWave 小程序直播点赞效果组件

## 效果

<image alt="效果图" src="/thumbwave.gif?raw=true" width="300px">

## 如何使用

1、下载该组件代码

2、 在页面或组件中引入点赞组件

- [page].json

```json
{
  "usingComponents": {
    "thumbWave": "path/thumbWave"
  }
}
```

- [page].wxml

```xml
<thumbWave
  bwidth="60rpx"
  bheight="60rpx"
  thumbCount="{{thumbCount}}"
  bindthumbclick="handleLikeClick"
/>
```

- [page].js

```js
Page({
  data: {
    thumbCount: 0,
  },
  handleLikeClick(e) {
    this.setData({
      thumbCount: 1, // 因为是点击事件，所以每次点赞数是1
    })
  },
})
```

3、 参数说明

- btnwidth 非必须，按钮宽度，字符串格式，比如'60rpx'

- btnwidth 非必须，按钮高度，字符串格式，比如'60rpx'

- thumbCount 必须，点赞产生的气泡数量；一定要通过 setData 来设置，否则没有效果；

  - 1 一般来说，点击事情传 1 即可，会产生 1-3 个气泡
  - 2 如果是后端传来的，会有收到多个点赞的情况，会产生 2-6 个气泡

- btnsrc 非必须，按钮图片地址，支持本地图片和网络图片

4、 事件

- thumbclick 按钮点击事件 非必须，一般在这个函数中设置 thumbCount，点赞的回调函数
