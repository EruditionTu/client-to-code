import React, { useEffect, useRef } from 'react'
import type { Fiber } from 'react-reconciler'
import hotkeys, { KeyHandler } from 'hotkeys-js'

import type {CodeInfo} from './utils/codeInfo'

import { setupHighlighter } from './utils/document'
import {getCodeInfoFromElement} from './utils/codeInfo'
import {gotoEditor} from './utils/editor'
import Overlay from './Overlay'
import {getElementInspect} from './utils/fiber'

/**
 * 扩展全局的Window属性
 */
declare global{
  interface Window{
    __REACT_DEV_INSPECTOR_TOGGLE__?:()=>void;
    __REACT_DEVTOOLS_TARGET_WINDOW__?:Window;
    __REACT_DEVTOOLS_GLOBAL_HOOK__?:any;
  }
}

export interface InspectParams {
  /** hover / click event target dom element */
  element: HTMLElement,
  /** nearest named react component fiber for dom element */
  fiber?: Fiber,
  /** source file line / column / path info for react component */
  codeInfo?: CodeInfo,
  /** react component name for dom element */
  name?: string,
}

export type ElementHandler = (params: InspectParams) => void

export const defaultHotKeys = ['control', 'shift', 'command', 'c']

export interface InspectorProps {
  /**
   * inspector toggle hotkeys
   *
   * supported keys see: https://github.com/jaywcjlove/hotkeys#supported-keys
   */
  keys?: string[],
  onHoverElement?: ElementHandler,
  onClickElement?: ElementHandler,
  /**
   * whether disable click react component to open IDE for view component code
   */
  disableLaunchEditor?: boolean,
}

export const Inspector: React.FC<InspectorProps&{children:any}> = (props:InspectorProps&{children:any}) => {
  const {
    keys,
    onHoverElement,
    onClickElement,
    disableLaunchEditor,
    children,
  } = props

  // hotkeys-js params need string
  const hotkey = (keys ?? defaultHotKeys).join('+')

  /** inspector tooltip overlay */
  const overlayRef = useRef<Overlay>()
  const mousePointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  const recordMousePoint = ({ clientX, clientY }: MouseEvent) => {
    mousePointRef.current.x = clientX
    mousePointRef.current.y = clientY
  }

  const startInspect = () => {
    const overlay = new Overlay()
    overlayRef.current = overlay

    const stopCallback = setupHighlighter({
      onPointerOver: handleHoverElement,
      onClick: handleClickElement,
    })

    overlay.setRemoveCallback(stopCallback)

    // inspect element immediately at mouse point
    const initPoint = mousePointRef.current
    const initElement = document.elementFromPoint(initPoint.x, initPoint.y)
    if (initElement) handleHoverElement(initElement as HTMLElement)
  }

  const stopInspect = () => {
    overlayRef.current?.remove()
    overlayRef.current = undefined
  }

  const handleHoverElement = (element: HTMLElement) => {
    const overlay = overlayRef.current

    const codeInfo = getCodeInfoFromElement(element)
    const relativePath = codeInfo?.relativePath
    const absolutePath = codeInfo?.absolutePath

    const { fiber, name, title } = getElementInspect(element)

    overlay?.inspect?.([element], title, relativePath ?? absolutePath)

    onHoverElement?.({
      element,
      fiber,
      codeInfo,
      name,
    })
  }

  const handleClickElement = (element: HTMLElement) => {
    stopInspect()

    const codeInfo = getCodeInfoFromElement(element)
    const { fiber, name } = getElementInspect(element)

    if (!disableLaunchEditor) gotoEditor(codeInfo)
    onClickElement?.({
      element,
      fiber,
      codeInfo,
      name,
    })
  }

  useEffect(() => {
    document.addEventListener('mousemove', recordMousePoint, true)
    return () => {
      document.removeEventListener('mousemove', recordMousePoint, true)
    }
  }, [])

  useEffect(() => {
    const handleHotKeys: KeyHandler = (event, handler) => {
      if (handler.key === hotkey) {
        overlayRef.current
          ? stopInspect()
          : startInspect()

      } else if (handler.key === 'esc' && overlayRef.current) {
        stopInspect()
      }
    }

    // https://github.com/jaywcjlove/hotkeys
    hotkeys(`${hotkey}, esc`, handleHotKeys)

    /**
     * @deprecated only for debug, will remove in next version
     */
    window.__REACT_DEV_INSPECTOR_TOGGLE__ = () => overlayRef.current
      ? stopInspect()
      : startInspect()

    return () => {
      hotkeys.unbind(`${hotkey}, esc`, handleHotKeys)
      delete window.__REACT_DEV_INSPECTOR_TOGGLE__
    }
  }, [hotkey])

  return (children ?? null)
}