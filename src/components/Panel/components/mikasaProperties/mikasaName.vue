<template>
  <div class="d-flex selectionArea">
    <div class="col-4">
      <label for="name">Anime Name:</label>
    </div>
    <div class="col-8">
      <select id="name" v-model="animeName" name="name" @change="setAnimeNameProperties(animeName)">
        <option value="DeathNote">Death Note</option>
        <option value="AttackOnTitan">Attack On Titan</option>
        <option value="Monster">Monster</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, ref } from 'vue'
  import { getAotNameValue, setAotNameValue } from '@/bo-utils/mikasaProperties/aotNameUtil'
  import modeler from '@/store/modeler'
  import { Base } from 'diagram-js/lib/model'
  import EventEmitter from '@/utils/EventEmitter'
  import { mapState } from 'pinia'
  import modelerStore from '@/store/modeler'

  export default defineComponent({
    name: 'MikasaName',
    setup() {
      const modelerStore = modeler()
      let getActive = computed<Base | null>(() => modelerStore.getActive!)
      const aotName = ref<any | string | undefined>('')
      const getAotNameProperties = () => {
        aotName.value = getAotNameValue(getActive.value!)
      }
      onMounted(() => {
        getAotNameProperties()
        EventEmitter.on('element-update', getAotNameProperties)
      })

      const setAnimeNameProperties = (aotName) => {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        setAotNameValue(getActive.value!, aotName)
      }

      return {
        aotName,
        setAnimeNameProperties
      }
    },
    computed: {
      ...mapState(modelerStore, ['getActive', 'getActiveId'])
    },
    watch: {
      getActiveId: {
        immediate: true,
        handler() {
          this.reloadAotNameProperties()
        }
      }
    },
    mounted() {
      this.reloadAotNameProperties()
      EventEmitter.on('element-update', this.reloadAotNameProperties)
    },
    methods: {
      async reloadAotNameProperties() {
        const modelerStore = modeler()
        let getActive = computed<Base | null>(() => modelerStore.getActive!)
        const aotName = ref<any | string | undefined>('')
        const getAotName = () => {
          aotName.value = getAotNameValue(getActive.value!)
          getAotName()
          EventEmitter.on('element-update', getAotName)
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
