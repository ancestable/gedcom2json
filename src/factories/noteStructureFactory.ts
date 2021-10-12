import { Mime, Note, NoteStructure, PointerTarget, SNote, Tag } from "@ancestable/gedcom7models";
import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";

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

    return {
      value: entry.value,
      [Tag.Media]: factoryHelper.getValue([Tag.Media]) as Mime,
      [Tag.Language]: factoryHelper.getValue([Tag.Language]),
      [Tag.Translation]: factoryHelper.isDefined([Tag.Language]) && {
        value: factoryHelper.getValue([Tag.Translation]) || '',
        [Tag.Media]: factoryHelper.getValue([Tag.Translation, Tag.Media]) as Mime,
        [Tag.Language]: factoryHelper.getValue([Tag.Translation, Tag.Language]),
      },
      sourceCitations: [],
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
