<script>
export default {
  name: "ComponentBase",
  data () {
    return {
    }
  },
  props: {
    params: Object,
    title: String,
    asSample: Boolean,
    onConponentClickFunc: Function,
  },
  components: {
  },
  created: function() {
  },
  mounted: function() {
    var vue = this;
    window[vue.$options.name + (!!vue.params ? (vue.params.id || vue._uid) : vue._uid)] = vue;

    $(vue.$el)
      .css("width", "100%")
      .css("height", "calc(100% - 32px)")
      .on("click", vue.onConponentClick)
      ;
  },
  activated: function() {
  },
  destroyed: function() {
  },
  methods: {
    onConponentClick: function(event) {
      var vue = this;
      // console.log(vue.$options.name + " clicked");
      if (!!vue.onConponentClickFunc) {
        vue.onConponentClickFunc(vue.$el);
      }
    },
  }
};
</script>
