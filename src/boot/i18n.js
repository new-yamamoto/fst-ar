import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "src/i18n";

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: "ja",
  fallbackLocale: "ja",
  messages
});

export default ({ app }) => {
  app.i18n = i18n
  Vue.prototype.i18n = i18n;
  window.i18n = i18n;
};

export { i18n };
