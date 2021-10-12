import { Pointer, PointerTarget } from "@ancestable/gedcom7models";

export class PointerFactory {
  static createPointer(reference: string, target: PointerTarget): Pointer {
    return {
      reference,
      target,
    }
  }
}