import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React 核心
          if (id.includes('node_modules/react') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // React Flow (工作流程編輯器)
          if (id.includes('node_modules/@xyflow') || id.includes('node_modules/dagre')) {
            return 'vendor-reactflow';
          }
          // Lucide Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          // Zustand 狀態管理
          if (id.includes('node_modules/zustand')) {
            return 'vendor-zustand';
          }
        },
      },
    },
    // 提高警告閾值
    chunkSizeWarningLimit: 600,
  },
})
