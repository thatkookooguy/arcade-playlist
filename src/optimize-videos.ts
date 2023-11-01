import { join } from 'path';

import ffmpeg from 'fluent-ffmpeg';
import { ensureDirSync, readdirSync } from 'fs-extra';

(async () => {
  /**
   * go over all videos in src/assets and do the following optimizations:
   * 1. convert to webm
   * 2. set max length to 2 minutes (trim video)
   * 3. add fade-in and fade-out effects to video and audio (1.5 seconds each)
   * 4. save to src/assets/optimized-videos
   */

  const videosDir = join(__dirname, '../src/assets/videos');
  const optimizedVideosDir = join(__dirname, '../src/assets/optimized-videos');

  ensureDirSync(optimizedVideosDir);

  const files = readdirSync(videosDir);
  await Promise.all(
    files.map(async (file) => {
      const inputPath = join(videosDir, file);
      const outputPath = join(optimizedVideosDir, file.replace('.mp4', '.webm'));

      return await processVideo(inputPath, outputPath, 120);
    })
  );

  console.log('Done!');
})();

function processVideo(
  inputPath: string,
  outputPath: string,
  maxLength: number
) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .setDuration(maxLength)
      .videoFilters([
        // Add fade-in effect to video for the first 1.5 seconds
        {
          filter: 'fade',
          options: 't=in:st=0:d=1.5'
        },
        // Add fade-out effect to video for the last 1.5 seconds
        {
          filter: 'fade',
          options: `t=out:st=${ maxLength - 1.5 }:d=1.5`
        }
      ])
      .audioFilters([
        // Add fade-in effect to audio for the first 1.5 seconds
        {
          filter: 'afade',
          options: 't=in:st=0:d=1.5'
        },
        // Add fade-out effect to audio for the last 1.5 seconds
        {
          filter: 'afade',
          options: `t=out:st=${ maxLength - 1.5 }:d=1.5`
        }
      ])
      .on('end', resolve)
      .on('error', reject)
      .save(outputPath);
  });
}
