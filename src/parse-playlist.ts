import { XMLParser } from 'fast-xml-parser';
import { readFileSync, readdirSync } from 'fs-extra';
import { resolve, join, parse } from 'path';
import inquirer from 'inquirer';
import { distance, closest } from 'fastest-levenshtein';

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

(async () => {
    const loadedPlatformsData: any = {};
    const imagesToCopy = [];
    const launchBoxRoot = resolve('./', 'LaunchBox');
    const platformDataRoot = join(launchBoxRoot, 'Data/Platforms');
    const playlistDataRoot = join(launchBoxRoot, 'Data/Playlists');
    const imagesRoot = join(launchBoxRoot, 'Images');
    
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

    // console.log(answers);
    // process.exit(0);
    
    const XMLdata = readFileSync(join(playlistDataRoot, `${ answers.playlist }.xml`), 'utf8');
    const parser = new XMLParser();
    let jObj = parser.parse(XMLdata);
    
    const playlist = {
        name: jObj.LaunchBox.Playlist.Name,
        nestedName: jObj.LaunchBox.Playlist.NestedName,
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
    }

    /**
     * get game details from platform xml
     * each platform has it's own xml file with the same name as the platform
     * in each game object
     */
    playlist.games = playlist.games.map((game: KbGame) => {
      let platformData = loadedPlatformsData[game.platform];
      if (!platformData) {
        const platformFile = join(platformDataRoot, `${ game.platform }.xml`);
        const XMLdata = readFileSync(platformFile, 'utf8');
        platformData = parser.parse(XMLdata);
        loadedPlatformsData[game.platform] = platformData;
      }
      const matchingPlatformGame = platformData.LaunchBox.Game.find((platformGame: LBPlatformGame) => platformGame.ID === game.id);
      const platformFrontBoxes = readdirSync(join(imagesRoot, `${ game.platform }/Box - Front/`));
      const platform3dBoxes = readdirSync(join(imagesRoot, `${ game.platform }/Box - 3D/`));

      const matchingPlatformFrontBox = closest(game.title, platformFrontBoxes);
      const matchingPlatform3dBox = closest(game.title, platform3dBoxes);

      imagesToCopy.push(join(imagesRoot, `${ game.platform }/Box - Front/`, matchingPlatformFrontBox));
      imagesToCopy.push(join(imagesRoot, `${ game.platform }/Box - 3D/`, matchingPlatform3dBox));

      // console.log(matchingPlatformGame);

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
          wikipediaUrl: matchingPlatformGame.WikipediaUrl
        }
      }
    });
    
    // console.log(playlist);
    console.log(imagesToCopy);
})();
