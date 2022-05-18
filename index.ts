// import { LikeWave } from './bessel'

Component({
  options: {
    pureDataPattern: /^_/, // 指定所有 _ 开头的数据字段为纯数据字段
  },
  data: {
    height: 800,
    width: 180,
    realHeight: 800,
    realWidth: 180,
    _queue: {},
    _ctx: null,
    _likeImgList: [],
    _canvas: null,
    count: 0,
    _iconWidth: 100,
    _thumbCount: 0,
  },
  properties: {
    btnwidth: {
      type: String,
      value: '50rpx',
    },
    btnheight: {
      type: String,
      value: '50rpx',
    },
    btnsrc: {
      type: String,
      value: './images/thumb.svg',
    },
    thumbCount: Number,
  },
  observers: {
    thumbCount(val) {
      if (val <= 0) {
        return
      }
      if (this.data._ctx && this.data._likeImgList.length) {
        // 点赞增加少的时候，产生气泡少，点赞增加多的时候，产生气泡多
        const count =
          val > 1 ? this.getRandomInt(2, 6) : this.getRandomInt(1, 3)
        this.likeClick(count)
      }
    },
  },
  lifetimes: {
    async attached() {
      const _canvas = await this.initCanvas()
      this.loadLikeIcons(_canvas)
    },
    ready() {},
    // 删除定时器，同时删除剩下的其他节点
    detached() {
      const { realHeight, realWidth } = this
      if (this.data.aniFrameId) {
        this.data._ctx.clearRect(0, 0, realWidth, realHeight)
        this.data._canvas.cancelAnimationFrame(this.data.aniFrameId)
        this.data.aniFrameId = null
      }
      this.data._queue = {}
    },
  },

  methods: {
    async initCanvas() {
      // 创建canvas上下文
      const res = await this.queryNode('#likestar')
      // console.error(res)
      if (!res[0]) {
        return
      }
      const _canvas = res[0].node
      this.data._canvas = _canvas
      if (!_canvas.getContext) {
        return
      }
      this.data._ctx = _canvas.getContext('2d')
      // 缩放canvs画布解决高清屏幕模糊问题
      const dpr = wx.getSystemInfoSync().pixelRatio

      _canvas.width = this.data.realWidth * dpr
      _canvas.height = this.data.realHeight * dpr

      this.data._ctx.scale(dpr, dpr)

      return _canvas
    },

    // 加载点赞点赞飘动icon
    loadLikeIcons(canvas) {
      for (let i = 1; i < 6; i++) {
        const likeImgae = canvas.createImage()
        likeImgae.src = `./images/thumb${i}.svg`
        likeImgae.onload = () => {
          this.data._likeImgList.push(likeImgae)
        }
      }
    },
    queryNode(selector) {
      return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery().in(this)
        query
          .select(selector)
          .fields({ node: true, size: true })
          .exec((res) => {
            resolve(res)
          })
      })
    },
    /**点赞个数变化 */
    handleLikeClick(e) {
      this.triggerEvent('thumbclick', e.detail)
    },

    getRandom(min, max) {
      return Math.random() * (max - min) + min
    },

    getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    /**点赞函数，参数 count 表示一次点赞同时出现的气泡数量*/
    likeClick(count) {
      const { length } = this.data._likeImgList
      const curId = new Date().getTime()
      for (let i = 0; i < count; i++) {
        const image = this.data._likeImgList[this.getRandomInt(0, length - 1)]
        const anmationData = {
          id: curId + i,
          timer: 0, // 定时器
          opacity: 1, //透明度
          pathData: this.getRandomInt(0, 1)
            ? this.generatePathData()
            : this.generatePathData(), // 路径
          image: image,
          factor: {
            speed: this.getRandom(0.01, 0.014), // 运动速度，值越小越慢
            t: 0, //  贝塞尔函数系数
          },
          width: this.data._iconWidth * this.getRandom(0.9, 1.1),
        }
        // console.error(this.data._canvas)
        if (Object.keys(this.data._queue).length > 0) {
          this.data._queue[anmationData.id] = anmationData
        } else {
          this.data._queue[anmationData.id] = anmationData
          this.data.aniFrameId = this.data._canvas.requestAnimationFrame(() => {
            this.bubbleAnimate()
          })
        }
      }
    },
    /**更新气泡的最新运动路径 */
    updatePath(data, factor) {
      const p0 = data[0]
      const p1 = data[1]
      const p2 = data[2]
      const p3 = data[3]

      const { t } = factor

      /*贝塞尔曲线，计算多项式系数*/
      const cx1 = 3 * (p1.x - p0.x)
      const bx1 = 3 * (p2.x - p1.x) - cx1
      const ax1 = p3.x - p0.x - cx1 - bx1

      const cy1 = 3 * (p1.y - p0.y)
      const by1 = 3 * (p2.y - p1.y) - cy1
      const ay1 = p3.y - p0.y - cy1 - by1

      const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x
      const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y
      return {
        x,
        y,
      }
    },

    generatePathData() {
      const { realWidth, realHeight } = this.data
      const p0 = {
        x: this.getRandom(0.6, 0.7) * realWidth,
        y: realHeight,
      }
      const p1 = {
        x: this.getRandom(-0.2, 0.5) * realWidth,
        y: this.getRandom(0.6, 0.85) * realHeight,
      }
      const p2 = {
        x: this.getRandom(0.7, 1) * realWidth,
        y: this.getRandom(0.25, 0.5) * realHeight,
      }
      const p3 = {
        x: this.getRandom(0.04, 0.7) * realWidth,
        y: this.getRandom(0, 0.15) * realHeight,
      }
      return [p0, p1, p2, p3]
    },
    /**点赞动画 */
    bubbleAnimate() {
      const { realHeight, realWidth } = this.data
      Object.keys(this.data._queue).forEach((key) => {
        const anmationData = this.data._queue[+key]
        const { x, y } = this.updatePath(
          anmationData.pathData,
          anmationData.factor
        )

        const { speed } = anmationData.factor
        anmationData.factor.t += speed

        let curWidth = anmationData.width
        // console.error(x, curWidth, y)

        if (y > 0.25 * realHeight) {
          curWidth = (realHeight - y) / 2.5
          curWidth = Math.min(anmationData.width, curWidth)
        } else {
          curWidth = (0.75 + y / realHeight) * anmationData.width
        }

        let curAlpha = anmationData.opacity
        curAlpha = y / realHeight
        curAlpha = Math.min(1, curAlpha)
        this.data._ctx.globalAlpha = curAlpha
        this.data._ctx.drawImage(
          anmationData.image,
          x - curWidth / 2,
          y,
          curWidth,
          curWidth
        )

        // this.data._ctx.drawImage(anmationData.image, 20, 20, curWidth, curWidth)
        // 贝塞尔曲线系数大于1，删除该气泡
        if (anmationData.factor.t > 1) {
          delete this.data._queue[anmationData.id]
        }
        if (y > realHeight) {
          delete this.data._queue[anmationData.id]
        }
        if (x < anmationData.width / 2) {
          delete this.data._queue[anmationData.id]
        }
      })
      if (Object.keys(this.data._queue).length > 0) {
        // 每20ms刷新一次图层
        this.data.aniFrameId = this.data._canvas.requestAnimationFrame(() => {
          this.data._ctx.clearRect(0, 0, realWidth, realHeight)
          this.bubbleAnimate()
        })
      } else {
        this.data._ctx.clearRect(0, 0, realWidth, realHeight)
        this.data._canvas.cancelAnimationFrame(this.data.aniFrameId)
        this.data.aniFrameId = null
      }
    },
  },
})
