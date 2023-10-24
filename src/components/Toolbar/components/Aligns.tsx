import { computed, ComputedRef, defineComponent } from 'vue'
import { NButton, NButtonGroup, NPopover } from 'naive-ui'
import Modeler from 'bpmn-js/lib/Modeler'
import Selection from 'diagram-js/lib/features/selection/Selection'
import Modeling from 'bpmn-js/lib/features/modeling/Modeling.js'
import EventEmitter from '@/utils/EventEmitter'
import LucideIcon from '@/components/common/LucideIcon.vue'

import { useI18n } from 'vue-i18n'

const Aligns = defineComponent({
  name: 'Aligns',
  setup() {
    const { t } = useI18n()
    let modeling: Modeling | null = null
    let selection: Selection | null = null
    let align: any = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      modeling = modeler.get('modeling')
      selection = modeler.get('selection')
      align = modeler.get('alignElements')
    })

    const alignElements = (tag: string) => {
      if (modeling && selection) {
        const SelectedElements = selection.get()
        if (!SelectedElements || SelectedElements.length <= 1) {
          return window.__messageBox.warning('请按住 Shift 键选择多个元素对齐')
        }
        align.trigger(SelectedElements, tag)
      }
    }
  }
})

export default Aligns
