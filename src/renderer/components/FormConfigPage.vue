<template>
  <el-row type="flex">
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>表单模板
            <i>(Form Template)</i>
          </span>
          <el-button style="float: right; padding: 2px 0;" type="text" @click="toTemplate()">添加</el-button>
        </div>
        <div v-for="(temp, index) in templates" :key="index" :id="'template-item' + index" class="text item template-item">
          <el-button style="float: right; padding: 0;" type="text" @click.prevent="toTemplate(temp, index)">编辑</el-button>
          <div @click.prevent="selectTemplate(index)">
            {{ temp.name }}
          </div>
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>元素
            <i>(Element)</i>
          </span>
        </div>
        <div v-for="(ele, index) in elements" :key="index" class="text item">
          {{ ele.name }}
          <el-button style="float: right; padding: 0;" type="text" @click="addElement(ele.type)">添加</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="attrs-box-card">
        <el-form :model="elementsForm" label-position="top" ref="elementsForm">
          <div v-for="(element, index) in elementsForm.attrs" :key="index" :id="'wrap-form-item' + index" class="wrap-form-item" @click="selectElementItem(index)">
            <div class="wrap-form-item-close" @click.prevent="removeElement(element)">x</div>
            <el-form-item :label="element.fieldName" :rules="{ required: element.isRequired, message: ' ', trigger: 'blur'}">
              <el-input v-if="element.type == 'input'" v-model="element.value"></el-input>
              <el-select v-else-if="element.type == 'select'" v-model="element.value"></el-select>
            </el-form-item>
          </div>
        </el-form>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="attrs-box-card">
        <div slot="header" class="clearfix">
          <span>属性
            <i>(Attribute)</i>
          </span>
        </div>
        <el-form v-if="elementsForm.attrs.length>0" :model="elementsForm" label-position="top" ref="attrsForm">
          <el-form-item v-for="(common, index) in attr.commons" :key="index" :label="common.name">
            <el-input v-if="common.type == 'input'" v-model="elementsForm.attrs[selectElementIndex][common.key]"></el-input>
            <el-switch v-else-if="common.type == 'switch'" v-model="elementsForm.attrs[selectElementIndex][common.key]"></el-switch>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>

    <el-dialog title="表单模板" :visible.sync="dialogFormVisible">
      <el-form :model="templateForm" :rules="templateFormRules" ref="templateForm">
        <el-form-item label="模板唯一标识" prop="key">
          <el-input v-model="templateForm.key" :disabled="disabledKey"></el-input>
        </el-form-item>
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="templateForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleTemplate()">取 消</el-button>
        <el-button type="primary" @click="confirmTemplate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import formSetting from '../../config/formSetting'
// import formTemplate from '../../config/formTemplate.json'

export default {
  data () {
    return {
      templates: [],
      elements: formSetting.elements,
      attr: formSetting.attr,
      elementsForm: {
        attrs: []
      },
      selectTemplateIndex: 0, // 所选模板索引
      selectElementIndex: 0, // 所选元素索引
      elementAttrs: {}, // 页面创建时赋值，给元素装配属性和属性值

      // dialog表单
      templateForm: { key: '', name: '' },
      templateFormRules: {
        key: [{ required: true, message: ' ', trigger: 'blur' }],
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      disabledKey: false,
      dialogFormVisible: false
    }
  },
  created () {
    const _this = this
    // 加载dbFormTemplate数据库
    this.$dbFormTemplate.loadDatabase()

    // 加载模板数据
    this.$dbFormTemplate.find({}, {key: 1, name: 1, _id: 0}, (wrong, docs) => {
      _this.templates = docs
    })

    const elementAttrs = {}
    const attr = this.attr
    attr.commons.forEach(obj => {
      elementAttrs[obj.key] = obj.value
    })
    this.elementAttrs = elementAttrs
  },
  methods: {
    toTemplate (template, index) {
      this.dialogFormVisible = true
      if (template) {
        this.templateForm = JSON.parse(JSON.stringify(template))
        this.selectTemplateIndex = index
        this.disabledKey = true
      } else {
        this.templateForm = { key: '', name: '' }
        this.disabledKey = false
      }
    },
    confirmTemplate () {
      var _this = this
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          // 复制对象
          const templateForm = JSON.parse(JSON.stringify(_this.templateForm))
          // 编辑
          if (_this.disabledKey) {
            // 修改模板所改列表中的模板名
            _this.templates[_this.selectTemplateIndex].name = templateForm.name
            _this.$dbFormTemplate.update({key: templateForm.key}, {$set: { name: templateForm.name }}, {})
          } else {
            _this.templates.push(templateForm)
            _this.$dbFormTemplate.insert(templateForm)
          }
        }
        _this.cancleTemplate()
      })
    },
    cancleTemplate () {
      this.dialogFormVisible = false
      this.$refs['templateForm'].resetFields()
    },
    addElement (type) {
      const that = this
      // 添加元素必需要选中模板
      if (this.selectTemplateIndex === 0) {
        this.$notify({
          title: '警告',
          message: '添加元素前，请先选中模板!!!',
          position: 'bottom-right',
          type: 'warning'
        })
        return
      }
      // 复制对象
      const elementAttrs = JSON.parse(JSON.stringify(that.elementAttrs))
      // 元素类型
      elementAttrs['type'] = type
      // 元素默认值
      elementAttrs['value'] = ''
      that.elementsForm.attrs.push(elementAttrs)
      const index = that.elementsForm.attrs.length - 1
      setTimeout(function () {
        that.selectElementItem(index)
      }, 50)
    },
    removeElement (element) {
      const that = this
      const attrs = this.elementsForm.attrs
      const index = attrs.indexOf(element)
      if (index !== -1) {
        // 删除元素后，选中下一个元素，如果删除的是最后一个元素，就选中前一个元素
        const len = attrs.length - 1
        var selectIndex = 0
        if (len > index) {
          selectIndex = index
        } else {
          selectIndex = index - 1
        }
        setTimeout(function () {
          that.elementsForm.attrs.splice(index, 1)
          that.selectElementItem(selectIndex)
        }, 50)
      }
    },
    selectTemplate (index) {
      const _this = this
      this._selectItem('template-item', 'active-template-item', index, function () {
        _this.selectTemplateIndex = index
      })
    },
    selectElementItem (index) {
      const _this = this
      this._selectItem('wrap-form-item', 'active-form-item', index, function () {
        _this.selectElementIndex = index
      })
    },
    _selectItem (className, activeClassName, index, callback) {
      var allEle = document.querySelectorAll(`.${className}`)
      allEle.forEach((ele) => {
        ele.classList.remove(activeClassName)
      })
      var ele = document.querySelector(`#${className}${index}`)
      if (ele) {
        ele.classList.add(activeClassName)
        callback()
      }
    }
  }
}
</script>

<style>
.text {
  font-size: 14px;
}

.item {
  padding: 10px;
}

.item:hover {
  background-color: rgb(195, 232, 240);
}

.active-template-item {
  background-color: rgb(227, 237, 240);
}

.item:last-child {
  margin-bottom: 0;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.wrap-form-item {
  position: relative;
  padding: 5px 8px;
}

.wrap-form-item-close {
  display: none;
  position: absolute;
  right: -11px;
  top: -11px;
  text-align: center;
  color: white;
  font-family: Arial, sans-serif;
  font-weight: bold;
  width: 22px;
  height: 22px;
  line-height: 20px;
  border-radius: 50%;
  background: red;
  cursor: pointer;
}

.active-form-item,
.wrap-form-item:hover {
  border: 1px dashed red;
}

.active-form-item .wrap-form-item-close,
.wrap-form-item:hover .wrap-form-item-close {
  display: block;
}

/* .active-form-item::after,
.wrap-form-item:hover::after {
  display: table;
  content: 'x';
  position: absolute;
  text-align: center;
  color: white;
  font-family: Arial, sans-serif;
  font-weight: bold;
  right: -11px;
  top: -11px;
  width: 22px;
  height: 22px;
  line-height: 20px;
  border-radius: 50%;
  background: red;
  cursor: pointer;
  pointer-events: auto;
} */

.attrs-box-card .el-card__body {
  padding: 10px 20px 15px;
}

.attrs-box-card .el-form-item {
  margin-bottom: 5px;
}

.attrs-box-card .el-form-item__label {
  line-height: 30px;
  font-size: 12px;
  padding: 0;
}

.attrs-box-card .el-form-item__content {
  line-height: 0px;
  font-size: 12px;
}
</style>
