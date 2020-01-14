<template>
  <q-page class="flex flex-center">
    <div class="grid single flex-start-content halfs">
      <transition-group
        tag="div"
        name="sortableCards"
        class="
          grid single fourths
          flex-start-content
          disable-marker
          cards clickable
          sortable-animation
        "
        swappable
      >
        <div
          v-for="(card, index) in 3"
          :key="card"
          swapItem
        >
          <h3>{{ index+1 }}</h3>
        </div>
      </transition-group>

      <transition-group
        tag="div"
        name="sortableCards"
        class="
          grid single fourths
          flex-start-content
          disable-marker
          cards clickable
          sortable-animation
        "
        swappable
      >
        <div
          v-for="(card, index) in 5"
          :key="card"
          :style="{ backgroundColor: card.color }"
          swapItem
        >
          <h3>{{ index+1 }}</h3>
        </div>
      </transition-group>
    </div>

    <!-- <h2 class="checkpoint">Sortable</h2>
    <div class="grid single flex-start-content halfs">
      <transition-group
        tag="div"
        name="sortableCards"
        class="
          grid single fourths
          flex-start-content
          disable-marker
          cards clickable
          sortable-animation
        "
        sortable
      >
        <div
          v-for="(_, index) in 7"
          :key="index"
          sortItem
        >
          <h3>{{ index+1 }}</h3>
        </div>
      </transition-group>

      <transition-group
        tag="div"
        name="sortableCards"
        class="
          grid single fifths
          flex-start-content
          disable-marker
          cards clickable
          sortable-animation
        "
        sortable
      >
        <div
          v-for="(card, index) in coloredCards"
          :key="index"
          :style="{ backgroundColor: card.color }"
          sortItem
        >
          <h3>{{ index+1 }}</h3>
        </div>
      </transition-group>
    </div> -->
  </q-page>
</template>

<style scoped lang="stylus">
$BorderRadius()
	border-radius: .2rem

// Drop Shadow
$DropShadow()
	box-shadow:
		0 .1rem 1rem rgba(#000, .1),
		0 0 .5rem rgba(#000, .1)
$DropShadowHover()
	box-shadow:
		0 .25rem 2rem rgba(#000, .25),
		0 .1rem .5rem rgba(#000, .15)
$DropShadowFocus()
	box-shadow:
		0 .4rem 3rem rgba(#000, .35),
		0 .1rem .5rem rgba(#000, .2)

$DisableMarker()
	-webkit-touch-callout: none
	-webkit-user-select: none
	-khtml-user-select: none
	-moz-user-select: none
	-ms-user-select: none
	user-select: none

$DisplayFlex()
	display: -webkit-flex
	display: -webkit-box
	display: -moz-box
	display: flex

$CenterContent()
	justify-content: center
	align-content: center
	align-items: center

$OutCubic = cubic-bezier(.22,.61,.36,1)
$Transition()
	-webkit-transition:	arguments
	-moz-transition:	arguments
	-o-transition:		arguments
	transition:			arguments

$BasicFontSize	= 1rem
$Heading1		= 3rem
$Heading2		= 2rem
$Heading3		= 1.75rem
$Heading4		= 1.5rem
$Heading5		= 1.25rem
$Heading6		= 1.15rem

html
	position: relative
	margin: 0
	padding: 0
	height: 100vh
	width: 100vw
	overflow: hidden
	-webkit-font-smoothing: subpixel-antialiased
	-moz-osx-font-smoothing: subpixel-antialiased
	body
		position: @position
		height: @height
		width: @width
		margin: @margin
		padding: @padding
		font-size: 0
		font-family:
			-apple-system,
			system-ui,
			BlinkMacSystemFont,
			"Segoe UI",
			"Roboto",
			"Ubuntu",
			"Helvetica Neue",
			sans-serif
		line-height: 1.5
		overflow: @overflow
		$Transition(none)
	#app
		position: @position
		$DisplayFlex()
		height: @height
		width: @width
		flex-flow: row wrap
		font-size: 0
		overflow: auto
		z-index: 1
		justify-content: center

*
	margin: 0
	padding: 0
	font-family: inherit
	background: none
	// outline: solid 1px rgba(#000, .1) !important
	border: none
	// box-sizing
	-webkit-box-sizing: border-box
	-moz-box-sizing: border-box
	-o-box-sizing: border-box
	box-sizing: border-box
	// transition
	$Transition(all $OutCubic 200ms)

.grid
	$DisplayFlex()
	flex-flow: row wrap
	justify-content: flex-start
	align-items: center
	&.cards > *, &.spacebetween > *
		margin: 1rem
	&.row-wrap
		flex-flow: row wrap
	&.row-nowarp
		flex-flow: row nowrap
	&.column-wrap
		flex-flow: column wrap
	&.column-nowrap
		flex-flow: column nowrap
	&.reverse-row-wrap
		flex-flow: row wrap
	&.reverse-row-nowarp
		flex-flow: row nowrap
	&.reverse-column-wrap
		flex-flow: column wrap
	&.reverse-column-nowrap
		flex-flow: column nowrap
	&.adapt
		flex-grow: 1
		&-items > *
			flex-grow: 1
	&.decrease
		flex-shrink: 1
		&-items > *
			flex-shrink: 1
	&.dont-adapt
		flex-grow: 0
		&-items > *
			flex-grow: 0
	&.dont-decrease
		flex-shrink: 0
		&-items > *
			flex-shrink: 0
	&.flex-start-content
		justify-content: flex-start
		align-content: flex-start
		align-items: flex-start
		&-self
			justify-content: flex-start
			align-content: flex-start
			align-self: flex-start
	&.center-content
		$CenterContent()
		&-self
			$CenterContent()
	&.stretch-items
		align-items: stretch

.single > *, .single
	flex: 1 0 100%
.halfs > *, .half
	flex-basis: calc(100% / 2)
.thirds > *, .third
	flex-basis: calc(100% / 3)
.fourths > *, .fourth
	flex-basis: calc(100% / 4)
.fifths > *, .fifth
	flex-basis: calc(100% / 5)
.sixths > *, .sixth
	flex-basis: calc(100% / 6)
.sevenths > *, .seventh
	flex-basis: calc(100% / 7)
.eigths > *, .eigth
	flex-basis: calc(100% / 8)

.disable-marker
	$DisableMarker()

span, input, button, a, q, p, b,
pre, code, i, textarea,
h1, h2, h3, h4, h5, h6
	font-weight: 400

span, input, button, a, q, p, b,
pre, code, i, textarea, label
	font-size: $BasicFontSize

span, input, q, p, b,
pre, code, i, label
	$Transition(none)

h1, h2, h3, h4, h5, h6
	text-align: center
h1
	font-size: $Heading1
h2
	font-size: $Heading2
h3
	font-size: $Heading3
h4
	font-size: $Heading4
h5
	font-size: $Heading5
h6
	font-size: $Heading6

.subtitle
	position: relative
	color: rgba(#000, .25)
	line-height: 1
	&-h1
		font-size: ($Heading1 * .7)
		top: -(@font-size * .1)
	&-h2
		font-size: ($Heading2 * .6)
		top: -(@font-size * .1)
	&-h3
		font-size: ($Heading3 * .5)
		top: -(@font-size * .1)
	&-h4
		font-size: ($Heading4 * .4)
		top: -(@font-size * .1)
	&-h5
		font-size: ($Heading5 * .4)
		top: -(@font-size * .1)
	&-h6
		font-size: ($Heading6 * .4)
		top: -(@font-size * .1)

hr
	width: calc(100% - 2rem)
	margin: 2rem 1rem
	border: none
	border-bottom: solid 1px

.card, .cards > *
	padding: 1rem
	flex: 0 0 auto
	$DropShadow()
	z-index: 2
	overflow: auto
	$BorderRadius()
	background-color: #fff
.card
	&.hoverable:hover
		transform: scale(1.03)
		$DropShadowHover()
		z-index: 3
	&.clickable
		cursor: pointer
		&:hover
			transform: scale(1.03)
			$DropShadowHover()
			z-index: 3
		&:active, &:focus
			transform: scale(1.06)
			$DropShadowFocus()
			z-index: 3
.cards
	&.hoverable > *:hover
		transform: scale(1.03)
		$DropShadowHover()
		z-index: 3
	&.clickable > *
		cursor: pointer
		&:hover
			transform: scale(1.03)
			$DropShadowHover()
			z-index: 3
		&:active, &:focus
			transform: scale(1.06)
			$DropShadowFocus()
			z-index: 3
	&.fixed-height > *
		position: relative
		overflow: auto
	&.halfs > *, .half
		flex-basis: calc(100% / 2 - 2rem)
	&.thirds > *, .third
		flex-basis: calc(100% / 3 - 2rem)
	&.fourths > *, .fourth
		flex-basis: calc(100% / 4 - 2rem)
	&.fifths > *, .fifth
		flex-basis: calc(100% / 5 - 2rem)
	&.sixths > *, .sixth
		flex-basis: calc(100% / 6 - 2rem)
	&.sevenths > *, .seventh
		flex-basis: calc(100% / 7 - 2rem)
	&.eigths > *, .eigth
		flex-basis: calc(100% / 8 - 2rem)

.topic
	position: relative
	$DisplayFlex()
	margin: 1rem
	flex-flow: row wrap
	$CenterContent()
	text-align: center
	> *
		flex: 1 0 100%
	h3
		font-weight: 100
		text-transform: uppercase

.checkpoint
	$DisplayFlex()
	margin: 1rem
	flex: 1 1 100%
	$CenterContent()
	&:before, &:after
		content: ""
		margin: 0 1rem
		flex: 1 1 auto
		border-bottom: solid .1rem

.weekly-todos
	flex-flow: row nowrap
	flex: 1 1 100%
	> *
		height: 100%
		flex: 1 0 calc(100% / 7 - 2rem)
		> *
			margin: .5rem !important
			flex: 1 1 auto

.sortable-animation > *
	transform: translate3d(0,0,0)
.sortableCards-move
	$Transition(transform $OutCubic 500ms)
	background-color: #f00
.sortableCards-enter, .sortableCards-leave-to
	transition: 5s
	opacity: 0

.draggable-source--is-dragging
	opacity: .3

.draggable-container--over
	animation: draggablePulseBg $OutCubic 1500ms infinite
@keyframes draggablePulseBg
	0%
		background-color: transparent
		outline: solid .1rem transparent
	35%
		background-color: rgba(#000, .05)
		outline: solid .1rem rgba(#000, .1)
	100%
		background-color: transparent
		outline: solid .1rem transparent

.draggable-mirror
	position: absolute
	padding: 1rem
	background-color: #fff
	$Transition(all 0ms)
	overflow: auto
	$DropShadowFocus()
	$BorderRadius()
	z-index: 10
	cursor: move
	$Transition(top 0ms, left 0ms)

.draggable-source--placed
	animation: placedItem $OutCubic .5s
@keyframes placedItem
	from
		transform: scale(1.065)
		$DropShadowHover()
	to
		transform: scale(1)
		$DropShadowFocus()
.sortableCards-enter-active, .sortableCards-leave-to
	opacity: 0
.sortableCards-leave-active
	position: absolute
</style>

<script>
import Swappable from "@shopify/draggable/lib/swappable";
import Sortable from "@shopify/draggable/lib/sortable";

export default {
  name: "PageIndex",
  data () {
    return {
    }
  },
  mounted: () => {
    const swappable = new Swappable(
      document.querySelectorAll("[swappable]"),
      {
        draggable: "[swapItem]",
        delay: 0,
      }
    );
    console.log("swappable", swappable);

    swappable.on("drag:start", () => {
      console.log("drag:start")
    })
    swappable.on("swappable:swapped", () => {
      console.log("drag:swapped")
    })
    swappable.on("drag:stop", () => {
      console.log("drag:stop")
    })
    swappable.on("drag:move", () => {
      console.log("drag:move")
    })

    const sortable = new Sortable(
      document.querySelectorAll("[sortable]"), {
        draggable: "[sortItem]",
        delay: 0,
      }
    )
    sortable.on("drag:start", () => {
      console.log("drag:start")
    })
    sortable.on("drag:stop", () => {
      console.log("drag:stop")
    })
  },
  methods: {
  }
};
</script>
