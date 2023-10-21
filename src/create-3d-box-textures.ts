import { spawn } from 'child_process';
import { join } from 'path';

import { readJSONSync, writeJsonSync } from 'fs-extra';

const assetsFolder = join(__dirname, '..', 'lb-playlist-ui', 'src', 'assets');

(() => {
  const games3dBoxes: Record<string, string> = {};
  const playlist = readJSONSync(join(assetsFolder, 'playlist-data.json'));
  const numberOfTotalGames = playlist.games.length;
  let numberOfDoneGames = 0;
  let numberOfFailedGames = 0;
  let numberOfSkippedGames = 0;

  playlist.games.forEach((gameDetails: any) => {
    if (!gameDetails.back) {
      numberOfDoneGames++;
      numberOfSkippedGames++;
      return;
    }

    const child = spawn(
      process.execPath,
      [ join(__dirname, 'single-3d-box-process.js'), JSON.stringify(gameDetails) ]
    );

    child.stdout.on('data', (data) => {
      const dataAsString = data.toString();
      const isDoneMessage = dataAsString.startsWith('[DONE]');
      if (isDoneMessage) {
        const messageJsonPart = dataAsString
          .replace('[DONE]', '')
          .trim();
        const parsedMessage = JSON.parse(messageJsonPart);
        // console.log('parsedMessage', parsedMessage);
        games3dBoxes[parsedMessage.title] = parsedMessage.box3D;
        return;
      }
      // console.log(`stdout: ${ data }`);
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${ data }`);
      numberOfFailedGames++;
    });

    child.on('exit', (code) => {
      numberOfDoneGames++;
      console.log(`child process exited with code ${ code }`);

      if (numberOfDoneGames === numberOfTotalGames) {
        console.log('games3dBoxes', games3dBoxes);
        console.log('numberOfDoneGames', numberOfDoneGames);
        console.log('numberOfFailedGames', numberOfFailedGames);
        console.log('numberOfSkippedGames', numberOfSkippedGames);

        playlist.games.forEach((gameDetails: any) => {
          if (games3dBoxes[gameDetails.title]) {
            gameDetails.box3D = encodeURIComponent(games3dBoxes[gameDetails.title]);
            // gameDetails.boxColor = games3dBoxes[gameDetails.title].boxColor;
          }
        });

        writeJsonSync(join(assetsFolder, 'playlist-data.json'), playlist, { spaces: 2 });
      }
    });
  });
})();
