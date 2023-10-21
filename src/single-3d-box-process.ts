import { join } from 'path';

import { ensureDirSync, readFileSync, writeFileSync } from 'fs-extra';
import getColors from 'get-image-colors';
import { isString, kebabCase } from 'lodash';
import probe from 'probe-image-size';
import { SvgMaker, SvgMakerResultType } from '@kibibit/kb-hologram';

const gameDetails = JSON.parse(process.argv[2]);

const assetsFolder = join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets');
const spineFolder = join(assetsFolder, 'spine');
const backFolder = join(assetsFolder, 'back');

(async () => {
  try {
    // console.log(gameDetails.cover);
    const coverImageDetails = probe.sync(readFileSync(join(assetsFolder, decodeURIComponent(gameDetails.cover))));
    let backColors;
    try {
      if (!gameDetails.back) {
        backColors = [ '#000000' ];
      } else {
        backColors = await getColors(
          join(backFolder, gameDetails.back), {
            count: 1
          }
        );
      }
    } catch (error) {
      // black is the default
      backColors = [ '#000000' ];
    }
    // console.log(coverImageDetails);
    const svgMaker = new SvgMaker({
      type: 'html',
      width: Math.round((coverImageDetails?.width || 600 ) * 2.5),
      height: coverImageDetails?.height || 900,
      templateFile: join(__dirname, './template/index.html'),
      data: {
        side1: gameDetails.spine ? join(spineFolder, gameDetails.spine) : null,
        side2: gameDetails.spine ? join(spineFolder, gameDetails.spine) : null,
        front: join(assetsFolder, gameDetails.cover),
        back: join(backFolder, gameDetails.back),
        color: isString(backColors[0]) ? backColors[0] : backColors[0].hex()
      }
    });

    const result = await svgMaker.render(SvgMakerResultType.PngBuffer);
    ensureDirSync(join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets', '3d-box-textures'));
    writeFileSync(join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets', '3d-box-textures', kebabCase(gameDetails.title) + '.png'), result);
    console.log('[DONE]', JSON.stringify({
      title: gameDetails.title,
      box3D: kebabCase(gameDetails.title) + '.png',
      boxColor: isString(backColors[0]) ? backColors[0] : backColors[0].hex()
    }));
  } catch (error) {
    console.error(error);
  }

  process.exit(0);
})();
