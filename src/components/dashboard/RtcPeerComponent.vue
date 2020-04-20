<template>
  <div>
    <q-splitter
      v-model="splitterRatio"
      style="height: 300px"
      :limits="[0, 100]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      separator-class="bg-black"
    >
      <template v-slot:before>
        <video
          id="local_video"
          class="video local"
          autoplay
        />
      </template>
      <template v-slot:after>
        <video
          id="remote_video"
          class="video remote"
          autoplay
        />
      </template>
    </q-splitter>
    <div style="display: flex;">
      <p>SDP to send:
        <br />
        <textarea id="text_for_send_sdp" v-model="textForSendSdp" rows="5" cols="60" readonly="readonly">SDP to send</textarea>
      </p>
      <p>SDP to receive: <button type="button" @click="onSdpText">Receive remote SDP</button>
        <br />
        <textarea id="text_for_receive_sdp" v-model="textToReceiveSdp" rows="5" cols="60"></textarea>
      </p>
    </div>
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
  height: calc(100% - 255px) !important;
  border: 1px solid black;
  margin: 5px;
}
.video {
  width: calc(100% - 10px);
  height: calc(100% - 10px);
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

export default {
  mixins: [ComponentBase],
  name: "RtcComponent",
  title: "コミュニケーションコンポーネント",
  data () {
    return {
      splitterRatio: 50,

      signalingSrvUrl: null,
      rtcSocket: null,

      peerConnection: null,
      localVideo: null,
      remoteVideo: null,
      localStream: null,
      remoteStream: null,

      textForSendSdp: null,
      textToReceiveSdp: null,
    }
  },
  props: {
    params: Object,
  },
  components: {
  },
  mounted: function() {
    var vue = this;
    vue.localVideo = $(vue.$el).find("#local_video")[0];
    vue.remoteVideo = $(vue.$el).find("#remote_video")[0];

    //WebSocket By ws
    // vue.signalingSrvUrl = "wss://fst-ar.rtc:4001/";
    // vue.rtcSocket = new WebSocket(vue.signalingSrvUrl);

    //WebSocket By socket.io
    vue.signalingSrvUrl = "https://fst-ar.rtc:4002/";
    vue.rtcSocket = io(vue.signalingSrvUrl);

    vue.rtcSocket.on("connect", event => vue.rtcSocket.emit("enter", vue._id)); //TODO: vue._uid -> login user id

    vue.rtcSocket.onopen = event => console.log("socket opened", event);
    vue.rtcSocket.onerror = err => console.error("socket error:", err);
    vue.rtcSocket.onmessage = event => {
      console.log("socket message", event.data);
      var message = JSON.parse(event.data);
      if (message.type === "offer") {
        // -- got offer ---
        console.log("Received offer ...");
        vue.textToReceiveSdp = message.sdp;
        var offer = new RTCSessionDescription(message);
        vue.setOffer(offer);
      } else if (message.type === "answer") {
        // --- got answer ---
        console.log("Received answer ...");
        vue.textToReceiveSdp = message.sdp;
        var answer = new RTCSessionDescription(message);
        vue.setAnswer(answer);
      } else if (message.type === "candidate") {
        // --- got ICE candidate ---
        console.log("Received ICE candidate ...");
        var candidate = new RTCIceCandidate(message.ice);
        console.log(candidate);
        if (vue.peerConnection) {
          vue.peerConnection.addIceCandidate(candidate);
        }
        else {
          console.error("PeerConnection not exist!");
          return;
        }
      }
    };
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
    stopVideo: function() {
      var vue = this;

      vue.pauseVideo(vue.localVideo);
      vue.stopLocalStream(vue.localStream);
    },
    playVideo: function(element, stream) {
      if ("srcObject" in element) {
        element.srcObject = stream;
      }
      else {
        element.src = window.URL.createObjectURL(stream);
      }
      element.play();
      element.volume = 0;
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

    // ----- hand signaling ----
    onSdpText: function() {
      var vue = this;

      if (!!vue.peerConnection) {
        console.log("Received answer text...");
        var answer = new RTCSessionDescription({
          type : "answer",
          sdp : vue.textToReceiveSdp,
        });
        vue.setAnswer(answer);
      }
      else {
        console.log("Received offer text...");
        let offer = new RTCSessionDescription({
          type : "offer",
          sdp : vue.textToReceiveSdp,
        });
        vue.setOffer(offer);
      }
      vue.textToReceiveSdp ="";
    },
    sendSdp: function(sessionDescription) {
      var vue = this;
      console.log("---sending sdp ---");

      vue.textForSendSdp = sessionDescription.sdp;
      var message = JSON.stringify(sessionDescription);
      console.log("sending SDP=" + message);
      vue.rtcSocket.send(message);
    },
    prepareNewConnection: function() {
      var vue = this;

      var pc_config = {"iceServers":[]};
      var peer = new RTCPeerConnection(pc_config);

      // --- on get remote stream ---
      if ("ontrack" in peer) {
        peer.ontrack = event => {
          console.log("-- peer.ontrack()");
          vue.remoteStream = event.streams[0];
          vue.playVideo(vue.remoteVideo, vue.remoteStream);
        };
      }
      else {
        peer.onaddstream = event => {
          console.log("-- peer.onaddstream()");
          vue.remoteStream = event.stream;
          vue.playVideo(vue.remoteVideo, vue.remoteStream);
        };
      }

      // --- on get local ICE candidate
      peer.onicecandidate = event => {
        if (!!event.candidate) {
          console.log(event.candidate);

          // Trickle ICE の場合は、ICE candidateを相手に送る
          vue.sendIceCandidate(event.candidate);
          // Vanilla ICE の場合には、何もしない
        } else {
          console.log("empty ice event");

          // Trickle ICE の場合は、何もしない
          // Vanilla ICE の場合には、ICE candidateを含んだSDPを相手に送る
          // vue.sendSdp(peer.localDescription);
        }
      };

      // -- add local stream --
      if (!!vue.localStream) {
        console.log("Adding local stream...");
        peer.addStream(vue.localStream);
      }
      else {
        console.warn("no local stream, but continue.");
      }

      return peer;
    },
    sendIceCandidate: function(candidate) {
      var vue = this;
      console.log("---sending ICE candidate ---");
      var message = JSON.stringify({ type: "candidate", ice: candidate });
      console.log("sending candidate", message);
      vue.rtcSocket.send(message);
    },
    makeOffer: function() {
      var vue = this;
      vue.peerConnection = vue.prepareNewConnection();
      vue.peerConnection.createOffer()
        .then(sessionDescription => {
          console.log("createOffer() succsess in promise");
          return vue.peerConnection.setLocalDescription(sessionDescription);
        })
        .then(function() {
          console.log("setLocalDescription() succsess in promise");

          // -- Trickle ICE の場合は、初期SDPを相手に送る --
          vue.sendSdp(vue.peerConnection.localDescription);
          // -- Vanilla ICE の場合には、まだSDPは送らない --
        })
        .catch(err => {
          console.error(err);
        });
    },
    setOffer: function(sessionDescription) {
      var vue = this;
      if (!!vue.peerConnection) {
        console.warn("peerConnection alreay exist!");
      }
      vue.peerConnection = vue.prepareNewConnection();
      vue.peerConnection.setRemoteDescription(sessionDescription)
        .then(() => {
          console.log("setRemoteDescription(offer) succsess in promise");
          vue.makeAnswer();
        })
        .catch(err => {
          console.error("setRemoteDescription(offer) ERROR: ", err);
        });
    },
    makeAnswer: function() {
      var vue = this;
      console.log("sending Answer. Creating remote session description..." );
      if (!vue.peerConnection) {
        console.error("peerConnection NOT exist!");
        return;
      }

      vue.peerConnection.createAnswer()
        .then(sessionDescription => {
          console.log("createAnswer() succsess in promise");
          return vue.peerConnection.setLocalDescription(sessionDescription);
        })
        .then(() => {
          console.log("setLocalDescription() succsess in promise");

          // -- Trickle ICE の場合は、初期SDPを相手に送る --
          vue.sendSdp(vue.peerConnection.localDescription);
          // -- Vanilla ICE の場合には、まだSDPは送らない --
        })
        .catch(err => {
          console.error(err);
        });
    },
    setAnswer: function(sessionDescription) {
      var vue = this;
      if (!vue.peerConnection) {
        console.error("peerConnection NOT exist!");
        return;
      }

      vue.peerConnection.setRemoteDescription(sessionDescription)
        .then(() => {
          console.log("setRemoteDescription(answer) succsess in promise");
        })
        .catch(err => {
          console.error("setRemoteDescription(answer) ERROR: ", err);
        });
    },
    connect: function() {
      var vue = this;
      if (!vue.peerConnection) {
        console.log("make Offer");
        vue.makeOffer();
      }
      else {
        console.warn("peer already exist.");
      }
    },
    hangUp: function() {
      var vue = this;
      if (!!vue.peerConnection) {
        console.log("Hang up.");
        vue.peerConnection.close();
        vue.peerConnection = null;
        vue.pauseVideo(vue.remoteVideo);
      }
      else {
        console.warn("peer NOT exist.");
      }
    },
  }
};
</script>
