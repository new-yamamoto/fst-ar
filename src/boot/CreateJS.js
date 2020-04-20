import Vue from "vue";
import { Stage, Shape } from "@createjs/easeljs";
import { Tween } from "@createjs/tweenjs";

Vue.prototype.CreateJS = {};
Vue.prototype.CreateJS.Stage = Stage;
Vue.prototype.CreateJS.Shape = Shape;
window.CreateJS = {};
window.CreateJS.Stage = Stage;
window.CreateJS.Shape = Shape;
