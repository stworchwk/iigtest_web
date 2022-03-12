import { createStore, Commit } from "vuex";

export default createStore({
  state: {
    users: {},
    isLoading: false
  },
  getters: {},
  mutations: {
    SET_IS_LOADING: (state: { isLoading: boolean }, isLoading: boolean) => (state.isLoading = isLoading),
    SET_USERS: (state: { users: object }, users: object) =>
      (state.users = users)
  },
  actions: {
    isLoading: ({ commit }: { commit: Commit }, isLoading: boolean) =>
      commit("SET_IS_LOADING", isLoading),
    setAuth: ({ commit }: { commit: Commit }, users: object) =>
      commit("SET_USERS", users),
  },
  modules: {},
});
