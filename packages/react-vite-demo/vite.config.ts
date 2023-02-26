import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {clientToCodeServer} from '@client-to-code/vite-plugin-react/plugin'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),clientToCodeServer()],
})
