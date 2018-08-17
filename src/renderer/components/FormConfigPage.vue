<template>
  <el-row type="flex">
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>表单模板
            <i>(Form Template)</i>
          </span>
          <el-button style="float: right; padding: 2px 0;" type="text">添加</el-button>
        </div>
        <div v-for="o in 2" :key="o" class="text item">
          {{'列表内容 ' + o }}
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>元素
            <i>(Element)</i>
          </span>
        </div>
        <div v-for="ele in elements" :key="ele.name" class="text item">
          {{ ele.name }}
          <el-button style="float: right; padding: 0;" type="text" @click="addElement(ele.type)">添加</el-button>
        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="attrs-box-card">
        <el-form :model="elementsForm" label-position="top" ref="elementsForm">
          <div v-for="(element, index) in elementsForm.attrs" :key="index" :id="'wrap-form-item' + index" class="wrap-form-item" @click="selectFormItem(index)">
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
            <el-input v-if="common.type == 'input'" v-model="elementsForm.attrs[selectElement][common.key]"></el-input>
            <el-switch v-else-if="common.type == 'switch'" v-model="elementsForm.attrs[selectElement][common.key]"></el-switch>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import formSetting from '../../config/formSetting'
export default {
  data () {
    return {
      elements: formSetting.elements,
      attr: formSetting.attr,
      elementsForm: {
        attrs: []
      },
      selectElement: 0, // 所选第几个元素
      elementAttrs: {} // 页面创建时赋值，给元素装配属性和属性值
    }
  },
  created () {
    let elementAttrs = {}
    let attr = this.attr
    attr.commons.forEach(obj => {
      elementAttrs[obj.key] = obj.value
    })
    this.elementAttrs = elementAttrs
  },
  methods: {
    addElement (type) {
      const that = this
      const elementAttrs = JSON.parse(JSON.stringify(that.elementAttrs)) // 复制对象
      elementAttrs['type'] = type // 元素类型
      elementAttrs['value'] = '' // 元素默认值
      that.elementsForm.attrs.push(elementAttrs)
      const index = that.elementsForm.attrs.length - 1
      setTimeout(function () {
        that.selectFormItem(index)
      }, 50)
    },
    removeElement (element) {
      var index = this.elementsForm.attrs.indexOf(element)
      if (index !== -1) {
        this.elementsForm.attrs.splice(index, 1)
      }
    },
    selectFormItem (index) {
      var allEle = document.querySelectorAll('.wrap-form-item')
      allEle.forEach((ele) => {
        ele.classList.remove('active-form-item')
      })
      var ele = document.querySelector('#wrap-form-item' + index)
      ele.classList.add('active-form-item')
      this.selectElement = index
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
  background-color: rgb(225, 234, 236);
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
