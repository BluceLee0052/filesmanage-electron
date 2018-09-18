<template>
  <div>
    <el-input placeholder="请输入内容" v-model="search.content" @focus="listenerEnter(true)" @blur="listenerEnter(false)" class="input-with-select">
      <el-select v-model="search.type" slot="prepend" placeholder="请选择">
        <el-option label="编号" value="code"></el-option>
        <el-option label="名称" value="name"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="searchBtn()"></el-button>
    </el-input>

    <div class="table-class">
      <el-table v-loading="loading" :data="page.datas" :border="true" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="40" inline class="demo-table-expand">
              <el-form-item label="盘符">
                <span>{{ props.row.drive }}:\</span>
              </el-form-item>
              <el-form-item label="编号">
                <span>{{ props.row.code }}</span>
              </el-form-item>
              <el-form-item label="名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="文件大小">
                <span>{{ handleFileSize(props.row.size) }}</span>
              </el-form-item>
              <el-form-item label="路径">
                <span>{{ props.row.path }}</span>
              </el-form-item>
              <el-form-item label="导入时间">
                <span>{{ handleTime(props.row.createdAt) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="编号" prop="code">
        </el-table-column>
        <el-table-column label="名称" prop="name">
        </el-table-column>
        <el-table-column label="文件大小" prop="size" :formatter="formatterFileSize">
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination-class">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.curPage" :page-sizes="pageSizes" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      search: {
        type: 'code',
        content: ''
      },
      pageSizes: [5, 10],
      page: {
        total: 0,
        curPage: 1,
        pageSize: 5,
        datas: []
      }
    }
  },
  methods: {
    listenerEnter (isListener) { // 监听回车键
      isListener ? document.addEventListener('keydown', this._handleEnter, false)
        : document.removeEventListener('keydown', this._handleEnter, false)
    },
    searchBtn () { // 查询按钮
      this._wrapPageData()
    },
    formatterFileSize (row, col, cellVal, index) {
      return this.handleFileSize(cellVal)
    },
    handleFileSize (bytes) { // 处理文件大小单位
      if (bytes === 0) return '0 B'
      const k = 1024 // or 1000
      const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return i === 0 ? `${bytes} ${sizes[i]}` : parseInt((bytes / Math.pow(k, i)) * 10) / 10 + ' ' + sizes[i]
    },
    handleTime (time) {
      var date = new Date(time)
      return date.toLocaleString()
    },
    handleSizeChange (val) {
      this.page.pageSize = val
      this._wrapPageData()
    },
    handleCurrentChange (val) {
      this.page.curPage = val
      this._wrapPageData()
    },
    _handleEnter (event) { // 处理回车事件
      if (event.keyCode === 13) {
        this._wrapPageData()
      }
    },
    _wrapPageData (sort) { // 封装分页数据
      var that = this
      var condition = {}

      this.loading = true // 加载数据遮罩

      if (this.search.content === '') {
        condition = {}
      } else {
        condition[this.search.type] = new RegExp(`${this.search.content}`)
      }
      this.$db.count(condition, function (wrong, count) {
        that.page.total = count
      })

      this.$db.find(condition)
        .sort(!sort ? { createTime: -1 } : sort)
        .skip((this.page.curPage - 1) * this.page.pageSize)
        .limit(this.page.pageSize)
        .exec(function (wrong, docs) {
          that.page.datas = docs
          that.loading = false // 取消数据遮罩
        })
    }
  }
}
</script>

<style>
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.table-class {
  margin-top: 30px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.pagination-class {
  margin: 10px auto;
}
</style>
