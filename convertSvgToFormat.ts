import fs from 'fs';
import { spawn } from 'child_process';

type Format =
  | 'dxf'
  | 'emf'
  | 'eps'
  | 'fxg'
  | 'gpl'
  | 'hpgl'
  | 'html'
  | 'jpg'
  | 'odg'
  | 'pdf'
  | 'png'
  | 'pov'
  | 'ps'
  | 'sif'
  | 'svgz'
  | 'tar'
  | 'tex'
  | 'tiff'
  | 'webp'
  | 'wmf'
  | 'xaml'
  | 'zip';
  
  
/*
*  Requires:
*   
* > brew install inkscape
*/
async function convertSvgToFormat(svg: string, format: Format): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const id = crypto.randomUUID();
    const input = `in_${id}.svg`;
    const output = `out_${id}.${format}`;
    const command = `inkscape --export-type=${format} ${input} --export-filename=${output}`;
    const clear = () => [input, output].forEach((file) => fs.unlinkSync(file));

    fs.writeFileSync(input, svg);

    spawn(command, { shell: true, stdio: 'inherit' })
      .on('close', (out) => {
        if(out !== 0) reject()
        else resolve(fs.readFileSync(output));
        clear();
      })
      .on('error', (error) => {
        reject(error);
        clear();
      });
  });
}
