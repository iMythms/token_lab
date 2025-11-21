import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Hash } from 'lucide-react';

interface OutputPanelProps {
  title: string;
  content: string;
  tokenCount: number;
  language: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ title, content, tokenCount, language }) => {
  return (
    <Card className="flex flex-col h-full bg-white border-gray-200 smooth-transition hover:border-gray-300 hover:shadow-md">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-900">
          {title}
        </CardTitle>
        <Badge 
          variant="secondary" 
          className="bg-black text-white border-0 px-4 py-1.5 text-sm font-semibold hover:bg-gray-800 flex items-center gap-1.5"
        >
          <Hash className="w-3.5 h-3.5" />
          {tokenCount} tokens
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative overflow-hidden">
        <div className="max-h-[450px] overflow-auto">
          <SyntaxHighlighter
            language={language}
            style={prism}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              borderRadius: 0,
              fontSize: '13px',
              background: '#fafafa',
              lineHeight: '1.6',
            }}
            showLineNumbers={true}
            lineNumberStyle={{
              minWidth: '3em',
              paddingRight: '1em',
              color: '#9ca3af',
              userSelect: 'none',
            }}
            wrapLongLines={true}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
};
