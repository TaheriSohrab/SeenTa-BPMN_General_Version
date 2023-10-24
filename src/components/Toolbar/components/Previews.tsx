import { defineComponent } from 'vue'

import BpmnModdle from 'bpmn-moddle'
import modeler from '@/store/modeler'
import { NButton, NPopover, NCode, useDialog } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import React from "@bpmn-io/properties-panel/preact/compat";

const Previews = defineComponent({
  name: 'Previews',
  setup() {
    const { t } = useI18n()
    const previewModel = useDialog()
    const modelerStore = modeler()

    const moddle = new BpmnModdle()

    const openXMLPreviewModel = async () => {
      try {
        const modeler = modelerStore.getModeler!

        if (!modeler) {
          return window.__messageBox.warning('模型加载失败，请刷新重试')
        }

        const { xml } = await modeler.saveXML({ format: true, preamble: true })

        previewModel.create({
          title: t('toolbar.previewAs'),
          showIcon: false,
          content: () => (
            <div class="preview-model">
              <NCode code={xml!} language="xml" wordWrap={true}></NCode>
            </div>
          )
        })
      } catch (e) {
        window.__messageBox.error((e as Error).message || (e as string))
      }
    }

    const cancel = () => {
      window.parent.postMessage('cancel', '*')
    }

    const openJsonPreviewModel = async () => {
      const modeler = modelerStore.getModeler!

      if (!modeler) {
        return window.__messageBox.warning('模型加载失败，请刷新重试')
      }

      const { xml } = await modeler.saveXML({ format: true })

      const jsonStr = await moddle.fromXML(xml!)

      previewModel.create({
        title: t('toolbar.previewAs'),
        showIcon: false,
        content: () => (
          <div class="preview-model">
            <NCode code={JSON.stringify(jsonStr, null, 2)} language="json" wordWrap={true}/>
          </div>
        )
      })
    }

    return () => (
      <div>
        <n-button onClick={openXMLPreviewModel} style="background-color: #326fa8; color: White; border: 0; padding: 15px; cursor: pointer; height: 35px">
          {'Preview as XML'}
        </n-button>
      </div>
    )
  }
})
export default Previews
