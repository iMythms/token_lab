import { useState, useMemo, useEffect } from 'react'
import { InputArea } from './components/InputArea'
import { OutputPanel } from './components/OutputPanel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { parseInput, toYaml, toToon, toCsv, toXml, toCollapsedJson, toPrettyJson, type InputType } from './utils/converters'
import { countTokens, type TokenizerModel } from './utils/tokenizer'
import { Activity, Zap } from 'lucide-react'

function App() {
  const [input, setInput] = useState('')
  const [inputType, setInputType] = useState<InputType>('json')
  const [tokenizerModel, setTokenizerModel] = useState<TokenizerModel>('gpt-4o')
  const [parsed, setParsed] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!input.trim()) {
      setParsed(null)
      setError(null)
      return
    }
    try {
      const obj = parseInput(input, inputType)
      setParsed(obj)
      setError(null)
    } catch (e) {
      setParsed(null)
      setError((e as Error).message)
    }
  }, [input, inputType])

  const outputs = useMemo(() => {
    if (!parsed) return []

    const pretty = toPrettyJson(parsed)
    const collapsed = toCollapsedJson(parsed)
    const yaml = toYaml(parsed)
    const toon = toToon(parsed)
    const csv = toCsv(parsed)
    const xml = toXml(parsed)

    return [
      { id: 'pretty', title: 'Prettified JSON', content: pretty, language: 'json', tokens: countTokens(pretty, tokenizerModel) },
      { id: 'collapsed', title: 'Collapsed JSON', content: collapsed, language: 'json', tokens: countTokens(collapsed, tokenizerModel) },
      { id: 'yaml', title: 'YAML', content: yaml, language: 'yaml', tokens: countTokens(yaml, tokenizerModel) },
      { id: 'toon', title: 'TOON', content: toon, language: 'json', tokens: countTokens(toon, tokenizerModel), highlight: true },
      { id: 'csv', title: 'CSV', content: csv, language: 'plaintext', tokens: countTokens(csv, tokenizerModel) },
      { id: 'xml', title: 'XML', content: xml, language: 'xml', tokens: countTokens(xml, tokenizerModel) },
    ]
  }, [parsed, tokenizerModel])

  return (
    <div className="min-h-screen gradient-bg">
      <div className="container mx-auto py-12 px-4 space-y-10">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-black" />
            <h1 className="text-5xl font-bold text-black">
              Token Lab
            </h1>
            <Zap className="w-8 h-8 text-black" />
          </div>
          <p className="text-lg text-gray-600 font-normal max-w-2xl mx-auto">
            Compare object notation syntaxes and token counts across different formats
          </p>
        </header>

        {/* Main content card */}
        <div className="glass-strong rounded-2xl p-8 smooth-transition">
          <InputArea
            value={input}
            onChange={setInput}
            inputType={inputType}
            onInputTypeChange={setInputType}
            tokenizerModel={tokenizerModel}
            onTokenizerModelChange={setTokenizerModel}
            error={error}
          />
        </div>

        {parsed && outputs.length > 0 && (
          <div className="glass-strong rounded-2xl p-6 smooth-transition">
            <Tabs defaultValue="pretty" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-100 p-1.5 rounded-lg gap-1">
                {outputs.map((out) => (
                  <TabsTrigger
                    key={out.id}
                    value={out.id}
                    className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md smooth-transition relative font-medium"
                  >
                    {out.highlight && (
                      <Zap className="w-3 h-3 absolute -top-1 -right-1 text-black data-[state=active]:text-yellow-400" />
                    )}
                    {out.title.split(' ')[0]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {outputs.map((out) => (
                <TabsContent key={out.id} value={out.id} className="mt-6">
                  <OutputPanel
                    title={out.title}
                    content={out.content}
                    tokenCount={out.tokens}
                    language={out.language}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}

        {/* Footer stats */}
        {parsed && (
          <div className="glass rounded-xl p-4 text-center">
            <p className="text-sm text-gray-600">
              Powered by{' '}
              <span className="font-semibold text-gray-900">js-tiktoken</span>
              {' '} • Model:{' '}
              <span className="font-semibold text-gray-900">{tokenizerModel}</span>
              {' '} • {outputs.length} formats analyzed
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
