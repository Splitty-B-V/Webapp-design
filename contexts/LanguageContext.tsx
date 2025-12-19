'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { t as translate } from '@/lib/i18n'

interface LanguageContextType {
  locale: string
  language: string
  setLocale: (locale: string) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState('nl')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Only run on client side
    setIsClient(true)
    const savedLocale = localStorage.getItem('locale') || 'nl'
    setLocale(savedLocale)
  }, [])

  useEffect(() => {
    // Update localStorage whenever locale changes (only on client)
    if (isClient) {
      localStorage.setItem('locale', locale)
    }
  }, [locale, isClient])

  const t = (key: string) => translate(key, locale)

  return (
    <LanguageContext.Provider value={{ locale, language: locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}