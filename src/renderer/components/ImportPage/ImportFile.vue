<template>
  <div>
    <div id="filesDiv">
      <div id="dropbox" @mouseout="focusFilesDiv=false" @mouseover="focusFilesDiv=true" @click.prevent="selectFiles($event)">将文件或文件夹拖到此处（或点击选择）</div>
      <input type="file" id="selectFiles" @change="handleSelectFiles($event)" multiple webkitdirectory />
    </div>
    <div id="filesPathDiv">
      <el-input type="textarea" v-model="selectFilePaths" :rows="11" placeholder="所选文件路径" :readonly="true" resize="none">
      </el-input>
      <el-radio-group v-model="pathTxtRadio" size="mini">
        <el-radio-button label="1">追加</el-radio-button>
        <el-radio-button label="2">替换</el-radio-button>
      </el-radio-group>
    </div>
  </div>
</template>

<script>
const pathUtil = require('path')
const fs = require('fs')
/*
  传入v-modle,值为数组
  @param v-modle
  return 选择的文件或文件夹（可多个），处理好的所有文件路径数组
*/
export default {
  props: ['value'],
  data () {
    return {
      pathTxtRadio: '1', // 选择文件路径处理方式 {1：追加，2：替换}
      files: [], // 临时保存选择的文件
      focusFilesDiv: false,
      selectFilePaths: '' // 选择的文件路径
    }
  },
  mounted: function () {
    var filesDiv = document.querySelector('#filesDiv')
    filesDiv.addEventListener('dragenter', this.onDragenter, false) // 进入
    filesDiv.addEventListener('dragover', this.onDragover, false) // 拖动着悬停在上方
    filesDiv.addEventListener('dragleave', this.onDragleave, false) // 离开
    filesDiv.addEventListener('drop', this.onDrop, false) // 放下
  },
  watch: {
    value (newVal, oldVal) { // 监听绑定的值，如果为空，清除数据
      if (newVal.length === 0) {
        this.files = []
        this.selectFilePaths = ''
        document.querySelector('#selectFiles').value = ''
      }
    },
    focusFilesDiv (newVal, oldVal) { // 监听鼠标移进，移出
      if (newVal) {
        this._setStyle({ id: 'dropbox', borderColor: 'blue' })
      } else {
        this._setStyle({ id: 'dropbox', borderColor: 'lightblue' })
      }
    }
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
      var returnFilesList = []
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

      filePaths = Array.from(new Set(filePaths)) // 去重

      for (var path of filePaths) { // 处理选择的文件或文件夹，返回处理好的文件路径
        const stat = fs.statSync(path)
        if (stat.isFile()) {
          returnFilesList.push(path)
        } else {
          this._readDirFileList(path, returnFilesList)
        }
      }

      this.selectFilePaths = filePaths.join('\n')
      this.$emit('input', returnFilesList)
    },
    _readDirFileList (path, returnFilesList) { // 遍历文件夹
      const that = this
      const files = fs.readdirSync(path)
      files.forEach(function (fileName, index) {
        const realPath = pathUtil.join(path, fileName)
        const stat = fs.statSync(realPath)
        if (stat.isFile()) {
          returnFilesList.push(realPath)
        } else {
          that._readDirFileList(realPath, returnFilesList)
        }
      })
    },
    _setStyle ({ id, borderColor }) {
      var oFile = document.querySelector(`#${id}`)
      if (borderColor) {
        oFile.style.borderColor = borderColor
      }
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
</style>


