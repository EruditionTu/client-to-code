import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Inspector} from '../node_modules/@client-to-code/react-client'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Inspector>
      <App/>
    </Inspector>
  </React.StrictMode>,
)
