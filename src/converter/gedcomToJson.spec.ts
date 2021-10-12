import { gedcomToJson } from './gedcomToJson';
import { GedcomFileHelper } from '../test/helper/gedcomFileHelper';

describe('gedcomToJson', () =>  {
  it('should convert', async () => {
    const buffer = await GedcomFileHelper.simpleFile();
    const gedcomJson = gedcomToJson(buffer);
    expect(gedcomJson).toBeDefined();
  });
});