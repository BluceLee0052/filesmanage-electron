const state = {
  templates: [],
  elements: [] // 选择模板后，里面的所包含的元素
}

const mutations = {
  SET_TEMPLATES (state, templates) {
    state.templates = templates
  },
  SET_ELEMENTS (state, elements) {
    state.elements = elements
  }
}

const actions = {
  setTemplates ({ commit }, templates) {
    commit('SET_TEMPLATES', templates)
  },
  setElements ({ commit }, elements) {
    commit('SET_ELEMENTS', elements)
  },
  loadTemplates ({ commit }) {
    setTimeout(function () {
      // 加载模板数据
      window.vue.$dbFormTemplate.find({}, { key: 1, name: 1, _id: 0 }, (wrong, docs) => {
        commit('SET_TEMPLATES', docs)
      })
    }, 200)
  },
  loadElementsByKey ({ commit }, key) {
    setTimeout(function () {
      window.vue.$dbFormTemplate.find({ key: key }, { elements: 1, _id: 0 }, (wrong, docs) => {
        var elements = docs[0]['elements']
        if (!elements) {
          elements = []
        }
        commit('SET_ELEMENTS', elements)
      })
    }, 50)
  }
}

export default {
  state,
  mutations,
  actions
}
