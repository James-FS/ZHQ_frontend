<template>
  <view class="content">
    <TabMenu
    :visible="menuVisible"
    @close="closeMenu">
    </TabMenu>
    <view class="detail-container">
      
      <!-- 标题图片 - 保持全屏 -->
      <view class="title">
        <img class="title-img" src="/static/img/微信图片_20251110104833_364_2.png" mode="aspectFill"></img>
        <view class="title-text">
  基于uniapp开发的跨平台移动应用实战
  <i class="iconfont icon-shoucang"
     :class="{'collected':collectionStatus}"
     @tap="toggleCollection"
  ></i>
  <i class="iconfont icon-gengduo" @tap="openMenu"></i>
</view>
      </view>

      <!-- 作者信息 - 有左右间距 -->
      <view class="author-info">
        <img class="author-avator" src="/static/icon/头像2.svg" mode="aspectFill"></img>
        <view class="author-name">废物利用</view>
      </view>

      <!-- 项目详情 - 有左右间距 -->
      <view class="detail-info">
        <text class="info-label">项目周期：</text>
        <!-- <text class="info-value">{{ teamDetails.value.project_cycle }}</text> -->
        <text class="info-label">招募人数：</text>
        <text class="info-value">5 人</text>
        <text class="info-label">预期成果：</text>
        <text class="info-value">发表一篇论文以及申请专利</text>
        <text class="info-label">所需技能：</text>
        <text class="info-value">发表一篇论文以及申请专利</text>
      </view>

      <!-- 详情内容 - 有左右间距 -->
      <view class="detail-context">
        <mp-html :content="html" />
        <application 
          :title="`${mockContext.title}`"
          :type="'green'"
        ></application>
      </view>

      <!-- 标签 - 有左右间距 -->
      <view class="detail-tag">
        <TagComponent
          v-for="(tags,index) in mockContext.tags"
          :key="index"
          :tagText="tags"
        ></TagComponent>
        <view style="margin-bottom: 1px;"><TagsInput v-model:tags="mockContext.tags" /></view>
      </view>
    </view>
    
  </view>
  
</template>

<script setup>
import { readonly, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import Application from '@/components/Application.vue';
import TagComponent from '@/components/Tags.vue';
import TagsInput from '@/components/TagsInput.vue'
import TabMenu from '../../components/Tab-menu.vue';
import { api } from '@/utils/index'
const teamID=ref(null);
const token = uni.getStorageSync('token');
let collectionStatus=ref()
let teamDetails=ref()
onLoad(async(options)=>{
  teamID.value=options.team_id;
  await fetchDetails();
  await getCollectionStatus();
})

const html = ref(`
  <div style="color:#333;line-height:1.9;">
    <h3 style="color:#333;">一、项目背景</h3>
    <p>随着高校创新创业教育深化，<strong>"一码多端"</strong>已成为移动应用的主流交付形态。本次实战以<strong>校园二手市集</strong>为真实业务场景，采用 <strong>uni-app + Vue3 + Vite + TypeScript</strong> 技术栈，<strong>4 周</strong>内完成一套可同时编译到微信、支付宝、H5、App 的商用级代码库，并输出学术论文与软件著作权。</p>

    <h3 style="color:#333;">二、技术选型与收益</h3>
    <ul>
      <li><strong>Vue3</strong>：Composition API 让复杂逻辑拆得开、合得拢；配合 <code>&lt;script setup&gt;</code> 语法糖，开发体验更轻量。</li>
      <li><strong>Vite</strong>：冷启动 & HMR 速度比 Webpack 快 3-5 倍，小程序端热重载稳定在 <strong>1 s 内</strong>。</li>
      <li><strong>TypeScript</strong>：组件 Props、Pinia State、API 接口全链路类型安全，<strong>编译期即可暴露 90% 低级错误</strong>。</li>
      <li><strong>uni-app</strong>：单仓代码 → 10+ 平台，<strong>条件编译</strong>解决平台差异，<strong>插件市场</strong>一键集成登录、支付、推送。</li>
    </ul>

    <h3 style="color:#333;">三、核心模块一览</h3>
    <table border="1" style="border-collapse:collapse;width:100%;text-align:center;margin:12px 0;">
      <tr style="background:#fafafa;">
        <th style="padding:8px;">模块</th><th style="padding:8px;">关键技术</th><th style="padding:8px;">交付物</th>
      </tr>
      <tr><td>用户中心</td><td>JWT 无感刷新、Vuex 持久化、微信一键登录</td><td>登录/注册/找回密码</td></tr>
      <tr><td>商品瀑布流</td><td>Intersection 懒加载、分页缓存、图片实时压缩</td><td>首屏列表、搜索、详情页</td></tr>
      <tr><td>订单&支付</td><td>微信支付 V3、异步通知、订单状态机</td><td>下单/支付/退款/状态回调</td></tr>
      <tr><td>发布上架</td><td>条件编译、原生插件、离线包方案</td><td>微信小程序包 + App 离线包</td></tr>
    </table>

    <h3 style="color:#333;">四、开发流程与规范</h3>
    <ol>
      <li><strong>需求评审</strong>：使用 Moqups 绘制低保真原型，确立 MVP 范围。</li>
      <li><strong>接口契约</strong>：Swagger + OpenAPI 3.0，前端通过 openapi-typescript 自动生成调用代码。</li>
      <li><strong>分支策略</strong>：Git Flow，main / dev / feature-xxx，合并必须经过 MR + Code Review。</li>
      <li><strong>自动化质检</strong>：Husky + lint-staged 在 commit 阶段跑 ESLint + Prettier，保证风格统一。</li>
      <li><strong>多端构建</strong>：一条命令同时输出微信小程序、H5、App 三端包，CI 自动上传体验版1。</li>
    </ol>

    <h3 style="color:#333;">五、性能与体验优化</h3>
    <ul>
      <li><strong>图片</strong>：WebP + 腾讯云数据万象「<code>?imageView2/2/w/750</code>」实时压缩，平均节省 62% 流量。</li>
      <li><strong>包体积</strong>：Vite terser + 按需引入 lodash-es，主包缩小 0.8 MB。</li>
      <li><strong>首屏渲染</strong>：骨架屏 + 离线缓存，小程序首屏时间从 1.8 s → 0.9 s。</li>
      <li><strong>列表滚动</strong>：虚拟滚动 + 分页缓存，千级商品无白屏、无闪动。</li>
    </ul>

    <h3 style="color:#333;">六、4 周里程碑</h3>
    <p><strong>Week1</strong> 需求锁定 + 技术底座搭建<br>
       <strong>Week2</strong> 用户/商品/订单接口联调<br>
       <strong>Week3</strong> 支付闭环 + 性能优化<br>
       <strong>Week4</strong> 多端打包 + 论文/专利材料输出</p>

    <h3 style="color:#333;">七、预期成果</h3>
    <ul>
      <li>✅ 可运行的跨端应用（微信、支付宝、H5、App）</li>
      <li>✅ 源代码、接口文档、部署脚本全套交付</li>
      <li>✅ EI 会议论文 1 篇（已拟题）</li>
      <li>✅ 软件著作权 1 项（材料已准备）</li>
    </ul>
  </div>
`)

let mockContext=ref({
  title:'CST2023企业',
  context:'html',
  avator:'/static/img/wechat_2025-11-05_103123_039.png',
  name:'作者名称',
  tags:['大创', '移动开发', 'UniApp']
});

let mockAuthor=ref({
  name:'作者名称',
  avator:'/static/img/wechat_2025-11-05_103123_039.png',
});

let menuVisible=ref(false)
const closeMenu=()=>{
  menuVisible.value=false;
}
const openMenu=()=>{
  menuVisible.value=true;
}

async function fetchDetails(){
  try{
    const res = await api.getTeamDetails(teamID.value);
    if(res.code===0){
      teamDetails.value=res.data;
      console.log("details",teamDetails);
    }
    else{
      throw new Error(res.message);
    }
  }catch(err){
     uni.showToast({
            title: err.message || '网络错误',
            icon: 'none'
        });
  }
}

async function getCollectionStatus(){
  try{
    const res = await api.getCollectionStatus(teamID.value);
    // res 本身就是 { code, data, message }
    if(res.code === 0) {
      collectionStatus.value = res.data.CollectionStatus;
    }
    else{
      uni.showToast({
        title: res.message || '获取收藏状态失败',
        icon: 'none'
      });
    }
  }catch(err){
    console.log(err);
    uni.showToast({
      title:'网络错误',
      icon: 'none'
    });
  }
}

async function addCollection(){
  try {
    console.log("添加收藏 team_id:", teamID.value);
    const res = await api.addCollection(teamID.value);
    if(res.code === 0) {
      collectionStatus.value = true;
      uni.showToast({
        title: '收藏成功',
        icon: 'success'
      });
    } else {
      throw new Error(res.message);
    }
  } catch(err) {
    console.error('收藏失败:', err);
    uni.showToast({
      title: err.message || '操作失败',
      icon: 'none'
    });
  }
}

async function removeCollection(){
  try {
    console.log("取消收藏 team_id:", teamID.value);
    const res = await api.removeCollection(teamID.value);
    if(res.code === 0) {
      collectionStatus.value = false;
      uni.showToast({
        title: '取消收藏成功',
        icon: 'success'
      });
    } else {
      throw new Error(res.message);
    }
  } catch(err) {
    console.error('取消收藏失败:', err);
    uni.showToast({
      title: err.message || '操作失败',
      icon: 'none'
    });
  }
}

async function toggleCollection(){
  if(collectionStatus.value) {
    await removeCollection();
  } else {
    await addCollection();
  }
}
</script>

<style lang="scss" scoped>
/* ========== 外层容器 ========== */
.content {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: stretch;
  background-color: #ffffff;
  min-height: 90vh;
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  overflow-x: hidden; /* ✨ 防止横向滚动 */
}

/* ========== 详情容器 ========== */
.detail-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: stretch;
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  gap: 20rpx;
}

/* ========== 标题区域 - 全屏显示 ========== */
.title {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  .title-img {
    width: 100%;
    height: 400rpx;
    object-fit: cover;
    display: block;
    margin: 0;
    padding: 0;
  }

   .title-text {
    display: flex;
    flex-direction: row;
    font-size: var(--title-size);
    font-weight: bold;
    color: var(--title-color);
    padding: 20rpx;
    line-height: 1.4;
    word-break: break-word;
    justify-content: space-between;
    align-items: center;
    .iconfont.icon-gengduo{
      font-size:54rpx;
    }
    .iconfont.icon-shoucang{
      color: #333; // 未收藏时的默认颜色
      &.collected{
        color: #e09846; // 收藏后填充此颜色
      }
    }
  }
}

/* ========== 作者信息 - 有左右间距 ========== */
.author-info {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  gap: 20rpx;
  padding: 20rpx;
  margin: 0;
  box-sizing: border-box;

  .author-avator {
    height: 120rpx;
    width: 120rpx;
    border-radius: 12rpx;
    flex-shrink: 0;
    object-fit: cover;
  }

  .author-name {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--title-color);
  }
}

/* ========== 项目详情 - 有左右间距 ========== */
.detail-info {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  gap: 16rpx;
  padding: 0 20rpx;
  margin: 0;
  box-sizing: border-box;

  .info-label {
    font-weight: bold;
    color: var(--accent-color);
    font-size: 28rpx;
  }

  .info-value {
    color: #666;
    font-size: 26rpx;
    line-height: 1.6;
    word-break: break-word;
  }
}

/* ========== 详情内容 - 有左右间距 ========== */
.detail-context {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: 0 20rpx;
  margin: 0;
  box-sizing: border-box;
  gap: 20rpx;
}

/* ========== 标签区域 - 有左右间距 ========== */
.detail-tag {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  gap: 12rpx;
  padding: 0 20rpx 20rpx 20rpx;
  margin: 0;
  box-sizing: border-box;
  justify-content: center;  
}
</style>