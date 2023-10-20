/* eslint-disable require-atomic-updates */
import { join, parse } from 'path';

import cliProgress from 'cli-progress';
import { XMLParser } from 'fast-xml-parser';
import { closest } from 'fastest-levenshtein';
import { copyFileSync, ensureDirSync, readdirSync, readFileSync, removeSync, writeJSONSync } from 'fs-extra';
import inquirer from 'inquirer';
import { isString } from 'lodash';

const FindFiles = require('file-regex');

interface ILBPlatformGame {
  ID: string;
}

interface ILBPlaylistGame {
    GamePlatform: string;
    GameTitle: string;
    GameId: string;
}

interface IKbGame {
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
const videosRoot = join(launchBoxRoot, 'Videos');

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
        choices: playlists
      }
    ]);

  await getPlaylistData(answers.playlist);
})();

async function getPlaylistData(playlistName: string) {
  const PlaylistSteps = [
    '📚 Reading Playlist Data from LB',
    '🔍🎮 Scanning games in playlist',
    '🖼️  Get Playlist Images from LB'
  ];
  const playlistProgressBar = new cliProgress.SingleBar({
    clearOnComplete: false,
    format: '{bar} | {percentage}% | {value}/{total} Chunks | {stepName}'
  }, cliProgress.Presets.shades_classic);
  playlistProgressBar.start(150, 0, {
    stepName: PlaylistSteps[0]
  });
  const XMLdata = readFileSync(join(playlistDataRoot, `${ playlistName }.xml`), 'utf8');
  const parser = new XMLParser();
  const jObj = parser.parse(XMLdata);
  const numberOfGamesInPlaylist = jObj.LaunchBox.PlaylistGame.length;

  const playlist = {
    name: jObj.LaunchBox.Playlist.Name,
    nestedName: jObj.LaunchBox.Playlist.NestedName,
    description: jObj.LaunchBox.Playlist.Notes,
    games: jObj.LaunchBox.PlaylistGame.map((game: ILBPlaylistGame, index: number) => {
      playlistProgressBar.update((index / numberOfGamesInPlaylist) * 100, {
        stepName: PlaylistSteps[1]
      });
      return {
        platform: game.GamePlatform,
        title: game.GameTitle,
        id: game.GameId
      };
    }),
    platforms: {} as Record<string, any>
  };

  playlistProgressBar.update(100, {
    stepName: PlaylistSteps[2]
  });

  const playlistClearLogoFolder = join(imagesRoot, 'Playlists', playlist.nestedName, 'Clear Logo');
  let folderContent: string[] = [];
  try {
    folderContent = readdirSync(playlistClearLogoFolder);
  } catch (e) {
    console.log(`Could not find clear logo for ${ playlist.name }`);
  }
  const playlistClearLogoImage = folderContent.find((filename) =>
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
    (playlist as any).cover = encodeURIComponent(playlistClearLogoImage);
  }

  playlistProgressBar.update(150, {
    stepName: PlaylistSteps[2]
  });
  playlistProgressBar.stop();
  const PlatformGameInfoProgressBar = new cliProgress.SingleBar({
    clearOnComplete: false,
    format: '{bar} | {percentage}% | {value}/{total} Chunks | {stepName}'
  }, cliProgress.Presets.shades_classic);
  let platformGameInfoProgress = 0;
  PlatformGameInfoProgressBar.start(numberOfGamesInPlaylist * 10, platformGameInfoProgress, {
    stepName: 'ℹ️🎮 Get Game Details from LB'
  });

  /**
     * get game details from platform xml
     * each platform has it's own xml file with the same name as the platform
     * in each game object
     */
  playlist.games = await Promise.all(playlist.games.map(async (game: IKbGame) => {
    let platformData = loadedPlatformsData[game.platform];
    if (!platformData) {
      const platformFile = join(platformDataRoot, `${ game.platform }.xml`);
      const XMLdata = readFileSync(platformFile, 'utf8');
      platformData = parser.parse(XMLdata);
      loadedPlatformsData[game.platform] = platformData;
    }
    const matchingPlatformGame = platformData.LaunchBox.Game.find((platformGame: ILBPlatformGame) => platformGame.ID === game.id);

    const matchedPlatforms = await FindFiles(
      join(imagesRoot, 'Platforms', game.platform, 'Clear Logo/'),
      new RegExp(`^${ game.platform.replace(/[^\w\s.&א-ת!-]/ug, '.') }((\-\d+)|(\\.[\w-]+))?\\.`),
      5
    );

    const matchedFrontBox = await getGameImageFromLaunchBox(game.title, game.platform, 'Box - Front');
    const matchedFrontReconstructedBox = await getGameImageFromLaunchBox(game.title, game.platform, 'Box - Front - Reconstructed');
    const matchedFanartFrontBox = await getGameImageFromLaunchBox(game.title, game.platform, 'Fanart - Box - Front');
    const matched3dBox = await getGameImageFromLaunchBox(game.title, game.platform, 'Box - 3D');
    const matchedSpine = await getGameImageFromLaunchBox(game.title, game.platform, 'Box - Spine');
    const matchedBack = await getGameImageFromLaunchBox(game.title, game.platform, 'Box - Back');
    const matchedVideo = await getGameImageFromLaunchBox(game.title, game.platform, 'Videos');

    if (!matchedFrontBox && !matchedFrontReconstructedBox && !matched3dBox && !matchedFanartFrontBox) {
      console.log(`Could not find box for ${ game.title }`);
    }

    // if (!matchedVideo) {
    //   console.log(`Could not find video for ${ game.title }`);
    // }

    if (matchedPlatforms.length > 0) {
      const matchedPlatformImageFile = closest(game.platform, matchedPlatforms.map((file: any) => file.file));
      const matchedPlatformImage = matchedPlatforms.find((file: any) => file.file === matchedPlatformImageFile);
      playlist.platforms[game.platform] = {
        name: game.platform,
        image: matchedPlatformImage?.file
      };
      imagesToCopy.push(matchedPlatformImage);
    }

    imagesToCopy.push(matchedFrontBox || matchedFrontReconstructedBox || matchedFanartFrontBox || matched3dBox);
    imagesToCopy.push(matchedVideo);

    platformGameInfoProgress += 10;
    PlatformGameInfoProgressBar.update(platformGameInfoProgress, {
      stepName: `ℹ️🎮 Get Game Details: ${ game.title }`
    });

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
        cover: (matchedFrontBox || matchedFrontReconstructedBox || matchedFanartFrontBox || matched3dBox)?.file,
        video: matchedVideo?.file,
        spine: matchedSpine?.file,
        back: matchedBack?.file
      }
    };
  }));

  PlatformGameInfoProgressBar.stop();
  const createResultFolderProgressBar = new cliProgress.SingleBar({
    clearOnComplete: false,
    format: '{bar} | {percentage}% | {value}/{total} Chunks | {stepName}'
  }, cliProgress.Presets.shades_classic);
  createResultFolderProgressBar.start(imagesToCopy.length, 0, {
    stepName: '📁✅ Creating Result Folder'
  });

  playlist.games.forEach((game: any) => {
    if (game.cover) {
      game.cover = encodeURIComponent(game.cover);
    }

    if (game.video) {
      game.video = encodeURIComponent(game.video);
    }
  });

  const assetFolder = join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets');
  removeSync(assetFolder);
  ensureDirSync(assetFolder);
  writeJSONSync(join(assetFolder, 'playlist-data.json'), playlist, { spaces: 2 });
  imagesToCopy.forEach((image: any, index: number) => {
    createResultFolderProgressBar.update(index);
    if (!image) return;

    if (isString(image)) {
      copyFileSync(image, join(assetFolder, parse(image).base));
      return;
    }

    copyFileSync(join(image.dir, image.file), join(assetFolder, image.file));
  });

  // update to 100%
  createResultFolderProgressBar.update(imagesToCopy.length, {
    stepName: '📁✅ Created Result Folder'
  });
  createResultFolderProgressBar.stop();
}

async function getGameImageFromLaunchBox(
  gameTitle: string,
  platform: string,
  imageType: string
) {
  const matchedImages = await FindFiles(
    join(imagesRoot, `${ platform }/${ imageType }/`),
    new RegExp(`^${ gameTitle.replace(/[^\w\s.&א-ת!-]/ug, '.') }(\\.[\\w-]+)?(-\\d+)?\\.`),
    5
  );

  const matchedImageFile = closest(gameTitle, matchedImages.map((file: any) => file.file));
  const matchedImage = matchedImages.find((file: any) => file.file === matchedImageFile);

  return matchedImage;
}
