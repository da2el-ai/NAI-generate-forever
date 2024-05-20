import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    root: 'src',
    plugins: [],
    build: {
        sourcemap: true,
        minify: false,
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'src/js/index.ts'),
                style: resolve(__dirname, 'src/css/style.scss'),
                options: resolve(__dirname, 'src/html/options.html'),
                popup: resolve(__dirname, 'src/html/popup.html'),
            },
            output: {
                entryFileNames: 'js/[name].js',
                // assetFileNames: '[name].[ext]',
                assetFileNames: function (assetInfo) {
                    const cssRegex = new RegExp('.css$', 'i');
                    const htmlRegex = new RegExp('.html$', 'i');
                    if (cssRegex.test(assetInfo.name)) {
                        return 'css/[name].[ext]';
                    }
                    return '[name].[ext]';
                },
            },
        },
    },
});
