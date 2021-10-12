import { IndividualAttributeStructureCAST, IndividualAttributeStructureEDUC, IndividualAttributeStructureFACT, IndividualAttributeStructureIDNO, IndividualAttributeStructureNATI, IndividualAttributeStructureNCHI, IndividualAttributeStructureNMR, IndividualAttributeStructureOCCU, IndividualAttributeStructurePROP, IndividualAttributeStructureRELI, IndividualAttributeStructureRESI, IndividualAttributeStructureSSN, IndividualAttributeStructureTITL, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { IndividualEventDetailFactory } from "./individualEventDetailFactory";

export class IndividualAttributeStructureFactory {

  private static individualAttributeStructure<T>(tag: Tag, entry: Entry) {
    const factoryHelper = new FactoryHelper(entry);

    return {
      type: tag,
      value: entry.value,
      [Tag.Type]: factoryHelper.getValue([Tag.Type]),
      individualEventDetail: new IndividualEventDetailFactory().fromGedcomEntry(entry),
    } as unknown as T;
  }

  static individualAttributeStructureCAST(entry: Entry): IndividualAttributeStructureCAST {
    return this.individualAttributeStructure<IndividualAttributeStructureCAST>(Tag.Caste, entry);
  }

  static individualAttributeStructureEDUC(entry: Entry): IndividualAttributeStructureEDUC {
    return this.individualAttributeStructure<IndividualAttributeStructureEDUC>(Tag.Education, entry);
  }

  static individualAttributeStructureIDNO(entry: Entry): IndividualAttributeStructureIDNO {
    return this.individualAttributeStructure<IndividualAttributeStructureIDNO>(Tag.IdentificationNumber, entry);
  }

  static individualAttributeStructureNATI(entry: Entry): IndividualAttributeStructureNATI {
    return this.individualAttributeStructure<IndividualAttributeStructureNATI>(Tag.Nationality, entry);
  }

  static individualAttributeStructureNCHI(entry: Entry): IndividualAttributeStructureNCHI {
    return this.individualAttributeStructure<IndividualAttributeStructureNCHI>(Tag.ChildrenCount, entry);
  }

  static individualAttributeStructureNMR(entry: Entry): IndividualAttributeStructureNMR {
    return this.individualAttributeStructure<IndividualAttributeStructureNMR>(Tag.MarriageCount, entry);
  }
  
  static individualAttributeStructureOCCU(entry: Entry): IndividualAttributeStructureOCCU {
    return this.individualAttributeStructure<IndividualAttributeStructureOCCU>(Tag.Occupation, entry);
  }
  
  static individualAttributeStructurePROP(entry: Entry): IndividualAttributeStructurePROP {
    return this.individualAttributeStructure<IndividualAttributeStructurePROP>(Tag.Property, entry);
  }
  
  static individualAttributeStructureRELI(entry: Entry): IndividualAttributeStructureRELI {
    return this.individualAttributeStructure<IndividualAttributeStructureRELI>(Tag.Religion, entry);
  }
  
  static individualAttributeStructureRESI(entry: Entry): IndividualAttributeStructureRESI {
    return this.individualAttributeStructure<IndividualAttributeStructureRESI>(Tag.Residence, entry);
  }

  static individualAttributeStructureSSN(entry: Entry): IndividualAttributeStructureSSN {
    return this.individualAttributeStructure<IndividualAttributeStructureSSN>(Tag.SocialSecurityNumber, entry);
  }
  
  static individualAttributeStructureTITL(entry: Entry): IndividualAttributeStructureTITL {
    return this.individualAttributeStructure<IndividualAttributeStructureTITL>(Tag.Title, entry);
  }
  
  static individualAttributeStructureFACT(entry: Entry): IndividualAttributeStructureFACT {
    return this.individualAttributeStructure<IndividualAttributeStructureFACT>(Tag.Fact, entry);
  }
}