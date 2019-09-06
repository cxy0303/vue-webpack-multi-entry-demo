<template>
<div class="svg-vue-tree">
  <svg xmlns="http://www.w3.org/2000/svg" class="svg_container" @mousedown="mousedown_handle($event)">
    <symbol :id='"item_box_"+item.id' v-for='(item,index) in items' viewBox='0 0 180 50' class="item-box">
      <rect x='0' y='0' width='180' height='50' fill='#EEEEEE' stroke='grey' stroke-width='2'></rect>
      <text x='90' y='25' width='180' height='50' fill='red'>{{item.text}}</text>
    </symbol>
    <g ref='svg_g_root' class="svg_g_root">
      <use v-for='(item,index) in items' :xlink:href='"#item_box_"+item.id' x='0' y='0' width='180' height='50' @mousedown.stop="mousedown_handle($event,item)"></use>
      <path :d='line' stroke='black' stroke-width='1'></path>
    </g>
  </svg>
</div>
</div>
</template>
<script>
export default {
  data() {
    return {
      items: [{
        id: 0,
        text: '任务测试一',
        tx: 0,
        ty: 0
      }, {
        id: 1,
        text: '任务测试二',
        tx: 0,
        ty: 0
      }],
      svg_g_root: {
        tx: 0,
        ty: 0
      },
      moveitem: {
        el: null,
        data: null
      }
    }
  },
  computed: {
    line() {
      let x1 = this.items[0].tx;
      let y1 = this.items[0].ty;

      let x2 = this.items[1].tx;
      let y2 = this.items[1].ty;
      return `M${x1},${y1} L${x2},${y2}`;
    }
  },
  methods: {
    mousedown_handle(e, item) {
      if (item) {
        this.moveitem.el = e.target;
        this.moveitem.data = item;
      } else {
        this.moveitem.el = this.$refs["svg_g_root"];
        this.moveitem.data = this.svg_g_root;
      }
    },
    mousemove_handler(e) {
      if (this.moveitem.el) {
        var target = this.moveitem.el;
        var data = this.moveitem.data;
        let ox = data.tx || 0;
        let oy = data.ty || 0;
        let x = e.movementX + ox;
        let y = e.movementY + oy;
        target.style.transform = `translate(${x}px,${y}px)`;
        data.tx = x;
        data.ty = y;
      }
      window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
    },
    init() {
      document.addEventListener("mousemove", this.mousemove_handler)
      document.addEventListener("mouseup", () => {
        this.moveitem.el = null;
        this.moveitem.data = null;
      })
    }
  },
  mounted() {
    this.init();
  }
}
</script>
<style lang="less">
.svg-vue-tree {
    font-family: '微软雅黑';
    width: 100%;
    height: 100%;
    .svg_container {
        width: 100%;
        height: 100%;
        background: none;
        .item-box {
            text {
                text-anchor: middle;
                font-size: 20px;
                dominant-baseline: middle;
            }
        }

    }
}
</style>
