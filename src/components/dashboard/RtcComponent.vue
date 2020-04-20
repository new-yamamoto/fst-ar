<template>
  <div>
    <video-player
      id="local_video"
      :class='["video local", "video-player-box"]'
      ref="videoPlayer"
      :playsinline="true"
      :options="{}"
      autoplay
    />
    <template
      v-for="con in peerConnections"
    >
      <video-player
        v-bind:key="con.id"
        :id='"remote_video_" + con.id'
        :ref='"remote_video_" + con.id'
        :class='["video local", "video-player-box"]'
        :playsinline="true"
        :options="{}"
        autoplay
      />
    </template>
    <!--
    <video
      id="local_video"
      class="video local"
      autoplay
    />
    <template
      v-for="con in peerConnections"
    >
      <video
        v-bind:key="con.id"
        :id='"remote_video_" + con.id'
        class="video remote"
        autoplay
      />
    </template>
    -->
    <q-bar>
      <q-space />
      <q-btn
        push
        stack
        unelevated
        no-caps
        color="primary"
        text-color="white"
        label="Start"
        icon="fas fa-video"
        @click="startVideo"
      />
      <q-btn
        push
        stack
        unelevated
        no-caps
        color="primary"
        text-color="white"
        label="Stop"
        icon="fas fa-video-slash"
        @click="stopVideo"
      />
      <q-btn
        push
        stack
        unelevated
        no-caps
        color="primary"
        text-color="white"
        label="Connect"
        icon="fas fa-link"
        @click="connect"
      />
      <q-btn
        push
        stack
        unelevated
        no-caps
        color="primary"
        text-color="white"
        label="Disconnect"
        icon="fas fa-unlink"
        @click="hangUp"
      />
    </q-bar>
  </div>
</template>

<style scoped>
.q-splitter {
  width: calc(100% - 10px);
  height: calc(100% - 55px) !important;
  border: 1px solid black;
  margin: 5px;
}
.video {
  /* width: calc(100% - 10px);
  height: calc(100% - 10px); */
  width: calc(100% / 3);
  height: calc(100% / 4);
  border: 0px solid black;
  margin: 5px;
}
.video.local {
}
.video.remote {
}
.q-bar {
  background-color: white;
  height: unset;
  padding-left: 5px;
  padding-right: 5px;
}
.q-btn {
  width: 100px;
  margin-left: 5px;
}
</style>

<script>
import ComponentBase from "../ComponentBase.vue";
import io from "socket.io-client";
import { videoPlayer } from "vue-video-player"
import "video.js/dist/video-js.css"

export default {
  mixins: [ComponentBase],
  name: "RtcComponent",
  title: "コミュニケーションコンポーネント",
  data () {
    return {
      splitterRatio: 50,

      localVideo: null,
      localStream: null,

      signalingSrvUrl: null,
      rtcSocket: null,

      peerConnections: [],
      MAX_CONNECTION_COUNT: 3,

      textForSendSdp: null,
      textToReceiveSdp: null,
    }
  },
  props: {
    params: Object,
  },
  components: {
    videoPlayer,
  },
  mounted: function() {
    var vue = this;
    vue.localVideo = $(vue.$el).find("#local_video video")[0];

    //WebSocket By socket.io
    vue.signalingSrvUrl = "https://fst-ar.rtc:4002/";
    vue.rtcSocket = io(vue.signalingSrvUrl);

    //onConnect
    vue.rtcSocket.on("connect", event => vue.rtcSocket.emit("enter", vue._id)); //TODO: vue._uid -> login user id

    //onMessage
    vue.rtcSocket.on("message", message => {
      console.log("message", message);
      var fromId = message.from;

      if (message.type === "offer") {
        console.log("Received offer ...");
        var offer = new RTCSessionDescription(message);
        vue.setOffer(fromId, offer);
      }
      else if (message.type === "answer") {
        console.log("Received answer ...");
        var answer = new RTCSessionDescription(message);
        vue.setAnswer(fromId, answer);
      }
      else if (message.type === "candidate") {
        console.log("Received ICE candidate ...");
        var candidate = new RTCIceCandidate(message.ice);
        console.log(candidate);
        vue.addIceCandidate(fromId, candidate);
      }
      else if (message.type === "call me") {
        if (!vue.isReadyToConnect()) {
          console.log("Not ready to connect, so ignore");
          return;
        }

        if (!!vue.isConnectedWith(fromId)) {
          console.log("already connected, so ignore");
        }
        else {
          vue.makeOffer(fromId);
        }
      }
      else if (message.type === "bye") {
        if (!!vue.isConnectedWith(fromId)) {
          vue.stopConnection(fromId);
        }
      }
    });
    vue.rtcSocket.on("user disconnected", event => {
      console.log("====user disconnected==== ", event);
      let id = event.id;
      if (!!vue.isConnectedWith(id)) {
        vue.stopConnection(id);
      }
    });
  },
  watch: {
  },
  methods: {
    getDeviceStream: function(option) {
      if ("getUserMedia" in navigator.mediaDevices) {
        return navigator.mediaDevices.getUserMedia(option);
      }
      else {
        return new Promise(function(resolve, reject){
          navigator.getUserMedia(option,
            resolve,
            reject
          );
        });
      }
    },
    startVideo: function() {
      var vue = this;

      vue.getDeviceStream({video: true, audio: false})
        .then(stream => {
          console.log("mediaDevice.getUserMedia() success:", stream);
          vue.localStream = stream;
          vue.playVideo(vue.localVideo, stream);
        })
        .catch(err => {
          console.log("mediaDevice.getUserMedia() error:", err);
          return;
        });
    },
    playVideo: function(element, stream) {
      var vue = this;

      if ("srcObject" in element) {
        element.srcObject = stream;
      }
      else {
        element.src = window.URL.createObjectURL(stream);
      }
      element.play();
      element.volume = 0;
    },
    stopVideo: function() {
      var vue = this;

      vue.pauseVideo(vue.localVideo);
      vue.stopLocalStream(vue.localStream);
    },
    pauseVideo: function(element) {
      element.pause();
      if ("srcObject" in element) {
        element.srcObject = null;
      }
      else {
        if (element.src && (element.src !== "") ) {
          window.URL.revokeObjectURL(element.src);
        }
        element.src = "";
      }
    },
    stopLocalStream: function(stream) {
      var tracks = stream.getTracks();
      if (!tracks) {
        console.error("NO tracks");
        return;
      }
      tracks.forEach(v => v.stop());
    },
    emitTo: function(id, msg) {
      var vue = this;
      msg.sendto = id;
      vue.rtcSocket.emit("message", msg);
    },
    emitRoom: function(msg) {
      var vue = this;
      vue.rtcSocket.emit("message", msg);
    },
    isReadyToConnect: function() {
      var vue = this;
      return !!vue.localStream;
    },
    canConnectMore: function() {
      var vue = this;
      return !vue.MAX_CONNECTION_COUNT || vue.peerConnections.length < vue.MAX_CONNECTION_COUNT;
    },
    isConnectedWith: function(id) {
      var vue = this;
      return !!vue.peerConnections.filter(v => v.id == id).length;
    },
    addConnection: function(id, peer) {
      var vue = this;
      vue.peerConnections.push({ id: id, connection: peer });
    },
    getConnection: function(id) {
      var vue = this;
      var peer = vue.peerConnections.find(v => v.id == id);
      return !!peer ? peer.connection : null;
    },
    deleteConnection: function(id) {
      var vue = this;
      vue.peerConnections.splice(vue.peerConnections.findIndex(v => v.id == id), 1);
    },
    stopConnection: function(id) {
      var vue = this;
      vue.detachVideo(id);

      if (!!vue.isConnectedWith(id)) {
        var peer = vue.getConnection(id);
        peer.close();
        vue.deleteConnection(id);
      }
    },
    stopAllConnection: function() {
      var vue = this;
      vue.peerConnections.forEach(v => vue.stopConnection(v.id));
    },
    getVideo: function(id) {
      var vue = this;

      var video = $(vue.$el).find("#remote_video_" + id);
      return !!video.length ? video[0] : null;
    },
    isVideoAttached: function(id) {
      var vue = this;

      var video = vue.getVideo(id);
      return !!video ? (!!video.srcObject || !!video.src) : false;
    },
    attachVideo: function(id, stream) {
      var vue = this;

      var video = vue.getVideo(id);
      vue.playVideo(video, stream);
    },
    detachVideo: function(id) {
      var vue = this;

      var video = vue.getVideo(id);
      vue.pauseVideo(video);
    },
    sendSdp: function(id, description) {
      var vue = this;

      var message = { type: description.type, sdp: description.sdp };
      console.log("sending SDP=" + message);
      vue.emitTo(id, message);
    },
    sendIceCandidate: function(id, candidate) {
      var vue = this;

      var message = { type: "candidate", ice: candidate };
      console.log("sending candidate", message);

      if (!!vue.isConnectedWith(id)) {
        vue.emitTo(id, message);
      }
      else {
        console.warn("connection NOT EXIST or ALREADY CLOSED. so skip candidate")
      }
    },
    prepareNewConnection: function(id) {
      var vue = this;

      var pc_config = {"iceServers":[]};
      var peer = new RTCPeerConnection(pc_config);

      // --- on get remote stream ---
      if ("ontrack" in peer) {
        peer.ontrack = event => {
          console.log("-- peer.ontrack()");

          if (!!vue.isVideoAttached(id)) {
            console.log("stream already attached, so ignore");
          }
          else {
            vue.attachVideo(id, event.streams[0]);
          }
        };
      }
      else {
        peer.onaddstream = event => {
          console.log("-- peer.onaddstream()");

          vue.attachVideo(id, event.stream);
        };
      }

      peer.onicecandidate = event => {
        if (!!event.candidate) {
          vue.sendIceCandidate(event.candidate);
        }
      };

      peer.onnegotiationneeded = event => {
        console.log("-- onnegotiationneeded() ---");
      };

      peer.onicecandidateerror = event => {
        console.error("ICE candidate ERROR:", event);
      };

      peer.onsignalingstatechange = () => {
        console.log("== signaling status=" + peer.signalingState);
      };

      peer.oniceconnectionstatechange = () => {
        console.log("== ice connection status=" + peer.iceConnectionState);
        if (peer.iceConnectionState === "disconnected") {
          console.log("-- disconnected --");
          vue.stopConnection(id);
        }
      };

      peer.onicegatheringstatechange = () => {
        console.log("==***== ice gathering state=" + peer.iceGatheringState);
      };

      peer.onconnectionstatechange = () => {
        console.log("==***== connection state=" + peer.connectionState);
      };

      peer.onremovestream = event => {
        console.log("-- peer.onremovestream()");
        vue.deleteRemoteStream(id);
        vue.detachVideo(id);
      };

      if (!!vue.localStream) {
        console.log("Adding local stream...");
        peer.addStream(vue.localStream);
      }
      else {
        console.warn("no local stream, but continue.");
      }

      return peer;
    },
    makeOffer: function(id) {
      var vue = this;
      var peerConnection = vue.prepareNewConnection(id);
      peerConnection.createOffer()
        .then(description => {
          return peerConnection.setLocalDescription(description);
        })
        .then(() => {
          vue.sendSdp(id, peerConnection.localDescription);
        })
        .catch(err => {
          console.error("makOffer Error", id, err);
        });

      vue.addConnection(id, peerConnection);
    },
    setOffer: function(id, description) {
      var vue = this;

      var peerConnection = vue.prepareNewConnection(id);
      peerConnection.setRemoteDescription(description)
        .then(() => {
          vue.makeAnswer(id);
        })
        .catch(err => {
          console.error("setOffer Error", id, err);
        });

      vue.addConnection(id, peerConnection);
    },
    makeAnswer: function(id) {
      var vue = this;

      var peerConnection = vue.getConnection(id);

      if (!peerConnection) {
        console.error("peerConnection NOT exist!");
        return;
      }

      peerConnection.createAnswer()
        .then(description => {
          return peerConnection.setLocalDescription(description);
        })
        .then(() => {
          vue.sendSdp(id, peerConnection.localDescription);
        })
        .catch(err => {
          console.error("peerConnection createAnswer Error", id, err);
        });
    },
    setAnswer: function(id, description) {
      var vue = this;

      var peerConnection = vue.getConnection(id);

      if (!peerConnection) {
        console.error("peerConnection NOT exist!");
        return;
      }

      peerConnection.setRemoteDescription(description)
        .then(() => {
        })
        .catch(err => {
          console.error("peerConnection setRemoteDescription Error", id, err);
        });
    },
    addIceCandidate: function(id, candidate) {
      if (!vue.isConnectedWith(id)) {
        console.warn("NOT CONNEDTED or ALREADY CLOSED with id=" + id + ", so ignore candidate");
        return;
      }

      var peerConnection = vue.getConnection(id);
      if (!!peerConnection) {
        peerConnection.addIceCandidate(candidate);
      }
      else {
        console.error("PeerConnection not exist!");
        return;
      }
    },
    connect: function() {
      var vue = this;

      if (!vue.isReadyToConnect()) {
        console.warn("NOT READY to connect");
      }
      else if (!vue.canConnectMore()) {
        console.log("TOO MANY connections");
      }
      else {
        vue.emitRoom({type: "call me"});
      }
    },
    hangUp: function() {
      var vue = this;

      vue.emitRoom({ type: "bye" });
      vue.stopAllConnection();
    },
  }
};
</script>
