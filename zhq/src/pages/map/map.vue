<template>
	<view class="map-page">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input-container">
				<input 
					class="search-input"
					type="text"
					placeholder="搜索地点..."
					v-model="searchKeyword"
					@input="onSearchInput"
				/>
				<image v-if="searchKeyword" src="/static/icon/搜索.svg" class="clear-icon" @tap="clearSearch"></image>
			</view>
			<!-- 搜索结果下拉框 -->
			<view class="search-results" v-if="searchKeyword && filteredLocations.length > 0">
				<view class="search-result-item" v-for="location in filteredLocations" :key="location.id" @click="selectLocation(location)">
					<text class="location-name">{{ location.name }}</text>
					<text class="location-category">{{ getCategoryLabel(location.category) }}</text>
				</view>
			</view>
			<view class="search-results empty" v-if="searchKeyword && filteredLocations.length === 0">
				<text>未找到相关地点</text>
			</view>
		</view>

		<!-- 分类筛选按钮 -->
		<view class="category-filter">
			<view class="filter-btn" :class="{ active: selectedCategory === null }" @tap="filterByCategory(null)">全部</view>
			<view class="filter-btn" :class="{ active: selectedCategory === 'teaching' }" @tap="filterByCategory('teaching')">教学楼</view>
			<view class="filter-btn" :class="{ active: selectedCategory === 'dorm' }" @tap="filterByCategory('dorm')">宿舍</view>
			<view class="filter-btn" :class="{ active: selectedCategory === 'dining' }" @tap="filterByCategory('dining')">餐厅</view>
			<view class="filter-btn" :class="{ active: selectedCategory === 'library' }" @tap="filterByCategory('library')">图书馆</view>
			<view class="filter-btn" :class="{ active: selectedCategory === 'sports' }" @tap="filterByCategory('sports')">运动</view>
			<view class="filter-btn" :class="{ active: selectedCategory === 'lab' }" @tap="filterByCategory('lab')">实验楼</view>
		</view>

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

			<!-- 回到校园中心按钮 -->
			<cover-view class="back-center-btn" @tap="backToSchoolCenter">
				<cover-image src="/static/icon/回到中心.svg" class="back-center-icon"></cover-image>
			</cover-view>
		</map>

		<!-- 地点详情弹窗 -->
		<view v-if="selectedLocationDetail" class="location-detail-popup">
			<view class="detail-overlay" @click="closeLocationDetail"></view>
			<view class="detail-content">
				<view class="detail-header">
					<text class="detail-title">{{ selectedLocationDetail.name }}</text>
					<view class="detail-category-badge">{{ getCategoryLabel(selectedLocationDetail.category) }}</view>
					<text class="close-icon" @tap="closeLocationDetail">✕</text>
				</view>
				<view class="detail-body">
					<view class="detail-item">
						<text class="detail-label">坐标:</text>
						<text class="detail-value">{{ selectedLocationDetail.latitude.toFixed(6) }}, {{ selectedLocationDetail.longitude.toFixed(6) }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">类型:</text>
						<text class="detail-value">{{ getCategoryLabel(selectedLocationDetail.category) }}</text>
					</view>
				</view>
				<view class="detail-actions">
					<button class="action-btn nav-from-here" @click="navigateFromHere(selectedLocationDetail)">从这里出发</button>
					<button class="action-btn nav-to-here" @click="navigateToHere(selectedLocationDetail)">导航到这里</button>
				</view>
			</view>
		</view>

		<!-- 起点选择菜单 -->
		<view v-if="showStartPointMenu" class="modal-overlay" @click="showStartPointMenu = false">
			<view class="menu-content" @click.stop>
				<view class="menu-title">选择起点</view>
				<view class="menu-items">
					<view class="menu-item" @tap="useCurrentLocationAsStart">
						<text class="menu-item-text">📍 使用当前位置</text>
					</view>
					<view class="menu-item" @tap="selectFromLocationListAsStart">
						<text class="menu-item-text">🏢 从地点列表选择</text>
					</view>
					<view class="menu-item" @tap="selectFromMapAsStart">
						<text class="menu-item-text">🗺️ 在地图上选择</text>
					</view>
				</view>
				<view class="menu-cancel" @tap="showStartPointMenu = false">取消</view>
			</view>
		</view>

		<!-- 终点选择菜单 -->
		<view v-if="showEndPointMenu" class="modal-overlay" @click="showEndPointMenu = false">
			<view class="menu-content" @click.stop>
				<view class="menu-title">选择终点</view>
				<view class="menu-items">
					<view class="menu-item" @tap="selectFromLocationListAsEnd">
						<text class="menu-item-text">🏢 从地点列表选择</text>
					</view>
					<view class="menu-item" @tap="selectFromMapAsEnd">
						<text class="menu-item-text">🗺️ 在地图上选择</text>
					</view>
				</view>
				<view class="menu-cancel" @tap="showEndPointMenu = false">取消</view>
			</view>
		</view>

		<!-- 地点列表弹窗 -->
		<view v-if="showLocationList" class="location-list-popup">
			<view class="location-list-overlay" @click="closeLocationList"></view>
			<view class="location-list-content">
				<view class="list-header">
					<text class="list-title">选择{{ listSelectMode === 'start' ? '起点' : '终点' }}</text>
					<text class="close-icon" @tap="closeLocationList">✕</text>
				</view>
				<view class="list-items">
					<view v-if="locations.length === 0" class="empty-list">
						<text>暂无地点数据</text>
					</view>
					<view v-else class="list-item" v-for="location in locations" :key="location.id" @tap="selectLocationFromList(location)">
						<view class="list-item-name">{{ location.name }}</view>
						<view class="list-item-category">{{ getCategoryLabel(location.category) }}</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部操作面板 -->
		<view class="bottom-panel" v-if="!selectedLocationDetail">
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
import { post, get } from '@/utils/request.js';

export default {
	name: 'Map',
	data() {
		return {
			// 地图中心坐标（学校中心）
			centerLat: 23.040639,
			centerLng: 113.370367,
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

			// 显示起点选择菜单
			showStartPointMenu: false,

			// 显示终点选择菜单
			showEndPointMenu: false,

			// 显示地点列表（选择起点或终点）
			showLocationList: false,
			listSelectMode: null,  // 'start' 或 'end'

			// 地图标记点数组
			markers: [],

			// 校园地点列表
			locations: [],

			// 搜索关键词
			searchKeyword: '',

			// 分类筛选
			selectedCategory: null,

			// 所有地点分类标签
			categoryLabels: {
				library: '图书馆',
				commercial: '商业中心',
				dining: '餐厅',
				dorm: '宿舍',
				lab: '实验楼',
				sports: '运动',
				teaching: '教学楼'
			},

			// 地点分类颜色
			categoryColors: {
				library: '#5C6BC0',
				commercial: '#FF6F00',
				dining: '#D32F2F',
				dorm: '#00897B',
				lab: '#7B1FA2',
				sports: '#1976D2',
				teaching: '#00AA00'
			},

			// 选中的地点详情
			selectedLocationDetail: null,

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
		this.loadLocations();
		this.updateCampusMarkers();
		// 自动获取用户当前位置作为起点
		this.getUserLocation();
	},

	computed: {
		// 计算过滤后的地点列表
		filteredLocations() {
			let filtered = this.locations;

			// 按分类筛选
			if (this.selectedCategory) {
				filtered = filtered.filter(loc => loc.category === this.selectedCategory);
			}

			// 按搜索关键词筛选
			if (this.searchKeyword) {
				filtered = filtered.filter(loc =>
					loc.name.toLowerCase().includes(this.searchKeyword.toLowerCase())
				);
			}

			return filtered;
		}
	},

	methods: {
		/**
		 * 加载校园地点数据
		 */
		async loadLocations() {
			try {
				const res = await get('/api/v1/locations');

				console.log('API响应:', res);
				console.log('res.data 类型:', Array.isArray(res.data), res.data);

				if (res.code === 0) {
					// 处理两种可能的数据格式
					let locationData = [];
					if (Array.isArray(res.data)) {
						locationData = res.data;
					} else if (res.data && Array.isArray(res.data.data)) {
						// 如果是分页格式 { data: [...], pagination: {...} }
						locationData = res.data.data;
					}

					if (locationData.length > 0) {
						this.locations = locationData;
						this.updateCampusMarkers();
						console.log('地点数据加载成功:', locationData.length, '个地点');
					} else {
						console.warn('地点数据为空');
						uni.showToast({
							title: '暂无地点数据',
							icon: 'none'
						});
					}
				} else {
					console.error('获取地点数据失败:', res);
					uni.showToast({
						title: '加载地点失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('加载地点异常:', error);
				uni.showToast({
					title: '网络错误',
					icon: 'none'
				});
			}
		},

		/**
		 * 更新校园标记点（地点标记）
		 */
		updateCampusMarkers() {
			const newMarkers = [];
			
			// 获取过滤后的地点列表
			const displayLocations = this.filteredLocations;

			// 为每个地点添加标记
			displayLocations.forEach((location, index) => {
				const categoryColor = this.categoryColors[location.category] || '#FF5722';
				
				newMarkers.push({
					id: 1000 + location.id, // 避免与起终点标记冲突
					latitude: location.latitude,
					longitude: location.longitude,
					title: location.name,
					iconPath: this.generateMarkerIcon(location.category),
					width: 35,
					height: 35,
					callout: {
						content: location.name,
						color: '#ffffff',
						fontSize: 12,
						borderRadius: 4,
						bgColor: categoryColor,
						padding: 8,
						display: 'BYCLICK' // 点击显示
					}
				});
			});

			// 添加起点标记
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

			// 添加终点标记
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
		 * 获取分类标签
		 */
		getCategoryLabel(category) {
			return this.categoryLabels[category] || category;
		},

		/**
		 * 关闭地点详情弹窗
		 */
		closeLocationDetail() {
			this.selectedLocationDetail = null;
		},

		/**
		 * 根据分类生成标记图标（可以返回不同颜色的图标）
		 */
		generateMarkerIcon(category) {
			// 这里可以返回不同分类的不同图标
			// 暂时都返回默认图标，实际可以根据category返回不同的图标
			return '/static/icon/定位位置.svg';
		},

		/**
		 * 搜索地点输入事件
		 */
		onSearchInput() {

			if (this.searchKeyword) {
				this.selectedCategory = null;  // 清除分类筛选
			}
			this.updateCampusMarkers();
		},

		/**
		 * 清除搜索
		 */
		clearSearch() {
			this.searchKeyword = '';
			this.updateCampusMarkers();
		},

		/**
		 * 按分类筛选
		 */
		filterByCategory(category) {
			this.selectedCategory = category;
			this.updateCampusMarkers();
		},

		/**
		 * 选择地点（来自搜索结果）
		 */
		selectLocation(location) {
			this.selectedLocationDetail = location;
			this.searchKeyword = ''; // 清除搜索框
			// 地图中心移动到该地点
			this.centerLat = location.latitude;
			this.centerLng = location.longitude;
			this.scale = 17;
		},

		/**
		 * 从选中的地点出发进行导航
		 */
		navigateFromHere(location) {
			this.startPoint = {
				lat: location.latitude,
				lng: location.longitude
			};
			this.selectedLocationDetail = null;
			this.selectMode = 'end';
			uni.showToast({
				title: '请在地图上选择终点',
				icon: 'none',
				duration: 2000
			});
		},

		/**
		 * 导航到选中的地点
		 */
		navigateToHere(location) {
			this.endPoint = {
				lat: location.latitude,
				lng: location.longitude
			};
			this.selectedLocationDetail = null;
			this.selectMode = 'start';
			uni.showToast({
				title: '请在地图上选择起点',
				icon: 'none',
				duration: 2000
			});
		},

		/**
		 * 点击"选择起点"按钮
		 * 显示起点选择菜单
		 */
		selectStartPoint() {
			this.showStartPointMenu = true;
		},

		/**
		 * 用户位置作为起点
		 */
		useCurrentLocationAsStart() {
			this.getUserLocation((lat, lng) => {
				this.startPoint = {
					lat: lat,
					lng: lng
				};
				this.showStartPointMenu = false;
				this.updateCampusMarkers();
				uni.showToast({
					title: '已设置为当前位置',
					icon: 'success'
				});
			});
		},

		/**
		 * 从地点列表选择起点
		 */
		selectFromLocationListAsStart() {
			this.showStartPointMenu = false;
			this.listSelectMode = 'start';
			this.showLocationList = true;
		},

		/**
		 * 从地图选择起点
		 */
		selectFromMapAsStart() {
			this.showStartPointMenu = false;
			this.selectMode = 'start';
			uni.showToast({
				title: '请在地图上点击选择起点',
				icon: 'none',
				duration: 2000
			});
		},

		/**
		 * 点击"选择终点"按钮
		 * 显示终点选择菜单
		 */
		selectEndPoint() {
			this.showEndPointMenu = true;
		},

		/**
		 * 从地点列表选择终点
		 */
		selectFromLocationListAsEnd() {
			this.showEndPointMenu = false;
			this.listSelectMode = 'end';
			this.showLocationList = true;
		},

		/**
		 * 从地图选择终点
		 */
		selectFromMapAsEnd() {
			this.showEndPointMenu = false;
			this.selectMode = 'end';
			uni.showToast({
				title: '请在地图上点击选择终点',
				icon: 'none',
				duration: 2000
			});
		},

		/**
		 * 地图点击事件
		 * 根据当前模式设置起点或终点，或展示地点详情
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
				this.updateCampusMarkers(); // 更新地图标记
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
				this.updateCampusMarkers(); // 更新地图标记
				uni.showToast({
					title: '终点已设置',
					icon: 'success'
				});
			}
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
		 * 回到学校中心
		 * 将地图中心设置到学校中心坐标
		 */
		backToSchoolCenter() {
			this.centerLat = 23.040639;
			this.centerLng = 113.370367;
			this.scale = 16;
			uni.showToast({
				title: '已返回校园中心',
				icon: 'success'
			});
		},

		/**
		 * 回到用户当前位置
		 * 获取用户实时位置并将地图中心设置到该位置
		 */
		backToCenter() {
			this.getUserLocation((lat, lng) => {
				this.centerLat = lat;
				this.centerLng = lng;
				this.scale = 16;
				uni.showToast({
					title: '已定位到当前位置',
					icon: 'success'
				});
			});
		},

		/**
		 * 获取用户当前位置
		 */
		getUserLocation(callback) {
			// 微信小程序使用wx.getLocation()
			wx.getLocation({
				type: 'gcj02', // 返回国测局坐标
				isHighAccuracy: true,  // 获取更精确的定位
				success: (res) => {
					console.log('当前位置的经度：' + res.longitude);
					console.log('当前位置的纬度：' + res.latitude);
					if (callback) {
						callback(res.latitude, res.longitude);
					}
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
		 * 从地点列表选择地点
		 */
		selectLocationFromList(location) {
			if (this.listSelectMode === 'start') {
				this.startPoint = {
					lat: location.latitude,
					lng: location.longitude
				};
			} else if (this.listSelectMode === 'end') {
				this.endPoint = {
					lat: location.latitude,
					lng: location.longitude
				};
			}
			this.showLocationList = false;
			this.listSelectMode = null;
			this.updateCampusMarkers();
			uni.showToast({
				title: '已选择 ' + location.name,
				icon: 'success'
			});
		},

		/**
		 * 关闭地点列表
		 */
		closeLocationList() {
			this.showLocationList = false;
			this.listSelectMode = null;
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
	display: flex;
	flex-direction: column;
}

/* 地图组件样式 */
.map {
	width: 100%;
	flex: 1;
	position: relative;
}

/* 搜索栏 */
.search-bar {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	z-index: 80;
	background: transparent;
	padding: 15rpx 20rpx;
}

.search-input-container {
	display: flex;
	align-items: center;
	background: #ffffff;
	border-radius: 25rpx;
	padding: 10rpx 20rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.search-input {
	flex: 1;
	font-size: 28rpx;
	outline: none;
	border: none;
	background: transparent;
	height: 45rpx;
	line-height: 45rpx;
	color: #333;
}

.search-input::placeholder {
	color: #999;
}

.clear-icon {
	width: 30rpx;
	height: 30rpx;
	margin-left: 10rpx;
	cursor: pointer;
}

/* 搜索结果下拉框 */
.search-results {
	background: #ffffff;
	border-radius: 15rpx;
	margin-top: 10rpx;
	box-shadow: 0 4rpx 15rpx rgba(0, 0, 0, 0.15);
	max-height: 400rpx;
	overflow-y: auto;
	z-index: 81;
}

.search-result-item {
	padding: 20rpx;
	border-bottom: 1rpx solid #f0f0f0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	transition: background 0.2s;
}

.search-result-item:hover {
	background: #f9f9f9;
}

.search-result-item:last-child {
	border-bottom: none;
}

.location-name {
	font-size: 28rpx;
	color: #333;
	flex: 1;
}

.location-category {
	font-size: 22rpx;
	color: #999;
	background: #f0f0f0;
	padding: 5rpx 12rpx;
	border-radius: 8rpx;
	margin-left: 10rpx;
}

.search-results.empty {
	padding: 20rpx;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}

/* 分类筛选按钮 */
.category-filter {
	position: absolute;
	top: 110rpx;
	left: 0;
	right: 0;
	display: flex;
	gap: 10rpx;
	padding: 10rpx 20rpx;
	overflow-x: auto;
	background: rgba(255, 255, 255, 0.95);
	z-index: 70;
	white-space: nowrap;
}

/* 隐藏滚动条 */
.category-filter::-webkit-scrollbar {
	display: none;
}

.filter-btn {
	padding: 8rpx 16rpx;
	background: #f5f5f5;
	border-radius: 20rpx;
	font-size: 24rpx;
	color: #666;
	border: 1rpx solid #e0e0e0;
	flex-shrink: 0;
	transition: all 0.3s;
	cursor: pointer;
}

.filter-btn.active {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #fff;
	border-color: transparent;
}

/* 地点详情弹窗 */
.location-detail-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 200;
	display: flex;
	align-items: flex-end;
}

.detail-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	cursor: pointer;
}

.detail-content {
	position: relative;
	background: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	width: 100%;
	padding: 40rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	z-index: 201;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.detail-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #333;
	flex: 1;
}

.detail-category-badge {
	background: #667eea;
	color: #fff;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-size: 22rpx;
	margin: 0 15rpx;
	white-space: nowrap;
}

.close-icon {
	font-size: 40rpx;
	color: #999;
	cursor: pointer;
	padding: 0 10rpx;
	line-height: 40rpx;
}

.detail-body {
	margin-bottom: 30rpx;
}

.detail-item {
	display: flex;
	padding: 15rpx 0;
	border-bottom: 1rpx solid #f0f0f0;
}

.detail-label {
	font-size: 26rpx;
	color: #666;
	width: 100rpx;
	font-weight: bold;
}

.detail-value {
	font-size: 26rpx;
	color: #333;
	flex: 1;
	word-break: break-all;
}

.detail-actions {
	display: flex;
	gap: 15rpx;
}

.action-btn {
	flex: 1;
	padding: 15rpx;
	border-radius: 10rpx;
	font-size: 28rpx;
	font-weight: bold;
	border: none;
	cursor: pointer;
}

.nav-from-here {
	background: #FFF3E0;
	color: #FF9800;
}

.nav-to-here {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: #ffffff;
}

/* 缩放控制按钮 */
.zoom-controls {
	position: absolute;
	right: 20rpx;
	top: 380rpx;
	display: flex;
	flex-direction: column;
	gap: 20rpx;
	z-index: 60;
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
	cursor: pointer;
}

/* 定位按钮 */
.location-btn {
	position: absolute;
	right: 20rpx;
	top: 200rpx;
	width: 70rpx;
	height: 70rpx;
	background: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
	z-index: 60;
	cursor: pointer;
}

.location-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 回到中心按钮 */
.back-center-btn {
	position: absolute;
	right: 20rpx;
	top: 285rpx;
	width: 70rpx;
	height: 70rpx;
	background: #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
	z-index: 60;
	cursor: pointer;
	pointer-events: auto;
}

.back-center-icon {
	width: 40rpx;
	height: 40rpx;
}

/* 底部操作面板 */
.bottom-panel {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
	padding: 30rpx;
	z-index: 100;
	max-height: 50vh;
	overflow-y: auto;
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
	cursor: pointer;
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
	cursor: pointer;
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

/* 模态框遮罩 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	z-index: 300;
	display: flex;
	align-items: flex-end;
}

/* 起点选择菜单 */
.menu-content {
	width: 100%;
	background: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	padding: 30rpx;
	box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.menu-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
	margin-bottom: 20rpx;
	text-align: center;
}

.menu-items {
	margin-bottom: 20rpx;
}

.menu-item {
	padding: 20rpx;
	background: #f5f5f5;
	border-radius: 15rpx;
	margin-bottom: 15rpx;
	text-align: center;
	cursor: pointer;
	transition: all 0.3s;
}

.menu-item:active {
	background: #e0e0e0;
	transform: scale(0.98);
}

.menu-item-text {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
}

.menu-cancel {
	padding: 15rpx;
	background: #ffffff;
	border: 2rpx solid #e0e0e0;
	border-radius: 10rpx;
	text-align: center;
	font-size: 28rpx;
	color: #666;
	cursor: pointer;
}

/* 地点列表弹窗 */
.location-list-popup {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 300;
	display: flex;
	align-items: flex-end;
}

.location-list-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(0, 0, 0, 0.5);
	cursor: pointer;
}

.location-list-content {
	position: relative;
	width: 100%;
	background: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	max-height: 70vh;
	display: flex;
	flex-direction: column;
	z-index: 301;
}

.list-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 30rpx;
	border-bottom: 1rpx solid #f0f0f0;
	flex-shrink: 0;
}

.list-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333;
}

.list-items {
	flex: 1;
	overflow-y: auto;
	padding: 20rpx;
}

.list-item {
	padding: 20rpx;
	background: #f9f9f9;
	border-radius: 12rpx;
	margin-bottom: 12rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	transition: all 0.3s;
}

.list-item:active {
	background: #e8e8e8;
	transform: scale(0.98);
}

.list-item-name {
	font-size: 28rpx;
	color: #333;
	font-weight: bold;
	flex: 1;
}

.list-item-category {
	font-size: 22rpx;
	color: #999;
	background: #f0f0f0;
	padding: 5rpx 12rpx;
	border-radius: 8rpx;
	margin-left: 10rpx;
}

/* 空列表提示 */
.empty-list {
	padding: 60rpx 20rpx;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}
</style>