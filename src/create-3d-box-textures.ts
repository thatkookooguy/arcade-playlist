import { join } from 'path';

import { ensureDirSync, readFileSync, readJSONSync, writeFileSync } from 'fs-extra';
import { kebabCase } from 'lodash';
import probe from 'probe-image-size';
import { SvgMaker, SvgMakerResultType } from '@kibibit/kb-hologram';

const assetsFolder = join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets');
const spineFolder = join(assetsFolder, 'spine');
const backFolder = join(assetsFolder, 'back');

(async () => {
  const playlist = readJSONSync(join(assetsFolder, 'playlist-data.json'));

  playlist.games.forEach(async (gameDetails: any) => {
    try {
      if (!gameDetails.spine || !gameDetails.back) {
        return;
      }

      console.log(gameDetails.cover);
      const coverImageDetails = probe.sync(readFileSync(join(assetsFolder, unescape(gameDetails.cover))));
      console.log(coverImageDetails);
      const svgMaker = new SvgMaker({
        type: 'html',
        width: (coverImageDetails?.width || 600 ) * 2.5,
        height: coverImageDetails?.height || 900,
        templateFile: join(__dirname, './template/index.html'),
        data: {
          side1: join(spineFolder, gameDetails.spine),
          side2: join(spineFolder, gameDetails.spine),
          front: join(assetsFolder, gameDetails.cover),
          back: join(backFolder, gameDetails.back)
        }
      });

      const result = await svgMaker.render(SvgMakerResultType.PngBuffer);
      ensureDirSync(join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets', '3d-box-textures'));
      writeFileSync(join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets', '3d-box-textures', kebabCase(gameDetails.title) + '.png'), result);
    } catch (error) {
      console.error(error);
    }
  });
  // const gameDetails = playlist.games.find((game: any) => game.spine && game.back);
})();
