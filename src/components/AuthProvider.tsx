'use client'

import { createContext, useContext, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<{ error: string | null }>
    signUp: (email: string, password: string) => Promise<{ error: string | null }>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    signIn: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    // Start with loading=false so login form shows immediately (no auto getSession)
    const [loading, setLoading] = useState(false)

    const signIn = async (email: string, password: string) => {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                setLoading(false)
                if (error.status === 429) {
                    return { error: 'Too many requests. Tunggu 2-3 menit lalu coba lagi.' }
                }
                if (error.message.includes('Email not confirmed')) {
                    return { error: 'Email belum dikonfirmasi. Matikan "Confirm email" di Supabase → Authentication → Providers → Email.' }
                }
                return { error: error.message }
            }
            if (data?.user) {
                setUser(data.user)
            }
            setLoading(false)
            return { error: null }
        } catch (err) {
            setLoading(false)
            return { error: `Connection error: ${err}` }
        }
    }

    const signUp = async (email: string, password: string) => {
        setLoading(true)
        try {
            const { data, error } = await supabase.auth.signUp({ email, password })
            setLoading(false)
            if (error) {
                if (error.status === 429) {
                    return { error: 'Too many requests. Tunggu 2-3 menit lalu coba lagi.' }
                }
                return { error: error.message }
            }
            if (data?.user && data?.session) {
                setUser(data.user)
                return { error: null }
            }
            // No session = needs email confirmation
            return { error: 'Akun dibuat tapi perlu verifikasi email. Matikan "Confirm email" di Supabase settings jika tidak mau verifikasi.' }
        } catch (err) {
            setLoading(false)
            return { error: `Connection error: ${err}` }
        }
    }

    const signOut = async () => {
        try {
            await supabase.auth.signOut()
        } catch {
            // ignore signOut errors
        }
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
