import fs from 'fs';
import path from 'path';

try {
  const nativeJsPath = path.resolve('node_modules/rollup/dist/native.js');

  if (fs.existsSync(nativeJsPath)) {
    let content = fs.readFileSync(nativeJsPath, 'utf8');
    if (!content.includes('@rollup/wasm-node/dist/native.js')) {
      content = content.replace(
        /const nativeModule = requireWithFriendlyError\([\s\S]*?\);/,
        `let nativeModule;\ntry {\n\tnativeModule = requireWithFriendlyError(existsSync(path.join(__dirname, localName)) ? localName : \`@rollup/rollup-\${packageBase}\`);\n} catch (e) {\n\ttry {\n\t\tnativeModule = require('@rollup/wasm-node/dist/native.js');\n\t} catch (e2) {\n\t\tthrow e;\n\t}\n}`
      );
      fs.writeFileSync(nativeJsPath, content, 'utf8');
      console.log('[patch-rollup] Successfully applied wasm fallback patch for Windows / AppLocker.');
    }
  }
} catch (err) {
  // Graceful no-op on platforms where native bindings are supported or paths differ
  console.log('[patch-rollup] Note: Skipping patch (native bindings active or non-windows environment).');
}
