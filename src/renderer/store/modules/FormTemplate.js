const state = {
  templates: []
}

const mutations = {
  setTemplates (state, templates) {
    state.templates = templates
  }
}

const actions = {
  // someAsyncTask ({ commit }) {
  //   // do something async
  //   commit('INCREMENT_MAIN_COUNTER')
  // }
}

export default {
  state,
  mutations,
  actions
}
