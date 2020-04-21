<template>
  <div>
    <q-bar class="bg-white text-primary">
      <q-space ></q-space>
      <q-badge color="orange" style="height: 20px;">{{Is3D ? "3D" : "2D"}}</q-badge>
      <q-badge color="blue" style="height: 20px;">{{SourceType}}</q-badge>
    </q-bar>
    <div class="image-container" style="height: calc(100% - 32px);">
      <div id="CrossKeyContainer">
        <q-btn
          fab-mini
          id="CrosskeyTop"
          icon="fas fa-caret-up"
          style="position: absolute; top: 0px; left: 40px;"
        ></q-btn>
        <q-btn
          fab-mini
          id="CrosskeyLeft"
          icon="fas fa-caret-left"
          style="position: absolute; top: 40px; left: 0px;"
        ></q-btn>
        <q-btn
          fab-mini
          id="CrosskeyRight"
          icon="fas fa-caret-right"
          style="position: absolute; top: 40px; left: 80px;"
        ></q-btn>
        <q-btn
          fab-mini
          id="CrosskeyBottom"
          icon="fas fa-caret-down"
          style="position: absolute; top: 80px; left: 40px;"
        ></q-btn>

        <q-btn-dropdown
          flat
          id="CrosskeyZoom"
          :label='(ZoomRatio * 100).toFixed(0) + "%"'
          style="position: absolute; width: 40px; top: 40px; left: 40px;"
        >
          <q-list>
            <q-item clickable v-close-popup @click="setZoom(200);">
              <q-item-section>
                <q-item-label>200%</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="setZoom(150);">
              <q-item-section>
                <q-item-label>100%</q-item-label>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="setZoom(100);">
              <q-item-section>
                <q-item-label>50%</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="canvas-wrapper" style="height: 100%; position: relative; overflow: hidden;">
        <canvas id="MainCanvas"></canvas>
        <div v-for="tag in TagLayouts" v-bind:key=tag.id
          :aria-label='!!i18n.locale ? tag["name_" + i18n.locale] : tag.name'
          :data-balloon-pos=tag.balloon
          data-balloon-visible
          :class='"TagMarker" + tag.style'
          :style=tag.layoutStyle
          @click="ev => showTagDetail(ev, tag)"
        ></div>
      </div>
      <div class="TagInfo" :style=TagInfoStyle>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentBase from "../ComponentBase.vue";
import "balloon-css";

export default {
  mixins: [ComponentBase],
  name: "TagViewComponent",
  title: "タグコンポーネント",
  components: {
  },
  data () {
    return {
      SourceType: null,
      WireFrame: null,
      Is3D: false,
      MainSource: null,

      Tags: [
        {
          name: "タグ001",
          name_ja: "タグ001",
          "name_en-us": "TAG001",
          id: "tag_001",
          style: "Circle",
          balloon: "left",
          size: {
            width: 90,
            height: 90,
          },
          pos: {
            top: 255,
            left: 365,
          },
        },
        {
          name: "タグ002",
          name_ja: "タグ002",
          "name_en-us": "TAG002",
          id: "tag_002",
          style: "Circle",
          balloon: "up",
          color: "black",
          bgcolor: "rgba(255, 255, 0, 0.25)",
          size: {
            width: 60,
            height: 60,
          },
          pos: {
            top: 195,
            left: 440,
          },
        },
        {
          name: "タグ003",
          name_ja: "タグ003",
          "name_en-us": "TAG003",
          id: "tag_003",
          style: "Rectangle",
          balloon: "right",
          size: {
            width: 100,
            height: 60,
          },
          pos: {
            top: 220,
            left: 600,
          },
        },
        {
          name: "タグ004",
          name_ja: "タグ004",
          "name_en-us": "TAG004",
          id: "tag_004",
          style: "Rectangle",
          balloon: "down",
          size: {
            width: 50,
            height: 50,
          },
          pos: {
            top: 450,
            left: 350,
          },
        },
      ],
      TagInfoStyle: null,

      Image: null,
      Canvas: null,
      Context: null,

      cr: null,
      CropperOptions: {
        viewMode: 0,
        dragMode: "move",
        toggleDragModeOnDblclick: false,
        guide: false,
        center: false,
        modal: false,
        autoCrop: false,
      },

      ZoomRatio: 0,
      OffsetX: 0,
      OffsetY: 0,
    }
  },
  props: {
  },
  computed: {
    TagLayouts: function() {
      var vue = this;

      var layouts = vue.Tags.map(v => {
        v.actualWidth = v.size.width * vue.ZoomRatio;
        v.actualHeight = v.size.height * vue.ZoomRatio;
        v.actualTop = v.pos.top * vue.ZoomRatio + vue.OffsetY;
        v.actualLeft = v.pos.left * vue.ZoomRatio + vue.OffsetX;

        v.layoutStyle = `
          position: absolute;
          width: ${v.actualWidth}px;
          height: ${v.actualHeight}px;
          top: ${v.actualTop}px;
          left: ${v.actualLeft}px;
          background-color: ${v.bgcolor || "rgb(255, 255, 255, 0.25)"};
        `;

        return v;
      });
      return layouts;
    },
  },
  created: function() {
    var vue = this;
    // console.log("tv created");
    // var img = new Image();
    // img.onload = () => {
    //   $(vue.$el).css("height", (img.height - 32) + "px");
    //   console.log("created", $(vue.$el).css("height"));
    // };
    // img.src = vue.MainSource;
  },
  mounted: function() {
    // console.log("tv mounted");
    var vue = this;

    vue.SourceType = !!vue.asSample ? "PNG" : vue.params.type;
    vue.MainSource = !!vue.asSample ? "/statics/images/TagViewSample.png" : vue.params.source;

    vue.Canvas = $("#MainCanvas")[0];
    vue.Context = vue.Canvas.getContext("2d");

    var img = new Image();
    img.onload = () => {
      //load canvas image
      vue.Image = img;
      var parent = $("#MainCanvas").parent();

      vue.ZoomRatio = _.min([parent.width() / vue.Image.width, parent.height() / vue.Image.height]);

      var h = vue.Image.height * vue.ZoomRatio;

      $(vue.$el).parent().css("height", (h + 64) + "px");

      vue.Canvas.width = parent.width();
      vue.Canvas.height = h;

      vue.Context.drawImage(
        img,
        0,
        0,
        img.width * vue.ZoomRatio,
        img.height * vue.ZoomRatio,
      );

      //set Cropper
      var cr;
      vue.Canvas.addEventListener("ready", event => {
        console.log("cr ready");
        cr.moveTo(0);
        vue.locateTag(cr.getCanvasData());

        //set cropper tapped and double tapped events
        cr.container.addEventListener("touchstart", ev => {
          var el = $(ev.target);
          var tapCount = (el.prop("tapCount") || 0) * 1;

          if(!tapCount) {
            el.prop("tapCount", ++tapCount);
            setTimeout(() => el.prop("tapCount", 0), 350);
          } else {
            //double tapped
            ev.preventDefault();

            //toggle drag mode
            // cr.setDragMode(cr.options.dragMode == "move" ? "crop" : "move");
            el.prop("tapCount", 0);
          }
        })
      });
      vue.Canvas.addEventListener("zoom", event => {
        // Prevent zoom in under 0.5
        // if (event.detail.ratio < 0.5) {
        //   event.preventDefault();
        // }
        // console.log("cr zoom", event.detail.ratio);
      });
      vue.Canvas.addEventListener("crop", event => {
        vue.locateTag(cr.getCanvasData());
      });

      cr = new window.Cropper(vue.Canvas, vue.CropperOptions);
      vue.cr = cr;
      window.cr = cr;
    };
    img.src = vue.MainSource;
  },
  methods: {
    setZoom: function(zoom) {
      var vue = this;
    },
    showTagDetail: function(ev, tag) {
      console.log("select tag:" + tag.id, tag);
    },
    locateTag: function(canvas) {
      var vue = this;
      var canvas = cr.getCanvasData();

      vue.ZoomRatio = canvas.width / vue.Image.width;
      vue.OffsetX = canvas.left;
      vue.OffsetY = canvas.top;
    },
  }
};

</script>

<style>
#CrossKeyContainer {
  width: 120px;
  height: 120px;
  position: absolute;
  top: 77px;
  left: 5px;
  padding: 0px;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 1;
}
#CrosskeyZoom i {
  display: none;
}
.TagMarkerRectangle {
	background-color: rgba(255,255,255,0.25);
  border: solid 1px black;
}
.TagMarkerCircle {
	background-color: rgba(255,255,255,0.25);
  border: solid 1px black;
  border-radius: 50%;
}
.TagInfo {
  background-color: white;
  border: solid 3px #027BE3;
  position: absolute;
  width: 200px;
  height: 300px;
  bottom: 0px;
  right: 0px;
}
.cropper-drag-box.cropper-modal {
  background-color: transparent;
  opacity: unset;
}
</style>
<style>
:root{
	--balloon-font-size: 14px;
	--balloon-color: rgba(255,255,255,0.75);
}
[aria-label][data-balloon-pos]:after{
	color:black !important;
	opacity:0;
	pointer-events:none;
	transition:all 0.18s ease-out 0.18s;
  text-indent:0;
	font-weight:normal;
	font-style:normal;
	text-shadow:none;
	font-size:var(--balloon-font-size);
	background:var(--balloon-color);
	border-radius:2px;
	content:attr(aria-label);
	padding:.5em 1em;
	position:absolute;
	white-space:nowrap;
	z-index:10
}
[aria-label][data-balloon-pos]:before{
	width:0;
	height:0;
	border:5px solid transparent;
	border-top-color:var(--balloon-color);
	opacity:0;
	pointer-events:none;
	transition:all 0.18s ease-out 0.18s;
	content:"";
	position:absolute;
  z-index:10
}
</style>
