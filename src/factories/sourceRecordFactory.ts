import { Mime, SourceRecord, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { IdentifierStructureFactory } from "./identifierStructureFactory";
import { MultimediaLinkFactory } from "./multimediaLinkFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { PlaceStructureFactory } from "./placeStructureFactory";
import { SourceRepositoryCitationFactory } from "./sourceRepositoryCitationFactory";

export class SourceFactory extends BaseFactory<SourceRecord>{
  constructor() {
    super([Tag.Source]);
  }

  fromGedcomEntry(sourceEntry: Entry): SourceRecord {
    const factoryHelper = new FactoryHelper(sourceEntry);
    const sourceRepositoryCitationEntries = factoryHelper.getChildrenWithTags([Tag.Repository]);
    const identifierEntries = factoryHelper.getChildrenWithTags(new IdentifierStructureFactory().tags);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const mediaLinkEntries = factoryHelper.getChildrenWithTag(Tag.Object);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);
    const dataEntry = factoryHelper.getEntryWithPath([Tag.Data]);

    return {
      referenceId: sourceEntry.referenceId,
      [Tag.Data]: this.parseData(dataEntry),
      [Tag.Author]: factoryHelper.getValue([Tag.Author]),
      [Tag.Abbreviation]: factoryHelper.getValue([Tag.Abbreviation]),
      [Tag.Publication]: factoryHelper.getValue([Tag.Publication]),
      [Tag.Text]: factoryHelper.isDefined([Tag.Text]) && {
        value: factoryHelper.getValue([Tag.Text]) || '',
        [Tag.Mime]: factoryHelper.getValue([Tag.Text, Tag.Mime]) as Mime,
        [Tag.Language]: factoryHelper.getValue([Tag.Text, Tag.Language]) || '',
      },
      sourceRepositoryCitation: new SourceRepositoryCitationFactory().fromGedcomEntries(sourceRepositoryCitationEntries),
      identifierStructures: new IdentifierStructureFactory().fromGedcomEntries(identifierEntries),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      multiMediaLinks: new MultimediaLinkFactory().fromGedcomEntries(mediaLinkEntries),
      changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
      creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
    }
  }

  parseData(dataEntry?: Entry) {
    if (!dataEntry) {
      return undefined;
    }

    const factoryHelper = new FactoryHelper(dataEntry);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const placeStructureEntry = factoryHelper.getEntryWithPath([Tag.Event, Tag.Place]);

    return {
      [Tag.Event]: factoryHelper.isDefined([Tag.Event]) && {
        value: factoryHelper.getValue([Tag.Event]) || '',
        [Tag.Date]: factoryHelper.isDefined([Tag.Event, Tag.Date]) && {
          value: factoryHelper.getValue([Tag.Event, Tag.Date]) || '',
          [Tag.Phrase]: factoryHelper.getValue([Tag.Event, Tag.Date, Tag.Phrase]),
        },
        placeStructure: placeStructureEntry ? new PlaceStructureFactory().fromGedcomEntry(placeStructureEntry) : undefined,
      },
      [Tag.Agency]: factoryHelper.getValue([Tag.Agency]),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
    }
  }
}