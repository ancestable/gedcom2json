import { IndividualEventDetail, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { EventDetailFactory } from "./eventDetailFactory";

export class IndividualEventDetailFactory extends BaseFactory<IndividualEventDetail>{

  fromGedcomEntry(entry: Entry): IndividualEventDetail {
    const factoryHelper = new FactoryHelper(entry);

    return {
      eventDetail: new EventDetailFactory().fromGedcomEntry(entry),
      [Tag.Age]: {
        value: factoryHelper.getValue([Tag.Age]) || '',
        [Tag.Phrase]: factoryHelper.getValue([Tag.Age, Tag.Phrase]) || '',
      }
    }
  }
}