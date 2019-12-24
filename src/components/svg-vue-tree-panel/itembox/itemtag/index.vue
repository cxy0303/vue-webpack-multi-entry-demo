<template>
<g class="item-tag" :class="{selected:selected}" @dblclick='dbclick'>
  <rect class="item-tag-rect" x='0' y='0' :width='item.width' :height='item.height'></rect>
  <text :x="padding_x" :y="padding_y" class="remark" ref='text' :style='item.style'>
    {{item.subject}}
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
          subject: "新元素"
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
      padding_x: 5,
      padding_y: 5,
      padding: 5
    }
  },
  methods: {
    dbclick($event) {
      this.$emit("edit", this.item);
    },
    intital() {
      this.$nextTick(() => {
        var boundary = this.$refs["text"].getBoundingClientRect();
        var width = parseInt(boundary.width);
        var height = parseInt(boundary.height);
        if (width % 10 > 0) {
          width = width + (10 - width % 10);
        }
        if (height % 10 > 0) {
          height = height + (10 - height % 10);
        }

        if (width < 70) {
          this.padding_x = (70 - width) / 2;
          width = 70;
        } else {
          this.padding_x = this.padding;
          width += this.padding;
        }

        if (height < 30) {
          this.padding_y = (30 - height) / 2;
          height = 30;
        } else {
          this.padding_y = this.padding;
          height += this.padding;
        }

        this.item.width = width;
        this.item.height = height
      })
    }
  },
  watch: {
    "item.subject"(v) {
      this.intital();
    }
  },
  mounted() {
    if (!this.item.style) {
      this.$set(this.item, "style", {
        fontSize: '13px'
      })
      this.intital();
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
