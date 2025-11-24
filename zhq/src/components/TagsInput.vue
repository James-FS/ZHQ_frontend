<!-- TagsInput.vue -->
<template>
  <view class="tag-wrapper">
    <!-- ① 添加框 -->
    <view class="tag-component">
      <text class="tag-icon">+</text>
      <input
        ref="inputRef"
        v-model="newTag"
        class="tag-input"
        placeholder="添加标签"
        :style="{ width: inputWidth }"
        @input="updateInputWidth"
        @confirm="addTag"
        @blur="addTag"
      />
    </view>

    <!-- ② 已有标签：flex 流，自动换行 -->
    <view class="tag-list">
      <view
        v-for="(t, i) in tags"
        :key="i"
        class="tag-component"
      >
        <!-- 非编辑态 -->
        <view v-if="editIndex !== i" class="tag" @tap="onEdit(i)">
          <text class="tag-icon">#</text>
          <text class="tag-text">{{ t }}</text>
          <text class="tag-delete" @tap.stop="deleteTag(i)">×</text>
        </view>
        <!-- 编辑态 -->
        <input
          v-else
          v-model="draft"
          :focus="true"
          class="tag-input"
          @confirm="onUpdate(i)"
          @blur="onUpdate(i)"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({ 
  modelValue: { 
    type: Array, 
    default: () => [] 
  } 
})

const emit = defineEmits(['update:modelValue'])

const tags = ref([...props.modelValue])
const newTag = ref('')
const editIndex = ref(-1)
const draft = ref('')
const inputRef = ref(null)
const inputWidth = ref('120rpx')


watch(() => props.modelValue, (newVal) => {
  tags.value = [...newVal]
}, { deep: true })


watch(tags, (newTags) => {
  emit('update:modelValue', [...newTags])
}, { deep: true })

onMounted(() => {
  updateInputWidth()
})

function updateInputWidth() {
  if (!inputRef.value) return
  
  const input = inputRef.value.$el || inputRef.value
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  const computedStyle = window.getComputedStyle(input)
  ctx.font = `${computedStyle.fontSize} ${computedStyle.fontFamily}`
  
  const text = newTag.value || '添加标签'
  const metrics = ctx.measureText(text)
  
  let width = Math.ceil(metrics.width) * 2 + 20
  width = Math.max(200, Math.min(width, 520))
  
  inputWidth.value = width + 'rpx'
}

function addTag() {
  const txt = newTag.value.trim()
  if (txt && !tags.value.includes(txt)) {
    tags.value.push(txt)
    emit('update:modelValue', [...tags.value])
  }
  newTag.value = ''
  setTimeout(() => updateInputWidth(), 0)
}

function deleteTag(i) {
  tags.value.splice(i, 1)
  emit('update:modelValue', [...tags.value])
}

function onEdit(i) {
  editIndex.value = i
  draft.value = tags.value[i]
}

function onUpdate(i) {
  const txt = draft.value.trim()
  if (txt && !tags.value.includes(txt)) {
    tags.value[i] = txt
    emit('update:modelValue', [...tags.value])
  }
  editIndex.value = -1
}
</script>

<style scoped>
/* 最外层：flex 流，自动换行 */
.tag-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  row-gap: 32rpx;
  column-gap: 24rpx;
  margin: 0;
  padding: 0;
}

/* 标签统一样式 */
.tag-component {
  margin-left: 10rpx;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38rpx;
  padding: 0 10rpx;
  border-radius: 10rpx;
  background: #e4eef4;
  border: 2rpx solid #c2d9ff;
  color: #2b6de9;
  font-size: 28rpx;
  line-height: 1;
}

.tag-icon {
  margin-right: 12rpx;
  font-weight: 600;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40rpx;
}

.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  max-width: 600rpx;
  min-width: 100rpx;
  height: 40rpx;
}

.tag-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex-shrink: 1;
  display: flex;
  align-items: center;
  height: 40rpx;
}

.tag-delete {
  margin-left: 16rpx;
  margin-right: -12rpx;
  font-weight: bold;
  cursor: pointer;
  font-size: 30rpx;
  line-height: 1;
  transition: color 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40rpx;
}

.tag-input {
  border: none;
  background: transparent;
  font-size: 14px;
  color: inherit;
  outline: none;
  padding: 0;
  margin: 0;
  transition: width 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40rpx;
}

.tag-input::placeholder {
  color: #999;
}

.tag-list {
  display: contents;
}
</style>