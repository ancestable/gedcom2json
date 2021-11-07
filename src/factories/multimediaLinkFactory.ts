import { MultimediaLink, PointerTarget, Tag } from "@ancestable/gedcom7models";

import { FactoryHelper } from "../helper/factoryHelper";
import { Entry } from "../models/entry";
import { BaseFactory } from "./baseFactory";

export class MultimediaLinkFactory extends BaseFactory<MultimediaLink> {
  constructor() {
    super([Tag.Object])
  }

  fromGedcomEntry(entry: Entry): MultimediaLink {
    const factoryHelper = new FactoryHelper(entry);

    return {
      [Tag.Object]: {
        reference: { reference: entry.value || '', target: PointerTarget.OBJE },
        [Tag.Crop]: factoryHelper.isDefined([Tag.Crop]) && {
          [Tag.Top]: factoryHelper.getValue([Tag.Crop, Tag.Top]),
          [Tag.Left]: factoryHelper.getValue([Tag.Crop, Tag.Left]),
          [Tag.Height]: factoryHelper.getValue([Tag.Crop, Tag.Height]),
          [Tag.Width]: factoryHelper.getValue([Tag.Crop, Tag.Width]),
        },
        [Tag.Title]: factoryHelper.getValue([Tag.Title]),
      }
    }
  }
}