<template>
  <div class="d-flex selectionArea">
    <div class="col-4">
      <label for="anyThing">Need Anything:</label>
    </div>
    <div class="col-8">
      <select
        id="anyThing"
        v-model="anyThing"
        name="anyThing"
        @change="setAnyProcessAnyThing(anyThing)"
      >
        <option value="noNeed">No Need</option>
        <option value="needChanges">Need Changes</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import {
    getAnyProcessAnythingValue,
    setAnyProcessAnythingValue
  } from '@/bo-utils/anyProcessProperties/anyProcessAnythingUtil'
  import modeler from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'

  export default defineComponent({
    name: 'AnyProcessAckMode',
    setup() {
      const modelerStore = modeler()
      let getActive = computed<Base | null>(() => modelerStore.getActive!)
      const anyThing = ref<any | string | undefined>('')
      const getAnyProcessAnyThing = () => {
        anyThing.value = getAnyProcessAnythingValue(getActive.value!)
      }
      onMounted(() => {
        getAnyProcessAnyThing()
        EventEmitter.on('element-update', getAnyProcessAnyThing)
      })
      const setAnyProcessAnyThing = (ss) => {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        setAnyProcessAnythingValue(getActive.value!, ss)
      }

      return {
        anyThing,
        setAnyProcessAnyThing
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    watch: {
      getActiveId: {
        immediate: true,
        handler() {
          this.reloadAnyProcessAckModeProperties()
        }
      }
    },
    mounted() {
      this.reloadAnyProcessAckModeProperties()
      EventEmitter.on('element-update', this.reloadAnyProcessAckModeProperties)
    },
    methods: {
      async reloadAnyProcessAckModeProperties() {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        const anyThing = ref<any | string | undefined>('')
        const getAnyProcessAnyThing = () => {
          anyThing.value = getAnyProcessAnythingValue(getActive.value!)
          getAnyProcessAnyThing()
          EventEmitter.on('element-update', getAnyProcessAnyThing)
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
