import { SubmitterRecord, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { AddressStructureFactory } from "./addressStructureFactory";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { IdentifierStructureFactory } from "./identifierStructureFactory";
import { MultimediaLinkFactory } from "./multimediaLinkFactory";
import { NoteStructureFactory } from "./noteStructureFactory";

export class SubmitterFactory extends BaseFactory<SubmitterRecord>{
  constructor() {
    super([Tag.Submitter]);
  }

  fromGedcomEntry(submitterEntry: Entry): SubmitterRecord {
    const factoryHelper = new FactoryHelper(submitterEntry);
    const addressEntry = factoryHelper.getEntryWithPath([Tag.Address]);
    const mediaLinkEntries = factoryHelper.getChildrenWithTag(Tag.Object);
    const identifierEntries = factoryHelper.getChildrenWithTags(new IdentifierStructureFactory().tags);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);
    const test = new NoteStructureFactory().fromGedcomEntries(noteEntries);

    return {
      referenceId: submitterEntry.referenceId,
      [Tag.Name]: factoryHelper.getValue([Tag.Name]) || '',
      addressStructure: addressEntry ? new AddressStructureFactory().fromGedcomEntry(addressEntry) : undefined,
      [Tag.Phone]: factoryHelper.getValueArray([Tag.Phone]),
      [Tag.Email]: factoryHelper.getValueArray([Tag.Email]),
      [Tag.Fax]: factoryHelper.getValueArray([Tag.Fax]),
      [Tag.Web]: factoryHelper.getValueArray([Tag.Web]),
      multimediaLinks: new MultimediaLinkFactory().fromGedcomEntries(mediaLinkEntries),
      [Tag.Language]: factoryHelper.getValueArray([Tag.Language]),
      identifierStructures: new IdentifierStructureFactory().fromGedcomEntries(identifierEntries),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
      creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
    }
  }
}