import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

// O modo "preview-html" gera um único arquivo HTML (usado só para pré-visualização).
export default defineConfig(({ mode }) => ({
  plugins: [vue(), ...(mode === 'preview-html' ? [viteSingleFile()] : [])],
  test: { environment: 'jsdom' },
}))
