<template>
  <div>
    <video-player
      id="VideoComponent_VideoPlayer"
      class="video-player-box"
      ref="videoPlayer"
      :options="playerOptions"
      :playsinline="true"
      customEventName="customstatechangedeventname"

      @play="onPlayerPlay"
      @pause="onPlayerPause"
      @ended="onPlayerEnded"
      @waiting="onPlayerWaiting"
      @playing="onPlayerPlaying"
      @loadeddata="onPlayerLoadeddata"
      @timeupdate="onPlayerTimeupdate"
      @canplay="onPlayerCanplay"
      @canplaythrough="onPlayerCanplaythrough"

      @statechanged="onPlayerStateChanged"
      @ready="onPlayerReadied"
    >
    </video-player>
  </div>
</template>

<style>
#VideoComponent_VideoPlayer {
  width: 100%;
  height: 100%;
}
#VideoComponent_VideoPlayer div.video-js {
  width: 100% !important;
  height: 100% !important;
}
</style>

<script>
import ComponentBase from "./ComponentBase.vue";

import { videoPlayer } from "vue-video-player"
import "video.js/dist/video-js.css"

export default {
  mixins: [ComponentBase],
  name: "VideoComponent",
  title: "ビデオコンポーネント",
  components: {
    videoPlayer,
  },
  data () {
    return {
      playerOptions: {
        autoplay: true,
        muted: true,
        language: "ja",
        playbackRates: [0.5, 1.0, 1.5, 2.0],
        sources: [],
      }
    }
  },
  props: {
  },
  computed: {
    player: function() {
      return this.$refs.videoPlayer.player
    },
  },
  mounted: function() {
    var vue = this;

    vue.playerOptions.sources = vue.asSample ? [{ type: "video/mp4", src: "/statics/videos/sample.mp4" }] : vue.params.sources;
  },
  methods: {
    onPlayerPlay: function(player) {
      //console.log("onPlayerPlay", player);
    },
    onPlayerPause: function(player) {
      //console.log("onPlayerPause", player);
    },
    onPlayerEnded: function(player) {
      //console.log("onPlayerEnded", player);
      var currIndex = _.findIndex(player.options_.sources, player.currentSource());
      var nextIndex = currIndex + 1;
      nextIndex = nextIndex == player.options_.sources.length ? 0 : nextIndex;
      player.src([player.options_.sources[nextIndex]]);
      player.play();
    },
    onPlayerWaiting: function(player) {
      //console.log("onPlayerWaiting", player);
    },
    onPlayerPlaying: function(player) {
      //console.log("onPlayerPlaying", player);
    },
    onPlayerLoadeddata: function(player) {
      //console.log("onPlayerLoadeddata", player);
    },
    onPlayerTimeupdate: function(player) {
      //console.log("onPlayerTimeupdate", player);
    },
    onPlayerCanplay: function(player) {
      //console.log("onPlayerCanplay", player);
    },
    onPlayerCanplaythrough: function(player) {
      //console.log("onPlayerCanplaythrough", player);
    },
    onPlayerStateChanged: function(player) {
      //console.log("onPlayerStateChanged", player);
    },
    onPlayerReadied: function(player) {
      //console.log("onPlayerReadied", player);
    },
  }
};

</script>
