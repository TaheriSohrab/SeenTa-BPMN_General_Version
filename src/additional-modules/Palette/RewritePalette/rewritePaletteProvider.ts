import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory.js'
import { assign } from 'min-dash'
import { createAction } from '../utils'

class RewritePaletteProvider extends PaletteProvider {
  private readonly _palette: PaletteProvider
  private readonly _create: any
  private readonly _elementFactory: ElementFactory
  private readonly _spaceTool: any
  private readonly _lassoTool: any
  private readonly _handTool: any
  private readonly _globalConnect: any
  private readonly _translate: any
  private readonly _moddle: any
  constructor(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect) {
    super(palette, create, elementFactory, spaceTool, lassoTool, handTool, globalConnect, 2000)
    this._palette = palette
    this._create = create
    this._elementFactory = elementFactory
    this._spaceTool = spaceTool
    this._lassoTool = lassoTool
    this._handTool = handTool
    this._globalConnect = globalConnect
  }
  getPaletteEntries() {
    const actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      lassoTool = this._lassoTool,
      handTool = this._handTool,
      globalConnect = this._globalConnect

    function createTransformerModule(event) {
      const transformerModule = elementFactory.createShape({ type: 'Transformer:Transformer' })

      create.start(event, transformerModule)
    }

    function createSubprocess(event) {
      const subProcess = elementFactory.createShape({
        type: 'bpmn:SubProcess',
        x: 0,
        y: 0,
        isExpanded: true
      })

      const startEvent = elementFactory.createShape({
        type: 'bpmn:StartEvent',
        x: 40,
        y: 82,
        parent: subProcess
      })

      create.start(event, [subProcess, startEvent], {
        hints: {
          autoSelect: [startEvent]
        }
      })
    }

    assign(actions, {
      'hand-tool': {
        group: 'tools',
        className: 'bpmn-icon-hand-tool',
        title: '手型工具',
        action: {
          click: function (event) {
            handTool.activateHand(event)
          }
        }
      },
      'lasso-tool': {
        group: 'tools',
        className: 'bpmn-icon-lasso-tool',
        title: '套索工具',
        action: {
          click: function (event) {
            lassoTool.activateSelection(event)
          }
        }
      },
      'global-connect-tool': {
        group: 'tools',
        className: 'bpmn-icon-connection-multi',
        title: '全局连线',
        action: {
          click: function (event) {
            globalConnect.toggle(event)
          }
        }
      },
      'create.start-event': createAction(
        elementFactory,
        create,
        'bpmn:StartEvent',
        'events',
        'bpmn-icon-start-event-none',
        '开始事件'
      ),
      'create.end-event': createAction(
        elementFactory,
        create,
        'bpmn:EndEvent',
        'events',
        'bpmn-icon-end-event-none',
        '结束事件'
      ),

      'create.transformer-module': {
        group: 'activity',
        className: 'transformer-module',
        title: 'Transformer Module',
        action: {
          click: createTransformerModule,
          dragstart: createTransformerModule
        }
      }
    })

    return actions
  }
}

RewritePaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect'
]

export default RewritePaletteProvider
