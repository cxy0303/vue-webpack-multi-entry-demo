<template>
<g class="item-box" :transform='`translate(${item.tx},${item.ty})`' @mouseover.stop="mouseover" @mouseout.stop='mouseout'>
  <rect x='-40' y='-40' :width='item.width+80' :height='item.height+80' fill='transparent'>
  </rect>
  <template v-if='showbar&&!istemp' v-for='(btn,key) in btns'>
    <g @mousedown.stop='mousedown_handle($event,key)' :transform='`translate(${btn.x},${btn.y})`'>
      <circle class="item-box-bar" :r='r'>
      </circle>
      <text transform='translate(-5,5)' fill='#DDDDDD'>+</text>
    </g>
  </template>
  <component :is='itemtype' :item='item' :selected='showbar' :key='item.id' @edit='edit'></component>
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
          type: 'item-tag',
          subject: '',
          text: '新元素',
          tx: 0,
          ty: 0,
          from: {
            top: [],
            bottom: [],
            left: [],
            right: []
          },
          to: {
            top: [],
            bottom: [],
            left: [],
            right: []
          }
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
    return {
      showbar: false,
      r: 15
    }
  },
  computed: {
    btns() {
      var cr = this.r;

      var btns = {
        right: {
          x: this.item.width + cr + 10,
          y: this.item.height / 2
        },
        left: {
          x: 0 - cr - 10,
          y: this.item.height / 2
        }
      };
      if (this.itemtype != "item-tag") {
        btns["bottom"] = {
          x: this.item.width / 2,
          y: this.item.height + cr + 10
        }
        btns["top"] = {
          x: this.item.width / 2,
          y: 0 - cr - 10
        }
      }
      return btns;
    },
    itemtype() {
      return this.item && this.item.type ? this.item.type : "item-card";
    }
  },
  methods: {
    edit(item) {
      this.$emit("edit", item);
    },
    mouseover(e) {
      this.showbar = true;
      this.selected = true;
    },
    mouseout(e) {
      let toElement = e.relatedTarget || e.toElement;
      if (toElement && toElement.parentNode && toElement.parentNode != e.currentTarget && toElement.parentNode.parentNode != e.currentTarget) {
        this.showbar = false;
        this.selected = false;
      }
    },
    mousedown_handle(e, key) {
      let to = {
        id: "tag_" + parseInt(Math.random() * 1000000),
        type: 'item-tag',
        tx: this.item.tx,
        ty: this.item.ty,
        width: this.item.width,
        height: this.item.height,
        type: this.item.type,
        subject: '元素主题',
        text: "元素内容",
        from: {
          top: [],
          bottom: [],
          left: [],
          right: []
        },
        to: {
          top: [],
          bottom: [],
          left: [],
          right: []
        }
      }

      if (key == "left") {
        to.from.right.push(this.item.id);
        this.item.to.left.push(to.id);
      } else if (key == "right") {
        to.from.left.push(this.item.id);
        this.item.to.right.push(to.id);
      }

      this.$emit("adddragstart", e, key, this.item, to)
    }
  }
}
</script>
<style lang="less">
@import '../index.less';
.item-box {
    transition: all 0.3s;
    .item-box-bar {
        stroke: @bordercolor1;
        fill: white;
    }
    &.selected {
        transition: none;
    }
}
</style>
