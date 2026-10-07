// import { defineConfig } from 'vite'
// // import react from '@vitejs/plugin-react'

// export default defineConfig({
//   // plugins: [react()],
//   base: '/',
// })

import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Automatically finds every .html file project so no list them manually
function getHtmlInputs() {
  const inputs = {
    main: resolve(__dirname, 'index.html'),
  }

  function scanDirectory(dir, prefix = '') {
    if (!fs.existsSync(dir)) return
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = resolve(dir, entry.name)
      if (entry.isDirectory()) {
        scanDirectory(fullPath, `${prefix}${entry.name}/`)
      } else if (entry.name.endsWith('.html')) {
        const key = `${prefix}${entry.name.replace('.html', '')}`
        inputs[key] = fullPath
      }
    }
  }

  scanDirectory(resolve(__dirname, 'public'))
  return inputs
}

export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: getHtmlInputs(),
    },
  },
})