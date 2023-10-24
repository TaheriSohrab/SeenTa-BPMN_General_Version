import { assign } from 'min-dash'
import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import Create from 'diagram-js/lib/features/create/Create'
import SpaceTool from 'diagram-js/lib/features/space-tool/SpaceTool'
import LassoTool from 'diagram-js/lib/features/lasso-tool/LassoTool'
import HandTool from 'diagram-js/lib/features/hand-tool/HandTool'
import GlobalConnect from 'diagram-js/lib/features/global-connect/GlobalConnect'
import Palette from 'diagram-js/lib/features/palette/Palette'

class EnhancementPaletteProvider extends PaletteProvider {
  private readonly _palette: Palette
  private readonly _create: Create
  private readonly _elementFactory: ElementFactory
  private readonly _spaceTool: SpaceTool
  private readonly _lassoTool: LassoTool
  private readonly _handTool: HandTool
  private readonly _globalConnect: GlobalConnect
  private readonly _translate: any
  constructor(
    palette,
    create,
    elementFactory,
    spaceTool,
    lassoTool,
    handTool,
    globalConnect,
    translate
  ) {
    super(
      palette,
      create,
      elementFactory,
      spaceTool,
      lassoTool,
      handTool,
      globalConnect,
      translate,
      2000
    )
    this._palette = palette
    this._create = create
    this._elementFactory = elementFactory
    this._spaceTool = spaceTool
    this._lassoTool = lassoTool
    this._handTool = handTool
    this._globalConnect = globalConnect
    this._translate = translate
  }
  getPaletteEntries() {
    const actions = {},
      create = this._create,
      elementFactory = this._elementFactory,
      translate = this._translate

    function createAction(
      type: string,
      group: string,
      className: string,
      title: string,
      options?: Object
    ) {
      function createListener(event) {
        const shape = elementFactory.createShape(assign({ type: type }, options))

        if (options) {
          !shape.businessObject.di && (shape.businessObject.di = {})
          shape.businessObject.di.isExpanded = (options as { [key: string]: any }).isExpanded
        }

        create.start(event, shape)
      }

      const shortType = type.replace(/^bpmn:/, '')

      return {
        group: group,
        className: className,
        title: title || translate('Create {type}', { type: shortType }),
        action: {
          dragstart: createListener,
          click: createListener
        }
      }
    }
    function createAOT(event) {
      const aotModule = elementFactory.createShape({ type: 'AOT:AOT' })
      create.start(event, aotModule)
    }
    function createWallE(event) {
      const wallEModule = elementFactory.createShape({ type: 'WallE:WallE' })
      create.start(event, wallEModule)
    }
    assign(actions, {
      'create.aot-module': {
        group: 'activity',
        className: 'bpmn-icon-mikasaModule',
        title: 'Mikasa',
        action: {
          click: createAOT,
          dragstart: createAOT
        }
      },
      'create.wallE-module': {
        group: 'activity',
        className: 'bpmn-icon-wallEModule',
        title: 'Wall-E',
        action: {
          click: createWallE,
          dragstart: createWallE
        }
      }
    })

    return actions
  }
}

EnhancementPaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
]

export default EnhancementPaletteProvider
