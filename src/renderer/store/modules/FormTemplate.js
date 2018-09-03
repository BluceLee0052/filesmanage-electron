const state = {
  templates: []
}

const mutations = {
  SET_TEMPLATES (state, templates) {
    state.templates = templates
  }
}

const actions = {
  setTemplates ({ commit }, templates) {
    commit('SET_TEMPLATES', templates)
  },
  loadTemplates ({ commit }) {
    setTimeout(function () {
      // 加载模板数据
      window.vue.$dbFormTemplate.find({}, { key: 1, name: 1, _id: 0 }, (wrong, docs) => {
        commit('SET_TEMPLATES', docs)
      })
    }, 200)
  }
}

export default {
  state,
  mutations,
  actions
}
