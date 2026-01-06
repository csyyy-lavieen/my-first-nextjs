import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

// Inisialisasi Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// System prompt - GANTI SESUAI PERSONALITY BOT KAMU!
const SYSTEM_PROMPT = `Kamu adalah Putra Bot, asisten virtual AI yang cerdas dan berpengetahuan luas untuk website portfolio Andi Putra Fathahillah.

TENTANG ANDI PUTRA FATHAHILLAH:
- Seorang siswa SMK berbakat yang sedang magang di Ashari Tech
- Lahir di Makassar pada tanggal 24 Agustus 2008, tinggal di Makassar
- Bersekolah di SMK Telkom Makassar jurusan RPL 
- Sedang belajar web development dengan Next.js
- Senang belajar UI/UX Design
- Ini adalah website portofolio pribadi untuk menampilkan karya dan skill
- Hobi: Main Game, Nonton Film, Membaca Buku, Mendengarkan Musik
- Skill: CSS, Tailwind CSS, Next.js, React, UI/UX Design

KEMAMPUAN KAMU:
- Kamu bisa menjawab pertanyaan umum tentang programming, web development, dan ui/ux design
- Kamu bisa memberikan tips dan saran tentang belajar coding
- Kamu bisa menjelaskan konsep teknis dengan bahasa yang mudah dipahami
- Kamu sangat mengenal Andi Putra dan bisa menceritakan tentang dia

CARA KAMU MENJAWAB:
- Gunakan bahasa Indonesia yang santai, ramah, tapi tetap informatif
- Jawab dengan jelas dan terstruktur
- JANGAN pernah menggunakan tanda kutip di awal atau akhir jawaban
- JANGAN membungkus jawabanmu dengan tanda petik atau quote marks
- Langsung jawab tanpa awalan tanda baca aneh
- Berikan jawaban yang helpful dan detailed ketika diperlukan
- Gunakan emoji sederhana seperti 😊 👋 ✨ 💡 🚀 untuk percakapan friendly
- Kalau tidak tahu, bilang dengan jujur dan tawarkan bantuan lain

LARANGAN:
- Jangan gunakan tanda kutip untuk membungkus respons
- Jangan gunakan emoji bintang {*}
- Jangan menjawab pertanyaan tidak pantas atau berbahaya
- Jangan berpura-pura menjadi orang lain selain Putra Bot
- Jangan memberikan informasi pribadi yang sensitif`

// Helper function untuk delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Function untuk generate content dengan retry
async function generateWithRetry(model: any, contents: any, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await model.generateContent({ contents })
            return result
        } catch (error: any) {
            // Check if it's a rate limit error (429)
            if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
                if (attempt < maxRetries) {
                    // Wait dengan exponential backoff: 2s, 4s, 8s...
                    const waitTime = Math.pow(2, attempt) * 1000
                    console.log(`Rate limited. Waiting ${waitTime / 1000}s before retry ${attempt + 1}/${maxRetries}...`)
                    await delay(waitTime)
                    continue
                }
            }
            throw error
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        // Ambil message dari request body
        const { message, history } = await request.json()

        // Validasi input
        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Buat conversation history untuk context
        const conversationHistory = history?.map((msg: { role: string; content: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        })) || []

        // Generate response dari Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const contents = [
            // System instruction
            {
                role: 'user',
                parts: [{ text: SYSTEM_PROMPT }],
            },
            {
                role: 'model',
                parts: [{ text: 'Baik, saya mengerti. Saya akan menjadi asisten yang ramah dan helpful sesuai instruksi.' }],
            },
            // Previous conversation history
            ...conversationHistory,
            // Current user message
            {
                role: 'user',
                parts: [{ text: message }],
            },
        ]

        // Generate dengan retry
        const result = await generateWithRetry(model, contents, 3)

        // Ambil text response
        const aiResponse = result.response.text()

        // Return response
        return NextResponse.json({
            success: true,
            message: aiResponse,
        })

    } catch (error: any) {
        console.error('Gemini API Error:', error)

        // Handle rate limit error
        if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('Too Many Requests')) {
            return NextResponse.json(
                { error: 'Terlalu banyak request. Tunggu beberapa detik dan coba lagi ya! ⏳' },
                { status: 429 }
            )
        }

        // Handle API key errors
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: 'API key tidak valid. Pastikan GEMINI_API_KEY sudah benar.' },
                    { status: 401 }
                )
            }
        }

        return NextResponse.json(
            { error: 'Gagal mendapatkan response dari AI. Coba lagi nanti.' },
            { status: 500 }
        )
    }
}