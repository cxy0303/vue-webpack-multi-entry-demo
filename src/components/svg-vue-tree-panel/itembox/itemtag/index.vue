<template>
<g class="item-tag" :class="{selected:selected}" @dblclick='dbclick'>
  <rect class="item-tag-rect" x='0' y='0' :width='item.width' :height='item.height'></rect>
  <text :x="padding" :y="padding" class="remark" ref='text' :style='item.style'>
    {{item.text}}
  </text>
</g>
</template>
<script>
import tool from '../../util/tool'
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
  },
  data() {
    return {
      padding: 5
    }
  },
  computed: {
    textdata() {
      return tool.get_text_wrap(this.item.text, 13, this.item.width - 35, 1);
    }
  },
  methods: {
    dbclick($event) {
      this.$emit("edit", this.item);
    }
  },
  watch: {
    "item.text"(v) {
      this.$nextTick(() => {
        var boundary = this.$refs["text"].getBoundingClientRect();
        var width = parseInt(boundary.width) + this.padding * 2;
        var height = parseInt(boundary.height) + this.padding * 2;
        if (width % 10 > 0) {
          this.item.width = width + (10 - width % 10);
        }
        if (height % 10 > 0) {
          this.item.height = height + (10 - height % 10);
        }
      })
    }
  },
  mounted() {
    if (!this.item.style) {
      this.$set(this.item, "style", {
        fontSize: '13px'
      })
    }
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
        // text-anchor: middle;
        dominant-baseline: text-before-edge;
        overflow: hidden;
        font-size: 13px;
        tspan {
            overflow: hidden;
        }
    }
}
</style>
