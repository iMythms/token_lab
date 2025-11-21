import yaml from 'js-yaml';
import Papa from 'papaparse';
import { XMLBuilder, XMLParser } from 'fast-xml-parser';
import { encode } from '@toon-format/toon';

export type InputType = 'json' | 'text' | 'yaml' | 'xml';

export const parseInput = (input: string, inputType: InputType): any => {
  if (!input.trim()) {
    throw new Error('Input is empty');
  }

  switch (inputType) {
    case 'json':
      return JSON.parse(input);
    
    case 'yaml':
      const yamlResult = yaml.load(input);
      if (yamlResult === null || yamlResult === undefined) {
        throw new Error('Invalid YAML');
      }
      return yamlResult;
    
    case 'xml':
      const parser = new XMLParser({ ignoreAttributes: false });
      return parser.parse(input);
    
    case 'text':
      // For plain text, wrap it in an object for consistency
      return { text: input };
    
    default:
      throw new Error(`Unsupported input type: ${inputType}`);
  }
};

export const toYaml = (obj: any): string => {
  try {
    return yaml.dump(obj);
  } catch (e) {
    return `Error converting to YAML: ${e}`;
  }
};

export const toToon = (obj: any): string => {
  try {
    return encode(obj);
  } catch (e) {
    return `Error converting to TOON: ${e}`;
  }
};

export const toCsv = (obj: any): string => {
  try {
    const data = Array.isArray(obj) ? obj : [obj];
    return Papa.unparse(data);
  } catch (e) {
    return `Error converting to CSV: ${e}`;
  }
};

export const toXml = (obj: any): string => {
  try {
    const builder = new XMLBuilder({
      format: true,
      ignoreAttributes: false
    });
    return builder.build({ root: obj });
  } catch (e) {
    return `Error converting to XML: ${e}`;
  }
};

export const toCollapsedJson = (obj: any): string => {
  return JSON.stringify(obj);
};

export const toPrettyJson = (obj: any): string => {
  return JSON.stringify(obj, null, 2);
};
