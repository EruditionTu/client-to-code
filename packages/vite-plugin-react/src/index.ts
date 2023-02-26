import type { Plugin } from 'vite'
import {queryParserMiddleware,launchEditorMiddleware} from '@client-to-code/middleware';


// react-dev-utils是cjs，packages.json一定要注意，否则会出现问题
export const clientToCodeServer = (): Plugin => ({
  name: 'vite-plugin-react-client-to-code',
  configureServer(server) {
    server.middlewares.use(queryParserMiddleware)

    server.middlewares.use(launchEditorMiddleware)
  },
})

