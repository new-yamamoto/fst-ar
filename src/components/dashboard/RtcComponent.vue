<template>
  <div>
    <video
      id="local_video"
      autoplay
      style="width: 320px; height: 240px; border: 1px solid black; margin: 5px;"
    />
    <button @click="startVideo">Start</button>
    <button @click="stopVideo">Stop</button>
  </div>
</template>

<script>
import ComponentBase from "./ComponentBase.vue";

export default {
  mixins: [ComponentBase],
  name: "RtcComponent",
  title: "コミュニケーションコンポーネント",
  data () {
    return {
      localStream: null,
    }
  },
  props: {
    params: Object,
  },
  components: {
  },
  mounted: function() {
  },
  watch: {
  },
  methods: {
    startVideo: function() {
      var vue = this;

      navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(stream => {
          console.log("mediaDevice.getUserMedia() success:", stream);
          vue.localStream = stream;
          $(vue.$el).find("#local_video")[0].srcObject = vue.localStream;
        })
        .catch(err => {
          console.log("mediaDevice.getUserMedia() error:", err);
          return;
        });
    },
    stopVideo: function() {
      var vue = this;
      $(vue.$el).find("#local_video")[0].srcObject = null;
    },
  }
};
</script>
