<template>
  <q-layout view="hHh Lpr lfr" class="bg-grey-1">
    <q-bar class="bg-primary text-white dashboard">
      <q-icon name="web"></q-icon>
      <div>Dashboard</div>
      <q-space ></q-space>
      <q-btn dense flat icon="close">
        <q-tooltip>Close</q-tooltip>
      </q-btn>
    </q-bar>
    <q-scroll-area class="contents-container">
      <q-page-container>
        <router-view :configs="dashboardConfigs" />
      </q-page-container>
    </q-scroll-area>
  </q-layout>
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
export default {
  name: "DashboardLayout",
  data () {
    return {
      dashboardConfigs: [],
    }
  },
  created: function() {
    var vue = this;

    //receive set config event
    vue.$root.$on("setEventConfig", config => vue.dashboardConfigs = config);
    //   console.log("set config", vue.dashboardConfigs, config);
    //   // if (!!config) {
    //   //   vue.dashboardConfigs.splice().concat(...config);
    //   // } else {
    //   //   vue.dashboardConfigs.splice();
    //   // }
    //   vue.dashboardConfigs = config;
    // });
  },
  computed: {
  },
  methods: {
  }
}
</script>
