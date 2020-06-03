<template>
  <div>
    <q-bar class="bg-primary text-white event-list">
      <div>Event List</div>
      <q-space ></q-space>
      <q-btn dense flat icon="minimize" @click="isEventsOpened = !isEventsOpened">
        <q-tooltip>最小化</q-tooltip>
      </q-btn>
    </q-bar>
    <div class="q-pt-sm q-mb-sm">
      <div class="row  q-px-sm q-mb-sm">
        <q-btn
          push
          stack
          dense
          rounded
          no-caps
          icon="playlist_add"
          color="primary"
        >
          <q-tooltip>追加</q-tooltip>
        </q-btn>
        <q-space />
        <q-btn
          push
          stack
          dense
          rounded
          no-caps
          icon="delete"
          color="primary"
        >
          <q-tooltip>削除</q-tooltip>
        </q-btn>
      </div>
      <q-scroll-area class="events-container q-mx-sm">
        <q-tree
          :nodes="events"
          node-key="eventId"
          selected-color="primary"
          :selected.sync="selectedEvent"
          @update:selected="target => loadEventConfig(target)"
          default-collapse-all
        />
      </q-scroll-area>
    </div>
    <div class="row selected-event q-mt-sm q-py-sm q-px-sm" style="border-top: solid 1px black;">
      {{eventName}}
    </div>
    <div v-show="!!eventName" class="row q-mt-sm">
      <div class="col text-center">Check:</div>
      <div class="col">
        <select>
          <option value=""></option>
          <option value="OK">OK</option>
          <option value="NG">NG</option>
          <option value="Others">Others</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
.q-layout {
  height: calc(100vh - 103px);
  min-height: unset !important;
}
.q-bar {
  border-top: solid 1px black;
}
.q-bar.event-list {
  border-bottom: solid 1px black;
}
.row.event-check {
  border-top: solid 1px black;
}
</style>
<style>
.inner-drawer .q-drawer {
  top: 104px;
  height: calc(100vh - 104px);
  border-right: solid 1px black;
}
.inner-drawer .fullscreen.q-drawer__backdrop {
  display: none;
}
.q-scrollarea.events-container {
  height: calc((100vh - 200px) / 2);
  margin-right: 8px;
  border: dotted 1px black;
}
.q-scrollarea.contents-container {
  height: calc(100vh - 104px);
  overflow: hidden;
  border-top: solid 1px black;
}
</style>

<script>
import ComponentBase from "./ComponentBase.vue";

export default {
  mixins: [ComponentBase],
  name: "EventListComponent",
  title: "イベントリスト",
  data () {
    return {
      isEventsOpened: true,
      selectedEvent: null,
      events: [
        {
          eventId: "タグビューサンプル",
          label: "タグビューサンプル",
          icon: "assignment_turned_in",
        },
        {
          eventId: "Rtcサンプル",
          label: "Rtcサンプル",
          icon: "assignment_turned_in",
        },
        {
          eventId: "Rtcサンプル(Peer)",
          label: "Rtcサンプル(Peer)",
          icon: "assignment_turned_in",
        },
        {
          eventId: "EVENT_01",
          label: "EVENT_01",
          icon: "assignment_turned_in",
          children: [
            {
              eventId: "EVENT_01_01",
              label: "SUBEVENT_01",
              icon: "assignment_turned_in",
            },
            {
              eventId: "EVENT_01_02",
              label: "SUBEVENT_02",
              icon: "assignment_turned_in",
            },
            {
              eventId: "EVENT_01_03",
              label: "SUBEVENT_03",
              icon: "assignment_turned_in",
            },
          ]
        },
        {
          eventId: "EVENT_02",
          label: "EVENT_02",
          icon: "assignment_turned_in",
        },
      ],
    }
  },
  computed: {
    eventName: function() {
      var flatten = ary => {
        return _.reduce(
          ary,
          (a, v) => {
            var vv = _.cloneDeep(v);
            delete vv.children;
            a.push(vv);
            if (!!v.children) {
              a = a.concat(flatten(v.children));
            }
            return a;
          },
          []
        );
      }
      var ret = flatten(this.events);
      var match = _.find(ret, { eventId: this.selectedEvent});
      return !!match ? match.label : "";
    }
  },
  methods: {
    loadEventConfig: function(eventId) {
      var vue = this;

      //TODO: load persitence config values
      var configs = [
        {
          "x": 0,
          "y": 0,
          "z": 0,
          "w": 0.5999843902439025,
          "h": 0.4,
          "i": 0,
          "info": {
            "comp": "GraphComponent",
            "title": "計測値",
            "params": {
              dataCollection: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [{
                  label: "XXX",
                  data: [12, 19, 3, 5, 2, 3],
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(255, 159, 64, 0.2)"
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)"
                  ],
                  borderWidth: 1
                }]
              },
              chartOptions: { responsive: true, maintainAspectRatio: false },
            }
          }
        },
        {
          "x": 0,
          "y": 0.4086206896551724,
          "z": 1,
          "w": 0.5999843902439025,
          "h": 0.5913793103448276,
          "i": 1,
          "info": {
            "comp": "VideoComponent",
            "title": "作業手順",
            "params": {
              sources: [
                {
                  type: "video/mp4",
                  src: "/statics/videos/robot.mp4",
                },
              ],
            }
          }
        },
        {
          "x": 0.6048628048780488,
          "y": 0,
          "z": 2,
          "w": 0.39001560975609756,
          "h": 0.996551724137931,
          "i": 2,
          "info": {
            "comp": "DocumentComponent",
            "title": "作業マニュアル",
            "params": {
              "type": "pdf",
              "url": "/statics/documents/溶接.pdf",
            }
          }
        },
      ];

      var eventConfigs = {
        "タグビューサンプル": [
          {
            "x": 0, "y": 0, "z": 0, "w": 1, "h": 1, "i": 0,
            "info": {
              "comp": "TagViewComponent",
              "title": "タグビューサンプル",
              "params": {
                "id": "TagiewSample",
                "type": "PNG",
                "source": "/statics/images/TagViewSample.png",
              }
            },
          },
        ],
        "Rtcサンプル": [
          {
            "x": 0, "y": 0, "z": 0, "w": 1, "h": 1, "i": 0,
            "info": {
              "comp": "RtcComponent",
              "title": "コミュニケーションサンプル",
              "asSample": true,
            },
          },
        ],
        "Rtcサンプル(Peer)": [
          {
            "x": 0, "y": 0, "z": 0, "w": 1, "h": 1, "i": 0,
            "info": {
              "comp": "RtcPeerComponent",
              "title": "コミュニケーションサンプル(Peer)",
              "asSample": true,
            },
          },
        ],
        "EVENT_01": configs,
        "EVENT_01_01": [configs[0]],
        "EVENT_01_02": [configs[1]],
        "EVENT_01_03": [configs[2]],
        "EVENT_02": [
          {
            "x": 0, "y": 0, "z": 0, "w": 1, "h": 1, "i": 0,
            "info": {
              "comp": "GraphComponent",
              "title": "グラフサンプル",
              "asSample": true,
            },
          },
        ],
      };

      //send event
      vue.$root.$emit("setEventConfig", eventConfigs[eventId]);
    }
  }
}
</script>
