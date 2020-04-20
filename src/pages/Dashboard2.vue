<template>
  <q-page class="flex q-px-sm" style="min-height: unset;">
    <div id="dashboard" style="width: 100%;">
      <div class="row  q-mt-sm q-mb-sm" style="align-items: center;">
        <select class="q-mr-sm">
          <option v-for="(comps, index) in dashboardComponents" :key="index" value="comps.name">{{comps.title}}</option>
        </select>
        <q-btn
          push
          stack
          dense
          rounded
          no-caps
          icon="add"
          color="primary"
          class="q-mr-sm"
          @click="() => console.log('コンポーネント追加')"
        >
          <q-tooltip>コンポーネント追加</q-tooltip>
        </q-btn>
        <q-space />
        <q-btn
          push
          stack
          dense
          rounded
          no-caps
          icon="refresh"
          color="primary"
          class="q-mr-sm"
        >
          <q-tooltip>レイアウト復元</q-tooltip>
        </q-btn>
      </div>
      <!-- vue-draggable-resizable -->
      <div class="components-container">
        <div class="components-container-inner">
          <q-resize-observer @resize="onContainerResize" ></q-resize-observer>
          <vue-draggable-resizable v-for="(config, index) in dashboardConfigs"
            class="component-pane"
            :id='"vdr_" + config.i'
            :ref='"vdr_" + config.i'
            :key="index"
            :grid="[5, 5]"
            :x="config.x * containerSize.width"
            :y="config.y * containerSize.height"
            :z="config.z"
            :w="config.w * containerSize.width"
            :h="config.h * containerSize.height"
            :minWidth="100"
            :minHeight="100"
            @activated="onConponentActivated"
            @dragging="onConponentDrag"
            @resizing="onConponentResize"
            :parent="true"
            drag-handle=".draggable-handle"
          >
            <div class="draggable-handle">
              <q-bar class="bg-primary text-white">
                <div class="component-title ellipsis">
                  {{!!config.info && !!config.info.title ? config.info.title : "タイトル"}}
                  <q-tooltip v-if="!!config.info && !!config.info.title">{{config.info.title}}</q-tooltip>
                </div>
                <q-space ></q-space>
                <q-btn dense flat icon="minimize" @click="event => minimizeComponent(config, currentLayout)">
                  <q-tooltip>最小化</q-tooltip>
                </q-btn>
                <q-btn v-if="config.maximized" dense flat icon="filter_none" @click="event => restoreComponent(config, currentLayout)">
                  <q-tooltip>元に戻す</q-tooltip>
                </q-btn>
                <q-btn v-else dense flat icon="crop_din" @click="event => maximizeComponent(config, currentLayout)">
                  <q-tooltip>最大化</q-tooltip>
                </q-btn>
                <q-btn dense flat icon="close" @click="event => closeComponent(config, currentLayout)">
                  <q-tooltip>閉じる</q-tooltip>
                </q-btn>
                <q-btn v-if="asConfig" dense flat icon="fas fa-cog q-icon" @click="event => configItem(config)">
                  <q-tooltip>設定</q-tooltip>
                </q-btn>
              </q-bar>
            </div>
            <component v-if="!!config.info && config.info.comp"
              :is="config.info.comp"
              :ref="config.info.comp"
              v-bind="{params: config.info.params, title: config.info.title, onConponentClickFunc: onConponentClick, asSample: !!config.info.asSample }"
            ></component>
          </vue-draggable-resizable>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
.p-page {
  min-height: unset !important;
}
.components-container {
  width: calc(100% - 10px);
  height: calc(100vh - 195px);
  padding: 5px;
  border-style: ridge;
  background-color: lightgray;
}
.components-container-inner {
  position: relative;
  width: 100%;
  height: 100%;
}
.component-pane {
  border: solid 1px black;
  background-color: white;
}
.component {
  height: calc(100% - 32px);
}
.draggable-handle {
  cursor: move;
}
</style>
<style>
</style>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

export default {
  name: "dashboard2",
  data () {
    return {
      asConfig: true,
      containerSize: {
        width: 0,
        height: 0,
      },
      dashboardConfigs: [],
      prevConfigs: [],
    }
  },
  components: {
    "vue-draggable-resizable": VueDraggableResizable,
    GraphComponent: () => import("../components/dashboard/GraphComponent"),
    VideoComponent: () => import("../components/dashboard/VideoComponent"),
    DocumentComponent: () => import("../components/dashboard/DocumentComponent"),
    RtcComponent: () => import("../components/dashboard/RtcComponent"),
    TagViewComponent: () => import("../components/dashboard/TagViewComponent"),
  },
  computed: {
    dashboardComponents: function() {
      var comps = require("../components/dashboard");
      console.log("dashboardComponents", comps);
      return _.values(comps.default);
    },
  },
  props: {
    configs: Array,
  },
  created: function() {
  },
  mounted: function() {
    var vue = this;

    //Vueコンポーネント参照
    window[vue.$options.name] = vue;

    $(vue.$el).find(".conponents-container").width("100%").height(500);
  },
  watch: {
    configs: {
      deep: true,
      handler: function() {
        var vue = this;

        if (!vue.configs) {
          vue.dashboardConfigs = [];
          return;
        }

        if (!vue.prevConfig || !vue.prevConfig.length) {
          vue.prevConfigs = vue.dashboardConfigs;
        }

        var diff = vue.diff(vue.dashboardConfigs, vue.configs);
        if (_.isEmpty(diff)) {
          return;
        }

        vue.dashboardConfigs = [];
        setTimeout(() => {
          if (!!vue.configs || !!vue.configs.length) {
            vue.dashboardConfigs = vue.configs;
          }
        }, 100);

        // // vue.dashboardConfigs = [];
        // // $(".component-pane").remove();

        // if (!!vue.configs || !!vue.configs.length) {
        //   // vue.dashboardConfigs = _.cloneDeep(vue.configs).map(v => { v.x = 0; v.y = 0; return v; });
        //   // vue.dashboardConfigs = vue.configs;
        //   vue.configs.forEach((v, i) => {
        //     vue.dashboardConfigs.splice(i, 1, v);
        //     if (_.last(vue.configs) == v && vue.dashboardConfigs.length > vue.configs.length) {
        //       vue.dashboardConfigs.splice(i + 1);
        //     }
        //   });
        // } else {
        //   vue.dashboardConfigs = [];
        // }
      },
    }
  },
  methods: {
    onContainerResize: function(size) {
      var vue = this;
      $Vue.set(vue.containerSize, "width", size.width);
      $Vue.set(vue.containerSize, "height", size.height);
    },
    onConponentClick: function(target) {
      var vue = this;

      vue.swapZindex(target);
    },
    onConponentActivated: function() {
      var vue = this;

      vue.swapZindex(window.event.target);
    },
    swapZindex: function(target) {
      var vue = this;

      var pane = $(target).closest(".component-pane");
      var refId = pane.prop("id");
      var targetId = refId.replace("vdr_", "");
      var curZ = vue.dashboardConfigs.find(v => v.i == targetId).z;
      var maxZ = _.max(vue.dashboardConfigs.map(v => v.z));

      _(vue.$refs).pickBy((v, k) => k.startsWith("vdr_")).forIn((v, k) => v[0].enabled = false);

      vue.dashboardConfigs.forEach(v => {
        if (v.i == targetId) {
          v.z = maxZ;
          vue.$refs[refId][0].enabled = true;
        } else {
          v.z = v.z - (v.z > curZ ? 1 : 0);
        }
      });
    },
    onConponentResize: function(x, y, width, height) {
      //console.log("resize", width, height);
    },
    onConponentDrag: function (x, y) {
      //console.log("drag", x, y);
    },
    minimizeComponent: function(item, list, isMinimized) {
      this.backupLayout();
      item.minimized = true;
      if (item.maximized) {
        this.currentLayout.forEach(v => {
          if (v.i != item.i) {
            v.hide = false;
          }
        });
      }
      this.minimizedItems.push(_.cloneDeep(item));
      console.log("minimize", item, this.currentLayout, this.minimizedItems);
    },
    restoreComponent: function(item, list, isMinimized) {
      this.backupLayout();
      if (isMinimized) {
        //最小化 => 元に戻す
        this.currentLayout.forEach(v => {
          if (v.i == item.i) {
            v.minimized = false;
          } else {
            v.hide = item.maximized;
          }
        });
        this.minimizedItems.splice(this.minimizedItems.findIndex(v => v.i == item.i), 1);
      } else {
        //最大化 => 通常
        this.currentLayout.forEach(v => {
          if (v.i == item.i) {
            $.extend(true, v, v.prev);
            v.maximized = false;
            v.prev = {};
          } else {
            v.hide = false;
          }
        });
      }
      console.log("restore", item, this.currentLayout, this.minimizedItems);
    },
    maximizeComponent: function(item, list, isMinimized) {
      var vue = this;
      vue.backupLayout();
      vue.currentLayout.forEach(v => {
        if (v.i == item.i) {
          v.prev = {
            "x": item.x,
            "y": item.y,
            "w": item.w,
            "h": item.h,
          };
          v.x = 0;
          v.y = 0;
          v.w = vue.colNum;
          v.h = vue.maxRows;
          v.i = item.i;
          v.info = item.info;
          v.maximized = true;
        } else {
          v.hide = true;
        }
      });
      console.log("maximize", item, vue.currentLayout, vue.minimizedItems);
    },
    closeComponent: function(item, list, isMinimized) {
      this.backupLayout();
      if (item.maximized && !isMinimized) {
        this.currentLayout.forEach(v => v.hide = false);
      }
      list.splice(list.findIndex(v => v.i == item.i), 1);

      console.log("close", item, this.currentLayout, this.minimizedItems);
    },
    backupLayout: function() {
        var json = JSON.stringify($(".component-pane").map((i, v) => {
          var element = $(v);
          var parent = element.parent();
          return {
            "x": element.position().left / parent.width(),
            "y": element.position().top / parent.height(),
            "z": i,
            "w": element.outerWidth() / parent.width(),
            "h": element.outerHeight() / parent.height(),
            "i": i,
            "info": {
              comp: "Component" + (i + 1),
              title: "コンポーネント" + (i + 1),
            },
          };
        }).get(), null, "\t");
    },
  },
};
</script>
