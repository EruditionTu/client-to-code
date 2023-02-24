import queryString from 'querystring'
import type {CodeInfo} from './codeInfo';

/*@ts-ignore*/
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint'
export const gotoEditor = (source?: CodeInfo) => {
    if (!source) return
  
    const {
      lineNumber,
      columnNumber,
      relativePath,
      absolutePath,
    } = source
  
    const isRelative = Boolean(relativePath)
  
    const launchParams = {
      fileName: isRelative ? relativePath : absolutePath,
      lineNumber,
      colNumber: columnNumber,
    }
  
    /**
     * api in 'react-dev-inspector/plugins/webpack/middlewares' launchEditorMiddleware
     */
    const apiRoute = isRelative
      ? `${launchEditorEndpoint}/relative`
      : launchEditorEndpoint
  
    fetch(`${apiRoute}?${queryString.stringify(launchParams)}`,{
      headers:{
        ['Content-Type']:'application/json'
      }
    })
  }
