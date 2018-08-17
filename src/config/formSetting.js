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
        key: 'field',
        name: '字段名',
        value: ''
      },
      {
        type: 'switch',
        key: 'isRequired',
        name: '是否必填',
        value: false
      },
      {
        type: 'input',
        key: 'note',
        name: '注释',
        value: ''
      }
    ]
  }
}
