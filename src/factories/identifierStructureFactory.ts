import { IdentifierStructure, IdentifierStructureEXID, IdentifierStructureREFN, IdentifierStructureUID, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";

export class IdentifierStructureFactory extends BaseFactory<IdentifierStructure>{
  constructor() {
    super([Tag.Reference, Tag.UniqueIdentifier, Tag.ExternalIdentifier]);
  }

  fromGedcomEntry(entry: Entry): IdentifierStructure {
    switch(entry.tag) {
      case Tag.Reference: return this.createReferenceFromGedcomEntry(entry);
      case Tag.UniqueIdentifier: return this.createUniqueIdentifierFromGedcomEntry(entry);
      case Tag.ExternalIdentifier: return this.createExternalIdentifierFromGedcomEntry(entry);
      default: return { type: Tag.UniqueIdentifier, value: '' };
    }
  }

  private createReferenceFromGedcomEntry(entry: Entry): IdentifierStructureREFN {
    const factoryHelper = new FactoryHelper(entry);

    return {
      type: Tag.Reference,
      value: entry.value,
      [Tag.Type]: factoryHelper.getValue([Tag.Type]),
    }
  }

  private createUniqueIdentifierFromGedcomEntry(entry: Entry): IdentifierStructureUID {
    return {
      type: Tag.UniqueIdentifier,
      value: entry.value,
    }
  }

  private createExternalIdentifierFromGedcomEntry(entry: Entry): IdentifierStructureEXID {
    const factoryHelper = new FactoryHelper(entry);

    return {
      type: Tag.ExternalIdentifier,
      value: entry.value,
      [Tag.Type]: factoryHelper.getValue([Tag.Type]),
    }
  }
}