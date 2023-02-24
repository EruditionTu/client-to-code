import type {Fiber,Source} from 'react-reconciler'
import { getFiberNodeFromDocument,getReferenceFiber } from './fiber';
export interface CodeInfo {
    /**
     * 代码的行数
     */
    lineNumber: string,
    /**
     * 代码的列数
     */
    columnNumber: string,
    relativePath?: string,
    absolutePath?: string,
}

/**
 * 
 * https://github.com/babel/babel/tree/v7.16.4/packages/babel-plugin-transform-react-jsx-source
 * 通过@babel/plugin-transform-react-jsx-source可以给标签打上组件源码的行数、列数以及文件名等信息
 * 像通过vite搭建react的环境时，@vitejs/plugin-react中就会使用到上面的这个包，所以我们可以在fiber节点中获取到_debugSource这个属性
 * 可以通过fiber节点的_debugSource来获取
 * 
 * @param fiber 
 * @returns 
 * 
 */
export const getCodeInfoFromDebugSource = (fiber?:Fiber):CodeInfo|undefined=>{
    if(!fiber?._debugSource)return undefined

    const {
        fileName,
        lineNumber,
        columnNumber,
      } = fiber._debugSource as Source & { columnNumber?: number };

      if(fileName&&lineNumber){
          return {
              lineNumber:String(lineNumber),
              columnNumber:String(columnNumber??0),
              absolutePath:String(fileName)
          }
      }
      return undefined
}

/**
 * 从dom节点获取源码信息
 * @param element 
 * @returns 
 */
export const getCodeInfoFromElement = (element:HTMLElement):CodeInfo|undefined=>{
    
    const fiber:Fiber|undefined=getFiberNodeFromDocument(element);

    const referenceFiber = getReferenceFiber(fiber);
    
    return getCodeInfoFromDebugSource(referenceFiber);
}



