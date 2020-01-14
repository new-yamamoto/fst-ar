<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header class="bg-white text-white" height-hint="64">
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title v-if="$q.screen.gt.xs" shrink class="row items-center no-wrap">
          <q-icon name="track_changes" size="48px" />
          <span class="q-ml-sm" style="font-size: 36px;">FST-AR</span>
        </q-toolbar-title>
        <q-space />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="Login"
          icon="fas fa-sign-in-alt"
          color="yellow"
          text-color="black"
        />
        <q-space />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="Download"
          icon="fas fa-download"
          color="yellow"
          text-color="black"
        />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="Events"
          icon="fas fa-tasks"
          color="yellow"
          text-color="black"
        />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="DashBoard"
          icon="web"
          color="yellow"
          text-color="black"
          @click="$router.push({ path: '/Dashboard' })"
        />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="DashBoard2"
          icon="web"
          color="yellow"
          text-color="black"
          @click="$router.push({ path: '/Dashboard2' })"
        />
        <q-space />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="RMS"
          icon="fas fa-chalkboard-teacher"
          color="yellow"
          text-color="black"
        />
        <q-space />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="Settings"
          icon="fas fa-cog"
          color="yellow"
          text-color="black"
        />
        <!-- button style samples -->
        <!-- <q-btn
          flat
          push
          stack
          rounded
          no-caps
          label="Login"
          icon="fas fa-sign-in-alt"
        />
        <q-space />
        <q-btn
          unelevated
          push
          stack
          rounded
          no-caps
          label="Download"
          icon="fas fa-download"
          color="deep-orange"
        />
        <q-btn
          outline
          push
          stack
          rounded
          no-caps
          label="Events"
          icon="fas fa-tasks"
          color="black"
        />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="DashBoard"
          icon="web"
          color="yellow"
          @click="$router.push({ path: '/Dashboard' })"
        />
        <q-space />
        <q-btn
          push
          stack
          rounded
          no-caps
          label="RMS"
          icon="fas fa-chalkboard-teacher"
          color="blue-grey"
        /> -->

      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer class="bg-grey-5 text-white">
      <q-toolbar>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  methods: {
  }
}
</script>

<style lang="css">
.q-toolbar {
  padding: 2px 2px !important;
}
.q-toolbar .q-btn {
  width: 110px;
  margin: 4px 8px;
  padding: 2px 0px !important;
  font-size: 14px;
}
.q-toolbar .q-btn.menu-btn {
  width: auto;
  margin: 4px 0px;
  font-size: 24px;
}
.q-footer {
  border-top: solid 1px black;
  height: 30px;
}
</style>

<style lang="sass">
.GNL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 55%

  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px

    .q-item__section--avatar
      .q-icon
        color: #5f6368

    .q-item__label
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
