import { createStore, Commit } from "vuex";

export default createStore({
  state: {
    profile: {},
    isLoading: false
  },
  getters: {},
  mutations: {
    SET_IS_LOADING: (state: { isLoading: boolean }, isLoading: boolean) => (state.isLoading = isLoading),
    SET_PROFILE: (state: { profile: object }, profile: object) =>
      (state.profile = profile)
  },
  actions: {
    isLoading: ({ commit }: { commit: Commit }, isLoading: boolean) =>
      commit("SET_IS_LOADING", isLoading),
    setProfile: ({ commit }: { commit: Commit }, profile: object) =>
      commit("SET_PROFILE", profile),
  },
  modules: {},
});
