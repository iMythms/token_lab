import { encodingForModel, type TiktokenModel } from "js-tiktoken";

export type TokenizerModel = 
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'gpt-4-turbo'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'o1'
  | 'o1-mini'
  | 'claude-3.5-sonnet' // Approximate using GPT-4o
  | 'claude-3-opus'     // Approximate using GPT-4
  | 'text-embedding-3-small';

const encoderCache = new Map<string, ReturnType<typeof encodingForModel>>();

// Map models to their tiktoken equivalents
const modelMapping: Record<TokenizerModel, TiktokenModel> = {
  'gpt-4o': 'gpt-4o',
  'gpt-4o-mini': 'gpt-4o',
  'gpt-4-turbo': 'gpt-4',
  'gpt-4': 'gpt-4',
  'gpt-3.5-turbo': 'gpt-3.5-turbo',
  'o1': 'o1',
  'o1-mini': 'o1-mini',
  'claude-3.5-sonnet': 'gpt-4o', // Approximation
  'claude-3-opus': 'gpt-4',      // Approximation
  'text-embedding-3-small': 'text-embedding-3-small',
};

const getEncoder = (model: TokenizerModel) => {
  const tiktokenModel = modelMapping[model];
  if (!encoderCache.has(tiktokenModel)) {
    encoderCache.set(tiktokenModel, encodingForModel(tiktokenModel));
  }
  return encoderCache.get(tiktokenModel)!;
};

export const countTokens = (text: string, model: TokenizerModel = 'gpt-4o'): number => {
  try {
    const encoder = getEncoder(model);
    return encoder.encode(text).length;
  } catch (e) {
    console.error("Tokenization error:", e);
    return 0;
  }
};

export const getAvailableModels = (): TokenizerModel[] => {
  return [
    'gpt-4o',
    'gpt-4o-mini',
    'gpt-4-turbo',
    'gpt-4',
    'gpt-3.5-turbo',
    'o1',
    'o1-mini',
    'claude-3.5-sonnet',
    'claude-3-opus',
    'text-embedding-3-small'
  ];
};

export const isApproximateModel = (model: TokenizerModel): boolean => {
  return model.startsWith('claude-');
};
