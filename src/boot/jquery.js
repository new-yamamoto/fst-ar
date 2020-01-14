import Vue from "vue";
import jquery from "jquery";

Vue.prototype.$ = Vue.prototype.jQuery = jquery;
window.$ = window.jQuery = jquery;
