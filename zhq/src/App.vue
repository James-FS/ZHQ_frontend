<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/*每个页面公共css */

/*导入iconfont图标库 */
@import './static/iconfont/iconfont.css'; 
@import './static/styles/global.css';
page {                 /* 小程序根节点 */
  background: #f5f5f5; /* 统一背景颜色 */
}

/* .pageHolder{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
} */

</style>
