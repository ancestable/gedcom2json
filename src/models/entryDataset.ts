import { Tag } from '@ancestable/gedcom7models';
import { Entry } from "./entry";

export interface EntryDataset {
  [Tag.Header]: Entry;
  [Tag.Family]: Entry[];
  [Tag.Individual]: Entry[];
  [Tag.Media]: Entry[];
  [Tag.Repository]: Entry[];
  [Tag.Note]: Entry[];
  [Tag.Source]: Entry[];
  [Tag.Submitter]: Entry[];
}