<template>
  <view class="select-demo">
    <view class="demo-header">
      <text class="demo-title">选择框组件演示</text>
    </view>
    
    <scroll-view class="demo-content" scroll-y>
      <!-- 基础用法 -->
      <view class="demo-section">
        <text class="section-title">基础用法</text>
        
        <common-select
          label="城市选择"
          placeholder="请选择城市"
          v-model:value="form.city"
          :options="cityOptions"
          :required="true"
          @change="onCityChange"
        />
        
        <common-select
          label="学历"
          placeholder="请选择学历"
          v-model:value="form.education"
          :options="educationOptions"
          :required="true"
        />
        
        <common-select
          label="职位类型"
          placeholder="请选择职位"
          v-model:value="form.position"
          :options="positionOptions"
        />
      </view>
      
      <!-- 多选模式 -->
      <view class="demo-section">
        <text class="section-title">多选模式</text>
        <text class="section-desc">支持同时选择多个选项，可通过maxOptions限制最多选择数量</text>
        
        <common-select
          label="技能选择"
          placeholder="可选择多项技能"
          v-model:value="form.skills"
          :options="skillOptions"
          :multiple="true"
          :required="true"
        />
        
        <common-select
          label="兴趣爱好"
          placeholder="最多选择3项"
          v-model:value="form.hobbies"
          :options="hobbyOptions"
          :multiple="true"
          :maxOptions="3"
        />
      </view>
      
      <!-- 不同尺寸 -->
      <view class="demo-section">
        <text class="section-title">不同尺寸</text>
        
        <common-select
          label="小尺寸"
          size="small"
          placeholder="小尺寸选择框"
          v-model:value="form.sizeSmall"
          :options="sizeOptions"
        />
        
        <common-select
          label="中尺寸"
          size="medium"
          placeholder="中尺寸选择框"
          v-model:value="form.sizeMedium"
          :options="sizeOptions"
        />
        
        <common-select
          label="大尺寸"
          size="large"
          placeholder="大尺寸选择框"
          v-model:value="form.sizeLarge"
          :options="sizeOptions"
        />
      </view>
      
      <!-- 不同边框风格 -->
      <view class="demo-section">
        <text class="section-title">不同边框风格</text>
        
        <common-select
          label="线条风格"
          border-style="line"
          placeholder="线条风格选择框"
          v-model:value="form.lineStyle"
          :options="styleOptions"
        />
        
        <common-select
          label="卡片风格"
          border-style="card"
          placeholder="卡片风格选择框"
          v-model:value="form.cardStyle"
          :options="styleOptions"
        />
      </view>
      
      <!-- 特殊状态 -->
      <view class="demo-section">
        <text class="section-title">特殊状态</text>
        
        <common-select
          label="不可清空"
          placeholder="不显示清空按钮"
          v-model:value="form.noClear"
          :options="statusOptions"
          :clearable="false"
        />
      </view>
      
      <!-- 自定义选项演示 -->
      <view class="demo-section">
        <text class="section-title">自定义选项</text>
        <text class="section-desc">用户可以在下拉框底部添加新选项，新增的选项会自动被添加到列表中</text>
        
        <common-select
          label="标签"
          placeholder="选择或添加标签"
          v-model:value="form.tags"
          :options="tagOptions"
          :addable="true"
          :multiple="true"
          @option-added="handleAddTag"
        />
        
        <common-select
          label="部门"
          placeholder="选择或添加部门"
          v-model:value="form.department"
          :options="departmentOptions"
          :addable="true"
          @option-added="handleAddDepartment"
        />
      </view>
      
      <!-- 表单验证演示 -->
      <view class="demo-section">
        <text class="section-title">表单验证</text>
        <text class="section-desc">点击"验证表单"按钮检查必填项是否已完成</text>
        
        <common-select
          label="必填项"
          placeholder="此项为必填"
          v-model:value="form.required"
          :options="requiredOptions"
          :required="true"
          ref="requiredSelect"
        />
        
        <view class="demo-buttons">
          <button class="demo-btn" @click="validateForm">验证表单</button>
          <button class="demo-btn" @click="resetForm">重置表单</button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import CommonSelect from '@/components/Select.vue'

export default {
  name: 'SelectDemo',
  
  components: {
    CommonSelect
  },
  
  data() {
    return {
      form: {
        city: '',
        education: '',
        position: '',
        skills: [],
        hobbies: [],
        sizeSmall: '',
        sizeMedium: '',
        sizeLarge: '',
        lineStyle: '',
        cardStyle: '',
        noClear: 'option3',
        tags: [],
        department: '',
        required: ''
      },
      
      // 各种选项数据
      cityOptions: [
        { label: '北京', value: 'bj' },
        { label: '上海', value: 'sh' },
        { label: '广州', value: 'gz' },
        { label: '深圳', value: 'sz' },
        { label: '杭州', value: 'hz' },
        { label: '成都', value: 'cd' },
        { label: '西安', value: 'xa' },
        { label: '南京', value: 'nj' }
      ],
      
      educationOptions: [
        { label: '高中及以下', value: 'high_school' },
        { label: '大专', value: 'college' },
        { label: '本科', value: 'bachelor' },
        { label: '硕士', value: 'master' },
        { label: '博士', value: 'phd' }
      ],
      
      positionOptions: [
        { label: '前端工程师', value: 'frontend' },
        { label: '后端工程师', value: 'backend' },
        { label: '全栈工程师', value: 'fullstack' },
        { label: '产品经理', value: 'pm' },
        { label: '设计师', value: 'designer' },
        { label: '运营', value: 'operation' }
      ],
      
      skillOptions: [
        { label: 'HTML/CSS', value: 'html_css' },
        { label: 'JavaScript', value: 'js' },
        { label: 'Vue', value: 'vue' },
        { label: 'React', value: 'react' },
        { label: 'Angular', value: 'angular' },
        { label: 'Node.js', value: 'nodejs' },
        { label: 'Python', value: 'python' },
        { label: 'Java', value: 'java' }
      ],
      
      hobbyOptions: [
        { label: '阅读', value: 'reading' },
        { label: '游戏', value: 'gaming' },
        { label: '运动', value: 'sports' },
        { label: '摄影', value: 'photography' },
        { label: '旅游', value: 'travel' },
        { label: '音乐', value: 'music' },
        { label: '绘画', value: 'painting' },
        { label: '电影', value: 'movie' }
      ],
      
      sizeOptions: [
        { label: '选项一', value: 'opt1' },
        { label: '选项二', value: 'opt2' },
        { label: '选项三', value: 'opt3' }
      ],
      
      styleOptions: [
        { label: '风格选项A', value: 'style_a' },
        { label: '风格选项B', value: 'style_b' },
        { label: '风格选项C', value: 'style_c' }
      ],
      
      statusOptions: [
        { label: '状态选项1', value: 'option1' },
        { label: '状态选项2', value: 'option2' },
        { label: '状态选项3', value: 'option3' }
      ],
      
      tagOptions: [
        { label: '紧急', value: 'urgent' },
        { label: '普通', value: 'normal' },
        { label: '低优先级', value: 'low' },
        { label: '已完成', value: 'completed' }
      ],
      
      departmentOptions: [
        { label: '技术部', value: 'tech' },
        { label: '产品部', value: 'product' },
        { label: '运营部', value: 'operation' },
        { label: '人力资源', value: 'hr' }
      ],
      
      requiredOptions: [
        { label: '必填项选项1', value: 'req1' },
        { label: '必填项选项2', value: 'req2' },
        { label: '必填项选项3', value: 'req3' }
      ]
    }
  },
  
  methods: {
    onCityChange(value) {
      console.log('城市选择改变:', value)
    },
    
    handleAddTag(newOption) {
      // 向 tagOptions 中添加新选项
      this.tagOptions.push(newOption)
      // 自动选中新添加的选项
      if (Array.isArray(this.form.tags)) {
        this.form.tags.push(newOption.value)
      }
      uni.showToast({
        title: `新标签"${newOption.label}"已添加`,
        icon: 'success',
        duration: 1500
      })
    },
    
    handleAddDepartment(newOption) {
      // 向 departmentOptions 中添加新选项
      this.departmentOptions.push(newOption)
      // 自动选中新添加的选项
      this.form.department = newOption.value
      uni.showToast({
        title: `新部门"${newOption.label}"已添加`,
        icon: 'success',
        duration: 1500
      })
    },
    
    validateForm() {
      let isValid = true
      
      // 验证必填项
      if (this.$refs.requiredSelect && !this.$refs.requiredSelect.validate()) {
        isValid = false
      }
      
      if (isValid) {
        uni.showToast({
          title: '表单验证通过',
          icon: 'success'
        })
      } else {
        uni.showToast({
          title: '表单验证失败',
          icon: 'error'
        })
      }
    },
    
    resetForm() {
      this.form = {
        city: '',
        education: '',
        position: '',
        skills: [],
        hobbies: [],
        sizeSmall: '',
        sizeMedium: '',
        sizeLarge: '',
        lineStyle: '',
        cardStyle: '',
        noClear: 'option3',
        tags: [],
        department: '',
        required: ''
      }
      
      uni.showToast({
        title: '表单已重置',
        icon: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-demo {
  min-height: 100vh;
  background: #F5F5F5;
}

.demo-header {
  background: #FFFFFF;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.demo-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
}

.demo-content {
  padding: 40rpx 30rpx;
  max-width: 750rpx;
  margin: 0 auto;
  box-sizing: border-box;
}

.demo-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.section-title {
  display: block;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 40rpx;
  padding-bottom: 20rpx;
  border-bottom: 4rpx solid #F0F0F0;
}

.section-desc {
  display: block;
  font-size: 28rpx;
  color: #666666;
  margin-bottom: 30rpx;
  padding: 20rpx;
  background-color: #F8F9FA;
  border-radius: 8rpx;
  border-left: 6rpx solid #409EFF;
}

.demo-buttons {
  display: flex;
  gap: 24rpx;
  margin-top: 40rpx;
}

.demo-btn {
  flex: 1;
  height: 88rpx;
  background: $uni-color-primary;
  color: #FFFFFF;
  border: none;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
