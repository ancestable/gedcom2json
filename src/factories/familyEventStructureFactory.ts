import { FamilyEventStructureANUL, FamilyEventStructureCENS, FamilyEventStructureDIV, FamilyEventStructureDIVF, FamilyEventStructureENGA, FamilyEventStructureMARB, FamilyEventStructureMARC, FamilyEventStructureMARL, FamilyEventStructureMARS, FamilyEventStructureMARR, FamilyEventStructureEVEN, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { FamilyEventDetailFactory } from "./familyEventDetailFactory";

export class FamilyEventStructureFactory {

  private static familyEventStructure<T>(tag: Tag, entry: Entry) {
    const factoryHelper = new FactoryHelper(entry);

    return {
      type: tag,
      [Tag.Type]: factoryHelper.getValue([Tag.Type]),
      familyEventDetail: new FamilyEventDetailFactory().fromGedcomEntry(entry),
    } as unknown as T;
  }

  static familyEventStructureANUL(entry: Entry): FamilyEventStructureANUL {
    return this.familyEventStructure<FamilyEventStructureANUL>(Tag.Annulment, entry);
  }

  static familyEventStructureCENS(entry: Entry): FamilyEventStructureCENS {
    return this.familyEventStructure<FamilyEventStructureCENS>(Tag.Census, entry);
  }

  static familyEventStructureDIV(entry: Entry): FamilyEventStructureDIV {
    return this.familyEventStructure<FamilyEventStructureDIV>(Tag.Divorce, entry);
  }

  static familyEventStructureDIVF(entry: Entry): FamilyEventStructureDIVF {
    return this.familyEventStructure<FamilyEventStructureDIVF>(Tag.DivorceFiled, entry);
  }

  static familyEventStructureENGA(entry: Entry): FamilyEventStructureENGA {
    return this.familyEventStructure<FamilyEventStructureENGA>(Tag.Engagement, entry);
  }

  static familyEventStructureMARB(entry: Entry): FamilyEventStructureMARB {
    return this.familyEventStructure<FamilyEventStructureMARB>(Tag.MarriageBan, entry);
  }

  static familyEventStructureMARC(entry: Entry): FamilyEventStructureMARC {
    return this.familyEventStructure<FamilyEventStructureMARC>(Tag.MarriageContract, entry);
  }

  static familyEventStructureMARL(entry: Entry): FamilyEventStructureMARL {
    return this.familyEventStructure<FamilyEventStructureMARL>(Tag.MarriageLicense, entry);
  }

  static familyEventStructureMARS(entry: Entry): FamilyEventStructureMARS {
    return this.familyEventStructure<FamilyEventStructureMARS>(Tag.MarriageSettlement, entry);
  }

  static familyEventStructureMARR(entry: Entry): FamilyEventStructureMARR {
    return this.familyEventStructure<FamilyEventStructureMARR>(Tag.Marriage, entry);
  }

  static familyEventStructureEVEN(entry: Entry): FamilyEventStructureEVEN {
    return this.familyEventStructure<FamilyEventStructureEVEN>(Tag.Event, entry);
  }
}
