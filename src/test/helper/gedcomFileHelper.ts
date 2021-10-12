import * as fs from 'fs';

export class GedcomFileHelper {
  static simpleFile(): Promise<ArrayBuffer> {
    return this.loadTestDataFile('TGC55C.ged');
  }

  private static loadTestDataFile(fileName: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      fs.readFile(`${__dirname}/../data/${fileName}`, null, (err, data) => {
        if(err) {
          reject(err);
        }
        resolve(data.buffer);
      });
    });
  }
}