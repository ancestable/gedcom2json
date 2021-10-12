import { Mime, PointerTarget, QualityOfData, Role, SourceCitation, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { MultimediaLinkFactory } from "./multimediaLinkFactory";
import { NoteStructureFactory } from "./noteStructureFactory";

export class SourceCitationFactory extends BaseFactory<SourceCitation> {
  constructor() {
    super([Tag.Source])
  }

  fromGedcomEntry(entry: Entry): SourceCitation {
    const factoryHelper = new FactoryHelper(entry);
    const mediaLinkEntries = factoryHelper.getChildrenWithTag(Tag.Object);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags)

    return {
      [Tag.Source]: {
        reference: {
          reference: entry.value,
          target: PointerTarget.SOUR,
        },
        [Tag.Page]: factoryHelper.getValue([Tag.Page]),
        [Tag.Data]: factoryHelper.isDefined([Tag.Data]) && {
          [Tag.Date]: factoryHelper.isDefined([Tag.Data, Tag.Date]) && {
            value: factoryHelper.getValue([Tag.Data, Tag.Date]) || '',
            [Tag.Time]: factoryHelper.getValue([Tag.Data, Tag.Date, Tag.Time]),
            [Tag.Phrase]: factoryHelper.getValue([Tag.Data, Tag.Date, Tag.Phrase]),
          },
          [Tag.Text]: factoryHelper.isDefined([Tag.Data, Tag.Text]) && {
            value: factoryHelper.getValue([Tag.Data, Tag.Text]) || '',
            [Tag.Mime]: factoryHelper.getValue([Tag.Data, Tag.Text, Tag.Mime]) as Mime,
            [Tag.Language]: factoryHelper.getValue([Tag.Data, Tag.Text, Tag.Language]),
          }
        },
        [Tag.Event]: factoryHelper.isDefined([Tag.Event]) && {
          value: factoryHelper.getValue([Tag.Event]) || '',
          [Tag.Phrase]: factoryHelper.getValue([Tag.Event, Tag.Phrase]),
          [Tag.Role]: factoryHelper.isDefined([Tag.Event, Tag.Role]) &&  {
            value: factoryHelper.getValue([Tag.Event, Tag.Role]) as Role,
            [Tag.Phrase]: factoryHelper.getValue([Tag.Event, Tag.Role, Tag.Phrase]),
          }
        },
        [Tag.QualityOfData]: factoryHelper.getValue([Tag.Event]) as QualityOfData || undefined,
        multimediaLinks: new MultimediaLinkFactory().fromGedcomEntries(mediaLinkEntries),
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      },
    }
  }
}