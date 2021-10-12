import { CreationDate, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";

export class CreationDateFactory extends BaseFactory<CreationDate>{
  constructor() {
    super([Tag.Submitter]);
  }

  fromGedcomEntry(entry: Entry): CreationDate {
    const factoryHelper = new FactoryHelper(entry);

    return {
      [Tag.CreationDate]: {
        [Tag.Date]: {
          value: factoryHelper.getValue([Tag.Date]) || '',
          [Tag.Time]: factoryHelper.getValue([Tag.Date, Tag.Time]),
        },
      }
    }
  }
}