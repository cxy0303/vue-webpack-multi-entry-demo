<template>
<div class="svg-vue-tree">
  <div class="svg-vue-tree-panel">
    <div v-for='(item,index) in items' class="item-box" @mousedown="mousedown_handle($event,item)">
      {{item.text}}
    </div>
  </div>
  <svg xmlns="http://www.w3.org/2000/svg">
    <path :d='line'></path>
  </svg>
</div>
</template>
<script>
export default {
  data() {
    return {
      items: [{
        text: '任务测试一',
        tx: 0,
        ty: 0
      }, {
        text: '任务测试二',
        tx: 0,
        ty: 0
      }],
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
      this.moveitem.el = e.target;
      this.moveitem.data = item;
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
    .svg-vue-tree-panel,
    svg {
        position: absolute;
        left: 0;
        top: 0;
        path {
            stroke: red;
            stroke-width: 2;
        }
    }
    .svg-vue-tree-panel {
        z-index: 1;
    }
    svg {
        width: 100%;
        height: 100%;
    }
    .item-box {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        width: 200px;
        height: 50px;
        border: 1px solid black;
        border-radius: 5px;
        background-color: #EEEEEE;
    }
}
</style>
