<template>
  <el-form-item>
    <el-input v-if="child.type == 'input'" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]"></el-input>
    <el-switch v-else-if="child.type == 'switch'" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]"></el-switch>
    <el-select v-else-if="child.type == 'select'" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]">
      <el-option v-for="param in child.params" :key="param.value" :label="param.text" :value="param.value"></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
export default {
  props: [''],
  data () {
    return {

    }
  }

}
</script>

