import { createStore, Commit } from "vuex";

export default createStore({
  state: {
    profile: {},
    isLoading: false,
    modalIsActive: false,
    modalContentTag: null,
  },
  getters: {},
  mutations: {
    SET_IS_LOADING: (state: { isLoading: boolean }, isLoading: boolean) =>
      (state.isLoading = isLoading),
    SET_PROFILE: (state: { profile: object }, profile: object) =>
      (state.profile = profile),
    SET_MODAL_IS_ACTIVE: (
      state: { modalIsActive: boolean },
      modalIsActive: boolean
    ) => (state.modalIsActive = modalIsActive),
    SET_MODAL_CONTENT_TAG: (state: { modalContentTag: string|null }, modalContentTag: string|null) =>
      (state.modalContentTag = modalContentTag),
  },
  actions: {
    isLoading: ({ commit }: { commit: Commit }, isLoading: boolean) =>
      commit("SET_IS_LOADING", isLoading),
    setProfile: ({ commit }: { commit: Commit }, profile: object) =>
      commit("SET_PROFILE", profile),
    modalShow: ({ commit }: { commit: Commit }) =>
      commit("SET_MODAL_IS_ACTIVE", true),
    modalClose: ({ commit }: { commit: Commit }) =>
      commit("SET_MODAL_IS_ACTIVE", false),
    modalContentTag: ({ commit }: { commit: Commit }, modalContentTag: string) =>
      commit("SET_MODAL_CONTENT_TAG", modalContentTag),
  },
  modules: {},
});
