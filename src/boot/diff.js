import Vue from "vue";
import { diff, addedDiff, deletedDiff, updatedDiff, detailedDiff } from "deep-object-diff";

Vue.prototype.diff = diff;
window.diff = diff;
