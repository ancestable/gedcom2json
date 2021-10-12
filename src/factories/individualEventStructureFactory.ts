import { FamcAdop, FamPointer, IndividualEventStructureADOP, IndividualEventStructureBAPM, IndividualEventStructureBARM, IndividualEventStructureBASM, IndividualEventStructureBIRTH, IndividualEventStructureBLES, IndividualEventStructureBURI, IndividualEventStructureCENS, IndividualEventStructureCHR, IndividualEventStructureCHRA, IndividualEventStructureCONF, IndividualEventStructureCREM, IndividualEventStructureDEAT, IndividualEventStructureEMIG, IndividualEventStructureEVEN, IndividualEventStructureFCOM, IndividualEventStructureGRAD, IndividualEventStructureIMMI, IndividualEventStructureNATU, IndividualEventStructureORDN, IndividualEventStructurePROB, IndividualEventStructureRETI, IndividualEventStructureWILL, PointerTarget, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { IndividualEventDetailFactory } from "./individualEventDetailFactory";

export class IndividualEventStructureFactory {

  private static individualEventStructure<T>(tag: Tag, entry: Entry) {
    const factoryHelper = new FactoryHelper(entry);

    return {
      type: tag,
      value: entry.value,
      [Tag.Type]: factoryHelper.getValue([Tag.Type]),
      individualEventDetail: new IndividualEventDetailFactory().fromGedcomEntry(entry),
    } as unknown as T;
  }

  static individualEventStructureBAPM(entry: Entry): IndividualEventStructureBAPM {
    return this.individualEventStructure<IndividualEventStructureBAPM>(Tag.Baptism, entry);
  }

  static individualEventStructureBARM(entry: Entry): IndividualEventStructureBARM {
    return this.individualEventStructure<IndividualEventStructureBARM>(Tag.BarMitzvah, entry);
  }

  static individualEventStructureBASM(entry: Entry): IndividualEventStructureBASM {
    return this.individualEventStructure<IndividualEventStructureBASM>(Tag.BatMitzvah, entry);
  }

  static individualEventStructureBLES(entry: Entry): IndividualEventStructureBLES {
    return this.individualEventStructure<IndividualEventStructureBLES>(Tag.Blessing, entry);
  }

  static individualEventStructureBURI(entry: Entry): IndividualEventStructureBURI {
    return this.individualEventStructure<IndividualEventStructureBURI>(Tag.Burial, entry);
  }

  static individualEventStructureCENS(entry: Entry): IndividualEventStructureCENS {
    return this.individualEventStructure<IndividualEventStructureCENS>(Tag.Census, entry);
  }

  static individualEventStructureCHRA(entry: Entry): IndividualEventStructureCHRA {
    return this.individualEventStructure<IndividualEventStructureCHRA>(Tag.AdultChristening, entry);
  }

  static individualEventStructureCONF(entry: Entry): IndividualEventStructureCONF {
    return this.individualEventStructure<IndividualEventStructureCONF>(Tag.Confirmation, entry);
  }

  static individualEventStructureCREM(entry: Entry): IndividualEventStructureCREM {
    return this.individualEventStructure<IndividualEventStructureCREM>(Tag.Cremation, entry);
  }

  static individualEventStructureDEAT(entry: Entry): IndividualEventStructureDEAT {
    return this.individualEventStructure<IndividualEventStructureDEAT>(Tag.Death, entry);
  }

  static individualEventStructureEMIG(entry: Entry): IndividualEventStructureEMIG {
    return this.individualEventStructure<IndividualEventStructureEMIG>(Tag.Emigration, entry);
  }

  static individualEventStructureFCOM(entry: Entry): IndividualEventStructureFCOM {
    return this.individualEventStructure<IndividualEventStructureFCOM>(Tag.FirstCommunion, entry);
  }

  static individualEventStructureGRAD(entry: Entry): IndividualEventStructureGRAD {
    return this.individualEventStructure<IndividualEventStructureGRAD>(Tag.Graduation, entry);
  }

  static individualEventStructureIMMI(entry: Entry): IndividualEventStructureIMMI {
    return this.individualEventStructure<IndividualEventStructureIMMI>(Tag.Immigration, entry);
  }

  static individualEventStructureNATU(entry: Entry): IndividualEventStructureNATU {
    return this.individualEventStructure<IndividualEventStructureNATU>(Tag.Naturalization, entry);
  }

  static individualEventStructureORDN(entry: Entry): IndividualEventStructureORDN {
    return this.individualEventStructure<IndividualEventStructureORDN>(Tag.Ordination, entry);
  }

  static individualEventStructurePROB(entry: Entry): IndividualEventStructurePROB {
    return this.individualEventStructure<IndividualEventStructurePROB>(Tag.Probate, entry);
  }

  static individualEventStructureRETI(entry: Entry): IndividualEventStructureRETI {
    return this.individualEventStructure<IndividualEventStructureRETI>(Tag.Retirement, entry);
  }

  static individualEventStructureWILL(entry: Entry): IndividualEventStructureWILL {
    return this.individualEventStructure<IndividualEventStructureWILL>(Tag.Will, entry);
  }

  static individualEventStructureADOP(entry: Entry): IndividualEventStructureADOP {
    const factoryHelper = new FactoryHelper(entry);
    const base = this.individualEventStructure<IndividualEventStructureADOP>(Tag.Adoption, entry);
    const extension = {
      [Tag.FamilyChild]: factoryHelper.isDefined([Tag.FamilyChild]) && {
        reference: {
          reference: factoryHelper.getValue([Tag.FamilyChild]) || '',
          target: PointerTarget.FAM,
        } as FamPointer,
        [Tag.Adoption]: factoryHelper.isDefined([Tag.FamilyChild, Tag.Adoption]) && {
          value: (factoryHelper.getValue([Tag.FamilyChild, Tag.Adoption]) || FamcAdop.BOTH) as FamcAdop,
          [Tag.Phrase]: factoryHelper.getValue([Tag.FamilyChild, Tag.Phrase]),
        }
      }
    }
    return { ...base, ...extension };
  }

  static individualEventStructureBIRTH(entry: Entry): IndividualEventStructureBIRTH {
    const factoryHelper = new FactoryHelper(entry);
    const base = this.individualEventStructure<IndividualEventStructureBIRTH>(Tag.Birth, entry);
    const extension = {
      [Tag.FamilyChild]: factoryHelper.isDefined([Tag.FamilyChild]) && {
        reference: factoryHelper.getValue([Tag.FamilyChild]) || '',
        target: PointerTarget.FAM,
      } as FamPointer,
    }
    return { ...base, ...extension };
  }

  static individualEventStructureCHR(entry: Entry): IndividualEventStructureCHR {
    const factoryHelper = new FactoryHelper(entry);
    const base = this.individualEventStructure<IndividualEventStructureCHR>(Tag.Christening, entry);
    const extension = {
      [Tag.FamilyChild]: factoryHelper.isDefined([Tag.FamilyChild]) && {
        reference: factoryHelper.getValue([Tag.FamilyChild]) || '',
        target: PointerTarget.FAM,
      } as FamPointer,
    }
    return { ...base, ...extension };
  }

  static individualEventStructureEVEN(entry: Entry): IndividualEventStructureEVEN {
    return this.individualEventStructure<IndividualEventStructureEVEN>(Tag.Event, entry);
  }
}
