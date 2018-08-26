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
      <el-card class="elements-box-card">
        <el-form :model="elementsForm" label-position="top" ref="elementsForm">
          <div v-for="(element, index) in elementsForm.attrs" :key="index" :id="'wrap-form-item' + index" class="wrap-form-item" @click="selectElementItem(index)">
            <div class="wrap-form-item-close" @click.prevent="removeElement(element)">x</div>
            <!-- <el-form-item :label="element.fieldName" :rules="element.rules">
              <el-input v-if="element.type == 'input'" v-model="element.value"></el-input>
              <el-select v-else-if="element.type == 'select'" v-model="element.value"></el-select>
              <span v-if="element.remark" class="item_remark">
                <i class="el-icon-warning"></i> {{element.remark}}</span>
            </el-form-item> -->
            <element-judge :data="element" v-model="element.value">
              <span v-if="element.remark" class="item_remark">
                <i class="el-icon-warning"></i> {{element.remark}}</span>
            </element-judge>
          </div>
          <el-form-item v-show="elementsForm.attrs.length>0" class="btn-form-item">
            <el-button type="primary" @click.prevent="saveElements()" :disabled="isSaved">保存</el-button>
          </el-form-item>
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
        <el-form v-if="elementsForm.attrs.length>0" :model="elementsForm" ref="attrsForm">
          <!-- <el-form-item v-for="common in attr.commons" :key="common.key" :label="common.name">
            <el-input v-if="common.type == 'input'" v-model="elementsForm.attrs[selectElementIndex][common.key]"></el-input>
            <el-switch v-else-if="common.type == 'switch'" v-model="elementsForm.attrs[selectElementIndex][common.key]"></el-switch>
            
            <fieldset v-if="common.childs && common.childsType == 'fieldset' && elementsForm.attrs[selectElementIndex][common.key] == true" style="width:86%;">
              <legend>{{common.childsName}}</legend>
              <el-form-item v-for="child in common.childs" :key="child.key" :label="child.name" v-if="!child.hidden">
                <el-input v-if="child.type == 'input'" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]"></el-input>
                <el-switch v-else-if="child.type == 'switch'" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]"></el-switch>
                <el-select v-else-if="child.type == 'select'" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]">
                  <el-option v-for="param in child.params" :key="param.value" :label="param.text" :value="param.value"></el-option>
                </el-select>
              </el-form-item>
            </fieldset>
          </el-form-item> -->
          <element-judge v-for="common in attr.commons" :key="common.key" :data="common" v-model="elementsForm.attrs[selectElementIndex][common.key]">
            <fieldset v-if="common.childs && common.childsType == 'fieldset' && elementsForm.attrs[selectElementIndex][common.key] == true" style="width:86%;">
              <legend>{{common.childsName}}</legend>
              <element-judge v-for="child in common.childs" :key="child.key" :data="child" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]"></element-judge>
            </fieldset>
          </element-judge>
          <!-- 特定元素属性 -->
          <element-judge v-for="common in attr[elementsForm.attrs[selectElementIndex].type]" :key="common.key" :data="common" v-model="elementsForm.attrs[selectElementIndex][common.key]">
            <fieldset v-if="common.childs && common.childsType == 'fieldset' && elementsForm.attrs[selectElementIndex][common.key] == true" style="width:86%;">
              <legend>{{common.childsName}}</legend>
              <element-judge v-for="child in common.childs" :key="child.key" :data="child" v-model="elementsForm.attrs[selectElementIndex][common.childsKey][child.key]"></element-judge>
            </fieldset>
          </element-judge>
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
import ElementJudge from './CommonPage/ElementJudge'
// import formTemplate from '../../config/formTemplate.json'

export default {
  components: { ElementJudge },
  data () {
    return {
      templates: [],
      elements: formSetting.elements,
      attr: formSetting.attr,
      elementsForm: {
        attrs: []
      },
      selectTemplateIndex: -1, // 所选模板索引
      selectElementIndex: 0, // 所选元素索引
      elementAttrs: {}, // 页面创建时赋值，给元素装配属性和属性值
      elementTypeAttrs: {}, // 给特定元素装配属性和属性值

      // dialog表单
      templateForm: { key: '', name: '' },
      templateFormRules: {
        key: [{ required: true, message: ' ', trigger: 'blur' }],
        name: [{ required: true, message: ' ', trigger: 'blur' }]
      },
      disabledKey: false,
      dialogFormVisible: false,

      isSaved: false // 标识是否保存过数据
    }
  },
  created () {
    const _this = this
    // 加载dbFormTemplate数据库
    this.$dbFormTemplate.loadDatabase()

    // 加载模板数据
    this.$dbFormTemplate.find({}, { key: 1, name: 1, _id: 0 }, (wrong, docs) => {
      _this.templates = docs
    })

    var elementAttrs = {}
    var elementTypeAttrs = {}
    const attr = this.attr
    _this._bufferElementAttrs(attr.commons, elementAttrs)
    var i = 0
    // 特定元素需要的属性
    for (let key in attr) {
      if (i++ >= 1) {
        _this._bufferElementAttrs(attr[key], elementTypeAttrs[key] = {})
      }
    }

    this.elementAttrs = elementAttrs
    this.elementTypeAttrs = elementTypeAttrs
  },
  watch: {
    'elementsForm.attrs': { // 监听elementsForm.attrs数据的变化
      handler (newVal, oldVal) {
        // 处理保存按钮是否可点
        if (oldVal.length === 0) { // 点击模板后，按钮不可点
          this.isSaved = true
          return
        } else {
          this.isSaved = false
        }

        if (newVal.length !== oldVal.length) { // 不相等，证明是添加元素后触发
          return
        }

        // 处理属性绑定
        // 判断新值，旧值是否相等，防止死循环
        const _this = this
        var newObj = newVal[this.selectElementIndex]
        // var oldObj = oldVal[this.selectElementIndex]
        if (newObj.bindKeys) {
          Object.keys(newObj.bindKeys).forEach((key) => {
            const nVal = _this._parsePath(newObj.bindKeys[key])(newObj)
            const oVal = _this._parsePath(key)(newObj)
            if (nVal !== oVal) {
              const segments = key.split('_')
              var keyObj = _this.elementsForm.attrs[_this.selectElementIndex]
              // 通过引用，修改值
              var obj = null
              for (let i = 0; i < segments.length - 1; i++) {
                if (!keyObj) return
                obj = keyObj[segments[i]]
              }
              obj[segments[segments.length - 1]] = nVal
            }
          })
        }
      },
      deep: true
    }
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
          var templates = _this.templates
          // 编辑
          if (_this.disabledKey) {
            // 修改模板所改列表中的模板名
            templates[_this.selectTemplateIndex].name = templateForm.name
            _this.$dbFormTemplate.update({ key: templateForm.key }, { $set: { name: templateForm.name } }, {})
          } else {
            templates.push(templateForm)
            _this.$dbFormTemplate.insert(templateForm)
            setTimeout(function () {
              // 选中新添加的模板
              _this.selectTemplate(templates.length - 1)
            }, 50)
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
      if (this.selectTemplateIndex === -1) {
        this.$message({
          message: '添加元素前，请先选中模板!!!',
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
      // 特定元素属性
      const elementTypeAttrs = that.elementTypeAttrs[type]
      Object.assign(elementAttrs, !elementTypeAttrs ? {} : JSON.parse(JSON.stringify(elementTypeAttrs)))
      console.dir(elementAttrs)
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
    saveElements () {
      const _this = this
      this.$dbFormTemplate.update({ key: this.templates[this.selectTemplateIndex].key }, { $set: { elements: this.elementsForm.attrs } }, {}, (wrong, docs) => {
        if (wrong) {
          _this.$message({
            message: '数据保存失败...',
            type: 'error'
          })
        } else {
          _this.$message({
            message: '数据保存成功...',
            type: 'success'
          })
        }
        _this.isSaved = true
      })
    },
    selectTemplate (index) {
      if (this.selectTemplateIndex === index) {
        return
      }
      const _this = this
      this._selectItem('template-item', 'active-template-item', index, function () {
        _this.selectTemplateIndex = index
        // 获取模板的元素集合
        _this.$dbFormTemplate.find({ key: _this.templates[index].key }, { elements: 1, _id: 0 }, (wrong, docs) => {
          var elements = docs[0]['elements']
          if (!elements) {
            elements = []
          }
          _this.elementsForm.attrs = elements
          setTimeout(function () {
            _this.selectElementItem(0)
          }, 50)
        })
      })
    },
    selectElementItem (index) {
      // if (this.selectElementIndex === index) {
      //   return
      // }
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
    },
    _parsePath (path) { // 解析字符串形式对象 如：'a.b.c'  由于数据存在nedb里会有问题，所以改成_
      const bailRE = /[^\w.$]/
      if (bailRE.test(path)) {
        return
      }
      const segments = path.split('_')
      return function (obj) {
        for (let i = 0; i < segments.length; i++) {
          if (!obj) return
          obj = obj[segments[i]]
        }
        return obj
      }
    },
    _bufferElementAttrs (attrs, elementAttrs) {
      attrs.forEach(obj => {
        elementAttrs[obj.key] = obj.value
        if (obj.bindKey) { // 绑定值，当key值发生改变，binkKey值也改变
          if (!elementAttrs['bindKeys']) {
            elementAttrs['bindKeys'] = {}
          }
          elementAttrs['bindKeys'][`${obj.bindKey}`] = obj.key
        }
        if (obj.childs) { // 存在子项
          elementAttrs[obj.childsKey] = {}
          obj.childs.forEach(childObj => {
            elementAttrs[obj.childsKey][childObj.key] = childObj.value
          })
        }
      })
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

.item_remark {
  color: lightblue;
  font-size: 12px;
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

.btn-form-item {
  margin: 10px 10px 0 0;
  text-align: right;
}

.elements-box-card .el-card__body {
  padding: 10px 20px 15px;
}

.elements-box-card .el-form-item {
  margin-bottom: 5px;
}

.elements-box-card .el-form-item__label {
  line-height: 30px;
  /* font-size: 12px; */
  padding: 0;
}

.elements-box-card .el-form-item__content {
  line-height: 20px;
  /* font-size: 12px; */
}

.attrs-box-card .el-card__body {
  padding: 10px 20px 15px;
}

.attrs-box-card .el-form-item {
  margin-bottom: 5px;
}

.attrs-box-card .el-form-item__label {
  line-height: 30px;
  /* font-size: 12px; */
  padding: 0;
}

.attrs-box-card .el-form-item__content {
  line-height: 28px;
  /* font-size: 12px; */
  text-align: right;
}
</style>
