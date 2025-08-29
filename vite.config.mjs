import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression2';

function antDesignIconsFix() {
    return {
        name: '@ant-design-icons-fix',
        transform(code, id) {
            if (id.includes('antd')) {
                return code.replace("throw new TypeError('Unknown theme type: ' + theme + ', name: ' + name)", 'return;');
            }
        },
    };
}

export default defineConfig({
    plugins: [
        react({
            include: /.(jsx|tsx)$/,
            babel: {
                plugins: ['styled-components'],
                babelrc: false,
                configFile: false,
            },
        }),
        antDesignIconsFix(),
        viteCompression({
            verbose: true,
            disable: false,
            algorithm: 'brotliCompress',
            ext: '.br',
            deleteOriginalAssets: false,
        }),
    ],
    watch: {
        exclude: ['node_modules/**', '.yarn/**', 'src/init.js'],
    },
    build: {
        commonjsOptions: {
            include: ['node_modules/**', 'src/init.js'],
            transformMixedEsModules: true,
        },
        outDir: 'dist',
        sourcemap: false,
        modulePreload: {
            resolveDependencies: (url, deps, context) => {
                return [];
            },
        },
        rollupOptions: {
            output: {
                sourcemap: false,
                manualChunks: {
                    lodash: ['lodash'],
                    router: ['react-router-dom'],
                    quill: ['quill'],
                    draftjs: ['draft-js'],
                    apollo: ['@apollo/client'],
                    antd: ['antd'],
                },
            },
        },
    },
    resolve: {
        alias: [
            { find: 'mutationobserver-shim', replacement: 'mutationobserver-shim/dist/mutationobserver.min.js' },
            { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
            { find: '@components', replacement: path.resolve(__dirname, './src/components') },
            { find: '@constants', replacement: path.resolve(__dirname, './src/constants') },
            { find: '@graphql', replacement: path.resolve(__dirname, './src/graphql') },
            { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
            { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
            { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
            { find: '@public', replacement: path.resolve(__dirname, './public') },
        ],
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                additionalData: '@root-entry-name: default;',
                math: 'always',
            },
        },
    },
});
