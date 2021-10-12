import { AddressStructure, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";

export class AddressStructureFactory extends BaseFactory<AddressStructure> {
  fromGedcomEntry(entry: Entry): AddressStructure {
    const factoryHelper = new FactoryHelper(entry);
    return {
      [Tag.Address]: {
        [Tag.Address1]: factoryHelper.getValue([Tag.Address1]),
        [Tag.Address2]: factoryHelper.getValue([Tag.Address2]),
        [Tag.Address3]: factoryHelper.getValue([Tag.Address3]),
        [Tag.City]: factoryHelper.getValue([Tag.City]),
        [Tag.State]: factoryHelper.getValue([Tag.State]),
        [Tag.PostalCode]: factoryHelper.getValue([Tag.PostalCode]),
        [Tag.Country]: factoryHelper.getValue([Tag.Country]),
      }
    }
  }
}