import Vue from "vue";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";

Vue.prototype.Cropper = Cropper;
window.Cropper = Cropper;
