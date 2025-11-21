import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InputType } from '@/utils/converters';
import { getAvailableModels } from '@/utils/tokenizer';
import { FileJson, FileText, FileCode, Type, Brain, Cpu } from 'lucide-react';

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  inputType: InputType;
  onInputTypeChange: (type: InputType) => void;
  tokenizerModel: string;
  onTokenizerModelChange: (model: string) => void;
  error: string | null;
  isTokenizerLoading: boolean;
}

const inputTypeIcons = {
  json: FileJson,
  yaml: FileCode,
  xml: FileCode,
  text: Type,
};

export const InputArea: React.FC<InputAreaProps> = ({
  value,
  onChange,
  inputType,
  onInputTypeChange,
  tokenizerModel,
  onTokenizerModelChange,
  error,
  isTokenizerLoading,
}) => {
  const availableModels = getAvailableModels();
  const Icon = inputTypeIcons[inputType] || FileText;

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="input-type" className="text-gray-900 font-semibold text-sm tracking-wide flex items-center gap-2">
            <Icon className="w-4 h-4" />
            Input Type
          </Label>
          <Select value={inputType} onValueChange={(value) => onInputTypeChange(value as InputType)}>
            <SelectTrigger id="input-type" className="bg-white border-gray-300 text-gray-900 hover:border-gray-400 smooth-transition focus:ring-2 focus:ring-black/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="json" className="focus:bg-gray-100 focus:text-gray-900">
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  JSON
                </div>
              </SelectItem>
              <SelectItem value="yaml" className="focus:bg-gray-100 focus:text-gray-900">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  YAML
                </div>
              </SelectItem>
              <SelectItem value="xml" className="focus:bg-gray-100 focus:text-gray-900">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" />
                  XML
                </div>
              </SelectItem>
              <SelectItem value="text" className="focus:bg-gray-100 focus:text-gray-900">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Plain Text
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="tokenizer-model" className="text-gray-900 font-semibold text-sm tracking-wide flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Tokenizer Model
          </Label>
          <Select value={tokenizerModel} onValueChange={(value) => onTokenizerModelChange(value)}>
            <SelectTrigger id="tokenizer-model" className="bg-white border-gray-300 text-gray-900 hover:border-gray-400 smooth-transition focus:ring-2 focus:ring-black/10">
              <div className="flex items-center gap-2 w-full">
                <SelectValue />
                {isTokenizerLoading && (
                  <div className="ml-auto animate-spin rounded-full h-3 w-3 border-b-2 border-gray-900"></div>
                )}
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200 max-h-[300px]">
              {availableModels.map((model) => (
                <SelectItem key={model} value={model} className="focus:bg-gray-100 focus:text-gray-900">
                  <div className="flex items-center gap-2">
                    {model.includes('GPT') ? <Cpu className="w-3 h-3 text-green-600" /> : 
                     model.includes('Llama') ? <Brain className="w-3 h-3 text-blue-600" /> :
                     model.includes('Mistral') ? <Brain className="w-3 h-3 text-purple-600" /> :
                     <Brain className="w-3 h-3 text-gray-500" />}
                    {model}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="input-text" className="text-gray-900 font-semibold text-sm tracking-wide">
          Input Data
        </Label>
        <div className="relative">
          <Textarea
            id="input-text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Paste your ${inputType.toUpperCase()} here...`}
            className={`min-h-[320px] font-mono text-sm bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 hover:border-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 smooth-transition resize-none ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
            }`}
          />
          {value && (
            <div className="absolute top-3 right-3 bg-gray-100 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-700 border border-gray-300 font-medium">
              {value.split('\n').length} lines
            </div>
          )}
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 px-4 py-3 rounded-lg">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
