import { EventDetail, Restriction, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { AddressStructureFactory } from "./addressStructureFactory";
import { AssociationStructureFactory } from "./associationStructureFactory";
import { BaseFactory } from "./baseFactory";
import { MultimediaLinkFactory } from "./multimediaLinkFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { PlaceStructureFactory } from "./placeStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class EventDetailFactory extends BaseFactory<EventDetail>{

  fromGedcomEntry(entry: Entry): EventDetail {
    const factoryHelper = new FactoryHelper(entry);

    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const mediaLinkEntries = factoryHelper.getChildrenWithTag(Tag.Object);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);
    const associationEntries = factoryHelper.getChildrenWithTag(Tag.Associates);
    const placeStructureEntry = factoryHelper.getEntryWithPath([Tag.Place]);
    const addressEntry = factoryHelper.getEntryWithPath([Tag.Address]);

    return {
      [Tag.Date]: factoryHelper.isDefined([Tag.Date]) && {
        value: factoryHelper.getValue([Tag.Date]) || '',
        [Tag.Phrase]: factoryHelper.getValue([Tag.Date, Tag.Phrase]) || '',
      },
      placeStructure: placeStructureEntry ? new PlaceStructureFactory().fromGedcomEntry(placeStructureEntry) : undefined,
      addressStructure: addressEntry ? new AddressStructureFactory().fromGedcomEntry(addressEntry) : undefined,
      [Tag.Phone]: factoryHelper.getValueArray([Tag.Phone]),
      [Tag.Email]: factoryHelper.getValueArray([Tag.Email]),
      [Tag.Fax]: factoryHelper.getValueArray([Tag.Fax]),
      [Tag.Web]: factoryHelper.getValueArray([Tag.Web]),
      [Tag.Agency]: factoryHelper.getValue([Tag.Agency]),
      [Tag.Religion]: factoryHelper.getValue([Tag.Religion]),
      [Tag.Cause]: factoryHelper.getValue([Tag.Cause]),
      [Tag.Restriction]: (factoryHelper.getValueArray([Tag.Restriction]) || []) as Restriction[],
      [Tag.SortDate]: factoryHelper.isDefined([Tag.SortDate]) && {
        value: factoryHelper.getValue([Tag.SortDate]) || '',
        [Tag.Time]: factoryHelper.getValue([Tag.SortDate, Tag.Time]),
        [Tag.Phrase]: factoryHelper.getValue([Tag.SortDate, Tag.Phrase]),
      },
      associationStructures: new AssociationStructureFactory().fromGedcomEntries(associationEntries),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      multimediaLinks: new MultimediaLinkFactory().fromGedcomEntries(mediaLinkEntries),
    }
  }
}