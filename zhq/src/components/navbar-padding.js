export default {
  data() {
    return {
      contentPaddingTop: 0
    }
  },
  
  onLoad() {
    this.setContentPadding()
  },
  
  methods: {
    setContentPadding() {
      const systemInfo = uni.getSystemInfoSync()
      const statusBarHeight = systemInfo.statusBarHeight || 0
      this.contentPaddingTop = statusBarHeight + 44 + 10
    }
  }
}