import dts from 'rollup-plugin-dts';
import esbuild,{ minify } from 'rollup-plugin-esbuild';
import { resolve } from 'path';

export default [
  {
    'input': resolve(__dirname,'../src/index.ts'),
    'output': {
      'file': resolve(__dirname,'../dist/index.js'),
      'format': 'es',
    },
    'external': [
      'pinia',
      '@no_idea/utils',
    ],
    'plugins': [
      esbuild({}),
      minify(),
    ],
  },
  {
    'input': resolve(__dirname,'../src/index.ts'),
    'output': {
      'file': resolve(__dirname,'../dist/index.d.ts'),
      'format': 'es',
    },
    'external': [
      'pinia',
    ],
    'plugins': [
      dts(),
    ],
  },
];