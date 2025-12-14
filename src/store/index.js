import { createStore } from 'vuex';

export default createStore({
  state: {
    language: 'ar',
    dailyHadith: {
      id: 'empty'
    },
    darkMode: true
  },
  mutations: {
    SET_LANGUAGE(state, lang) {
      state.language = lang;
    },
    SET_DAILY_HADITH(state, hadith) {
      state.dailyHadith = hadith;
    },
    TOGGLE_THEME(state) {
      state.darkMode = !state.darkMode;
    }
  },
  actions: {
    setLanguage({ commit }, lang) {
      commit('SET_LANGUAGE', lang);
    },
    loadDailyHadith({ commit }) {
      // Simulate fetching
      setTimeout(() => {
        commit('SET_DAILY_HADITH', {
          id: 1,
          text: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى.',
          reference: 'رواه البخاري ومسلم'
        });
      }, 500);
    }
  },
  getters: {
    currentLanguage: state => state.language,
    isDarkMode: state => state.darkMode
  }
});