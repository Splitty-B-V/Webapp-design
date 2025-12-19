'use client'

import { useState, useEffect } from 'react'
import { useBill } from '@/contexts/BillContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface CustomAmountViewProps {
  total: number
  onBack: () => void
  onContinue: (amount: number) => void
}

export default function CustomAmountView({ total, onBack, onContinue }: CustomAmountViewProps) {
  const { paidAmount, remainingAmount } = useBill()
  const { t } = useLanguage()
  const alreadyPaid = paidAmount
  const remaining = remainingAmount
  
  // Calculate default cents from remaining amount
  const remainingCents = Math.round((remaining % 1) * 100)
  
  const [euros, setEuros] = useState('')
  const [cents, setCents] = useState(remainingCents.toString().padStart(2, '0'))
  const [isTyping, setIsTyping] = useState(false)
  
  const enteredAmount = euros || cents ? 
    parseFloat(`${euros || '0'}.${cents.padEnd(2, '0')}`) : 0
  const progressPercentage = (alreadyPaid / total) * 100
  const newProgressPercentage = ((alreadyPaid + enteredAmount) / total) * 100
  
  // Allow any amount > 0 and <= remaining
  const isValidAmount = enteredAmount > 0 && enteredAmount <= remaining

  const handleEurosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    const euros = value ? parseInt(value) : 0
    const remainingEuros = Math.floor(remaining)
    
    // Cap at remaining euros if exceeding
    if (euros > remainingEuros) {
      setEuros(remainingEuros.toString())
      setCents(Math.round((remaining - remainingEuros) * 100).toString().padStart(2, '0'))
    } else {
      setEuros(value)
      // If we're at max euros, check if cents would exceed
      if (euros === remainingEuros) {
        const maxCents = Math.round((remaining - remainingEuros) * 100)
        const currentCents = cents ? parseInt(cents) : 0
        if (currentCents > maxCents) {
          setCents(maxCents.toString().padStart(2, '0'))
        }
      }
    }
    setIsTyping(true)
  }

  const handleCentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
    const currentEuros = euros ? parseInt(euros) : 0
    const remainingEuros = Math.floor(remaining)
    
    // If we're at max euros, limit cents
    if (currentEuros === remainingEuros) {
      const maxCents = Math.round((remaining - remainingEuros) * 100)
      const newCents = value ? parseInt(value) : 0
      if (newCents > maxCents) {
        setCents(maxCents.toString().padStart(2, '0'))
      } else {
        setCents(value)
      }
    } else if (currentEuros > remainingEuros) {
      // If euros exceed remaining, set to max
      setEuros(remainingEuros.toString())
      setCents(Math.round((remaining - remainingEuros) * 100).toString().padStart(2, '0'))
    } else {
      setCents(value)
    }
    setIsTyping(true)
  }

  // Preset amount buttons - including amounts that might exceed remaining
  const presetAmounts = [
    { label: '€10', amount: 10 },
    { label: '€25', amount: 25 },
    { label: '€50', amount: 50 },
    { label: `€${remaining.toFixed(2).replace('.', ',')}`, amount: remaining }
  ]

  const setPresetAmount = (amount: number) => {
    // Cap preset amount at remaining if it exceeds
    const cappedAmount = Math.min(amount, remaining)
    const eurosPart = Math.floor(cappedAmount)
    // Don't change cents - keep the default remaining cents
    setEuros(eurosPart.toString())
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col h-full" style={{ maxHeight: 'calc(95vh - 100px)' }}>
      {/* Header */}
      <div className="flex-shrink-0 pt-4 pb-3 px-4 sm:pt-6 sm:pb-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <button 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            onClick={onBack}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-black">{t('customAmount')}</h2>
          <div className="w-10"></div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          {t('enterAmount')}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pb-3 sm:pb-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Bill status */}
        <div className="mb-4 sm:mb-6">
          {/* Remaining to pay - highlighted */}
          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full mb-2 sm:mb-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <p className="text-[10px] sm:text-xs font-semibold text-orange-700 uppercase tracking-wide">{t('outstandingAmount')}</p>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">€{remaining.toFixed(2).replace('.', ',')}</p>
              <div className="flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">{t('total')}</span>
                  <span className="font-medium text-gray-700">€{total.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className="w-px h-3 bg-gray-300"></div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-500">{t('paidAmount')}</span>
                  <span className="font-medium text-green-600">€{alreadyPaid.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amount input section */}
        <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-2">
              <span className="text-3xl sm:text-5xl font-bold text-gray-900">€</span>
              <div className="flex items-baseline">
                <input 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="0"
                  className="w-20 sm:w-24 text-3xl sm:text-5xl font-bold text-black outline-none text-center bg-transparent placeholder-gray-300"
                  style={{ fontSize: '28px' }}
                  type="text"
                  value={euros}
                  onChange={handleEurosChange}
                />
                <span className="text-2xl sm:text-3xl font-bold text-black">,</span>
                <input 
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="00"
                  className="w-12 sm:w-16 text-2xl sm:text-3xl font-bold text-black outline-none bg-transparent placeholder-gray-300"
                  style={{ fontSize: '24px' }}
                  type="text"
                  value={cents}
                  onChange={handleCentsChange}
                  maxLength={2}
                />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              {t('enterAmount')} (max €{remaining.toFixed(2).replace('.', ',')})
            </p>
          </div>

          {/* Preset amount buttons */}
          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setPresetAmount(preset.amount)}
                className="py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom section */}
      <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 p-3 sm:p-4">
        {enteredAmount > 0 && (
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-xs sm:text-sm text-gray-600">{t('youPay')}</span>
            <span className="text-lg sm:text-xl font-bold text-black">€{enteredAmount.toFixed(2).replace('.', ',')}</span>
          </div>
        )}
        <button 
          disabled={!isValidAmount}
          className={`w-full py-3 px-4 sm:py-4 sm:px-6 rounded-2xl font-medium text-sm sm:text-base transition-all duration-200 ${
            isValidAmount 
              ? 'bg-black text-white hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => isValidAmount && onContinue(enteredAmount)}
        >
          {!enteredAmount ? t('enterAmount') : t('continueToTip')}
        </button>
      </div>
    </div>
  )
}