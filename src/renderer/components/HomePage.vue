<template>
  <el-container>
    <el-container>
      <div class="aside">
        <ul>
          <li title="搜索" @click="addTab('SearchPage')">
            <i class="el-icon-search"></i>
          </li>
          <li title="导入数据" @click="addTab('ImportPage')">
            <i class="el-icon-upload"></i>
          </li>
          <li title="导入文件路径" @click="addTab('ImportPathsPage')">
            <i class="el-icon-tickets"></i>
          </li>
          <li @click="addTab('FormConfigPage')">
            <i class="el-icon-setting"></i>
          </li>
        </ul>
      </div>
      <!-- <el-aside width="100px">
        sdfsdf
      </el-aside> -->
      <el-container>
        <el-main>
          <el-tabs v-model="activeName" type="card" closable @tab-remove="removeTab">
            <el-tab-pane v-for="(item) in tabs" :key="item.name" :label="item.title" :name="item.name">
              <component :is=item.content></component>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
    <el-footer class="fix-footer" style="height: 25px;">Footer</el-footer>
  </el-container>
</template>

<script>
import SearchPage from './SearchPage'
import ImportPage from './ImportPage'
import ImportPathsPage from './ImportPathsPage'
import FormConfigPage from './FormConfigPage'

export default {
  name: 'home-page',
  components: { SearchPage, ImportPage, ImportPathsPage, FormConfigPage },
  data () {
    return {
      activeName: '1',
      /*
        {
          title: 'Tab 1',
          name: '1',
          content: SearchPage
        }
      */
      tabs: []
    }
  },
  mounted () {
    // 加载模板数据
    this.$store.dispatch('loadTemplates')
  },
  methods: {
    handleClick (key, keyPath) {
      // console.log(key, keyPath)
    },
    addTab (name) {
      var obj = {}
      let tabs = this.tabs
      let exist = false
      if (name === 'SearchPage') {
        obj = { title: '搜索', name: 'SearchPage', content: SearchPage }
      } else if (name === 'ImportPage') {
        obj = { title: '导入数据', name: 'ImportPage', content: ImportPage }
      } else if (name === 'ImportPathsPage') {
        obj = { title: '导入文件路径', name: 'ImportPathsPage', content: ImportPathsPage }
      } else if (name === 'FormConfigPage') {
        obj = { title: '配置表单', name: 'FormConfigPage', content: FormConfigPage }
      } else {
        return false
      }

      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].name === name) {
          exist = true
          break
        }
      }
      if (!exist) {
        this.tabs.push(obj)
      }
      this.activeName = obj.name
    },
    removeTab (targetName) {
      let tabs = this.tabs
      let activeName = this.activeName
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
              activeName = nextTab.name
            }
          }
        })
      }

      this.activeName = activeName
      this.tabs = tabs.filter(tab => tab.name !== targetName)
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-size: 16px;
}

.aside {
  /* background-color: #333333; */
  background-color: #adadad;
  color: #ffffff;
}

.aside ul {
  font-size: 28px;
  list-style: none;
  padding: 0 12px;
  margin: 0;
}

.aside ul li {
  margin: 15px 0px;
  cursor: pointer;
}

.el-main {
  padding: 5px;
}

.el-tabs__item {
  height: 30px;
  line-height: 30px;
  font-size: 12px;
}

.el-footer {
  background-color: rgb(64, 158, 255);
  color: white;
  line-height: 25px;
}

.fix-footer {
  position: fixed;
  width: 100%;
  bottom: 0;
}
</style>


