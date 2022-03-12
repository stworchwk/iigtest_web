import { createStore, Commit } from "vuex";

export default createStore({
  state: {
    users: {},
  },
  getters: {},
  mutations: {
    SET_USERS: (state: { users: object }, users: object) =>
      (state.users = users),
  },
  actions: {
    setAuth: ({ commit }: { commit: Commit }, users: object) =>
      commit("SET_USERS", users),
  },
  modules: {},
});
