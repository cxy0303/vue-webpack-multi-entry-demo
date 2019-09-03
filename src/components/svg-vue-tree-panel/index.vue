<template>
<div class="svg-vue-tree-panel">
  <svg viewBox='0 0 1000 1000'>
    <defs>
      <symbol id='item1' viewBox='0 0 100 40'>
        <rect x="0" y="0" rx=10 ry=10 width="100px" height="40px"></rect>
      </symbol>
    </defs>
    <use v-for='(item,index) in items' xlink:href='#item1' x='400' y='200' width="100px" height="40px" class="item" @mousedown='mousedown_handle' @mousemove='mousemove_handler' @mouseup="mouseup_handler"></use>
  </svg>
</div>
</template>
<script>
export default {
  data() {
    return {
      items: [{}]
    }
  },
  methods: {
    mousedown_handle(e) {
      e.target["mousein"] = true;
    },
    mousemove_handler(e) {
      if (e.target["mousein"]) {
        let ox = parseInt(e.target["tx"]) || 0;
        let oy = parseInt(e.target["ty"]) || 0;
        let x = e.movementX + ox;
        let y = e.movementY + oy;
        e.target.style.transform = `translate(${x}px,${y}px)`;
        e.target["tx"] = x;
        e.target["ty"] = y;
      }
    },
    mouseup_handler(e) {
      e.target["mousein"] = false;
    }
  },
  mounted() {
    document.addEventListener("mouseup", () => {
			
    })
  }
}
</script>
<style lang="less">
.svg-vue-tree-panel {
    width: 100%;
    height: 100%;
    svg {
        width: 100%;
        height: 100%;
        .item {
            fill: darken(green,10%);
            &:hover {
                fill: lighten(green,10%);
                cursor: pointer;
            }
        }
    }
}
</style>
