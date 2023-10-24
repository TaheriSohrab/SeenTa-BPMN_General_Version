<template>
  <div class="d-flex selectionArea">
    <div class="col-4">
      <label for="wallECrush">Partner's Name:</label>
    </div>
    <div class="col-8">
      <input
        id="wallECrush"
        v-model="wallECrush"
        style="width: 83%"
        maxlength="25"
        @input="setWallECrush(wallECrush)"
      />
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import {
    getWallECrushValue,
    setWallECrushValue
  } from '@/bo-utils/wallEProperties/wallE-crushUtil.ts'
  import modeler from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'

  export default defineComponent({
    name: 'WallECrush',
    setup() {
      const modelerStore = modeler()
      let getActive = computed<Base | null>(() => modelerStore.getActive!)
      const wallECrush = ref<any | string | undefined>('')
      const getWallECrush = () => {
        wallECrush.value = getWallECrushValue(getActive.value!)
      }
      onMounted(() => {
        getWallECrush()
        EventEmitter.on('element-update', getWallECrush)
      })

      const setWallECrush = (outputMsgType) => {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        setWallECrushValue(getActive.value!, outputMsgType)
      }

      return {
        wallECrush,
        setWallECrush
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    watch: {
      getActiveId: {
        immediate: true,
        handler() {
          this.reloadWallECrushProperties()
        }
      }
    },
    mounted() {
      this.reloadWallECrushProperties()
      EventEmitter.on('element-update', this.reloadWallECrushProperties)
    },
    methods: {
      async reloadWallECrushProperties() {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        const outputMsgType = ref<any | string | undefined>('')
        const getWallECrush = () => {
          outputMsgType.value = getWallECrushValue(getActive.value!)
          getWallECrush()
          EventEmitter.on('element-update', getWallECrush)
        }
      }
    }
  })
</script>
<style>
  .col-4 {
    width: 40%;
  }
  .col-8 {
    width: 80%;
  }
  .selectionArea {
    margin: 2% 0;
    display: flex;
    align-items: center;
  }
  .selectionArea select {
    text-transform: uppercase;
    width: 85% !important;
    height: 30px;
  }
  .selectionArea option {
    padding: 7px;
    text-transform: capitalize !important;
  }
</style>
