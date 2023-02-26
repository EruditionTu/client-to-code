# @client-to-code/middleware

该软件包是用于client-to-code的一个中间件，作用是正确的解析链接中的query参数。

## 在vite中的用法

```
import {queryParserMiddleware,launchEditorMiddleware} from 'client-to-code/middleware';

export const clientToCodeServer = (): Plugin => ({
  name: 'vite-plugin-react-client-to-code',
  configureServer(server) {
    server.middlewares.use(queryParserMiddleware)

    server.middlewares.use(launchEditorMiddleware)
  },
})

```