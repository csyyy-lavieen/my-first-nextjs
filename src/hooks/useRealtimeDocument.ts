'use client'

import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useRealtimeDocument(
    documentId: string | null,
    onUpdate: (content: string) => void
) {
    const stableOnUpdate = useCallback(onUpdate, [onUpdate])

    useEffect(() => {
        if (!documentId) return

        const channel = supabase
            .channel(`document:${documentId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'documents',
                    filter: `id=eq.${documentId}`
                },
                (payload: { new: { content: string } }) => {
                    stableOnUpdate(payload.new.content)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [documentId, stableOnUpdate])
}
