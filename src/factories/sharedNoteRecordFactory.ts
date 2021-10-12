import { Mime, SharedNoteRecord, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { IdentifierStructureFactory } from "./identifierStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class SharedNoteRecordFactory extends BaseFactory<SharedNoteRecord>{
  constructor() {
    super([Tag.SharedNoteRecord]);
  }

  fromGedcomEntry(sharedNoteRecordEntry: Entry): SharedNoteRecord {
    const factoryHelper = new FactoryHelper(sharedNoteRecordEntry);
    const translationEntries = factoryHelper.getChildrenWithTag(Tag.Translation);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);
    const identifierEntries = factoryHelper.getChildrenWithTags(new IdentifierStructureFactory().tags);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);

    return {
      referenceId: sharedNoteRecordEntry.referenceId,
      value: sharedNoteRecordEntry.value,
      [Tag.Mime]: factoryHelper.getValue([Tag.Page]) as Mime,
      [Tag.Language]: factoryHelper.getValue([Tag.Language]),
      [Tag.Translation]: this.createTranslations(translationEntries),
      sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      identifierStructures: new IdentifierStructureFactory().fromGedcomEntries(identifierEntries),
      changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
      creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
    }
  }

  createTranslations(translationEntries: Entry[]) {
    return translationEntries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);

      return {
        value: entry.value,
        [Tag.Mime]: factoryHelper.getValue([Tag.Mime]) as Mime,
        [Tag.Language]: factoryHelper.getValue([Tag.Language]) || '',
      }
    });
  }
}