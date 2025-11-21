import { AutoTokenizer, PreTrainedTokenizer } from '@xenova/transformers';

export type TokenizerModel = 
  | 'Xenova/gpt-4o'
  | 'Xenova/gpt-4'
  | 'Xenova/gpt-3.5-turbo'
  | 'Xenova/text-embedding-3-small'
  | 'Xenova/Meta-Llama-3-8B-Instruct'
  | 'Xenova/Mistral-7B-Instruct-v0.1'
  | 'Xenova/gemma-7b-it'
  | 'Xenova/Phi-3-mini-4k-instruct'
  | 'Xenova/claude-tokenizer'; // Community port if available, or fallback

// Map friendly names to Hugging Face model IDs
export const MODEL_MAPPING: Record<string, string> = {
  'GPT-4o': 'Xenova/gpt-4o',
  'GPT-4': 'Xenova/gpt-4',
  'GPT-3.5 Turbo': 'Xenova/gpt-3.5-turbo',
  'Llama 3 (8B)': 'Xenova/Meta-Llama-3-8B-Instruct',
  'Mistral 7B': 'Xenova/Mistral-7B-Instruct-v0.1',
  'Gemma 7B': 'Xenova/gemma-7b-it',
  'Phi-3 Mini': 'Xenova/Phi-3-mini-4k-instruct',
  'Embedding 3 Small': 'Xenova/text-embedding-3-small',
};

const tokenizerCache = new Map<string, Promise<PreTrainedTokenizer>>();

export const getAvailableModels = (): string[] => {
  return Object.keys(MODEL_MAPPING);
};

export const loadTokenizer = (modelName: string): Promise<PreTrainedTokenizer> => {
  const modelId = MODEL_MAPPING[modelName];
  if (!tokenizerCache.has(modelId)) {
    const promise = AutoTokenizer.from_pretrained(modelId);
    tokenizerCache.set(modelId, promise);
  }
  return tokenizerCache.get(modelId)!;
};

export const countTokensAsync = async (text: string, modelName: string): Promise<number> => {
  try {
    const tokenizer = await loadTokenizer(modelName);
    const tokens = tokenizer.encode(text);
    return tokens.length;
  } catch (e) {
    console.error(`Tokenization error for ${modelName}:`, e);
    return 0;
  }
};
