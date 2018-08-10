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
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script>
import SearchPage from './SearchPage/SearchPage'
import ImportPage from './ImportPage/ImportPage'

export default {
  name: 'landing-page',
  components: { SearchPage, ImportPage },
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


