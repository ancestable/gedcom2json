import { FamilyEventDetail, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { EventDetailFactory } from "./eventDetailFactory";

export class FamilyEventDetailFactory extends BaseFactory<FamilyEventDetail>{

  fromGedcomEntry(entry: Entry): FamilyEventDetail {
    const factoryHelper = new FactoryHelper(entry);

    return {
      eventDetail: new EventDetailFactory().fromGedcomEntry(entry),
      [Tag.Husband]: factoryHelper.isDefined([Tag.Husband]) && {
        [Tag.Age]: {
          value: factoryHelper.getValue([Tag.Husband, Tag.Age]) || '',
          [Tag.Phrase]: factoryHelper.getValue([Tag.Husband, Tag.Age, Tag.Phrase]) || '',
        } 
      },
      [Tag.Wife]: factoryHelper.isDefined([Tag.Wife]) && {
        [Tag.Age]: {
          value: factoryHelper.getValue([Tag.Wife, Tag.Age]) || '',
          [Tag.Phrase]: factoryHelper.getValue([Tag.Wife, Tag.Age, Tag.Phrase]) || '',
        } 
      }
    }
  }
}