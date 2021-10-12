import { Tag } from "@ancestable/gedcom7models";

import { Entry } from "../models/entry";

export abstract class BaseFactory<T> {
  constructor(private _tags: Tag[] = []) { }

  get tags() {
    return [...this._tags];
  }

  abstract fromGedcomEntry(entry: Entry): T;
  fromGedcomEntries(entries: Entry[]): T[] {
    return entries
      .filter((entry) => this._tags.includes(entry.tag as Tag))
      .map((entry) => this.fromGedcomEntry(entry));
  };
}