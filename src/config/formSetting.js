module.exports = {
  elements: [
    {
      type: 'input',
      name: '输入框'
    },
    {
      type: 'select',
      name: '下拉框'
    }
  ],
  attr: {
    commons: [
      {
        type: 'input',
        key: 'fieldName',
        name: '显示名',
        value: ''
      },
      {
        type: 'input',
        key: 'field', // filed的值改变，prop的值也改变
        bindKey: 'prop',
        name: '字段名',
        value: ''
      },
      {
        type: 'input',
        key: 'prop',
        name: '属性名', // 如果是必填项，需要此属性
        value: '',
        hidden: true
      },
      {
        type: 'switch',
        key: 'isRequired',
        bindKey: 'rules_required', // 绑定，值由key的值决定 （用_代替.）
        name: '是否必填',
        value: false,
        childsType: 'fieldset',
        childsKey: 'rules',
        childsName: '元素规则',
        childs: [{
          type: 'switch',
          key: 'required',
          name: '是否必填',
          hidden: true, // 元素隐藏
          value: false
        },
        {
          type: 'input',
          key: 'message',
          name: '必填提示',
          value: ' ',
          hidden: true // 不需要，有注释就可以了
        },
        {
          type: 'select',
          key: 'trigger',
          params: [{ text: '内容改变', value: 'change' }, { text: '失去焦点', value: 'blur' }],
          name: '触发事件',
          value: 'blur'
        }]
      },
      {
        type: 'input',
        key: 'remark',
        name: '注释',
        value: ''
      }
    ],
    select: [
      // {
      //   type: 'raido',
      //   key: 'selectValuesType',
      //   size: 'mini',
      //   name: '下拉参数类型',
      //   params: [{text: '数组', value: 'array'}, {text: '键值对', value: 'key'}],
      //   value: 'array'
      // },
      {
        type: 'selectCreate',
        key: 'selectValues',
        params: [],
        name: '下拉框值',
        value: []
      }
    ]
  }
}
