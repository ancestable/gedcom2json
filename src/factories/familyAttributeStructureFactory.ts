import { FamilyAttributeStructureFACT, FamilyAttributeStructureNCHI, FamilyAttributeStructureRESI, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { FamilyEventDetailFactory } from "./familyEventDetailFactory";

export class FamilyAttributeStructureFactory {

  private static familyAttributeStructure<T>(tag: Tag, entry: Entry) {
    const factoryHelper = new FactoryHelper(entry);

    return {
      type: tag,
      value: entry.value,
      [Tag.Type]: factoryHelper.getValue([Tag.Type]),
      familyEventDetail: new FamilyEventDetailFactory().fromGedcomEntry(entry),
    } as unknown as T;
  }
  
  static familyAttributeStructureNCHI(entry: Entry): FamilyAttributeStructureNCHI {
    return this.familyAttributeStructure<FamilyAttributeStructureNCHI>(Tag.ChildrenCount, entry);
  }

  static familyAttributeStructureRESI(entry: Entry): FamilyAttributeStructureRESI {
    return this.familyAttributeStructure<FamilyAttributeStructureRESI>(Tag.Residence, entry);
  }

  static familyAttributeStructureFACT(entry: Entry): FamilyAttributeStructureFACT {
    return this.familyAttributeStructure<FamilyAttributeStructureFACT>(Tag.Fact, entry);
  }
}
