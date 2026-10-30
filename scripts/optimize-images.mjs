import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = 'public/images/capri';

async function optimizeImages() {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));
  console.log(`Optimizing ${files.length} images in ${dir}...`);

  for (const file of files) {
    const srcPath = path.join(dir, file);
    const parsed = path.parse(file);
    const isPng = parsed.ext === '.png';

    const meta = await sharp(srcPath).metadata();
    const targetWidth = Math.min(meta.width || 1600, 1600);

    // 1. Generate WebP version
    const webpPath = path.join(dir, `${parsed.name}.webp`);
    await sharp(srcPath)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(webpPath);

    // 2. Re-optimize the JPG/PNG version in place with compression & max 1600px
    if (!isPng) {
      const tempJpg = path.join(dir, `${parsed.name}-tmp.jpg`);
      await sharp(srcPath)
        .resize({ width: targetWidth, withoutEnlargement: true })
        .jpeg({ quality: 82, progressive: true, mozjpeg: true })
        .toFile(tempJpg);
      fs.renameSync(tempJpg, srcPath);
    }
  }

  // Also optimize logo.png
  if (fs.existsSync('public/logo.png')) {
    await sharp('public/logo.png')
      .webp({ quality: 90 })
      .toFile('public/logo.webp');
  }

  console.log('Image optimization completed successfully!');
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
