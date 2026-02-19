import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { functionTools } from '@/lib/function-tools'
import { executeFunctionCall } from '@/lib/execute-function'

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

function formatDocumentForAI(content: string): string {
    const lines = content.split('\n')
    return lines.map((line, i) => `${i + 1}. ${line}`).join('\n')
}

export async function POST(request: NextRequest) {
    try {
        const { messages, documentContent, file } = await request.json()

        const documentWithLines = formatDocumentForAI(documentContent)
        const lineCount = documentContent.split('\n').length

        const systemPrompt = `You are a helpful AI assistant for a document editor, similar to Cursor IDE.

**CURRENT DOCUMENT (${lineCount} lines):**
\`\`\`
${documentWithLines}
\`\`\`

You have tools to manipulate the document:
- update_doc_by_line: Replace specific lines (use start_line and end_line, 1-indexed)
- update_doc_by_replace: Find and replace text strings
- insert_at_line: Insert new content before or after a specific line
- delete_lines: Remove specific lines
- append_to_document: Add content at the end

Rules:
1. Always check the current document state above before making changes
2. Be precise with line numbers (1-indexed)
3. When the user asks to edit, use the appropriate tool
4. Confirm your changes after editing
5. If the document is empty, use append_to_document to add content`

        // Build content parts for the user message
        const userMessage = messages[messages.length - 1]
        const contentParts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = []

        // Add file if present (multimodal)
        if (file) {
            const base64Data = file.data.split(',')[1]
            contentParts.push({
                inlineData: {
                    mimeType: file.type,
                    data: base64Data,
                },
            })
        }

        contentParts.push({ text: userMessage.content })

        // Build conversation history
        const conversationContents = [
            { role: 'user' as const, parts: [{ text: systemPrompt }] },
            {
                role: 'model' as const,
                parts: [
                    {
                        text: "I understand. I'm ready to help you edit your document. I can see the current document content with line numbers. What would you like me to do?",
                    },
                ],
            },
            ...messages.slice(0, -1).map((m: { role: string; content: string }) => ({
                role: (m.role === 'user' ? 'user' : 'model') as 'user' | 'model',
                parts: [{ text: m.content }],
            })),
            {
                role: 'user' as const,
                parts: contentParts,
            },
        ]

        // First call with function tools
        let response = await genai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: conversationContents,
            config: {
                tools: functionTools,
            },
        })

        // Check if AI wants to call a function
        const candidate = response.candidates?.[0]
        const parts = candidate?.content?.parts || []
        const functionCallPart = parts.find(
            (p: { functionCall?: unknown }) => p.functionCall
        )

        if (functionCallPart?.functionCall) {
            const fc = functionCallPart.functionCall
            const fcName = fc.name!
            const fcArgs = (fc.args || {}) as Record<string, unknown>

            console.log('Function call:', fcName, fcArgs)

            // Execute the function
            const executionResult = executeFunctionCall(fcName, fcArgs, documentContent)

            if (!executionResult.success) {
                return NextResponse.json({
                    message: {
                        role: 'assistant',
                        content: `❌ Error: ${executionResult.error}`,
                        functionCall: { name: fcName, args: fcArgs },
                    },
                })
            }

            // Send result back to AI with UPDATED document state
            const newDocumentWithLines = formatDocumentForAI(executionResult.newContent!)
            const newLineCount = executionResult.newContent!.split('\n').length

            const followUpContents = [
                {
                    role: 'user' as const,
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model' as const,
                    parts: [
                        {
                            text: "I understand. I'm ready to help you edit your document.",
                        },
                    ],
                },
                {
                    role: 'user' as const,
                    parts: contentParts,
                },
                {
                    role: 'model' as const,
                    parts: [{ functionCall: { name: fcName, args: fcArgs } }],
                },
                {
                    role: 'user' as const,
                    parts: [
                        {
                            functionResponse: {
                                name: fcName,
                                response: {
                                    success: true,
                                    updatedDocument: newDocumentWithLines,
                                    totalLines: newLineCount,
                                },
                            },
                        },
                    ],
                },
            ]

            response = await genai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: followUpContents,
            })

            return NextResponse.json({
                message: {
                    role: 'assistant',
                    content: response.text || '✅ Document updated!',
                    functionCall: { name: fcName, args: fcArgs },
                },
                newDocumentContent: executionResult.newContent,
            })
        }

        // No function call, normal chat response
        return NextResponse.json({
            message: {
                role: 'assistant',
                content: response.text || 'No response generated.',
            },
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('AI Editor API error:', message)
        return NextResponse.json(
            { error: 'Failed to process request', details: message },
            { status: 500 }
        )
    }
}
