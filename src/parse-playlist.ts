import { XMLParser } from 'fast-xml-parser';
import { copy, copyFileSync, ensureDirSync, readFileSync, readdirSync, removeSync, writeJSONSync } from 'fs-extra';
import { resolve, join, parse } from 'path';
import inquirer from 'inquirer';
import { distance, closest } from 'fastest-levenshtein';
import { isString } from 'lodash';
const FindFiles = require('file-regex');

interface LBPlatformGame {
  ID: string;
}

interface LBPlaylistGame {
    GamePlatform: string;
    GameTitle: string;
    GameId: string;
}

interface KbGame {
  id: string;
  title: string;
  platform: string;
}

const loadedPlatformsData: any = {};
const imagesToCopy: any[] = [];
const launchBoxRoot = join('E:/', 'LaunchBox');
const platformDataRoot = join(launchBoxRoot, 'Data/Platforms');
const playlistDataRoot = join(launchBoxRoot, 'Data/Playlists');
const imagesRoot = join(launchBoxRoot, 'Images');

(async () => {
    /**
     * read playlists from playlistDataRoot (each playlist is an XML file)
     * then, ask the user using inquirer which playlist they want to use
     */
    
    const playlists = readdirSync(playlistDataRoot).map((file) => parse(file).name);
    
    const answers = await inquirer
      .prompt([
        {
          type: 'list',
          name: 'playlist',
          message: `Found ${ playlists.length } Playlists. Which playlist do you want to use?`,
          choices: playlists,
        },
      ]);

    await getPlaylistData(answers.playlist);
})();

async function getPlaylistData(playlistName: string) {
  const XMLdata = readFileSync(join(playlistDataRoot, `${ playlistName }.xml`), 'utf8');
    const parser = new XMLParser();
    let jObj = parser.parse(XMLdata);
    
    const playlist = {
        name: jObj.LaunchBox.Playlist.Name,
        nestedName: jObj.LaunchBox.Playlist.NestedName,
        description: jObj.LaunchBox.Playlist.Notes,
        games: jObj.LaunchBox.PlaylistGame.map((game: LBPlaylistGame) => ({
            platform: game.GamePlatform,
            title: game.GameTitle,
            id: game.GameId,
        }))
    };

    const playlistClearLogoFolder = join(imagesRoot, 'Playlists', playlist.nestedName, 'Clear Logo');
    const playlistClearLogoImage = readdirSync(playlistClearLogoFolder).find((filename) =>
      filename.endsWith('.png') ||
      filename.endsWith('.jpg') ||
      filename.endsWith('.jpeg') ||
      filename.endsWith('.gif') ||
      filename.endsWith('.bmp') ||
      filename.endsWith('.tif') ||
      filename.endsWith('.tiff') ||
      filename.endsWith('.webp')
    );
    if (playlistClearLogoImage) {
      imagesToCopy.push(join(playlistClearLogoFolder, playlistClearLogoImage));
      (playlist as any).cover = playlistClearLogoImage;
    }

    /**
     * get game details from platform xml
     * each platform has it's own xml file with the same name as the platform
     * in each game object
     */
    playlist.games = await Promise.all(playlist.games.map(async (game: KbGame) => {
      let platformData = loadedPlatformsData[game.platform];
      if (!platformData) {
        const platformFile = join(platformDataRoot, `${ game.platform }.xml`);
        const XMLdata = readFileSync(platformFile, 'utf8');
        platformData = parser.parse(XMLdata);
        loadedPlatformsData[game.platform] = platformData;
      }
      const matchingPlatformGame = platformData.LaunchBox.Game.find((platformGame: LBPlatformGame) => platformGame.ID === game.id);

      const matchedFrontBoxes = await FindFiles(
        join(imagesRoot, `${ game.platform }/Box - Front/`),
        new RegExp(`^${ game.title.replace(/[^\w\s.&א-ת!-]/ug, '.') }`),
        5
      );
      const matchedFrontReconstructedBoxes = await FindFiles(
        join(imagesRoot, `${ game.platform }/Box - Front - Reconstructed/`),
        new RegExp(`^${ game.title.replace(/[^\w\s.&א-ת!-]/ug, '.') }`),
        5
      );
      const matched3DBoxes = await FindFiles(
        join(imagesRoot, `${ game.platform }/Box - 3D/`),
        new RegExp(`^${ game.title.replace(/[^\w\s.&א-ת!-]/ug, '.') }`),
        5
      );
    
      const matchedFrontBoxFile = closest(game.title, matchedFrontBoxes.map((file: any) => file.file));
      const matchedFrontReconstructedBoxFile = closest(game.title, matchedFrontReconstructedBoxes.map((file: any) => file.file));
      const matched3dBoxFile = closest(game.title, matched3DBoxes.map((file: any) => file.file));

      const matchedFrontBox = matchedFrontBoxes.find((file: any) => file.file === matchedFrontBoxFile);
      const matchedFrontReconstructedBox = matchedFrontReconstructedBoxes.find((file: any) => file.file === matchedFrontReconstructedBoxFile);
      const matched3dBox = matched3DBoxes.find((file: any) => file.file === matched3dBoxFile);

      if (!matchedFrontBox && !matchedFrontReconstructedBox && !matched3dBox) {
        console.log(`Could not find box for ${ game.title }`);
      }

      imagesToCopy.push(matchedFrontBox || matchedFrontReconstructedBox || matched3dBox);

      return {
        ...game,
        ...{
          communityStarRating: matchingPlatformGame.CommunityStarRating,
          communityStarRatingTotalVotes: matchingPlatformGame.CommunityStarRatingTotalVotes,
          developer: matchingPlatformGame.Developer,
          maxPlayers: matchingPlatformGame.MaxPlayers,
          description: matchingPlatformGame.Notes,
          playMode: matchingPlatformGame.PlayMode,
          publisher: matchingPlatformGame.Publisher,
          releaseDate: matchingPlatformGame.ReleaseDate,
          videoUrl: matchingPlatformGame.VideoUrl,
          wikipediaUrl: matchingPlatformGame.WikipediaUrl,
          cover: (matchedFrontBox || matched3dBox)?.file,
        }
      }
    }));

    removeSync(join(__dirname, '..', 'result'));
    ensureDirSync(join(__dirname, '..', 'result'));
    ensureDirSync(join(__dirname, '..', 'result', 'assets'));
    writeJSONSync(join(__dirname, '..', 'result', 'assets', 'playlist-data.json'), playlist, { spaces: 2 });
    imagesToCopy.forEach((image: any) => {
      if (!image) return;

      if (isString(image)) {
        copyFileSync(image, join(__dirname, '..', 'result', 'assets', parse(image).base));
        return;
      }

      copyFileSync(join(image.dir, image.file), join(__dirname, '..', 'result', 'assets', image.file));
    });
}