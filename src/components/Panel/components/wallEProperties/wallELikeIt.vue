<template>
  <div class="d-flex selectionArea">
    <div class="col-4">
      <label for="likeIt">Do you Like:</label>
    </div>
    <div class="col-8">
      <select id="likeIt" v-model="likeIt" name="likIt" @change="setWAllELikeItProperties(likeIt)">
        <option value="Yes">Yes</option>
        <option value="No">No</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import {
    getWallELikeIttValue,
    setWallELikeIttValue
  } from '@/bo-utils/wallEProperties/wallE-likeItUtil'
  import modeler from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'

  export default defineComponent({
    name: 'WallELikeIt',
    setup() {
      const modelerStore = modeler()
      let getActive = computed<Base | null>(() => modelerStore.getActive!)
      const likeIt = ref<any | string | undefined>('')
      const getWallELikeItProperties = () => {
        likeIt.value = getWallELikeIttValue(getActive.value!)
      }
      onMounted(() => {
        getWallELikeItProperties()
        EventEmitter.on('element-update', getWallELikeItProperties)
      })

      const setWAllELikeItProperties = (likeIt) => {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        setWallELikeIttValue(getActive.value!, likeIt)
      }

      return {
        likeIt,
        setWAllELikeItProperties
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    watch: {
      getActiveId: {
        immediate: true,
        handler() {
          this.reloadWallEValueProperties()
        }
      }
    },
    mounted() {
      this.reloadWallEValueProperties()
      EventEmitter.on('element-update', this.reloadWallEValueProperties)
    },
    methods: {
      async reloadWallEValueProperties() {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        const likeIt = ref<any | string | undefined>('')
        const getWallELikeIt = () => {
          likeIt.value = getWallELikeIttValue(getActive.value!)
          getWallELikeIt()
          EventEmitter.on('element-update', getWallELikeIt())
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
