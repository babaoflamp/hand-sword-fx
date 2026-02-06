import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({

  plugins: [react()],

  server: {

    host: true, // 사내 망(LAN) 접속 허용

    port: 5173,

  }

})
