import { PlaceStructure, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { NoteStructureFactory } from "./noteStructureFactory";

export class PlaceStructureFactory extends BaseFactory<PlaceStructure> {
  constructor() {
    super([Tag.Place])
  }

  fromGedcomEntry(entry: Entry): PlaceStructure {
    const factoryHelper = new FactoryHelper(entry);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const translationEntries = factoryHelper.getChildrenWithTag(Tag.Translation);
    const externalIdentifierEntries = factoryHelper.getChildrenWithTag(Tag.ExternalIdentifier);

    return {
      [Tag.Place]: {
        value: factoryHelper.getValue([Tag.Place]) || '',
        [Tag.Format]: factoryHelper.getValue([Tag.Place, Tag.Format]),
        [Tag.Language]: factoryHelper.getValue([Tag.Place, Tag.Language]),
        [Tag.Translation]: this.createTranslations(translationEntries),
        [Tag.Map]: factoryHelper.isDefined([Tag.Map]) && {
          [Tag.Latitude]: factoryHelper.getValue([Tag.Place, Tag.Map, Tag.Latitude]) || '0',
          [Tag.Longitude]: factoryHelper.getValue([Tag.Place, Tag.Map, Tag.Longitude]) || '0',
        },
        [Tag.ExternalIdentifier]: this.createExternalIdentifiers(externalIdentifierEntries),
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      }
    }
  }

  createTranslations(translationEntries: Entry[]) {
    return translationEntries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);

      return {
        value: entry.value,
        [Tag.Language]: factoryHelper.getValue([Tag.Language]) || '',
      }
    });
  }

  createExternalIdentifiers(externalIdentifierEntries: Entry[]) {
    return externalIdentifierEntries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);

      return {
        value: entry.value,
        [Tag.Type]: factoryHelper.getValue([Tag.Type]) || '',
      }
    });
  }
}