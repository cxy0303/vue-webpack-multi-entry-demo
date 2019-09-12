<template>
<g class="item-tag" :class="{selected:selected}">
  <rect class="item-tag-rect" x='0' y='0' :width='item.width' :height='item.height'></rect>
  <text class="item-tag-text" x='90' y='25' :width='item.width' :height='item.height'>{{item.text}}</text>
</g>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {
          text: "测试"
        }
      }
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "item"
  }
}
</script>
<style lang='less'>
@import '../../index.less';
.item-tag {
    cursor: move;
    overflow: hidden;
    &.selected {
        .item-tag-rect {
            fill: grey;
        }
        .item-tag-text {
            fill: white;
        }
    }
    &:hover {
        .selected;
    }
    rect {
        rx: 2px;
        ry: 2px;
        stroke: @bordercolor;
        fill: white;
        stroke-width: 0.6;
    }
    text {
        text-anchor: middle;
        dominant-baseline: middle;
        overflow: hidden;
        font-size: 13px;
    }
}
</style>
