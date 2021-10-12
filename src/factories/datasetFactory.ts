import { Dataset, Tag } from "@ancestable/gedcom7models";

import { EntryDataset } from "../models/entryDataset";
import { FamilyRecordFactory } from "./familyRecordFactory";
import { HeaderFactory } from "./headerFactory";
import { IndividualRecordFactory } from "./individualRecordFactory";
import { MultimediaRecordFactory } from "./multimediaRecordFactory";
import { RepositoryRecordFactory } from "./repositoryRecordFactory";
import { SharedNoteRecordFactory } from "./sharedNoteRecordFactory";
import { SourceFactory } from "./sourceRecordFactory";
import { SubmitterFactory } from "./submitterFactory";

export class DataSetFactory {
  fromGedcomEntry(entryDataset: EntryDataset): Dataset {
    return {
      [Tag.Header]: new HeaderFactory().fromGedcomEntry(entryDataset.HEAD),
      [Tag.Family]: new FamilyRecordFactory().fromGedcomEntries(entryDataset.FAM),
      [Tag.Individual]: new IndividualRecordFactory().fromGedcomEntries(entryDataset.INDI),
      [Tag.Media]: new MultimediaRecordFactory().fromGedcomEntries(entryDataset.MEDI),
      [Tag.Repository]: new RepositoryRecordFactory().fromGedcomEntries(entryDataset.REPO),
      [Tag.Note]: new SharedNoteRecordFactory().fromGedcomEntries(entryDataset.NOTE),
      [Tag.Source]: new SourceFactory().fromGedcomEntries(entryDataset.SOUR),
      [Tag.Submitter]: new SubmitterFactory().fromGedcomEntries(entryDataset.SUBM),
    }
  }
}