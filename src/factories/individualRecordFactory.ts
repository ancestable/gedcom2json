import { FamcStat, FamPointer, IndiPointer, IndividualAttributeStructure, IndividualAttributeStructureTags, IndividualEventStructure, IndividualEventStructureTags, IndividualRecord, Pedi, PointerTarget, Restriction, Sex, SubmPointer, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { AssociationStructureFactory } from "./associationStructureFactory";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { IdentifierStructureFactory } from "./identifierStructureFactory";
import { IndividualAttributeStructureFactory } from "./individualAttributeStructureFactory";
import { IndividualEventStructureFactory } from "./individualEventStructureFactory";
import { MultimediaLinkFactory } from "./multimediaLinkFactory";
import { NonEventStructureFactory } from "./nonEventStructureFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { PersonalNameStructureFactory } from "./personalNameStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class IndividualRecordFactory extends BaseFactory<IndividualRecord>{
  constructor() {
    super([Tag.Individual]);
  }

  fromGedcomEntry(individualEntry: Entry): IndividualRecord {
    const factoryHelper = new FactoryHelper(individualEntry);
    const identifierEntries = factoryHelper.getChildrenWithTags(new IdentifierStructureFactory().tags);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);
    const mediaLinkEntries = factoryHelper.getChildrenWithTag(Tag.Object);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);
    const nameEntries = factoryHelper.getChildrenWithTag(Tag.Name);

    const individualAttributeStructureEntries = factoryHelper.getChildrenWithTags(IndividualAttributeStructureTags);
    const individualEventStructureEntries = factoryHelper.getChildrenWithTags(IndividualEventStructureTags);
    const nonEventStructureEntries = factoryHelper.getChildrenWithTags([Tag.NonEvent]);
    
    const familyChildEntries = factoryHelper.getChildrenWithTag(Tag.FamilyChild);
    const familySpouseEntries = factoryHelper.getChildrenWithTag(Tag.FamilySpouse);
    const associationEntries = factoryHelper.getChildrenWithTag(Tag.Associates);
    const submitterEntries = factoryHelper.getChildrenWithTag(Tag.Submitter);
    const descendantInterestEntries = factoryHelper.getChildrenWithTag(Tag.DescendantInt);
    const ancestorInterestEntries = factoryHelper.getChildrenWithTag(Tag.AncestorInterest);
    const aliasEntries = factoryHelper.getChildrenWithTag(Tag.Alias);

    return {
      referenceId: individualEntry.referenceId,
      [Tag.Restriction]: (factoryHelper.getValueArray([Tag.Restriction]) || []) as Restriction[],
      personalNameStructures: new PersonalNameStructureFactory().fromGedcomEntries(nameEntries),
      [Tag.Sex]: (factoryHelper.getValueArray([Tag.Sex]) || Sex.Unknown) as Sex,
      individualAttributeStructures: this.createIndividualAttributeStructure(individualAttributeStructureEntries),
      individualEventStructures: this.createIndividualEventStructure(individualEventStructureEntries),
      nonEventStructures: new NonEventStructureFactory().fromGedcomEntries(nonEventStructureEntries),
      [Tag.FamilyChild]: this.createFamilyChild(familyChildEntries),
      [Tag.FamilySpouse]: this.createFamilySpouse(familySpouseEntries),
      [Tag.Submitter]: this.createSubmitterPointer(submitterEntries),
      associationStructures: new AssociationStructureFactory().fromGedcomEntries(associationEntries),
      [Tag.Alias]: this.createAlias(aliasEntries),
      [Tag.AncestorInterest]: this.createAncestorInterest(ancestorInterestEntries), 
      [Tag.DescendantInt]: this.createDescendantInterest(descendantInterestEntries), 
      identifierStructures: new IdentifierStructureFactory().fromGedcomEntries(identifierEntries),
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
      multimediaLinks: new MultimediaLinkFactory().fromGedcomEntries(mediaLinkEntries),
      changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
      creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
    }
  }

  private createAlias(entries: Entry[]) {
    return entries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);

      return {
        reference: {
          reference: entry.value || '',
          target: PointerTarget.INDI,
        } as IndiPointer,
        [Tag.Phrase]: factoryHelper.getValue([Tag.Phrase]),
      }
    })
  }

  private createDescendantInterest(entries: Entry[]): SubmPointer[] {
    return entries.map(entry => ({
      reference: entry.value,
      target: PointerTarget.SUBM,
    }))
  }

  private createAncestorInterest(entries: Entry[]): SubmPointer[] {
    return entries.map(entry => ({
      reference: entry.value,
      target: PointerTarget.SUBM,
    }))
  }

  private createSubmitterPointer(entries: Entry[]): SubmPointer[] {
    return entries.map(entry => ({
      reference: entry.value,
      target: PointerTarget.SUBM,
    }))
  }

  private createFamilySpouse(entries: Entry[]) {
    return entries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);
      const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);

      return {
        reference: {
          reference: entry.value,
          target: PointerTarget.FAM,
        } as FamPointer,
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      }
    });
  }

  private createIndividualAttributeStructure(entries: Entry[]): IndividualAttributeStructure[] {
    return entries.map(entry => {
      switch(entry.tag) {
        case Tag.Caste: return IndividualAttributeStructureFactory.individualAttributeStructureCAST(entry);
        case Tag.Education: return IndividualAttributeStructureFactory.individualAttributeStructureEDUC(entry);
        case Tag.IdentificationNumber: return IndividualAttributeStructureFactory.individualAttributeStructureIDNO(entry);
        case Tag.Nationality: return IndividualAttributeStructureFactory.individualAttributeStructureNATI(entry);
        case Tag.ChildrenCount: return IndividualAttributeStructureFactory.individualAttributeStructureNCHI(entry);
        case Tag.Occupation: return IndividualAttributeStructureFactory.individualAttributeStructureOCCU(entry);
        case Tag.Property: return IndividualAttributeStructureFactory.individualAttributeStructurePROP(entry);
        case Tag.Religion: return IndividualAttributeStructureFactory.individualAttributeStructureRELI(entry);
        case Tag.Residence: return IndividualAttributeStructureFactory.individualAttributeStructureRESI(entry);
        case Tag.SocialSecurityNumber: return IndividualAttributeStructureFactory.individualAttributeStructureSSN(entry);
        case Tag.Title:  return IndividualAttributeStructureFactory.individualAttributeStructureTITL(entry);
        case Tag.Fact: return IndividualAttributeStructureFactory.individualAttributeStructureFACT(entry);
        default: return {
          type: Tag.Fact,
          value: '',
        }
      }
    })
  }

  private createIndividualEventStructure(entries: Entry[]): IndividualEventStructure[] {
    return entries.map(entry => {
      switch(entry.tag) {
        case Tag.BarMitzvah: return IndividualEventStructureFactory.individualEventStructureBARM(entry);
        case Tag.BatMitzvah: return IndividualEventStructureFactory.individualEventStructureBASM(entry);
        case Tag.Blessing: return IndividualEventStructureFactory.individualEventStructureBLES(entry);
        case Tag.Burial: return IndividualEventStructureFactory.individualEventStructureBURI(entry);
        case Tag.Census: return IndividualEventStructureFactory.individualEventStructureCENS(entry);
        case Tag.AdultChristening: return IndividualEventStructureFactory.individualEventStructureCHRA(entry);
        case Tag.Confirmation: return IndividualEventStructureFactory.individualEventStructureCONF(entry);
        case Tag.Cremation: return IndividualEventStructureFactory.individualEventStructureCREM(entry);
        case Tag.Death: return IndividualEventStructureFactory.individualEventStructureDEAT(entry);
        case Tag.Emigration: return IndividualEventStructureFactory.individualEventStructureEMIG(entry);
        case Tag.FirstCommunion: return IndividualEventStructureFactory.individualEventStructureFCOM(entry);
        case Tag.Graduation: return IndividualEventStructureFactory.individualEventStructureGRAD(entry);
        case Tag.Immigration: return IndividualEventStructureFactory.individualEventStructureIMMI(entry);
        case Tag.Naturalization: return IndividualEventStructureFactory.individualEventStructureNATU(entry);
        case Tag.Ordination: return IndividualEventStructureFactory.individualEventStructureORDN(entry);
        case Tag.Probate: return IndividualEventStructureFactory.individualEventStructurePROB(entry);
        case Tag.Retirement: return IndividualEventStructureFactory.individualEventStructureRETI(entry);
        case Tag.Will: return IndividualEventStructureFactory.individualEventStructureWILL(entry);
        case Tag.Adoption: return IndividualEventStructureFactory.individualEventStructureADOP(entry);
        case Tag.Birth: return IndividualEventStructureFactory.individualEventStructureBIRTH(entry);
        case Tag.Christening: return IndividualEventStructureFactory.individualEventStructureCHR(entry);
        case Tag.Event: return IndividualEventStructureFactory.individualEventStructureEVEN(entry);
        default: return {
          type: Tag.BarMitzvah,
          value: '',
        }
      }
    })
  }

  private createFamilyChild(entries: Entry[]) {
    return entries.map(entry => {
      const factoryHelper = new FactoryHelper(entry);
      const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);

      return {
        reference: {
          reference: entry.value,
          target: PointerTarget.FAM,
        } as FamPointer,
        [Tag.Pedigree]: {
          value: (factoryHelper.getValue([Tag.Pedigree]) || Pedi.Other) as Pedi,
          [Tag.Phrase]: factoryHelper.getValue([Tag.Phrase])
        },
        [Tag.Status]: {
          value: (factoryHelper.getValue([Tag.Status]) || FamcStat.PROVEN) as FamcStat,
          [Tag.Phrase]: factoryHelper.getValue([Tag.Phrase])
        },
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
      }
    })
  }
}