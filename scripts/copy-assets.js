import fs from 'fs';
import path from 'path';

// Pasta de origem (electron)
const srcDir = path.resolve('electron');
// Pasta de destino (build)
const outDir = path.resolve('build/electron');

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;

    const stats = fs.statSync(src);

    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

        const files = fs.readdirSync(src);
        files.forEach(file => copyRecursive(path.join(src, file), path.join(dest, file)));
    } else if (stats.isFile()) {
        fs.copyFileSync(src, dest);
    }
}

// Copia apenas HTML e assets
copyRecursive(path.join(srcDir, 'tamplate'), path.join(outDir, 'tamplate'));
copyRecursive(path.join(srcDir, 'assets'), path.join(outDir, 'assets'));

// Se quiser copiar outros HTML soltos
const htmlFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.html'));
htmlFiles.forEach(f => copyRecursive(path.join(srcDir, f), path.join(outDir, f)));