/**
 * https://github.com/facebook/create-react-app/blob/main/packages/react-dev-utils/errorOverlayMiddleware.js
 */

import path from 'path';
import createReactLaunchEditorMiddleware  from 'react-dev-utils/errorOverlayMiddleware'
import type {RequestHandler} from  "express"
// 由于没有相应的types文件就会导致ts编译报错，所以加一个ignore
/* @ts-ignore*/
import launchEditorEndpoint from 'react-dev-utils/launchEditorEndpoint';


export  const reactLaunchEditorMiddleware:RequestHandler = createReactLaunchEditorMiddleware()


export const queryParserMiddleware = (req:any, res:any, next:any) => {
  /**
   * 拼接query参数，
   * 我在前端使用fetch没有指定Content-Type
   * 所以本地服务用express解析的时候不能正确解析query参数
   * 这里直接偷个懒🤣
   */
  if (!req.query && req.url) {
    const url = new URL(req.url, 'https://berwin.xyz')
    req.query = Object.fromEntries(url.searchParams.entries())
  }
  next()
}


export const launchEditorMiddleware = (req:any, res:any, next:any) => {
  if (req.url.startsWith(launchEditorEndpoint)) {
    if (
      req.url.startsWith(`${launchEditorEndpoint}/relative`)
      && typeof req.query.fileName === 'string'
    ) {
      req.query.fileName = path.join(process.cwd(), req.query.fileName)
    }

    reactLaunchEditorMiddleware(req, res, next)
  } else {
    next()
  }
}