<template>
  <div>
    <el-form :inline="true" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="模板" prop="template">
        <el-select v-model="ruleForm.template" placeholder="请选择模板">
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

    <el-form :model="dataForm" ref="dataForm" label-width="100px">
      <el-form-item label="导入文件" prop="files" :rules="{ type: 'array', required: true, message: ' ', trigger: 'change' }">
        <import-file v-model="dataForm.files"></import-file>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('dataForm')">导入</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImportFile from './ImportPage/ImportFile'

export default {
  components: {
    ImportFile
  },
  data () {
    return {
      loading: null, // $loading对象
      templates: [],
      ruleForm: {
        template: '',
        operatMode: 'import'
      },
      rules: {
        template: [{ required: true, message: '请选择模板', trigger: 'change' }],
        operatMode: [{ required: true, message: '请选择操作方式', trigger: 'change' }]
      },
      dataForm: {
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
          that._openFullScreen(true)
          setTimeout(() => {
            that.$db.insert(this.ruleForm.files, (wrong) => {
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
      this.ruleForm.files = []
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
</style>