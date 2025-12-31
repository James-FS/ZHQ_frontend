<template>
	<view class="container">
		<view class="content">
			<view class="icon">🚧</view>
			<view class="title">页面开发中</view>
			<view class="subtitle">敬请期待</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Schedule',
	data() {
		return {
			
		};
	}
};
</script>

<style scoped>
.container {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content {
	text-align: center;
}

.icon {
	font-size: 120rpx;
	margin-bottom: 40rpx;
}

.title {
	font-size: 48rpx;
	color: #ffffff;
	font-weight: bold;
	margin-bottom: 20rpx;
}

.subtitle {
	font-size: 32rpx;
	color: rgba(255, 255, 255, 0.8);
}
</style>