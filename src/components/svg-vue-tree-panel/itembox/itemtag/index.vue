<template>
<g class="item-tag">
  <rect x='0' y='0' width='180' height='50' fill='inherit' stroke='inherit' stroke-width='inherit'></rect>
  <text x='90' textLength='160px' y='25' width='180' height='50' fill='currentColor' stroke='none'>{{item.text}}</text>
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
.item-tag {
    fill: blue;
    color: black;
    stroke: yellow;
    stroke-width: 5;
    box-shadow: 0 0 10px 10px grey;
    &:hover {
        fill: red;
        color: blue;
        stroke: green;
        stroke-width: 10;
    }
    rect {
        dx: 5px;
        dy: 5px;
        overflow: hidden;
    }
    text {
        text-anchor: middle;
        dominant-baseline: middle;
        overflow: hidden;
        textLength: 20px;
    }
}
</style>
