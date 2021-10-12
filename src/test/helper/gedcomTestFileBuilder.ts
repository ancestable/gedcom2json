export class GedcomTestFileBuilder {
  private lines: string[] = [];

  addHeader() {
    this.lines.push(`0 HEADER`);
    return this;
  }

  addRecord(referenceId: string, tag = 'INDI') {
    this.lines.push(`0 ${referenceId} ${tag}`);
    return this;
  }

  addEntry(level: number, tag: string, payload: string) {
    this.lines.push(`${level} ${tag} ${payload}`);
    return this;
  }

  toBuffer() {
    return new TextEncoder().encode(this.lines.join('\r\n'));
  }
}