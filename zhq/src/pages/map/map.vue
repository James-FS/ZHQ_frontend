<template>
	<view class="map-page">
		<!-- 地图组件 -->
		<map id="campusMap" class="map" :latitude="centerLat" :longitude="centerLng" :scale="scale" :markers="markers"
			:polyline="polyline" :show-location="true" @tap="onMapTap" @regionchange="onRegionChange">
			<!-- 缩放控制按钮 -->
			<cover-view class="zoom-controls">
				<cover-view class="zoom-btn" @tap="zoomIn">+</cover-view>
				<cover-view class="zoom-btn" @tap="zoomOut">-</cover-view>
			</cover-view>

			<!-- 定位按钮 -->
			<cover-view class="location-btn" @tap="backToCenter">
				<cover-image src="/static/icon/定位.svg" class="location-icon"></cover-image>
			</cover-view>
		</map>

		<!-- 底部操作面板 -->
		<view class="bottom-panel">
			<!-- 路线信息显示 -->
			<view class="route-info" v-if="routeInfo.distance">
				<text class="info-text">距离: {{ routeInfo.distance }}米</text>
				<text class="info-text">预计: {{ routeInfo.duration }}分钟</text>
			</view>

			<!-- 起点终点选择区域 -->
			<view class="point-selector">
				<view class="point-item">
					<text class="point-label">起点</text>
					<view :class="['point-btn', selectMode === 'start' ? 'active' : '', startPoint ? 'selected' : '']"
						@click="selectStartPoint">
						<text v-if="!startPoint">点击地图选择起点</text>
						<text v-else>{{ startPoint.lat.toFixed(4) }}, {{ startPoint.lng.toFixed(4) }}</text>
					</view>
				</view>

				<view class="point-item">
					<text class="point-label">终点</text>
					<view :class="['point-btn', selectMode === 'end' ? 'active' : '', endPoint ? 'selected' : '']"
						@click="selectEndPoint">
						<text v-if="!endPoint">点击地图选择终点</text>
						<text v-else>{{ endPoint.lat.toFixed(4) }}, {{ endPoint.lng.toFixed(4) }}</text>
					</view>
				</view>
			</view>

			<!-- 操作按钮组 -->
			<view class="action-buttons">
				<button class="action-btn clear-btn" @click="clearRoute" :disabled="!startPoint && !endPoint">
					清除
				</button>
				<button class="action-btn nav-btn" @click="startNavigation" :disabled="!startPoint || !endPoint">
					开始导航
				</button>
			</view>
		</view>

		<!-- 加载提示 -->
		<view class="loading-mask" v-if="isLoading">
			<view class="loading-content">
				<text class="loading-text">正在规划路线...</text>
			</view>
		</view>
	</view>
</template>

<script>
import { post } from '@/utils/request.js';

export default {
	name: 'Map',
	data() {
		return {
			// 地图中心坐标（校园中心）
			centerLat: 23.040636,
			centerLng: 113.370359,
			// 缩放级别（16适合显示校园范围）
			scale: 16,
			// 最小和最大缩放级别（限制地图范围）
			minScale: 14,
			maxScale: 18,

			// 当前选择模式：'start'(选择起点) | 'end'(选择终点) | null
			selectMode: null,

			// 起点坐标
			startPoint: null,

			// 终点坐标
			endPoint: null,

			// 地图标记点数组
			markers: [],

			// 导航路线数组
			polyline: [],

			// 路线信息（距离、时长）
			routeInfo: {
				distance: null,
				duration: null
			},

			// 加载状态
			isLoading: false
		};
	},

	onLoad() {
		// 页面加载时的初始化
		console.log('地图页面加载完成');
	},

	methods: {
		/**
		 * 点击"选择起点"按钮
		 * 进入起点选择模式
		 */
		selectStartPoint() {
			if (this.selectMode === 'start') {
				// 如果已经是起点选择模式，则取消
				this.selectMode = null;
				uni.showToast({
					title: '已取消选择',
					icon: 'none'
				});
			} else {
				// 进入起点选择模式
				this.selectMode = 'start';
				uni.showToast({
					title: '请在地图上点击选择起点',
					icon: 'none',
					duration: 2000
				});
			}
		},

		/**
		 * 点击"选择终点"按钮
		 * 进入终点选择模式
		 */
		selectEndPoint() {
			if (this.selectMode === 'end') {
				// 如果已经是终点选择模式，则取消
				this.selectMode = null;
				uni.showToast({
					title: '已取消选择',
					icon: 'none'
				});
			} else {
				// 进入终点选择模式
				this.selectMode = 'end';
				uni.showToast({
					title: '请在地图上点击选择终点',
					icon: 'none',
					duration: 2000
				});
			}
		},

		/**
		 * 地图点击事件
		 * 根据当前模式设置起点或终点
		 */
		onMapTap(e) {
			// 获取点击位置的经纬度
			const { latitude, longitude } = e.detail;

			if (this.selectMode === 'start') {
				// 设置起点
				this.startPoint = {
					lat: latitude,
					lng: longitude
				};
				this.selectMode = null; // 退出选择模式
				this.updateMarkers(); // 更新地图标记
				uni.showToast({
					title: '起点已设置',
					icon: 'success'
				});
			} else if (this.selectMode === 'end') {
				// 设置终点
				this.endPoint = {
					lat: latitude,
					lng: longitude
				};
				this.selectMode = null; // 退出选择模式
				this.updateMarkers(); // 更新地图标记
				uni.showToast({
					title: '终点已设置',
					icon: 'success'
				});
			}
		},

		/**
		 * 更新地图标记点
		 * 根据起点和终点生成markers数组
		 */
		updateMarkers() {
			const newMarkers = [];

			// 添加起点标记（绿色）
			if (this.startPoint) {
				newMarkers.push({
					id: 1,
					latitude: this.startPoint.lat,
					longitude: this.startPoint.lng,
					iconPath: '/static/icon/start.png',
					width: 40,
					height: 40,
					callout: {
						content: '起点',
						color: '#ffffff',
						fontSize: 12,
						borderRadius: 5,
						bgColor: '#4CAF50',
						padding: 5,
						display: 'ALWAYS'
					}
				});
			}

			// 添加终点标记（红色）
			if (this.endPoint) {
				newMarkers.push({
					id: 2,
					latitude: this.endPoint.lat,
					longitude: this.endPoint.lng,
					iconPath: '/static/icon/end.png',
					width: 40,
					height: 40,
					callout: {
						content: '终点',
						color: '#ffffff',
						fontSize: 12,
						borderRadius: 5,
						bgColor: '#F44336',
						padding: 5,
						display: 'ALWAYS'
					}
				});
			}

			this.markers = newMarkers;
		},

		/**
 * 开始导航
 * 调用后端接口获取路线规划
 */
		async startNavigation() {
			if (!this.startPoint || !this.endPoint) {
				uni.showToast({
					title: '请先选择起点和终点',
					icon: 'none'
				});
				return;
			}

			try {
				this.isLoading = true;

				console.log('发送导航请求:', {
					startLat: this.startPoint.lat,
					startLng: this.startPoint.lng,
					endLat: this.endPoint.lat,
					endLng: this.endPoint.lng
				});

				const res = await post('/api/v1/route', {
					startLat: this.startPoint.lat,
					startLng: this.startPoint.lng,
					endLat: this.endPoint.lat,
					endLng: this.endPoint.lng
				});

				this.isLoading = false;

				console.log('收到导航响应:', res);

				if (res.code === 0 && res.data) {
					// ⚠️ 添加：检查路径数据
					if (!res.data.path || res.data.path.length === 0) {
						throw new Error('未获取到有效路径数据');
					}

					console.log('路径点数量:', res.data.path.length);
					console.log('前3个路径点:', res.data.path.slice(0, 3));

					this.routeInfo = {
						distance: res.data.distance,
						duration: res.data.duration
					};

					this.drawRoute(res.data.path);

					uni.showToast({
						title: '路线规划成功',
						icon: 'success'
					});
				} else {
					throw new Error(res.message || '路线规划失败');
				}

			} catch (error) {
				this.isLoading = false;
				console.error('导航失败:', error);
				uni.showModal({
					title: '导航失败',
					content: error.message || '请稍后重试',
					showCancel: false
				});
			}
		},

		/**
		 * 绘制导航路线
		 */
		drawRoute(path) {
			if (!path || path.length === 0) {
				console.error('路径数据为空');
				uni.showToast({
					title: '路径数据为空',
					icon: 'none'
				});
				return;
			}

			console.log('开始绘制路线，点数:', path.length);

			// 转换为polyline格式
			const points = path.map(point => ({
				latitude: point.lat,
				longitude: point.lng
			}));

			console.log('前3个转换后的点:', points.slice(0, 3));

			// ⚠️ 修改：优化polyline配置
			this.polyline = [{
				points: points,
				color: '#FF5722',
				width: 8,           // 增加线宽以便更明显
				dottedLine: false,  // 实线
				arrowLine: true,
				borderColor: '#ffffff',
				borderWidth: 2
			}];

			console.log('polyline已设置:', this.polyline);

			// ⚠️ 添加：强制触发地图更新
			this.$nextTick(() => {
				console.log('地图应已更新polyline');
			});
		},


		/**
		 * 清除路线
		 * 重置所有选择和路线数据
		 */
		clearRoute() {
			uni.showModal({
				title: '确认清除',
				content: '是否清除当前的起点、终点和路线？',
				success: (res) => {
					if (res.confirm) {
						// 清除所有数据
						this.startPoint = null;
						this.endPoint = null;
						this.markers = [];
						this.polyline = [];
						this.routeInfo = {
							distance: null,
							duration: null
						};
						this.selectMode = null;

						uni.showToast({
							title: '已清除',
							icon: 'success'
						});
					}
				}
			});
		},

		/**
		 * 回到用户当前位置
		 * 获取用户实时位置并将地图中心设置到该位置
		 */
		backToCenter() {
			// 微信小程序使用wx.getLocation()
			wx.getLocation({
				type: 'gcj02', // 返回国测局坐标
				isHighAccuracy: false,
				success: (res) => {
					this.centerLat = res.latitude;
					this.centerLng = res.longitude;
					this.scale = 16;

					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);

					uni.showToast({
						title: '已定位到当前位置',
						icon: 'success'
					});
				},
				fail: (error) => {
					console.error('定位失败:', error);
					uni.showToast({
						title: '定位失败，请检查权限',
						icon: 'none'
					});
				}
			});
		},

		/**
		 * 放大地图
		 */
		zoomIn() {
			if (this.scale < this.maxScale) {
				this.scale++;
			} else {
				uni.showToast({
					title: '已达到最大缩放',
					icon: 'none'
				});
			}
		},

		/**
		 * 缩小地图
		 */
		zoomOut() {
			if (this.scale > this.minScale) {
				this.scale--;
			} else {
				uni.showToast({
					title: '已达到最小缩放',
					icon: 'none'
				});
			}
		},

		/**
		 * 地图区域变化事件
		 * 限制用户不能移动到校园范围外
		 */
		onRegionChange(e) {
			// 可以在这里添加地图范围限制逻辑
			// 例如：检查中心点是否超出校园范围，如果超出则自动拉回
			const { latitude, longitude } = e.detail.centerLocation || {};

			if (latitude && longitude) {
				// 定义校园范围（根据实际情况调整）
				const maxDistance = 0.01; // 约1公里范围
				const latDiff = Math.abs(latitude - 23.040636);
				const lngDiff = Math.abs(longitude - 113.370359);

				// 如果超出范围，自动回到中心（可选功能）
				if (latDiff > maxDistance || lngDiff > maxDistance) {
					// 这里可以添加自动回中心的逻辑
					// this.backToCenter();
				}
			}
		}
	}
};
</script>

<style scoped>
/* 页面容器 */
.map-page {
	width: 100%;
	height: 100vh;
	position: relative;
	overflow: hidden;
}

/* 地图组件样式 */
.map {
	width: 100%;
	height: 100%;
}

/* 缩放控制按钮 */
.zoom-controls {
	position: absolute;
	right: 20rpx;
	top: 200rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.zoom-btn {
	width: 70rpx;
	height: 70rpx;
	background: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

/* 定位按钮 */
.location-btn {
	position: absolute;
	right: 20rpx;
	top: 100rpx;
	width: 70rpx;
	height: 70rpx;
	background: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
}

.location-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 底部操作面板 */
.bottom-panel {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	padding: 30rpx;
	z-index: 100;
}

/* 路线信息显示 */
.route-info {
	display: flex;
	justify-content: space-around;
	padding: 20rpx;
	background: #E3F2FD;
	border-radius: 15rpx;
	margin-bottom: 20rpx;
}

.info-text {
	font-size: 28rpx;
	color: #1976D2;
	font-weight: bold;
}

/* 起点终点选择区域 */
.point-selector {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	margin-bottom: 20rpx;
}

.point-item {
	display: flex;
	align-items: center;
	gap: 20rpx;
}

.point-label {
	font-size: 28rpx;
	font-weight: bold;
	color: #333333;
	width: 80rpx;
}

.point-btn {
	flex: 1;
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 10rpx;
	border: 2rpx solid #e0e0e0;
	font-size: 24rpx;
	color: #666666;
	text-align: center;
	transition: all 0.3s;
}

/* 激活状态（正在选择） */
.point-btn.active {
	background: #FFF3E0;
	border-color: #FF9800;
	color: #FF9800;
	animation: pulse 1s infinite;
}

/* 已选择状态 */
.point-btn.selected {
	background: #E8F5E9;
	border-color: #4CAF50;
	color: #4CAF50;
}

/* 脉冲动画 */
@keyframes pulse {

	0%,
	100% {
		transform: scale(1);
	}

	50% {
		transform: scale(1.02);
	}
}

/* 操作按钮组 */
.action-buttons {
	display: flex;
	gap: 20rpx;
}

.action-btn {
	flex: 1;
	padding: 15rpx;
	border-radius: 10rpx;
	font-size: 24rpx;
	font-weight: bold;
	border: none;
}

/* 清除按钮 */
.clear-btn {
	background: #EEEEEE;
	color: #666666;
}

.clear-btn[disabled] {
	opacity: 0.5;
}

/* 导航按钮 */
.nav-btn {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
}

.nav-btn[disabled] {
	background: #CCCCCC;
	opacity: 0.6;
}

/* 加载遮罩 */
.loading-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.loading-content {
	padding: 40rpx 60rpx;
	background: #ffffff;
	border-radius: 20rpx;
}

.loading-text {
	font-size: 28rpx;
	color: #333333;
}
</style>