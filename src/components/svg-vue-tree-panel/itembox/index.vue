<template>
<g class="item-box selected" :transform='`translate(${item.tx},${item.ty})`' @mouseover.stop="mouseover" @mouseout.stop='mouseout'>
  <rect x='-40' y='-40' :width='item.width+80' :height='item.height+80' fill='transparent'>
  </rect>
  <template v-if='showbar&&!istemp' v-for='(btn,key) in btns'>
    <g @mousedown.stop='mousedown_handle($event,key)' :transform='`translate(${btn.x},${btn.y})`'>
      <circle class="item-box-bar" :r='r'>
      </circle>
      <text transform='translate(-5,5)' fill='#DDDDDD'>+</text>
    </g>
  </template>
  <component :is='itemtype' :item='item' :selected='showbar' :key='item.id'></component>
</g>
</template>
<script>
import itemtag from './itemtag'
import itemcard from './itemcard'
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
    },
    //拖拽跟随鼠标显示
    istemp: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'item-tag': itemtag,
    'item-card': itemcard
  },
  data() {
    var cr = 25;
    return {
      showbar: false,
      r: cr,
      btns: {
        top: {
          x: this.item.width / 2,
          y: 0 - cr - 10
        },
        right: {
          x: this.item.width + cr + 10,
          y: this.item.height / 2
        },
        bottom: {
          x: this.item.width / 2,
          y: this.item.height + cr + 10
        },
        left: {
          x: 0 - cr - 10,
          y: this.item.height / 2
        }
      }
    }
  },
  computed: {
    itemtype() {
      return this.item && this.item.type ? this.item.type : "item-card";
    }
  },
  methods: {
    mouseover(e) {
      this.showbar = true;
    },
    mouseout(e) {
      let toElement = e.relatedTarget || e.toElement;
      if (toElement && toElement.parentNode && toElement.parentNode != e.currentTarget && toElement.parentNode.parentNode != e.currentTarget) {
        this.showbar = false;
      }
    },
    mousedown_handle(e, key) {
      let to = {
        tx: this.item.tx + this.item.width + this.r * 2 + 10,
        ty: this.item.ty,
        width: this.item.width,
        height: this.item.height,
        text: "新元素"
      }

      if (key == "top") {
        to.tx = this.item.tx;
        to.ty = this.item.ty - this.item.height - this.r * 2 + 10;
      } else if (key == "bottom") {
        to.tx = this.item.tx;
        to.ty = this.item.ty + this.item.height + this.r * 2 + 10;
      } else if (key == "left") {
        to.tx = this.item.tx - this.r * 2 + 10 - this.item.width;
        to.ty = this.item.ty;
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
