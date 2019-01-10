<template>
  <div>
    <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="模板" prop="templateKey">
        <el-select v-model="ruleForm.templateKey" placeholder="请选择模板">
          <el-option v-for="temp in templates" :key="temp.key" :label="temp.name" :value="temp.key"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作方式" prop="operatMode">
        <el-select v-model="ruleForm.operatMode">
          <el-option label="导入" value="import"></el-option>
          <el-option label="录入" value="entry"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
      </el-form-item>
    </el-form>
    <el-form id="dataForm" :model="dataForm" ref="dataForm" label-width="100px">
      <template v-if="dataForm.operatMode == 'entry'">
        <element-judge v-for="(element, index) in dataForm.elements" :key="index" :data="element" v-model="element.value">
          <span v-if="element.remark" class="item_flag">
            <i class="el-icon-warning"></i> {{element.remark}}</span>
        </element-judge>
      </template>
      <el-form-item v-else-if="dataForm.operatMode == 'import'" label="导入文件" prop="files" :rules="{ type: 'array', required: true, message: ' ', trigger: 'change' }">
        <import-file v-model="dataForm.files"></import-file>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')">{{btnName}}</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImportFile from './ImportPage/ImportFile'
import ElementJudge from './CommonPage/ElementJudge'
import path from 'path'
import XLSX from 'xlsx'

export default {
  components: {
    ImportFile,
    ElementJudge
  },
  data () {
    return {
      loading: null, // $loading对象
      btnName: '导入',
      templates: [],
      ruleForm: {
        templateKey: '',
        operatMode: 'import'
      },
      rules: {
        templateKey: [{ required: true, message: '请选择模板', trigger: 'change' }],
        operatMode: [{ required: true, message: '请选择操作方式', trigger: 'change' }]
      },
      dataForm: {
        operatMode: 'import',
        elements: [],
        files: []
      }
    }
  },
  created () {
    this.templates = this.$store.state.FormTemplate.templates
  },
  methods: {
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
    submitForm (formName) {
      var that = this
      that.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === 'ruleForm') {
            that.dataForm.operatMode = that.ruleForm.operatMode
            // 按钮显示名称
            if (that.dataForm.operatMode === 'import') {
              that.btnName = '导入'
            } else {
              that.btnName = '保存'
            }
            that.$store.dispatch('loadElementsByKey', that.ruleForm.templateKey)
            that.dataForm.elements = that.$store.state.FormTemplate.elements
          } else if (formName === 'dataForm') {
            that._openFullScreen(true)
            for (let file of this.dataForm.files) {
              const elementsTemplate = that.$store.state.FormTemplate.elements
              const ext = path.extname(file).toLowerCase()
              if (ext === '.xlsx' || ext === '.xls') {
                let wb = XLSX.readFile(file)
                for (const sheetName of wb.SheetNames) {
                  let sheet = wb.Sheets[sheetName]
                  console.dir(sheet)
                  if (sheet['!ref']) { // 数据范围 存在，证明有数据
                    let datas = XLSX.utils.sheet_to_json(sheet)
                    for (let i = 0; i < datas.length; i++) { // 行数据
                      const data = datas[i]
                      // 获取模板元素field, 当作excel的标题获取值
                      for (let j = 0; j < elementsTemplate.length; j++) { // 列数据
                        const ele = elementsTemplate[j]
                        const val = data[ele.field] || ele.value

                        if (ele.isRequired && !val) { // 必填
                          console.log(`行：${i + 1}，列：${j + 1}`)
                        }
                      }
                    }
                  }
                }
              }
            }
            that._openFullScreen(false)
            setTimeout(() => {
              // that.$db.insert(this.dataForm.files, (wrong) => {
              //   that._openFullScreen(false)
              //   if (!wrong) {
              //     that.resetForm(formName)
              //     that.$message({
              //       message: '数据处理成功...',
              //       type: 'success',
              //       center: true
              //     })
              //   } else {
              //     that.$message({
              //       message: '数据处理失败...',
              //       type: 'error',
              //       center: true
              //     })
              //   }
              // })
            }, 200)
          }
        } else {
          if (that.templates.length === 0) { // 模板为空
            that.$confirm('没有模板，现在配置模板吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$emit('addTab', 'FormConfigPage')
            }).catch(() => { console.log('ssssssssss') })
          } else {
            that.$message({
              message: '表单验证失败...',
              type: 'error',
              center: true
            })
          }
        }
      })
    },
    resetForm (formName) {
      this.dataForm.files = []
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
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

#dataForm .el-form-item:last-child {
  padding-top: 5px;
}
</style>