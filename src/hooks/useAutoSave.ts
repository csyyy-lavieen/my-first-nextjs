'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useAutoSave(documentId: string | null, content: string) {
    const savedContentRef = useRef(content)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        if (!documentId) return
        if (content === savedContentRef.current) return

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(async () => {
            const { error } = await supabase
                .from('documents')
                .update({ content, updated_at: new Date().toISOString() })
                .eq('id', documentId)

            if (!error) {
                savedContentRef.current = content
            }
        }, 2000)

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [documentId, content])
}
