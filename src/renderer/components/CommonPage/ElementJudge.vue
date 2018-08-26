<template>
  <el-form-item v-if="!data.hidden" :label="data.name || data.fieldName" :rules="data.rules">
    <el-input v-if="data.type == 'input'" v-model="currentValue"></el-input>
    <el-switch v-else-if="data.type == 'switch'" v-model="currentValue"></el-switch>
    <el-select v-else-if="data.type == 'select'" v-model="currentValue">
      <el-option v-for="param in data.params" :key="param.value" :label="param.text" :value="param.value"></el-option>
      <el-option v-for="param in data.selectValues" :key="param" :label="param" :value="param"></el-option>
    </el-select>
    <el-select v-else-if="data.type == 'selectCreate'" multiple filterable allow-create default-first-option v-model="currentValue">
      <el-option v-for="param in data.params" :key="param.value" :label="param.text" :value="param.value"></el-option>
    </el-select>
    <el-radio-group v-else-if="data.type == 'radio'" v-model="currentValue" :size="data.size">
      <el-radio-button v-for="param in data.params" :key="param.value" :label="param.text" :value="param.value"></el-radio-button>
    </el-radio-group>
    <slot></slot>
  </el-form-item>
</template>

<script>
export default {
  props: ['value', 'data'],
  data () {
    return {

    }
  },
  computed: {
    currentValue: {
      // 动态计算currentValue的值
      get () {
        return this.value // 将props中的value赋值给currentValue
      },
      set (val) {
        this.$emit('input', val) // 通过$emit触发父组件
      }
    }
  }
}
</script>


