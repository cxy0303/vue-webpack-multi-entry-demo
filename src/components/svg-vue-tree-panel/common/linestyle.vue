<template>
<drop-down class="linestyle">
  <template slot='title'>
    <a>
      <svg viewBox='0,0,15,15'>
        <path :d='path[type]' stroke='black'></path>
      </svg>
      <span v-if='type==0'>直线</span>
      <span v-if='type==1'>折线</span>
      <span v-if='type==2'>曲线</span>
    </a>
  </template>
  <div class="drop-down-panel-item" @click='$emit("change",0)'>
    <a>
      <svg viewBox='0,0,15,15'>
        <path :d='path[0]' stroke='black'></path>
      </svg>
      <span>直线</span>
    </a>
  </div>
  <div class="drop-down-panel-item" @click='$emit("change",1)'>
    <a>
      <svg viewBox='0,0,15,15'>
        <path :d='path[1]' stroke='black'></path>
      </svg>
      <span>折线</span>
    </a>
  </div>
  <div class="drop-down-panel-item" @click='$emit("change",2)'>
    <a>
      <svg viewBox='0,0,15,15'>
        <path :d='path[2]' stroke='black'></path>
      </svg>
      <span>曲线</span>
    </a>
  </div>
</drop-down>
</template>
<script>
import dropdown from './dropdown'
export default {
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  model: {
    prop: "type",
    event: "change"
  },
  components: {
    "drop-down": dropdown
  },
  data() {
    return {
      path: [
        'M0,7.5 L20,7.5 ',
        'M0,7.5 L20,7.5 ',
        'M0,7.5 L20,7.5 '
      ]
    }
  }
}
</script>
<style lang="less">
.linestyle {
    a {
        padding: 0 10px;
        display: flex;
        height: 100%;
        position: relative;
        z-index: 2;
        align-items: center;
        font-size: 13px;
        svg {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
        align-items: center;
    }
    .drop-down-panel .drop-down-panel-item {
        &:hover {
            path {
                stroke: blue;
            }
        }
    }
}
</style>
