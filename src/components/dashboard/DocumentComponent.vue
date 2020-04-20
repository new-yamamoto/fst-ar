<template>
  <div>
    <div class="viewer pdf-viewer">
    </div>
    <div class="viewer xls-viewer">
    </div>
    <div class="viewer doc-viewer">
    </div>
  </div>
</template>

<style scoped>
.viewer {
  width: 100%;
  height: 100%;
}
</style>

<script>
import ComponentBase from "../ComponentBase.vue";

export default {
  mixins: [ComponentBase],
  name: "DocumentComponent",
  title: "ドキュメントコンポーネント",
  components: {
  },
  data () {
    return {
      type: null,
    }
  },
  props: {
  },
  computed: {
    viewerUrl: function() {
      var vue = this;

      //contents url
      var targetUrl = vue.asSample ? "/statics/documents/test1.pdf" : vue.params.url;

      //viewer url
      return "/statics/pdf.js-gh-pages/web/viewer.html?file=" + targetUrl + "#zoom=page-width";
    },
  },
  mounted: function() {
    var vue = this;
    console.log("Doc Comp mounted");
    vue.type = vue.asSample ? "pdf" : vue.params.type;
    vue.setDocument();
  },
  methods: {
    setDocument: function() {
      var vue = this;

      switch(vue.type) {
        case "pdf":
            var viewer = $("<iframe>")
              .attr("src", vue.viewerUrl)
              .css("width", "100%")
              .css("height", "100%")
              .on("load", event => {
                $(event.target).contents().find("body")
                  .on("click touchstart", ev => vue.onConponentClick(ev));
              })
              ;

            $(vue.$el).find(".pdf-viewer").remove("iframe").append(viewer);
          break;
        case "xls":
          //TODO: excel docuemnt
        case "doc":
          //TODO: word docuemnt
        default:

      }
    }
  },
};
</script>
