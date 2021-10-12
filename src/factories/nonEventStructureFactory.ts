import { NonEventStructure, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class NonEventStructureFactory extends BaseFactory<NonEventStructure>{
  constructor() {
    super([Tag.NonEvent]);
  }

  fromGedcomEntry(nonEventStructureEntry: Entry): NonEventStructure {
    const factoryHelper = new FactoryHelper(nonEventStructureEntry);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);

    return {
      [Tag.NonEvent]: {
        [Tag.Date]: factoryHelper.isDefined([Tag.Date]) && {
          value: factoryHelper.getValue([Tag.Date]) || '',
          [Tag.Phrase]: factoryHelper.getValue([Tag.Date, Tag.Phrase]),
        },
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
        sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      }
    }
  }
}