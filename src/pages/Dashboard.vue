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
      <grid-layout
        id="contents"
        ref="contents"
        :layout.sync="currentLayout"
        :col-num="colNum"
        :row-height="rowHeight"
        :isDraggable="draggable"
        :isResizable="resizable"
        :responsive="responsive"
        :vertical-compact=false
        :margin="[10, 10]"
        :use-css-transforms="true"
        :maxRows="maxRows"
        touch-action="none"
        style="height: 400px; touch-action: none;"
      >
        <grid-item v-for="(item, index) in currentLayout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="index"
          dragAllowFrom=".vue-draggable-handle"
          :style="item.hide || item.minimized ? 'visibility: hidden;' : ''"
        >
          <div class="vue-draggable-handle">
            <q-bar class="bg-primary text-white">
              <div class="ellipsis">
                {{item.info.title}}
                <q-tooltip v-if="!!item.info">{{item.info.title}}</q-tooltip>
              </div>
              <q-space ></q-space>
              <q-btn dense flat icon="minimize" @click="event => minimizeComponent(item, currentLayout)">
                <q-tooltip>最小化</q-tooltip>
              </q-btn>
              <q-btn v-if="item.maximized" dense flat icon="filter_none" @click="event => restoreComponent(item, currentLayout)">
                <q-tooltip>元に戻す</q-tooltip>
              </q-btn>
              <q-btn v-else dense flat icon="crop_din" @click="event => maximizeComponent(item, currentLayout)">
                <q-tooltip>最大化</q-tooltip>
              </q-btn>
              <q-btn dense flat icon="close" @click="event => closeComponent(item, currentLayout)">
                <q-tooltip>閉じる</q-tooltip>
              </q-btn>
              <q-btn v-if="isConfig" dense flat icon="fas fa-cog q-icon" @click="event => configItem(item)">
                <q-tooltip>設定</q-tooltip>
              </q-btn>
            </q-bar>
          </div>
          <keep-alive>
            <component :is="item.info.comp" :ref="item.info.comp" v-bind="{params: item.info.params}"></component>
          </keep-alive>
        </grid-item>
      </grid-layout>
      <grid-layout
        id="minimized"
        ref="minimized"
        :layout.sync="minimizedItems"
        :col-num=6
        :row-height=34
        :isDraggable=false
        :isResizable=false
        :responsive=true
        :vertical-compact=true
        :margin="[10, 10]"
        :use-css-transforms="true"
        :maxRows=2
      >
        <grid-item v-for="(item, index) in minimizedItems"
          :x="index % 3 * 2"
          :y="Math.floor(index / 3)"
          :w=2
          :h=1
          :i="item.i"
          :key="index"
          dragAllowFrom=".vue-draggable-handle"
        >
          <div class="vue-draggable-handle">
            <q-bar class="bg-primary text-white">
              <div class="ellipsis">
                {{item.info.title}}
                <q-tooltip v-if="!!item.info">{{item.info.title}}</q-tooltip>
              </div>
              <q-space ></q-space>
              <q-btn dense flat icon="filter_none" @click="event => restoreComponent(item, minimizedItems, true)">
                <q-tooltip>元に戻す</q-tooltip>
              </q-btn>
              <q-btn dense flat icon="close" @click="event => closeComponent(item, minimizedItems, true)">
                <q-tooltip>閉じる</q-tooltip>
              </q-btn>
            </q-bar>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </q-page>
</template>

<style scoped>
.p-page {
  min-height: unset !important;
}
.VueCarousel {
  width: 100%;
  border: groove 1px black;
}
.VueCarousel-slide {
  border: groove 1px black;
}
</style>
<style>
/*** vue-grid-layout ***/
#content {
    width: 100%;
}
.vue-grid-layout {
    background: #eee;
}
.layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
}
.eventsJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
    height: 100px;
    overflow-y: scroll;
}
.columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}
.vue-resizable-handle {
    background-size: 100% !important;
    padding: 0px !important;
}
.vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 1px solid black;
}
.vue-grid-item.resizing {
    opacity: 0.9;
}
.vue-grid-item.static {
    background: #cce;
}
.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}
.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}
.vue-grid-item .minMax {
    font-size: 12px;
}
.vue-grid-item .add {
    cursor: pointer;
}
.vue-grid-item.no-touch {
  touch-action: auto;
}
.vue-draggable-handle {
    border-bottom: solid 1px black;
    cursor: pointer;
}
#minimized .vue-draggable-handle {
    border-bottom: none;
}
</style>

<script>
import VueGridLayout from "vue-grid-layout";

export default {
  name: "dashboard",
  data () {
    return {
      isConfig: true,
      colNum: 6,
      maxRows: 4,
      rowHeight: 80,
      currentLayout: [
        { "x": 0, "y": 0, "w": 2, "h": 2, "i": 0, "info": { comp: "GraphComponent", title: "コンポーネント1", params: { a: 10 } } },
        { "x": 2, "y": 0, "w": 4, "h": 2, "i": 1, "info": { comp: "VideoComponent", title: "コンポーネント2", params: { a: 20 } } },
        { "x": 0, "y": 2, "w": 5, "h": 2, "i": 2, "info": { comp: "DocumentComponent", title: "コンポーネント3", params: { a: 30 } } },
      ],
      minimizedItems: [
        { "x": 5, "y": 2, "w": 1, "h": 2, "i": 3, "info": { comp: "GraphComponent", title: "コンポーネント4", params: { a: 40 } } },
      ],
      operations: [],
      draggable: true,
      resizable: true,
      responsive: true,
      index: 0,
    }
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    GraphComponent: () => import("../components/dashboard/GraphComponent"),
    VideoComponent: () => import("../components/dashboard/VideoComponent"),
    DocumentComponent: () => import("../components/dashboard/DocumentComponent"),
    TagViewComponent: () => import("../components/dashboard/TagViewComponent"),
  },
  computed: {
    dashboardComponents: function() {
      var comps = require("../components/dashboard");
      console.log("dashboardComponents", comps);
      return _.values(comps.default);
    },
  },
  created: function() {
  },
  mounted: function() {
    var vue = this;

    //Vueコンポーネント参照
    window[vue.$options.name] = vue;
  },
  methods: {
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
      this.operations.push(
        {
          currentLayout: _.cloneDeep(this.currentLayout),
          minimizedItems: _.cloneDeep(this.minimizedItems),
        }
      );
    },
  },
};
</script>
