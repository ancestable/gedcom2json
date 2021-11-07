import { Header, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";
import { AddressStructureFactory } from "./addressStructureFactory";
import { NoteStructureFactory } from './noteStructureFactory';

export class HeaderFactory extends BaseFactory<Header> {
  fromGedcomEntry(headEntry: Entry): Header {
    const factoryHelper = new FactoryHelper(headEntry);
    const addressStructureEntry = factoryHelper.getEntryWithPath([Tag.Source, Tag.Corporate, Tag.Address]);
    const noteEntries = factoryHelper.getChildrenWithTags(new NoteStructureFactory().tags);

    return {
      [Tag.Gedcom]: {
        [Tag.Version]: factoryHelper.getValue([Tag.Gedcom, Tag.Version]) || '',
      },
      [Tag.ExtensionSchema]: {
        [Tag.Tag]: factoryHelper.getValueArray([Tag.ExtensionSchema, Tag.Tag]) || [],
      },
      [Tag.Source]: factoryHelper.isDefined([Tag.Source]) && {
        [Tag.Version]: factoryHelper.getValue([Tag.Source, Tag.Version]),
        [Tag.Name]: factoryHelper.getValue([Tag.Source, Tag.Name]),
        [Tag.Corporate]: factoryHelper.isDefined([Tag.Source, Tag.Corporate]) && {
          value: factoryHelper.getValue([Tag.Source, Tag.Corporate]),
          [Tag.Phone]: factoryHelper.getValueArray([Tag.Source, Tag.Corporate, Tag.Phone]) || [],
          [Tag.Email]: factoryHelper.getValueArray([Tag.Source, Tag.Corporate, Tag.Email]) || [],
          [Tag.Fax]: factoryHelper.getValueArray([Tag.Source, Tag.Corporate, Tag.Fax]) || [],
          [Tag.Web]: factoryHelper.getValueArray([Tag.Source, Tag.Corporate, Tag.Web]) || [],
          addressStructure: addressStructureEntry ? new AddressStructureFactory().fromGedcomEntry(addressStructureEntry): undefined,
        },
        [Tag.Data]: factoryHelper.isDefined([Tag.Source, Tag.Data]) && {
          value: factoryHelper.getValue([Tag.Source, Tag.Data]),
          [Tag.Date]: factoryHelper.isDefined([Tag.Source, Tag.Data, Tag.Date]) && {
            value: factoryHelper.getValue([Tag.Source, Tag.Data, Tag.Date]),
            [Tag.Time]: factoryHelper.getValue([Tag.Source, Tag.Data, Tag.Date, Tag.Time]),
          },
          [Tag.Corporate]: factoryHelper.getValue([Tag.Source, Tag.Data, Tag.Corporate]),
        }
      },
      [Tag.Destination]: factoryHelper.getValue([Tag.Destination]),
      [Tag.Date]: factoryHelper.isDefined([Tag.Date]) && {
        value: factoryHelper.getValue([Tag.Date]),
        [Tag.Time]: factoryHelper.getValue([Tag.Date, Tag.Time]),
      },
      [Tag.Submitter]: factoryHelper.getValue([Tag.Submitter]),
      [Tag.Corporate]: factoryHelper.getValue([Tag.Corporate]),
      [Tag.Language]: factoryHelper.getValue([Tag.Language]) as string | undefined,
      [Tag.Place]: {
        [Tag.Format]: factoryHelper.getValue([Tag.Place, Tag.Format]),
      },
      noteStructures: new NoteStructureFactory().fromGedcomEntries(noteEntries),
    }
  }
}