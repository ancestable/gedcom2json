import { Mime, Note, NoteStructure, PointerTarget, SNote, Tag } from "@ancestable/gedcom7models";
import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { SourceCitationFactory } from './sourceCitationFactory';

export class NoteStructureFactory extends BaseFactory<NoteStructure> {
  constructor() {
    super([Tag.Note, Tag.SharedNoteRecord]);
  }

  fromGedcomEntry(entry: Entry): NoteStructure {
    switch(entry.tag) {
      case Tag.Note: return this.createNoteFromGedcomEntry(entry);
      case Tag.SharedNoteRecord: return this.createSNoteFromGedcomEntry(entry);
      default: throw Error(`${entry} is not a valid NoteStructure`);
    }
  }

  private createNoteFromGedcomEntry(entry: Entry): Note {
    const factoryHelper = new FactoryHelper(entry);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);

    return {
      value: entry.value,
      [Tag.Mime]: factoryHelper.getValue([Tag.Mime]) as Mime,
      [Tag.Language]: factoryHelper.getValue([Tag.Language]),
      [Tag.Translation]: factoryHelper.isDefined([Tag.Language]) && {
        value: factoryHelper.getValue([Tag.Translation]) || '',
        [Tag.Mime]: factoryHelper.getValue([Tag.Translation, Tag.Mime]) as Mime,
        [Tag.Language]: factoryHelper.getValue([Tag.Translation, Tag.Language]),
      },
      sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries)
    }
  }

  private createSNoteFromGedcomEntry(entry: Entry): SNote {
    return {
      pointer: {
        reference: entry.value,
        target: PointerTarget.SNOTE,
      }
    }
  }
}
