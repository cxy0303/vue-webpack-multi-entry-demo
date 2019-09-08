<template>
<div class="svg-vue-tree">
  <svg xmlns="http://www.w3.org/2000/svg" class="svg_container" @mousedown="mousedown_handle($event)">
    <g ref='svg_g_root' class="svg_g_root">
      <item-tag :key='item.id' :item='item' v-for='(item,index) in items' @mousedown.native.stop="mousedown_handle($event,item)"></item-tag>
      <path :d='line' stroke='black' stroke-width='1'></path>
    </g>
  </svg>
</div>
</div>
</template>
<script>
import itemtag from './itembox/itemtag'
export default {
  data() {
    return {
      items: [{ //显示数据
        id: 0,
        text: '任务测试一sdfsdfdsfsdfsdfsdfsdf',
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
      moveitem: { //拖拽实时数据
        el: null,
        data: null
      },
      linepath: {
				// 'key1-key2':{
				// 	from:fromitem,
				// 	to:toitem
				// }
			} //连线关系数据
    }
  },
  components: {
    "item-tag": itemtag
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
  lines() {
    var all_paths = {};
    return all_paths;
  },
  methods: {
    mousedown_handle(e, item) {
      debugger
      if (item) {
        this.moveitem.el = e.currentTarget;
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
    debugger
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

    }
}
</style>
