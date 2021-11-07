import { gedcomToJson } from './gedcomToJson';
import { GedcomFileHelper } from '../test/helper/gedcomFileHelper';
import { Mime, PointerTarget, QualityOfData, SubmitterRecord, Tag } from '@ancestable/gedcom7models';

describe('gedcomToJson', () =>  {
  
  describe('Submitter', () => {
    const expectedSubmitterFromStressTestFile: SubmitterRecord = {
      referenceId: '@SUBM1@',
      [Tag.Name]: 'Christian Buehlmeyer',
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
      multimediaLinks: [
        {
          [Tag.Object]: {
            [Tag.Crop]: {
              [Tag.Top]: '0',
              [Tag.Left]: '0',
              [Tag.Height]: '100',
              [Tag.Width]: '100',
            },
            [Tag.Title]: 'TestObject',
            reference: {
              reference: '@OBJE1@',
              target: PointerTarget.OBJE,
            }
          }
        }
      ],
      [Tag.Language]: [
        'German',
      ],
      identifierStructures: [
        {
          [Tag.Type]: 'TestId',
          'type': Tag.Reference,
          'value': '1234-test-56789',
        },
        {
          [Tag.Type]: 'ExtendedTestId',
          'type': Tag.Reference,
          'value': '1234-test-56789-test',
        },
        {
          'type': Tag.UniqueIdentifier,
          'value': '65fb385d-fa70-4d22-bc53-13781c799c36',
        },
        {
          'type': Tag.UniqueIdentifier,
          'value': '6b78dbc0-19f0-443b-b796-b0360e350dc5',
        },
        {
          [Tag.Type]: 'extIdProvider',
          'type': Tag.ExternalIdentifier,
          'value': 'textExId',
        },
        {
          [Tag.Type]: 'extIdProvider2',
          'type': Tag.ExternalIdentifier,
          'value': 'textExId2',
        },
      ],
      changeDate: {
        [Tag.Change]: {
          [Tag.Date]: {
            value: '01 Oct 2021',
            [Tag.Time]: '0:00:00',
          },
          noteStructures: [
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
        }
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
      ],
      creationDate: {
        [Tag.CreationDate]: {
          [Tag.Date]: {
            value: '02 Oct 2021',
            [Tag.Time]: '0:00:01',
          }
        }
      },
    };

    it('should convert the Submitter correctly', async () => {
      const buffer = await GedcomFileHelper.stressTestSubmitterFile();
      const gedcomJson = gedcomToJson(buffer);
      expect(gedcomJson).toBeDefined();
      expect(gedcomJson.SUBM[0]).toStrictEqual(expectedSubmitterFromStressTestFile)
    });
  });
});