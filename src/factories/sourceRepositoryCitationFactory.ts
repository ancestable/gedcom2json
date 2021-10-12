import { MultimediaFormat, SourceRepositoryCitation, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { NoteStructureFactory } from "./noteStructureFactory";

export class SourceRepositoryCitationFactory extends BaseFactory<SourceRepositoryCitation>{
  constructor() {
    super([Tag.Repository]);
  }

  fromGedcomEntry(entry: Entry): SourceRepositoryCitation {
    const factoryHelper = new FactoryHelper(entry);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const callNumberEntries = factoryHelper.getChildrenWithTag(Tag.CallNumber);

    return {
      referenceId: entry.value,
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      [Tag.CallNumber]: this.createCallNumbers(callNumberEntries),
    }
  }

  private createCallNumbers(callNumberEntries: Entry[]) {
    return callNumberEntries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);

      return {
        value: entry.value,
        [Tag.Media]: {
          value: factoryHelper.getValue([Tag.Media]) as MultimediaFormat,
          [Tag.Phrase]: factoryHelper.getValue([Tag.Media, Tag.Phrase]) || '',
        }
      }
    });
  }
}