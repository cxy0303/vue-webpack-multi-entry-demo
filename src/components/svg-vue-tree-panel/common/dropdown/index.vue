<template>
<div class="svg-vue-dropdown">
  <slot name='title'>

  </slot>
  <div class="drop-down-panel">
    <slot>

    </slot>
  </div>
</div>
</template>
<script>
export default {

}
</script>
<style lang="less">
.svg-vue-dropdown {
    cursor: pointer;
    position: relative;
    &:hover {
        &::before {
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5;
            background-color: #DDDDDD;
            z-index: 1;
        }
        .drop-down-panel {
            visibility: visible;
            transform: translateY(0);
        }
    }
    .drop-down-panel {
        visibility: hidden;
        transform: translateY(-10%);
        transition: transform 0.1s;
        position: absolute;
        top: 100%;
        background-color: white;
        border-radius: 3px;
        min-width: 100%;
        width: auto;
        z-index: 1;
        &::before {
            content: ' ';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 1px solid #DDDDDD;
        }
        .drop-down-panel-item {
            padding: 5px 0;
            &:hover {
                color: blue;
            }
        }
    }
}
</style>
