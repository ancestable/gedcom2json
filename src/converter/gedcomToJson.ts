import { DataSetFactory } from "../factories/datasetFactory";
import { Tag } from '@ancestable/gedcom7models';
import { Entry } from "../models/entry";
import { EntryDataset } from "../models/entryDataset";
import { parseGedcom } from "./parseGedcom";

export function gedcomToJson(gedcomBuffer: ArrayBuffer) {
  const tree = parseGedcom(gedcomBuffer);
  const entryDataset = entriesToEntryDataset(tree);
  const dataset = new DataSetFactory().fromGedcomEntry(entryDataset);
  return dataset;
}

function entriesToEntryDataset(entries: Entry[]): EntryDataset {
  let headerEntries: Entry = { tag: Tag.Header, children: [], value: '', referenceId: '' };
  const familyEntries: Entry[] = [];
  const individualEntries: Entry[] = [];
  const mediaEntries: Entry[] = [];
  const repositoryEntries: Entry[] = [];
  const noteEntries: Entry[] = [];
  const sourceEntries: Entry[] = [];
  const submitterEntries: Entry[] = [];

  entries.forEach((entry) => {
    switch(entry.tag) {
      case Tag.Header: headerEntries = entry; break;
      case Tag.Family: familyEntries.push(entry); break;
      case Tag.Individual: individualEntries.push(entry); break;
      case Tag.Media: mediaEntries.push(entry); break;
      case Tag.Repository: repositoryEntries.push(entry); break;
      case Tag.Note: noteEntries.push(entry); break;
      case Tag.Source: sourceEntries.push(entry); break;
      case Tag.Submitter: submitterEntries.push(entry); break;
    }
  });

  return {
    [Tag.Header]: headerEntries,
    [Tag.Family]: familyEntries,
    [Tag.Individual]: individualEntries,
    [Tag.Media]: mediaEntries,
    [Tag.Repository]: repositoryEntries,
    [Tag.Note]: noteEntries,
    [Tag.Source]: sourceEntries,
    [Tag.Submitter]: submitterEntries,
  };
}