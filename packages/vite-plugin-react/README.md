# @client-to-code/vite-plugin-react

当我们使用react开发web app时，使用vite作为构建工具时，通过引入这个插件，可以实现开发环境下点击UI跳转对应文件的效果。

## 用法

```
npm i @client-to-code/vite-plugin-react -D
```

```
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {clientToCodeServer} from '@client-to-code/vite-plugin-react/plugin'

export default defineConfig({
  plugins: [react(),clientToCodeServer()],
})
```

```
// ./src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Inspector} from '@client-to-code/vite-plugin-react'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Inspector>
      <App/>
    </Inspector>
  </React.StrictMode>,
)

```

