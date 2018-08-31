<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
    <el-form-item label="模板" prop="template">
      <el-select v-model="ruleForm.template" placeholder="请选择模板">
        <el-option v-for="drive in drives" :key="drive" :label="drive+':\\'" :value="drive"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="操作方式">
      <el-select v-model="ruleForm.operatMode" placeholder="请选择操作方式">
        <el-option label="导入" value="import"></el-option>
        <el-option label="录入" value="entry"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="导入文件" prop="files">
      <import-file v-model="ruleForm.files"></import-file>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">导入</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
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
      drives: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
      ruleForm: {
        template: '',
        operatMode: 'import',
        files: []
      },
      rules: {
        template: [{ required: true, message: '请选择模板', trigger: 'change' }],
        files: [{ type: 'array', required: true, message: ' ', trigger: 'change' }]
      }
    }
  },
  created () {
    
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