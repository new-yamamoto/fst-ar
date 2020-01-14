<template>
  <div>
    <line-chart
      chart-id="GraphComponent_LineChart"
      css-classes="GraphComponent_ChartArea"
      :chartData=dataCollection
      :options=chartOptions
      :width="100"
      :height="75" />
  </div>
</template>

<style>
.GraphComponent_ChartArea {
  width: 100%;
  height: 100%;
}
.GraphComponent_ChartArea canvas {
  width: 100% !important;
  height: 100% !important;
}
</style>

<script>
import ComponentBase from "./ComponentBase.vue";
import LineChart from "./Charts/LineChart";

export default {
  mixins: [ComponentBase],
  name: "GraphComponent",
  title: "グラフコンポーネント",
  components: {
    LineChart,
  },
  data () {
    return {
      dataCollection: null,
      chartOptions: null,
    }
  },
  props: {
  },
  mounted: function() {
    var vue = this;

    if (vue.asSample) {
      vue.dataCollection = {
        labels: _.range(1, 101),
        datasets: [
          {
            label: "サンプル",
            data: _.range(1, 101).map(v => v * (Math.random() - 0.5)),
            borderWidth: 1
          }
        ],
      };
      vue.chartOptions = { responsive: true, maintainAspectRatio: false };
    } else {
      vue.dataCollection = vue.params.dataCollection;
      vue.chartOptions = vue.params.chartOptions;
    }
  },
  methods: {
    fillData: function() {
      var vue = this;
    },
    getRandomInt: function() {
      return Math.random() - 0.5 * 10;
    }
  }
};
</script>
