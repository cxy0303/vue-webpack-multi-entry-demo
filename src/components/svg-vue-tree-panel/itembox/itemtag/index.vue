<template>
<g class="item-tag">
  <rect x='0' y='0' :width='item.width' :height='item.height'></rect>
  <text x='90' y='25' textLength='160' :width='item.width' :height='item.height'>{{item.text}}</text>
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
    &:hover {
        rect {
            fill: grey;
        }
        text {
            fill: white;
        }
    }
    rect {
        rx: 2px;
        ry: 2px;
        stroke: @bordercolor;
        fill: white;
    }
    text {
        text-anchor: middle;
        dominant-baseline: middle;
        overflow: hidden;
        font-size: 13px;
    }
}
</style>
