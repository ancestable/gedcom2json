import { parseGedcom } from './parseGedcom';
import { GedcomTestFileBuilder } from '../test/helper/gedcomTestFileBuilder';

describe('parseGedcom', () =>  {
  it('should create a record for each line with level 0', async () => {
    const referenceIds = ['@ID1', '@ID2', '@ID3'];
    const tag = 'INDI';
    const buffer = referenceIds
      .reduce((builder, referenceId) => builder.addRecord(referenceId, tag), new GedcomTestFileBuilder())
      .toBuffer();

    const result = parseGedcom(buffer);

    expect(result).toHaveLength(referenceIds.length);
    result.forEach(({ children, referenceId, tag, value }, index) => {
      expect(children).toEqual([]);
      expect(referenceId).toBe(referenceIds[index]);
      expect(tag).toBe(tag);
      expect(value).toBe('');
    });
  });

  it('should create a nested record with the level representing the nesting depth', async () => {
    const builder = new GedcomTestFileBuilder();
    const buffer = builder
      .addRecord('@ID1@', 'INDI')
      .addEntry(1, 'TAG1', 'value1')
      .addEntry(2, 'TAG11', 'value11')
      .addEntry(2, 'TAG12', 'value12')
      .addEntry(1, 'TAG2', 'value2')
      .addEntry(2, 'TAG21', 'value21')
      .addEntry(3, 'TAG211', 'value211')
      .toBuffer();

    const result = parseGedcom(buffer);

    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        'children': [
          {
            'children': [
              {
                'children': [],
                'referenceId': '',
                'tag': 'TAG11',
                'value': 'value11'
              },
              {
                'children': [],
                'referenceId': '',
                'tag': 'TAG12',
                'value': 'value12'
              }
            ],
            'referenceId': '',
            'tag': 'TAG1',
            'value': 'value1'
          },
          {
            'children': [
              {
                'children': [
                  {
                    'children': [],
                    'referenceId': '',
                    'tag': 'TAG211',
                    'value': 'value211'
                  }
                ],
                'referenceId': '',
                'tag': 'TAG21',
                'value': 'value21'
              }
            ],
            'referenceId': '',
            'tag': 'TAG2',
            'value': 'value2'
          }
        ],
        'referenceId': '@ID1@',
        'tag': 'INDI',
        'value': ''
      }
    ]);
  });

  it('should create a record with value containing new line when CONT tag is used', async () => {
    const builder = new GedcomTestFileBuilder();
    const buffer = builder
      .addRecord('@ID1@', 'INDI')
      .addEntry(1, 'TAG1', 'line1')
      .addEntry(2, 'CONT', 'line2')
      .addEntry(2, 'CONT', 'line3')
      .toBuffer();

    const result = parseGedcom(buffer);

    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        'children': [  
          {
            'children': [],
            'referenceId': '',
            'tag': 'TAG1',
            'value': 'line1\nline2\nline3',
          }
        ],
        'referenceId': '@ID1@',
        'tag': 'INDI',
        'value': ''
      }
    ]);
  });

  it('should create a record with value concatinated when CONC tag is used', async () => {
    const builder = new GedcomTestFileBuilder();
    const buffer = builder
      .addRecord('@ID1@', 'INDI')
      .addEntry(1, 'TAG1', 'line1')
      .addEntry(2, 'CONC', 'line2')
      .addEntry(2, 'CONC', 'line3')
      .toBuffer();

    const result = parseGedcom(buffer);

    expect(result).toHaveLength(1);
    expect(result).toEqual([
      {
        'children': [  
          {
            'children': [],
            'referenceId': '',
            'tag': 'TAG1',
            'value': 'line1 line2 line3',
          }
        ],
        'referenceId': '@ID1@',
        'tag': 'INDI',
        'value': ''
      }
    ]);
  });
});