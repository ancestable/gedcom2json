import { FamilyAttributeStructure, FamilyAttributeStructureTags, FamilyEventStructure, FamilyEventStructureTags, FamilyRecord, IndiPointer, PointerTarget, Restriction, SubmPointer, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { AssociationStructureFactory } from "./associationStructureFactory";
import { BaseFactory } from "./baseFactory";
import { ChangeDateFactory } from "./changeDateFactory";
import { CreationDateFactory } from "./creationDateFactory";
import { FamilyAttributeStructureFactory } from "./familyAttributeStructureFactory";
import { FamilyEventStructureFactory } from "./familyEventStructureFactory";
import { MultimediaLinkFactory } from "./multimediaLinkFactory";
import { NonEventStructureFactory } from "./nonEventStructureFactory";
import { NoteStructureFactory } from "./noteStructureFactory";
import { SourceCitationFactory } from "./sourceCitationFactory";

export class FamilyRecordFactory extends BaseFactory<FamilyRecord>{
  constructor() {
    super([Tag.Family]);
  }

  fromGedcomEntry(familyRecordEntry: Entry): FamilyRecord {
    const factoryHelper = new FactoryHelper(familyRecordEntry);
    const childIndiPointerEntries = factoryHelper.getChildrenWithTag(Tag.Child);

    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);
    const changeDateEntry = factoryHelper.getEntryWithPath([Tag.Change]);
    const creationDateEntry = factoryHelper.getEntryWithPath([Tag.CreationDate]);
    const mediaLinkEntries = factoryHelper.getChildrenWithTag(Tag.Object);
    const sourceCitationEntries = factoryHelper.getChildrenWithTags([Tag.Source]);
    const nonEventStructureEntries = factoryHelper.getChildrenWithTags([Tag.NonEvent]);
    const associationEntries = factoryHelper.getChildrenWithTag(Tag.Associates);
    const submitterEntries = factoryHelper.getChildrenWithTag(Tag.Submitter);

    const familyAttributeStructureEntries = factoryHelper.getChildrenWithTags(FamilyAttributeStructureTags);
    const familyEventStructureEntries = factoryHelper.getChildrenWithTags(FamilyEventStructureTags);

    return {
        referenceId: familyRecordEntry.referenceId,
        [Tag.Restriction]: (factoryHelper.getValueArray([Tag.Restriction]) || []) as Restriction[],
        [Tag.Husband]: factoryHelper.isDefined([Tag.Husband]) && {
          reference: factoryHelper.getValue([Tag.Husband]),
          target: PointerTarget.INDI,
        } as IndiPointer,
        [Tag.Wife]: factoryHelper.isDefined([Tag.Wife]) && {
          reference: factoryHelper.getValue([Tag.Wife]),
          target: PointerTarget.INDI,
        } as IndiPointer,
        [Tag.Child]: this.createChildIndiPointer(childIndiPointerEntries),
        familyAttributeStructures: this.createFamilyAttributeStructure(familyAttributeStructureEntries),
        familyEventStructures: this.createFamilyEventStructure(familyEventStructureEntries),
        nonEventStructures: new NonEventStructureFactory().fromGedcomEntries(nonEventStructureEntries),
        associationStructures: new AssociationStructureFactory().fromGedcomEntries(associationEntries),
        [Tag.Submitter]: this.createSubmitterSubmPointer(submitterEntries),
        noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
        sourceCitations: new SourceCitationFactory().fromGedcomEntries(sourceCitationEntries),
        multimediaLinks: new MultimediaLinkFactory().fromGedcomEntries(mediaLinkEntries),
        changeDate: changeDateEntry ? new ChangeDateFactory().fromGedcomEntry(changeDateEntry) : undefined,
        creationDate: creationDateEntry ? new CreationDateFactory().fromGedcomEntry(creationDateEntry) : undefined,
      }
  }

  private createChildIndiPointer(entries: Entry[]): IndiPointer[] {
    return entries.map(entry => ({
      reference: entry.value,
      target: PointerTarget.INDI,
    }));
  }

  private createSubmitterSubmPointer(entries: Entry[]): SubmPointer[] {
    return entries.map(entry => ({
      reference: entry.value,
      target: PointerTarget.SUBM,
    }));
  }

  private createFamilyAttributeStructure(entries: Entry[]): FamilyAttributeStructure[] {
    return entries.map(entry => {
      switch(entry.tag) {
        case Tag.ChildrenCount: return FamilyAttributeStructureFactory.familyAttributeStructureNCHI(entry);
        case Tag.Residence: return FamilyAttributeStructureFactory.familyAttributeStructureRESI(entry);
        case Tag.Fact: return FamilyAttributeStructureFactory.familyAttributeStructureFACT(entry);
        default: return {
          type: Tag.Fact,
          value: '',
          [Tag.Type]: '',
        }
      }
    })
  }

  private createFamilyEventStructure(entries: Entry[]): FamilyEventStructure[] {
    return entries.map(entry => {
      switch(entry.tag) {
        case Tag.Census: return FamilyEventStructureFactory.familyEventStructureCENS(entry);
        case Tag.Divorce: return FamilyEventStructureFactory.familyEventStructureDIV(entry);
        case Tag.DivorceFiled: return FamilyEventStructureFactory.familyEventStructureDIVF(entry);
        case Tag.Engagement: return FamilyEventStructureFactory.familyEventStructureENGA(entry);
        case Tag.MarriageBan: return FamilyEventStructureFactory.familyEventStructureMARB(entry);
        case Tag.MarriageContract: return FamilyEventStructureFactory.familyEventStructureMARC(entry);
        case Tag.MarriageLicense: return FamilyEventStructureFactory.familyEventStructureMARL(entry);
        case Tag.MarriageSettlement: return FamilyEventStructureFactory.familyEventStructureMARS(entry);
        case Tag.Marriage: return FamilyEventStructureFactory.familyEventStructureMARR(entry);
        case Tag.Event: return FamilyEventStructureFactory.familyEventStructureEVEN(entry);
        default: return {
          type: Tag.Census,
          value: '',
        }
      }
    })
  }
}