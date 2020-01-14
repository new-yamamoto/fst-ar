export default ({ app, Vue }) => {
  Vue.prototype.console = window.console;

  window.$app = app;
  window.$Vue = Vue;
};
