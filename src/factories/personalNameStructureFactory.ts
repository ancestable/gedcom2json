import { NameType, PersonalNamePieces, PersonalNameStructure, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class PersonalNameStructureFactory extends BaseFactory<PersonalNameStructure> {
  tagsForPersonalNamePieces = [
    Tag.NamePrefix,
    Tag.GivenName,
    Tag.Nickname,
    Tag.SurnamePrefix,
    Tag.Surname,
    Tag.NameSuffix,
  ];

  constructor() {
    super([Tag.Name]);
  }

  fromGedcomEntry(entry: Entry): PersonalNameStructure {
    const factoryHelper = new FactoryHelper(entry);
    const personalNamePieces = factoryHelper.getChildrenWithTags(this.tagsForPersonalNamePieces);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const translationEntries = factoryHelper.getChildrenWithTags([Tag.Translation]);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);

    return {
      [Tag.Name]: {
        value: entry.value,
        [Tag.Type]: factoryHelper.isDefined([Tag.Type]) && {
          value: (factoryHelper.getValue([Tag.Type]) || NameType.OTHER) as NameType,
          [Tag.Phrase]: factoryHelper.getValue([Tag.Phrase]),
        },
        personalNamePieces: this.createPersonalNamePieces(personalNamePieces),
        [Tag.Translation]: this.createTranslations(translationEntries),
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
        sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      }
    }
  }

  private createPersonalNamePieces(entries: Entry[]): PersonalNamePieces {
    const findEntryTag = (tag: Tag) => entries.filter(entry => entry.tag === tag).map(entry => entry.value);

    return {
      [Tag.NamePrefix]: findEntryTag(Tag.NamePrefix),
      [Tag.GivenName]: findEntryTag(Tag.GivenName),
      [Tag.Nickname]: findEntryTag(Tag.Nickname),
      [Tag.SurnamePrefix]: findEntryTag(Tag.SurnamePrefix),
      [Tag.Surname]: findEntryTag(Tag.Surname),
      [Tag.NameSuffix]: findEntryTag(Tag.NameSuffix),
    }
  }

  private createTranslations(translationEntries: Entry[]) {
    return translationEntries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);
      const personalNamePieces = factoryHelper.getChildrenWithTags(this.tagsForPersonalNamePieces);

      return {
        value: entry.value,
        [Tag.Language]: factoryHelper.getValue([Tag.Language]) || '',
        personalNamePieces: this.createPersonalNamePieces(personalNamePieces),
      }
    });
  }
}