import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // <-- Importez le module 'path' de Node.js

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src') // <-- Ajoutez cette configuration d'alias
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8080', // Votre adresse backend
                changeOrigin: true,
            }
        }
    }
})