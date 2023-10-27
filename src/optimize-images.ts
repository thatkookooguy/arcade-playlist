import { join } from 'path';

import imagemin from 'imagemin';
import ImageminGm from 'imagemin-gm';
import imageminWebp from 'imagemin-webp';
// import imageminPng from 'imagemin-pngquant';

const imageminGm = new ImageminGm();

(async () => {
  const rootAssetsPath = join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets');
  const path3dBoxes = join(rootAssetsPath, '3d-box-textures');
  await imagemin([ rootAssetsPath + '/*.{jpg,png}' ], {
    destination: join(rootAssetsPath, 'optimized'),
    plugins: [
      imageminGm.resize({ width: 500, height: 500, gravity: 'Center' }),
      imageminWebp({ quality: 50 })
    ]
  });

  console.log('Cover images optimized!');

  // await imagemin([ path3dBoxes + '/*.{jpg,png}' ], {
  //   destination: join(path3dBoxes, 'optimized'),
  //   plugins: [
  //     imageminGm.resize({ width: 1000, height: 1000, gravity: 'Center' }),
  //     imageminWebp({ quality: 50 })
  //   ]
  // });

  // console.log('3d box textures optimized!');
})();
