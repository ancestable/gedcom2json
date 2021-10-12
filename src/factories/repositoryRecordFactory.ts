import { RepositoryRecord, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { AddressStructureFactory } from "./addressStructureFactory";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { IdentifierStructureFactory } from "./identifierStructureFactory";
import { NoteStructureFactory } from "./noteStructureFactory";

export class RepositoryRecordFactory extends BaseFactory<RepositoryRecord>{
  constructor() {
    super([Tag.Repository]);
  }

  fromGedcomEntry(repositoryEntry: Entry): RepositoryRecord {
    const factoryHelper = new FactoryHelper(repositoryEntry);
    const addressEntry = factoryHelper.getEntryWithPath([Tag.Address]);
    const identifierEntries = factoryHelper.getChildrenWithTags(new IdentifierStructureFactory().tags);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);

    return {
      referenceId: repositoryEntry.referenceId,
      [Tag.Name]: factoryHelper.getValue([Tag.Name]) || '',
      addressStructure: addressEntry ? new AddressStructureFactory().fromGedcomEntry(addressEntry) : undefined,
      [Tag.Phone]: factoryHelper.getValueArray([Tag.Phone]),
      [Tag.Email]: factoryHelper.getValueArray([Tag.Email]),
      [Tag.Fax]: factoryHelper.getValueArray([Tag.Fax]),
      [Tag.Web]: factoryHelper.getValueArray([Tag.Web]),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      identifierStructures: new IdentifierStructureFactory().fromGedcomEntries(identifierEntries),
      changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
      creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
    }
  }
}