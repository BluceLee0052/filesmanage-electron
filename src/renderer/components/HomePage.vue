<template>
  <el-container>
    <el-main>
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane name="1">
          <span slot="label">
            <i class="el-icon-search"></i> 搜索</span>
          <search-page></search-page>
        </el-tab-pane>
        <el-tab-pane name="2">
          <span slot="label">
            <i class="el-icon-upload"></i> 导入管理</span>
          <import-page></import-page>
        </el-tab-pane>
        <el-tab-pane name="3">
          <span slot="label">
            <i class="el-icon-setting"></i> 表单配置</span>
          <form-config-page></form-config-page>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import SearchPage from './SearchPage'
import ImportPage from './ImportPage'
import FormConfigPage from './FormConfigPage'

export default {
  name: 'landing-page',
  components: { SearchPage, ImportPage, FormConfigPage },
  data () {
    return {
      activeName: '1'
    }
  },
  methods: {
    handleClick (key, keyPath) {
      // console.log(key, keyPath)
    }
  }
}
</script>

<style>
</style>


