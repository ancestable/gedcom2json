import { gedcomToJson } from './gedcomToJson';
import { GedcomFileHelper } from '../test/helper/gedcomFileHelper';
import { Header, Mime, PointerTarget, QualityOfData, Tag } from '@ancestable/gedcom7models';

describe('gedcomToJson', () =>  {
  
  describe('Header', () => {
    const expectedHeaderFromStressTestFile: Header = {
      [Tag.Gedcom]: {
        [Tag.Version]: '7.0.0',
      },
      [Tag.ExtensionSchema]: {
        [Tag.Tag]: [],
      },
      [Tag.Source]: {
        [Tag.Version]: '0.0.0',
        [Tag.Name]: 'Ancestable',
        [Tag.Corporate]: {
          value: 'Test Inc.',
          addressStructure: {
            [Tag.Address]: {
              [Tag.Address1]: 'Test Street 1',
              [Tag.Address2]: 'Building A',
              [Tag.Address3]: 'Floor 42',
              [Tag.City]: 'Nearby City',
              [Tag.State]: 'Nearby State',
              [Tag.PostalCode]: '123456',
              [Tag.Country]: 'Another Country',
            },
          },
          [Tag.Phone]: ['555 123456789', '555 0123456789'],
          [Tag.Email]: ['john@nonvalid.nonvalid', 'john2@nonvalid.nonvalid'],
          [Tag.Fax]: ['555 987654321', '555 9876543210'],
          [Tag.Web]: ['www.christian-buehlmeyer.com', 'www.christian-buehlmeyer.com'],
        },
        [Tag.Data]: {
          value: 'Sample data source',
          [Tag.Date]: {
            value: '1 Oct 2021',
            [Tag.Time]: '0:00:00',
          },
          [Tag.Corporate]: 'NoCorp',
        }
      },
      [Tag.Destination]: 'Ancestable',
      [Tag.Date]: {
        value: '2 Oct 2021',
        [Tag.Time]: '0:00:00',
      },
      [Tag.Submitter]: '@SOUR1@',
      [Tag.Corporate]: 'AnotherTest Inc.',
      [Tag.Language]: 'English',
      [Tag.Place]: {
        [Tag.Format]: 'xml',
      },
      noteStructures: [
        {
          pointer: {
            reference: '@SNOTE1@',
            target: PointerTarget.SNOTE,
          }
        },
        {
          value: 'Just some test\ntext for a note',
          [Tag.Mime]: Mime.TextPlain,
          [Tag.Language]: 'English',
          [Tag.Translation]: {
            value: 'Ein anderer Testtext\nfuer die Notiz',
            [Tag.Mime]: Mime.TextPlain,
            [Tag.Language]: 'German',
          },
          sourceCitations: [
            {
              [Tag.Source]: {
                reference: {
                  reference: '@SOUR1@',
                  target: PointerTarget.SOUR,
                },
                [Tag.Page]: '1',
                [Tag.Data]: {
                  [Tag.Date]: {
                    value: '3 Oct 2021',
                    [Tag.Time]: '0:00:01',
                    [Tag.Phrase]: 'Header phrase text',
                  },
                  [Tag.Text]: [
                    {
                      value: 'Just some header source text',
                      [Tag.Mime]: Mime.TextPlain,
                      [Tag.Language]: 'English',
                    },
                    {
                      value: 'Nur ein header source Text',
                      [Tag.Mime]: Mime.TextPlain,
                      [Tag.Language]: 'German',
                    },
                  ],
                },
                [Tag.Event]: undefined,
                [Tag.QualityOfData]: QualityOfData.DIRECT_EVIDENCE,
                multimediaLinks: [],
                noteStructures: [],
              }
            },
          ]
        }
      ]
    };

    it('should convert the Header correctly', async () => {
      const buffer = await GedcomFileHelper.stressTestHeaderFile();
      const gedcomJson = gedcomToJson(buffer);
      expect(gedcomJson).toBeDefined();
      expect(gedcomJson.HEAD).toStrictEqual(expectedHeaderFromStressTestFile)
    });
  });
});