import { Type, type FunctionDeclaration, type Tool } from '@google/genai'

const updateDocByLine: FunctionDeclaration = {
    name: 'update_doc_by_line',
    description:
        'Replace content of specific line(s) in the document. Use this when user asks to change specific lines.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            start_line: {
                type: Type.INTEGER,
                description: 'Starting line number (1-indexed)',
            },
            end_line: {
                type: Type.INTEGER,
                description: 'Ending line number (inclusive)',
            },
            new_content: {
                type: Type.STRING,
                description: 'New content to replace the specified lines',
            },
        },
        required: ['start_line', 'end_line', 'new_content'],
    },
}

const updateDocByReplace: FunctionDeclaration = {
    name: 'update_doc_by_replace',
    description:
        'Find and replace text in the document. Use when user wants to replace specific words/phrases.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            old_string: {
                type: Type.STRING,
                description: 'Exact text to find (case-sensitive)',
            },
            new_string: {
                type: Type.STRING,
                description: 'Text to replace with',
            },
            occurrence: {
                type: Type.STRING,
                description: 'Which occurrence to replace: first, last, or all',
            },
        },
        required: ['old_string', 'new_string', 'occurrence'],
    },
}

const insertAtLine: FunctionDeclaration = {
    name: 'insert_at_line',
    description:
        'Insert new content at a specific line without replacing existing content.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            line_number: {
                type: Type.INTEGER,
                description: 'Line number where to insert (1-indexed)',
            },
            content: {
                type: Type.STRING,
                description: 'Content to insert',
            },
            position: {
                type: Type.STRING,
                description: 'Insert before or after the specified line',
            },
        },
        required: ['line_number', 'content', 'position'],
    },
}

const deleteLines: FunctionDeclaration = {
    name: 'delete_lines',
    description: 'Delete specific lines from the document.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            start_line: {
                type: Type.INTEGER,
                description: 'First line to delete (1-indexed)',
            },
            end_line: {
                type: Type.INTEGER,
                description: 'Last line to delete (inclusive)',
            },
        },
        required: ['start_line', 'end_line'],
    },
}

const appendToDocument: FunctionDeclaration = {
    name: 'append_to_document',
    description: 'Add content to the end of the document.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            content: {
                type: Type.STRING,
                description: 'Content to append',
            },
        },
        required: ['content'],
    },
}

export const functionTools: Tool[] = [
    {
        functionDeclarations: [
            updateDocByLine,
            updateDocByReplace,
            insertAtLine,
            deleteLines,
            appendToDocument,
        ],
    },
]
