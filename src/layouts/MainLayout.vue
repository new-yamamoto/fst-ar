<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-1">
    <q-header class="bg-white text-white" style="border-bottom: solid black 1px;" height-hint="64">
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
          @click="showLoginDialog = !showLoginDialog"
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
          @click="isShwoRMS = !isShwoRMS"
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

<!--
    <q-drawer
      ref="RmsDrawer"
      :value="isShwoRMS"
      behavior="desktop"
      class="rms-drawer"
      :width=250
    >
      <q-bar class="bg-primary text-white event-list">
        <div>RMS</div>
        <q-space ></q-space>
        <q-btn dense flat icon="minimize" @click="isEventsOpened = !isEventsOpened">
          <q-tooltip>最小化</q-tooltip>
        </q-btn>
      </q-bar>
      <div class="q-pt-sm q-mb-sm">
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
-->
    <q-splitter
      class="splitter main-splitter"
      v-model="mainSplitterRatio"
      :limits="[0, 100]"
      before-class="overflow-hidden"
      after-class="overflow-hidden"
      separator-class="splitter-separator main-splitter-separator"
    >
      <template v-slot:before>
        <div class="rms-container">
          <q-bar class="bg-primary text-white rms-header">
            <div>RMS</div>
            <q-space ></q-space>
            <q-btn dense flat icon="minimize" @click="isEventsOpened = !isEventsOpened">
              <q-tooltip>最小化</q-tooltip>
            </q-btn>
          </q-bar>
          <div class="q-pt-sm q-mb-sm">
          </div>
        </div>
      </template>
      <template v-slot:after>
        <q-splitter
          class="splitter sub-splitter"
          v-model="subSplitterRatio"
          :limits="[0, 100]"
          before-class="overflow-hidden"
          after-class="overflow-hidden"
          separator-class="splitter-separator sub-splitter-separator"
        >
          <template v-slot:before>
            <div class="eventlist-container">
              <EventList />
            </div>
          </template>
          <template v-slot:after>
            <router-view />
          </template>
        </q-splitter>
      </template>
    </q-splitter>

    <q-footer class="bg-grey-5 text-white">
      <q-toolbar>
      </q-toolbar>
    </q-footer>

    <q-dialog
      id="loginDialog"
      v-model="showLoginDialog"
      persistent
    >
      <q-card style="width: calc(100% - 20px); height: calc(100vh - 100px); ">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title shrink class="row items-center no-wrap">
            <q-icon name="track_changes" size="48px" />
            <span class="q-ml-sm" style="font-size: 36px;">FST-AR</span>
          </q-toolbar-title>
        </q-toolbar>

        <div class="q-pa-md">
          <q-carousel
            id="mainCarousel"
            v-model="carouselSlide"
            transition-prev="scale"
            transition-next="scale"
            swipeable
            animated
            control-color="primary"
            navigation
            padding
            arrows
            class="bg-white text-primary shadow-1 rounded-borders"
          >
            <q-carousel-slide name="login" class="column no-wrap">
              <div class="flex flex-center q-mb-md">
                <q-icon name="fas fa-sign-in-alt" size="36px"></q-icon>
                <div class="q-ml-md" style="font-size: x-large;">{{ $t("LoginMessage") }}</div>
              </div>
              <div class="flex flex-left">
                <q-input
                  v-model="login.id"
                  ref="login.id"
                  filled
                  :placeholder='$t("AccountPlaceholder")'
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type Account']"
                  style="width: 100%;"
                ></q-input>
              </div>
              <div class="flex flex-left">
                <q-input
                  v-model="login.pw"
                  ref="login.pw"
                  :type="!!login.isPw ? 'password' : 'text'"
                  filled
                  :placeholder='$t("PassWordPlaceholder")'
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Please type PassWord']"
                  style="width: 100%;"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="!!login.isPw ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="login.isPw = !login.isPw"
                    ></q-icon>
                  </template>
                </q-input>
              </div>
              <div class="flex flex-left q-mb-lg">
                <q-select
                  :label='$t("LanguageLabel")'
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  filled
                  v-model="lang"
                  :options='$t("LanguageOptions")'
                  map-options
                  style="width: 100%;"
                ></q-select>
              </div>
              <q-linear-progress
                :value="progress"
                color="primary"
                size="50px"
                class="q-ma-md q-mt-lg"
                style="width: unset; visibility: hidden;"
                :style='isLogin ? "visibility: visible;" : "visibility: hidden;"'
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="primary"
                    :label="progressMessage">
                  </q-badge>
                </div>
              </q-linear-progress>
              <div class="flex flex-center" style="width: 100%; position: absolute; left: 0px; bottom: 75px; justify-content: space-evenly;">
                <q-btn
                  push
                  stack
                  no-caps
                  :label='$t("LoginLabel")'
                  icon="fas fa-sign-in-alt"
                  color="primary"
                  text-color="white"
                  style="width: 120px; height: 60px;"
                  @click="attemptLogin"
                />
                <q-btn
                  v-if="!!isLogin && !!operation && !!system"
                  push
                  stack
                  no-caps
                  :label='$t("CloseLabel")'
                  icon="fas fa-window-close"
                  color="primary"
                  text-color="white"
                  style="width: 120px; height: 60px;"
                  @click="showLoginDialog = false"
                />
              </div>
            </q-carousel-slide>

            <q-carousel-slide name="operations" class="column no-wrap flex-left">
              <div class="flex flex-center q-mb-md">
                <q-icon name="fas fa-tools" size="36px"></q-icon>
                <div class="q-ml-md" style="font-size: x-large;">{{ $t("OperationsMessage") }}</div>
              </div>
              <div class="flex flex-left q-mb-lg">
                <q-select
                  :label='$t("OperationsLabel")'
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  filled
                  v-model="operation"
                  :options="operations"
                  map-options
                  style="width: 100%;"
                  @input="operationChanged"
                ></q-select>
              </div>
              <div class="flex flex-center" style="width: 100%; position: absolute; left: 0px; bottom: 75px; justify-content: space-evenly;">
                <q-btn
                  v-if="!!isLogin && !!operation && !!system"
                  push
                  stack
                  no-caps
                  :label='$t("CloseLabel")'
                  icon="fas fa-window-close"
                  color="primary"
                  text-color="white"
                  style="width: 120px; height: 60px;"
                  @click="showLoginDialog = false"
                />
              </div>
            </q-carousel-slide>

            <q-carousel-slide name="systems" class="column no-wrap flex-left">
              <div class="flex flex-center q-mb-md">
                <q-icon name="fas fa-wrench" size="36px"></q-icon>
                <div class="q-ml-md" style="font-size: x-large;">{{ $t("SystemsMessage") }}</div>
              </div>
              <div class="flex flex-left q-mb-lg">
                <q-select
                  :label='$t("SystemsLabel")'
                  transition-show="jump-up"
                  transition-hide="jump-up"
                  filled
                  v-model="system"
                  :options="systems"
                  map-options
                  style="width: 100%;"
                  @input="systemChanged"
                ></q-select>
              </div>
              <div class="flex flex-center" style="width: 100%; position: absolute; left: 0px; bottom: 75px; justify-content: space-evenly;">
                <q-btn
                  v-if="!!isLogin && !!operation && !!system"
                  push
                  stack
                  no-caps
                  :label='$t("CloseLabel")'
                  icon="fas fa-window-close"
                  color="primary"
                  text-color="white"
                  style="width: 120px; height: 60px;"
                  @click="showLoginDialog = false"
                />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>


      </q-card>
    </q-dialog>

  </q-layout>
</template>

<script>
import EventList from "../components/EventListComponent.vue";

export default {
  name: "MainLayout",
  components: {
    EventList: EventList,
  },
  data () {
    return {
      isReady: false,
      isShwoRMS: false,
      mainSplitterRatio: 0,
      subSplitterRatio: 30,

      carouselSlide: "login",

      lang: this.$i18n.locale,
      langs: [
        {
          label: "Japanese",
          value: "ja",
        },
        {
          label: "English",
          value: "en-us",
        }
      ],

      operation: null,
      operations: [
        {
          label: "巡回",
          value: "ope_01",
        },
        {
          label: "ジョブ作業1",
          value: "ope_02",
        },
        {
          label: "ジョブ作業2",
          value: "ope_03",
        },
      ],

      system: null,
      systems: [
        {
          label: "システム1[DCS]",
          value: "sys_01",
        },
        {
          label: "システム2[FM]",
          value: "sys_02",
        },
        {
          label: "システム3[AR]",
          value: "sys_03",
        },
        {
          label: "システム4[eFact]",
          value: "sys_04",
        },
        {
          label: "システム5[Excel]",
          value: "sys_05",
        },
      ],

      login: {
        id: null,
        pw: null,
        isPw: true,
      },
        progress: 0,

      isLogin: false,
      showLoginDialog: true,

    }
  },
  computed: {
    progressMessage: function() {
      return (this.progress == 1 ? "Complete " : "Loading... ") + (this.progress * 100).toFixed(2) + "%";
    },
  },
  watch: {
    lang: {
      handler: function(lang) {
        this.$i18n.locale = lang.value;
        import(`quasar/lang/${lang.value}`).then(language => {
          this.$q.lang.set(language.default);
        });
      },
    },
  },
  created: function() {
  },
  mounted: function() {
    this.isReady = true;

    window.MainLayout = this;
  },
  methods: {
    attemptLogin: function() {
      var vue = this;

      //TODO: login check

      vue.isLogin = true;

      var tm = setInterval(() => {
        if (vue.progress == 1) {
          clearInterval(tm);
          setTimeout(() => vue.carouselSlide = "operations", 500);
        }

        var d = _.random(0.1, 0.3, true);
        if (vue.progress + d > 1) {
          vue.progress = 1;
        } else {
          vue.progress += d;
        }
      }, 300);
    },
    operationChanged: function() {
      var vue = this;

      vue.carouselSlide = "systems";
    },
    systemChanged: function() {
      var vue = this;

      vue.showLoginDialog = false;

      if (vue.$route.path != "/Dashboard2") {
        vue.$router.push("/Dashboard2");
      }
    },
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
.main-splitter {
  position: relative;
  height: calc(100% - 72px);
  top: 72px;
}
.sub-splitter {
  position: relative;
  height: 100%;
}
.splitter-separator {
  background: lightgray;
  width: 10px !important;
}
.splitter-separator .q-splitter__separator-area {
  left: 0px;
  right: 0px;
}
.q-linear-progress .q-badge {
  font-size: larger !important;
  line-height: normal !important;
}
#mainCarousel.q-carousel {
  height: calc(100vh - 190px);
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
