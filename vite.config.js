import { defineConfig } from 'vite'

export default defineConfig({
    base: '/portfolio/',
    build: {
        outDir: 'dist',// Opcional: Garante que os arquivos saiam organizados na pasta dist
    }
})
