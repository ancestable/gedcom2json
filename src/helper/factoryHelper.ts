import { Tag } from "@ancestable/gedcom7models";
import { Entry } from "../models/entry";

type Path = (Tag | string)[];

export class FactoryHelper {
  constructor(private entry: Entry) { }

  public isDefined(path: Path) {
    return this.getEntryWithPath(path) ? true : undefined;
  }
  
  public getValue(path: Path): string | undefined {
    const valueSelection = this.getEntryWithPath(path);
    return valueSelection?.value;
  }

  public getValueArray(path: Path): string[] | undefined {
    const entry = this.getEntryWithPath(path.slice(0,-1));
    const finalTag = path[path.length - 1];
    const values = entry?.children.filter((child) => child.tag === finalTag).map((entry) => entry.value);
    return values;
  }

  public getEntryWithPath(path: Path): Entry | undefined {
    let currentSelection: Entry | undefined = this.entry;
    path.forEach((element) => {
      currentSelection = currentSelection?.children.find((child) => child.tag === element);
    });
    return currentSelection;
  }

  public getChildrenWithTag(tag: Tag): Entry[] {
    return this.entry.children.filter((child) => child.tag === tag);
  }

  public getChildrenWithTags(tags: Tag[]): Entry[] {
    return this.entry.children.filter((child) => tags.includes(child.tag as Tag));
  }
}