<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="盘符" prop="drive">
      <el-select v-model="ruleForm.drive" placeholder="请选择盘符">
        <el-option v-for="drive in drives" :key="drive" :label="drive+':\\'" :value="drive"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="导入文件" prop="selectFilePaths">
      <div id="filesDiv">
        <div id="dropbox" @mouseout="focusFilesDiv=false" @mouseover="focusFilesDiv=true" @click.prevent="selectFiles($event)">将文件或文件夹拖到此处（或点击选择）</div>
        <input type="file" id="selectFiles" @change="handleSelectFiles($event)" multiple webkitdirectory />
      </div>
      <div id="filesPathDiv">
        <el-input type="textarea" v-model="ruleForm.selectFilePaths" :rows="11" placeholder="所选文件路径" :readonly="true" resize="none">
        </el-input>
        <el-radio-group v-model="pathTxtRadio" size="mini">
          <el-radio-button label="1">追加</el-radio-button>
          <el-radio-button label="2">替换</el-radio-button>
        </el-radio-group>
      </div>
    </el-form-item>
    <el-form-item>
      <el-button type="danger" @click="clearDriveData('ruleForm')">清空盘符数据</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">导入</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
const fs = require('fs')
const pathUtil = require('path')
export default {
  data () {
    return {
      loading: null, // $loading对象
      focusFilesDiv: false,
      pathTxtRadio: '1',
      drives: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      files: [],
      ruleForm: {
        drive: 'A',
        selectFilePaths: ''
      },
      rules: {
        drive: [{ required: true, message: '请选择盘符', trigger: 'change' }],
        selectFilePaths: [{ required: true, message: ' ', trigger: 'change' }]
      }
    }
  },
  watch: {
    focusFilesDiv: function (newVal, oldVal) {
      if (newVal) {
        this._setStyle({ id: 'dropbox', borderColor: 'blue' })
      } else {
        this._setStyle({ id: 'dropbox', borderColor: 'lightblue' })
      }
    }
  },
  mounted: function () {
    var filesDiv = document.querySelector('#filesDiv')
    filesDiv.addEventListener('dragenter', this.onDragenter, false) // 进入
    filesDiv.addEventListener('dragover', this.onDragover, false) // 拖动着悬停在上方
    filesDiv.addEventListener('dragleave', this.onDragleave, false) // 离开
    filesDiv.addEventListener('drop', this.onDrop, false) // 放下
  },
  methods: {
    onDragenter (e) {
      e.stopPropagation()
      e.preventDefault()
      this.focusFilesDiv = true
    },
    onDragover (e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },
    onDragleave (e) {
      e.stopPropagation()
      e.preventDefault()
      this.focusFilesDiv = false
    },
    onDrop (e) { // 拖拽文件，放开鼠标后执行操作
      e.stopPropagation()
      e.preventDefault()
      this.focusFilesDiv = false
      this.handleSelectFiles(e)
      return false
    },
    selectFiles (e) { // 点击选择文件
      document.querySelector('#selectFiles').click()
    },
    handleSelectFiles (e) { // 处理选择或拖拽的文件
      var selectFiles = []
      var filePaths = []
      const dt = e.dataTransfer
      if (dt) { // 拖拽
        selectFiles = dt.files
      } else {
        selectFiles = document.querySelector('#selectFiles').files
      }

      if (this.pathTxtRadio === '1') { // 判断文件是追加还是替换处理
        this.files = Array.from(this.files).concat(Array.from(selectFiles))
      } else {
        this.files = Array.from(selectFiles)
      }

      for (var file of this.files) {
        filePaths.push(file.path)
      }

      this.ruleForm.selectFilePaths = filePaths.join('\n')
    },
    _setStyle ({ id, borderColor }) {
      var oFile = document.querySelector(`#${id}`)
      if (borderColor) {
        oFile.style.borderColor = borderColor
      }
    },
    _readDirFileList (path, returnFilesList) { // 遍历文件夹
      const that = this
      const files = fs.readdirSync(path)
      files.forEach(function (fileName, index) {
        const realPath = pathUtil.join(path, fileName)
        const stat = fs.statSync(realPath)
        if (stat.isFile()) {
          returnFilesList.push(that._wrapFileObj({ size: stat.size, fileName: fileName, path: realPath }))
        } else {
          that._readDirFileList(realPath, returnFilesList)
        }
      })
    },
    _wrapFileObj ({ size = 0, path = '', fileName = '' }) { // 封装文件对象
      const dir = path.split(pathUtil.sep)
      const regCode = /\w{2,}-\d{3,}/i
      const regName = /^[\u4e00-\u9fa5]+$/
      var dirLevel = dir.length - 2 // 文件夹的层级，里面包含文件名，需要去掉
      // 编号
      var code = fileName.match(regCode)
      if (code == null) { // 通过文件名，没有找到编号，就通过父文件夹找
        code = dir[dirLevel].match(regCode)
        dirLevel -= 1
      }
      var name = dir[dirLevel].match(regName) // 作者
      if (name == null) {
        for (let i = 1; i < dirLevel; i++) {
          dirLevel -= 1
          name = dir[dirLevel].match(regName)
          if (name != null) return
        }
      }

      return {
        drive: this.ruleForm.drive,
        name: name != null ? name[0] : '',
        code: code != null ? code[0] : '',
        size: size,
        fileName: fileName,
        path: pathUtil.dirname(path.substring(2)), // 去掉盘符 如 D:\\桌面\\text.txt => \\桌面
        ext: pathUtil.extname(path)
      }
    },
    _openFullScreen (isOpen) { // 打开全屏遮罩
      if (isOpen) {
        this.loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
      } else {
        this.loading.close()
      }
    },
    clearDriveData (formName) {
      var that = this
      this.$confirm(`此操作将删除盘符为${this.ruleForm.drive}:\\的所有数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this._openFullScreen(true)
        this.$db.remove({ drive: this.ruleForm.drive }, { multi: true }, (wrong) => {
          that._openFullScreen(false)
          if (!wrong) {
            that.$message({
              message: `盘符为${this.ruleForm.drive}:\\的所有数据已删除...`,
              type: 'success',
              center: true
            })
          } else {
            that.$message({
              message: `删除盘符为${this.ruleForm.drive}:\\的数据出错...`,
              type: 'error',
              center: true
            })
          }
        })
      }).catch(() => { })
    },
    submitForm (formName) {
      var that = this
      that.$refs[formName].validate(valid => {
        if (valid) {
          that._openFullScreen(true)
          setTimeout(() => {
            var returnFilesList = []
            for (var file of that.files) {
              const stat = fs.statSync(file.path)
              if (stat.isFile()) {
                returnFilesList.push(that._wrapFileObj({ size: file.size, fileName: file.name, path: file.path }))
              } else {
                that._readDirFileList(file.path, returnFilesList)
              }
            }
            that.$db.insert(returnFilesList, (wrong) => {
              that._openFullScreen(false)
              if (!wrong) {
                that.resetForm('ruleForm')
                that.$message({
                  message: '数据构建成功...',
                  type: 'success',
                  center: true
                })
              } else {
                that.$message({
                  message: '数据构建失败...',
                  type: 'error',
                  center: true
                })
              }
            })
          }, 200)
        } else {
          that.$message({
            message: '表单验证失败...',
            type: 'error',
            center: true
          })
        }
      })
    },
    resetForm (formName) {
      this.files = []
      document.querySelector('#selectFiles').value = ''
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
#filesDiv {
  position: relative;
}

#dropbox {
  width: 50%;
  height: 270px;
  line-height: 270px;
  text-align: center;
  border: dashed 5px lightblue;
  cursor: pointer;
}

#selectFiles {
  display: none;
}

#filesPathDiv {
  width: 47%;
  position: absolute;
  top: 0;
  right: 0;
}

.item_flag {
  color: lightblue;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 3px;
}
</style>