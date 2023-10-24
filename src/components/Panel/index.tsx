import { defineComponent, Component, markRaw, onMounted, ref } from 'vue'
import { NCollapse } from 'naive-ui'
import { Base, Connection, Label, Shape } from 'diagram-js/lib/model'
import { Translate } from 'diagram-js/lib/i18n/translate'
import debounce from 'lodash.debounce'
import EventEmitter from '@/utils/EventEmitter'
import modelerStore from '@/store/modeler'
import Logger from '@/utils/Logger'
import getBpmnIconType from '@/bpmn-icons/getIconType'
import bpmnIcons from '@/bpmn-icons'
import AnyProcessAckMode from '@/components/Panel/components/anyProcess/anyProcessAckMode.vue'
import WallELikeIt from '@/components/Panel/components/wallEProperties/wallELikeIt.vue'
import WallECrush from '@/components/Panel/components/wallEProperties/wallECrush.vue'
import MikasaName from '@/components/Panel/components/mikasaProperties/mikasaName.vue'

const Panel = defineComponent({
  name: 'Panel',
  setup() {
    const modeler = modelerStore()
    const panel = ref<HTMLDivElement | null>(null)
    const currentElementId = ref<string | undefined>(undefined)
    const currentElementType = ref<string | undefined>(undefined)

    const penalTitle = ref<string | undefined>('属性配置')
    const bpmnIconName = ref<string>('')
    const bpmnElementName = ref<string>('')
    const renderComponents = markRaw<Component[]>([])
    const setCurrentComponents = (element: Base) => {
      renderComponents.splice(0, renderComponents.length)
      if (element.type === 'bpmn:SequenceFlow') {
        renderComponents.splice(0, renderComponents.length)
        renderComponents.push(AnyProcessAckMode)
      }
      if (element.type === 'AOT:AOT') {
        renderComponents.splice(0, renderComponents.length)
        renderComponents.push(MikasaName)
      }
      if (element.type === 'WallE:WallE') {
        renderComponents.splice(0, renderComponents.length)
        renderComponents.push(WallELikeIt)
        renderComponents.push(WallECrush)
      }
    }

    // 设置选中元素，更新 store
    const setCurrentElement = debounce((element: Shape | Base | Connection | Label | null) => {
      let activatedElement: BpmnElement | null | undefined = element
      let activatedElementTypeName = ''

      if (!activatedElement) {
        activatedElement =
          modeler.getElRegistry?.find((el) => el.type === 'bpmn:Process') ||
          modeler.getElRegistry?.find((el) => el.type === 'bpmn:Collaboration')

        if (!activatedElement) {
          return Logger.prettyError('No Element found!')
        }
      }
      activatedElementTypeName = getBpmnIconType(activatedElement)

      modeler.setElement(markRaw(activatedElement), activatedElement.id)
      currentElementId.value = activatedElement.id
      currentElementType.value = activatedElement.type.split(':')[1]
      penalTitle.value = modeler.getModeler?.get<Translate>('translate')(currentElementType.value)
      bpmnIconName.value = bpmnIcons[activatedElementTypeName]
      bpmnElementName.value = activatedElementTypeName
      setCurrentComponents(activatedElement)
      EventEmitter.emit('element-update', activatedElement)

      Logger.prettyPrimary(
        'Selected element changed',
        `ID: ${activatedElement.id} , type: ${activatedElement.type}`
      )
      Logger.prettyInfo('Selected element businessObject', activatedElement.businessObject)
    }, 100)

    EventEmitter.on('modeler-init', (modeler) => {
      modeler.on('import.done', () => {
        setCurrentElement(null)
      })

      modeler.on('selection.changed', ({ newSelection }) => {
        console.log(JSON.stringify(newSelection[0]?.type))
        setCurrentElement(newSelection[0] || null)
      })
      modeler.on('element.changed', ({ element }) => {
        if (element && element.id === currentElementId.value) {
          setCurrentElement(element)
        }
      })

      modeler.on('element.click', (event) => {
        Logger.prettyInfo('Element Click', event)
      })
    })

    onMounted(() => !currentElementId.value && setCurrentElement())

    return () => (
      <div ref={panel} class="panel">
        <div class="panel-header">
          {/*<BpmnIcon name={bpmnIconName.value}></BpmnIcon>*/}
          <p>{bpmnElementName.value}</p>
          {/*<p>{customTranslate(currentElementType.value || 'Process')}</p>*/}
        </div>
        <NCollapse arrow-placement="right">
          {renderComponents.map((component) => (
            <component is={component}></component>
          ))}
        </NCollapse>
      </div>
    )
  }
})

export default Panel
