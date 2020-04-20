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
          :label='(Rate * Zoom * 100).toFixed(0) + "%"'
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
      <div class="image-wrapper" style="height: 100%;">
        <img
          id="MainImage"
          :src="MainSource"
          style="width: 100%; height: auto;"
        >
          <q-resize-observer @resize="onImageResize" ></q-resize-observer>
        </img>
      </div> -->
      <!-- タグエレメントはデータから動的に配置 -->
      <div id="tags">
        <div v-for="tag in tagLayouts" v-bind:key=tag.id
          :aria-label=tag.name
          :data-balloon-pos=tag.balloon
          data-balloon-visible
          :class='"TagMarker" + tag.style'
          style="position: absolute;"
          :style=tag.layoutStyle
          @click="ev => showTagDetail(ev, tag)"
        ></div>
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

      Rate: 0,
      Zoom: 1.0,
      OffsetX: 0,
      OffsetY: 0,

      tags: [
        {
          name: "タグ001",
          id: "tag_001",
          style: "Circle",
          balloon: "left",
          size: {
            width: 90,
            height: 90,
          },
          pos: {
            top: 260,
            left: 355,
          },
        },
        {
          name: "タグ002",
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
          id: "tag_004",
          style: "Rectangle",
          balloon: "down",
          size: {
            width: 50,
            height: 50,
          },
          pos: {
            top: 500,
            left: 350,
          },
        },
      ],
      cropperOptions: {
        viewMode: 1,
        guide: false,
        center: false,
        modal: false,
        autoCrop: false,
      },

      Canvas: null,
      Context: null,
    }
  },
  props: {
  },
  computed: {
    tagLayouts: function() {
      var vue = this;
      var f = vue.Rate * vue.Zoom;

      var layouts = vue.tags.map(v => {
        v.actualWidth = v.size.width * f;
        v.actualHeight = v.size.height * f;
        v.actualTop = v.pos.top * f - vue.OffsetY * vue.Rate;
        v.actualLeft = v.pos.left * f - vue.OffsetX * vue.Rate;
        v.layoutStyle = `
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
  mounted: function() {
    var vue = this;

    vue.SourceType = !!vue.asSample ? "PNG" : vue.params.type;
    vue.MainSource = !!vue.asSample ? "/statics/images/TagViewSample.png" : vue.params.source;

    $("img#MainImage").on("load", ev => {
      vue.Rate = $("img#MainImage").width() / $("img#MainImage").prop("naturalWidth");
      //PinchZoom.js create instance
      var pz = new PinchZoom(
        $("img#MainImage").parent("div")[0],
        {
          minZoom: 1.0,
          onZoomUpdate: (p, e) => {
            vue.Zoom = p.zoomFactor;
            vue.OffsetX = p.offset.x;
            vue.OffsetY = p.offset.y;

          },
          onDragUpdate: (p, e) => {
            vue.Zoom = p.zoomFactor;
            vue.OffsetX = p.offset.x;
            vue.OffsetY = p.offset.y;
          },
        },
      );
      window.pz = pz;
    });

    //calc ImageRate
    // vue.Rate = $("img#MainImage").width() / $("img#MainImage").prop("naturalWidth");

    // $("img#MainImage").on("load", ev => {
    //   vue.Rate = $("img#MainImage").width() / $("img#MainImage").prop("naturalWidth");      //Cropper
    //   // var cr = new window.Cropper($("img#MainImage")[0], vue.cropperOptions);
    //   // window.cr = cr;
    // });
  },
  methods: {
    setZoom: function(zoom) {
      var vue = this;
    },
    showTagDetail: function(ev, tag) {
      console.log("select tag:" + tag.id, tag);
    },
    onImageResize: function() {
      var vue = this;
    },
    resizeCanvas: function() {
      var vue = this;
      vue.Canvas.width = $("#MainCanvas").parent().width();
      vue.Canvas.height = $("#MainCanvas").parent().height();
      var rate = _.min([vue.Canvas.width / img.width, vue.Canvas.height / img.height]);
      vue.Context.drawImage(
        img,
        0,
        0,
        img.width * rate,
        img.height * rate,
      );
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
