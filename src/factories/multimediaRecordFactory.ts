import { Medi, MultimediaFormat, MultimediaRecord, Restriction, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { IdentifierStructureFactory } from "./identifierStructureFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class MultimediaRecordFactory extends BaseFactory<MultimediaRecord>{
  constructor() {
    super([Tag.Object]);
  }

  fromGedcomEntry(multimediaRecordEntry: Entry): MultimediaRecord {
    const factoryHelper = new FactoryHelper(multimediaRecordEntry);
    const identifierEntries = factoryHelper.getChildrenWithTags(new IdentifierStructureFactory().tags);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);
    const fileEntries = factoryHelper.getChildrenWithTag(Tag.File);

    return {
      referenceId: multimediaRecordEntry.referenceId,
      [Tag.Restriction]: (factoryHelper.getValueArray([Tag.Restriction]) || []) as Restriction[],
      [Tag.File]: this.createFiles(fileEntries),
      identifierStructures: new IdentifierStructureFactory().fromGedcomEntries(identifierEntries),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
      creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
    }
  }

  private createTranslations(translationEntries: Entry[]) {
    return translationEntries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);

      return {
        value: entry.value,
        [Tag.Format]: (factoryHelper.getValue([Tag.Format]) || MultimediaFormat.Jpeg) as MultimediaFormat,
      }
    });
  }

  private createFiles(fileEntries: Entry[]) {
    return fileEntries.map(fileEntry => {

      const factoryHelper = new FactoryHelper(fileEntry);
      const translationEntries = factoryHelper.getChildrenWithTag(Tag.Translation);


      return {
        value: fileEntry.value,
        [Tag.Format]: factoryHelper.isDefined([Tag.Format]) && {
          value: (factoryHelper.getValue([Tag.Format]) || MultimediaFormat.Jpeg) as MultimediaFormat,
          [Tag.Media]: {
            value: (factoryHelper.getValue([Tag.Format, Tag.Media]) || Medi.Other) as Medi,
            [Tag.Phrase]: factoryHelper.getValue([Tag.Format, Tag.Media, Tag.Phrase]),
          },
        },
        [Tag.Title]: factoryHelper.getValue([Tag.Title]),
        [Tag.Translation]: this.createTranslations(translationEntries),
      }
    });
  }
}