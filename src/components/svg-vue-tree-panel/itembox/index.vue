<template>
<g class="item-box selected" :transform='`translate(${item.tx},${item.ty})`' @mouseover.stop="mouseover" @mouseout.stop='mouseout'>
  <rect x='-40' y='-40' :width='item.width+80' :height='item.height+80' fill='transparent'>
  </rect>
  <template v-if='showbar'>
    <circle class="item-box-bar" r='20' :cx='btn.x' :cy='btn.y' v-for='btn in btns' @mousedown.stop='mousedown_handle($event,btn)'></circle>
  </template>
  <item-tag :item='item' :selected='showbar'></item-tag>
</g>
</template>
<script>
import itemtag from './itemtag'
export default {
  props: {
    item: {
      type: Object,
      default () {
        return {
          id: '',
          width: 160,
          height: 50,
          text: '新元素',
          tx: 0,
          ty: 0
        }
      }
    }
  },
  components: {
    'item-tag': itemtag
  },
  data() {
    return {
      showbar: false,
      btns: {
        top: {
          x: this.item.width / 2,
          y: -30
        },
        right: {
          x: this.item.width + 30,
          y: this.item.height / 2
        },
        bottom: {
          x: this.item.width / 2,
          y: this.item.height + 30
        },
        left: {
          x: -30,
          y: this.item.height / 2
        }
      }
    }
  },
  methods: {
    mouseover(e) {
      this.showbar = true;
    },
    mouseout(e) {
      if (e.toElement.parentNode != e.currentTarget) {
        this.showbar = false;
      }
    },
    mousedown_handle(e, btn) {
      let to = {
        tx: this.item.tx + this.item.width + 50,
        ty: this.item.ty,
        width: this.item.width,
        height: this.item.height,
        text: "新元素"
      }
      this.$emit("adddragstart", e, this.item, to)
    }
  }
}
</script>
<style lang="less">
@import '../index.less';
.item-box {
    .item-box-bar {
        stroke: @bordercolor1;
        fill: white;
    }
}
</style>
