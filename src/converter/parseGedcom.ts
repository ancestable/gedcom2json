import { Tag } from '@ancestable/gedcom7models';
import { TextDecoder } from "util";
import { Entry } from "../models/entry";

export function parseGedcom(gedcomBuffer: ArrayBuffer) {
  const structure: Entry[] = [];
  const lines = splitIntoLines(gedcomBuffer);

  let currentEntryLevels: { [level: number]: Entry } = {};

  lines.forEach((line) => {
    if (isLineRecordElement(line)) {
      currentEntryLevels = {};
      currentEntryLevels[0] = createRecordEntryFromLine(line);
      structure.push(currentEntryLevels[0]);
    } else {
      const level = getLevel(line);
      const entry = createEntryFromLine(line);
      currentEntryLevels[level - 1].children.push(entry);
      currentEntryLevels[level] = entry;
    }
  });

  return structure;
}

function appendToLine(line: string, append: string, delimiter = ' '): string {
  return `${line}${delimiter}${append}`;
}

function preprocessLines(lines: string[]): string[] {
  let processedLines: string[] = [];
  lines.forEach(line => {
    const entry = createEntryFromLine(line);
    if (entry.tag === Tag.Continuation || entry.tag === Tag.Concatenation) {
      const latestLine = processedLines[processedLines.length - 1];
      const delimiter = entry.tag === Tag.Concatenation ? ' ' : '\n';
      const updatedLatestLine = appendToLine(latestLine, entry.value, delimiter);
      processedLines[processedLines.length - 1] = updatedLatestLine;
      return;
    }

    processedLines.push(line);
  });

  return processedLines;
}

function splitIntoLines(gedcomBuffer: ArrayBuffer): string[] {
  const lines = new TextDecoder().decode(gedcomBuffer).split(/\r\n|\n\r|\n|\r/);
  const preprocessedLines = preprocessLines(lines);
  return preprocessedLines;
}

function createRecordEntryFromLine(line: string): Entry {
  let [ _, referenceId, tag, ...rest ] = line.split(' ');

  // in case no referenceId is given in the line we just have the level and the tag e.g. '0 HEADER'
  if (!tag) {
    tag = referenceId;
    referenceId = '';
  };

  return {
    tag,
    referenceId,
    value: rest.join(' '),
    children: []
  }
}

function createEntryFromLine(line: string): Entry {
  const [ _, tag, ...payload ] = line.split(' ');
  return {
    tag,
    referenceId: '',
    value: payload.join(' '),
    children: [],
  }
}

function isLineRecordElement(line: string) {
  return getLevel(line) === 0;
}

function getLevel(line: string) {
  return +line.split(' ')[0];
}