import { ChangeDate, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { NoteStructureFactory } from "./noteStructureFactory";

export class ChangeDateFactory extends BaseFactory<ChangeDate>{
  constructor() {
    super([Tag.Submitter]);
  }

  fromGedcomEntry(entry: Entry): ChangeDate {
    const factoryHelper = new FactoryHelper(entry);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);

    return {
      [Tag.Change]: {
        [Tag.Date]: {
          value: factoryHelper.getValue([Tag.Date]) || '',
          [Tag.Time]:  factoryHelper.getValue([Tag.Date, Tag.Time]),
        },
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      }
    }
  }
}