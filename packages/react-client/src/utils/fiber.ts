import type {Fiber} from 'react-reconciler';

import {getCodeInfoFromDebugSource} from './codeInfo'


/**
 * ReactElement
 * $$typeof：对象类型标识用于判断当前Object是否是同一种类型的ReactElement
 * type：如果当前ReactElement是是一个ReactComponent，那这里将是它对应的Constructor；而普通HTML标签，一般都是String
 * props：ReactElement上的所有属性，包含children
 * 
 */

 
/**
 * FiberNode
 * 在React 16之后Fiber Reconciler 就作为React的调度器，核心数据结构就是由FiberNode组成的NodeTree。 
 * 
 * type：和ReactElement的type属性表现一致
 * return：表示父级的FiberNode
 * child：表示第一个子FiberNode
 * sibling：表示紧紧相邻的下一个兄弟FiberNode
 * pendingProps：表示新的porops
 * memoizedProps：表示所有流程处理后的新props
 * memoizedState：表示经过所有流程处理后的新state
 * 
 */


/**
 * 原生HTML标签的Fiber是string类型
 * @param fiber 
 * @returns 
 */
export const isNativeTagFiber = (fiber?: Fiber): boolean => typeof fiber?.type === 'string'



export const isReactSymbolFiber = (fiber?: Fiber): boolean => typeof fiber?.type?.$$typeof === 'symbol'


/**
 * 处理使用forwardRef包裹的组件
 * @param fiber 
 * @returns 
 */
export const isForwardRef = (fiber?: Fiber): boolean =>
  fiber?.type?.$$typeof === Symbol.for('react.forward_ref')

type FiberHTMLElement = HTMLElement & {
    [fiberKey: string]: Fiber | undefined,
}


/**
 * 这个函数的作用是从react所挂载的dom节点上面获取该dom的Fiber节点，Fiber节点上有我们插件所需的debugSouce信息
 * 博客链接：https://www.cnblogs.com/ltfxy/p/15807553.html
 * https://github.com/facebook/react/blob/v16.13.1/packages/react-dom/src/client/ReactDOMComponentTree.js#L21
 * https://github.com/facebook/react/blob/v16.14.0/packages/react-dom/src/client/ReactDOMComponentTree.js#L39
 * @param element 
 * @returns 
 */
export const getFiberNodeFromElement = (element: FiberHTMLElement): Fiber | undefined => {
    const fiberKey = Object.keys(element).find(key => (
      key.startsWith('__reactInternalInstance$')
      || key.startsWith('__reactFiber$')
    ))
    if (fiberKey) {
      return element[fiberKey] as Fiber
    }
    return undefined
}


/**
 * 当element的dom节点上没有Fiber属性时，那么说明这个节点不是经过babel-jsx编译之后的节点，也同样不是react可控的，就不会有对应的FiberNode
 * 例如document.createElement()创建的dom节点，我们是不能在上面找到Fiber属性，所以需要寻找父节点的FiberNode
 * @param element 
 * @returns 
 */
export const getFiberNodeFromDocument = (element: HTMLElement | null): Fiber | undefined => {
    if (!element) return undefined
    const fiber = getFiberNodeFromElement(element as FiberHTMLElement)
    if (fiber) return fiber
    return getFiberNodeFromDocument(element.parentElement)
}

export const getDirectParentFiber = (child: Fiber): Fiber | null => {
    let current = child.return
    while (current) {
      /**
       * react fiber symbol types see:
       * https://github.com/facebook/react/blob/v17.0.0/packages/shared/ReactSymbols.js#L39-L58
       */
      if (!isReactSymbolFiber(current)) {
        return current
      }
      current = current.return
    }
    return null
}

export const getFiberName = (fiber?: Fiber): string | undefined => {
    const fiberType = fiber?.type
    if (!fiberType) return undefined
    const { displayName, name } = fiberType
  
    if (typeof displayName === 'string') {
      return displayName
    } else if (typeof name === 'string') {
      return name
    }
  
    return undefined
}

export const getReferenceFiber = (baseFiber?: Fiber): Fiber | undefined => {
  if (!baseFiber) return undefined

  const directParent = getDirectParentFiber(baseFiber)
  if (!directParent) return undefined

  const isParentNative = isNativeTagFiber(directParent)
  const isOnlyOneChild = !directParent.child!.sibling

  let referenceFiber = (!isParentNative && isOnlyOneChild)
    ? directParent
    : baseFiber

  // fallback for cannot find code-info fiber when traverse to root
  const originReferenceFiber = referenceFiber

  while (referenceFiber) {
    if (getCodeInfoFromDebugSource(referenceFiber)) return referenceFiber

    referenceFiber = referenceFiber.return!
  }

  return originReferenceFiber
}


export const getNamedFiber = (baseFiber?: Fiber): Fiber | undefined => {
  let fiber = baseFiber

  // fallback for cannot find code-info fiber when traverse to root
  let originNamedFiber: Fiber | undefined

  while (fiber) {
    let parent = fiber.return ?? undefined
    let forwardParent: Fiber | undefined

    while (isReactSymbolFiber(parent)) {
      if (isForwardRef(parent)) {
        forwardParent = parent
      }
      parent = parent?.return ?? undefined
    }

    if (forwardParent) {
      fiber = forwardParent
    }

    if (getFiberName(fiber)) {
      if (!originNamedFiber) originNamedFiber = fiber

      if (getCodeInfoFromDebugSource(fiber)) return fiber
    }

    fiber = parent!
  }

  return originNamedFiber
}


export const getElementInspect = (element: HTMLElement): {
  fiber?: Fiber,
  name?: string,
  title: string,
} => {
  const fiber = getFiberNodeFromDocument(element)
  const referenceFiber = getReferenceFiber(fiber)

  const namedFiber = getNamedFiber(referenceFiber)

  const fiberName = getFiberName(namedFiber)
  const nodeName = element.nodeName.toLowerCase()

  const title = fiberName
    ? `${nodeName} in <${fiberName}>`
    : nodeName

  return {
    fiber: referenceFiber,
    name: fiberName,
    title,
  }
}