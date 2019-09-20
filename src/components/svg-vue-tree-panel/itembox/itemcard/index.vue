<template>
<g class="item-card" :class="{selected:selected}">
  <pattern id="avatar" width="100%" height="100%" patternContentUnits="objectBoundingBox">
    <image width="1" height="1" xlink:href="http://thirdwx.qlogo.cn/mmopen/vi_32/DYAIOgq83eoqxH8oKJZ19eicbVtxMBibkIQUEHfBWmfXKepnVLfia7lrznX4MI7rRHosC8qMRZu2C9R9bRAv57aibA/132" />
  </pattern>
  <rect class="left-color" x='0' y='0' rx='5' ry='5' :width='item.width' :height='item.height'></rect>
  <rect class="content" x='10' y='0' rx='5' ry='5' :width='item.width-10' :height='item.height'></rect>
  <circle :class="{flash:flash}" cx="265" cy="32" r='25' fill="url(#avatar)"></circle>
  <text x="20" y="25">
    <tspan class="subject" :textLength='subjectdata[0].width'>{{subjectdata[0].value.join('')}}</tspan>
    <tspan x='20' :y="70+index*18" class="remark" :textLength='row.width' v-for='(row,index) in textdata'>{{row.value.join('')}}</tspan>
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
          subject: "新元素",
          text: "",
          width: 200,
          height: 50
        }
      }
    },
    selected: {
      type: Boolean,
      default: false
    },
    flash: {
      type: Boolean,
      default: false
    }
  },
  model: {
    prop: "item"
  },
  computed: {
    subjectdata() {
      return tool.get_text_wrap(this.item.subject, 16, this.item.width - 135, 1)
    },
    textdata() {
      return tool.get_text_wrap(this.item.text, 13, this.item.width - 35, 3);
    }
  },
  mounted() {}
}
</script>
<style lang="less">
@import '../../index.less';
.item-card {
    &.selected {
        .content {
            stroke: @primary;
        }
    }
    .content {
        stroke-width: 1;
        fill: white;
    }
    .left-color {
        fill: @primary;
    }
    .subject {
        fill: @fontcolor1;
        font-size: 16px;
        font-weight: bolder;
    }
    .remark {
        font-size: 13px;
        fill: @fontcolor2;
        width: auto;
        height: auto;
        text-anchor: start;
        dominant-baseline: middle;
        overflow: hidden;
    }
    .flash {
        animation: flash 1s infinite linear;
    }
    @keyframes flash {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
}
</style>
