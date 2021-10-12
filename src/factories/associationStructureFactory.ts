import { AssociationStructure, PointerTarget, Role, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class AssociationStructureFactory extends BaseFactory<AssociationStructure>{
  constructor() {
    super([Tag.Associates]);
  }

  fromGedcomEntry(associationStructureEntry: Entry): AssociationStructure {
    const factoryHelper = new FactoryHelper(associationStructureEntry);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);

    return {
      [Tag.Associates]: {
        reference: {
          reference: associationStructureEntry.value,
          target: PointerTarget.INDI,
        },
        [Tag.Phrase]: factoryHelper.getValue([Tag.Phrase]),
        [Tag.Role]: factoryHelper.isDefined([Tag.Role]) && {
          value: (factoryHelper.getValue([Tag.Role]) || Role.OTHER) as Role,
          [Tag.Phrase]: factoryHelper.getValue([Tag.Role, Tag.Phrase]),
        },
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
        sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      }
    }
  }
}