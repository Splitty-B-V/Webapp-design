'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useBill } from '@/contexts/BillContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface PaymentMethodViewProps {
  totalAmount: number
  subtotal: number
  serviceFee: number
  tipAmount: number
  splitMode?: string
  selectedItems?: { name: string; quantity: number; price: number }[]
  peopleCount?: number
  onBack: () => void
  onPay: () => void
}

export default function PaymentMethodView({ 
  totalAmount, 
  subtotal,
  serviceFee,
  tipAmount,
  splitMode = 'Onbekend',
  selectedItems,
  peopleCount,
  onBack, 
  onPay 
}: PaymentMethodViewProps) {
  const router = useRouter()
  const { addPayment, remainingAmount } = useBill()
  const { t } = useLanguage()
  const [selectedMethod, setSelectedMethod] = useState<'ideal' | 'apple' | 'card'>('ideal')
  const [timeRemaining, setTimeRemaining] = useState(300) // 5 minutes in seconds
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const progressPercentage = (timeRemaining / 300) * 100

  const paymentMethods = [
    { 
      id: 'ideal', 
      name: 'iDEAL', 
      description: t('idealDescription') || 'Betaal direct vanuit je Nederlandse bankrekening',
      icon: '/images/ideal.png', 
      isImage: true,
      bgColor: 'bg-orange-50',
      iconColor: null
    },
    { 
      id: 'apple', 
      name: 'Apple Pay', 
      description: t('applePayDescription') || 'Betaal snel en veilig met Apple Pay',
      icon: null, 
      isImage: false,
      bgColor: 'bg-gray-100',
      iconColor: null
    },
    { 
      id: 'card', 
      name: 'Creditcard', 
      description: t('cardDescription') || 'Betaal met je creditcard of debitcard',
      icon: null, 
      isImage: false,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
  ]

  return (
    <div className="flex flex-col h-full" style={{ maxHeight: 'calc(85vh - 100px)' }}>
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
          <h2 className="text-lg sm:text-xl font-bold text-black">{t('checkout') || t('pay')}</h2>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 pb-3 sm:pb-4 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {/* Timer card */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xl sm:text-2xl">⏱️</span>
              <span className="font-medium text-gray-700 text-sm sm:text-base">{t('timeToComplete') || 'Tijd om af te ronden'}</span>
            </div>
            <span className="text-xl sm:text-2xl font-bold text-orange-600">{formatTime(timeRemaining)}</span>
          </div>
          <div className="h-2 w-full bg-orange-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Payment summary */}
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">{t('overview') || 'Overzicht'}</h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs sm:text-sm">{t('subtotal') || 'Subtotaal'}</span>
              <span className="font-medium text-gray-900 text-sm sm:text-base">€{subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-gray-600 text-xs sm:text-sm">{t('serviceFee')}</span>
                <div className="group relative">
                  <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="absolute bottom-full right-0 mb-2 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-900 text-white text-[10px] sm:text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    {t('appServiceFee') || 'App servicekosten'}
                  </div>
                </div>
              </div>
              <span className="font-medium text-gray-900 text-sm sm:text-base">€{serviceFee.toFixed(2).replace('.', ',')}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-gray-600 text-xs sm:text-sm">{t('tip')}</span>
                  <span className="text-lg sm:text-xl">💝</span>
                </div>
                <span className="font-medium text-green-600 text-sm sm:text-base">€{tipAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="pt-2 mt-2 sm:pt-3 sm:mt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 text-sm sm:text-base">{t('total')}</span>
                <span className="text-xl sm:text-2xl font-bold text-black">€{totalAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">{t('paymentMethod')}</h3>
          <div className="space-y-2 sm:space-y-3">
            {/* iDEAL */}
            <button
              onClick={() => setSelectedMethod('ideal')}
              className={`w-full p-2.5 sm:p-3 rounded-xl border transition-all duration-200 ${
                selectedMethod === 'ideal'
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                    selectedMethod === 'ideal' 
                      ? 'border-gray-900 bg-gray-900' 
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'ideal' && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-grow text-left">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">iDEAL</h4>
                </div>
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-orange-50">
                  <img
                    alt="iDEAL"
                    className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    src="/images/ideal.png"
                  />
                </div>
              </div>
            </button>

            {/* Apple Pay */}
            <button
              onClick={() => setSelectedMethod('apple')}
              className={`w-full p-2.5 sm:p-3 rounded-xl border transition-all duration-200 ${
                selectedMethod === 'apple'
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                    selectedMethod === 'apple' 
                      ? 'border-gray-900 bg-gray-900' 
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'apple' && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-grow text-left">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Apple Pay</h4>
                </div>
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-gray-100">
                  <Image
                    alt="Apple Pay"
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
                    src="/images/apple-pay.png"
                  />
                </div>
              </div>
            </button>

            {/* Credit Card */}
            <button
              onClick={() => setSelectedMethod('card')}
              className={`w-full p-2.5 sm:p-3 rounded-xl border transition-all duration-200 ${
                selectedMethod === 'card'
                  ? 'bg-gray-50 border-gray-900'
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex-shrink-0">
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 ${
                    selectedMethod === 'card' 
                      ? 'border-gray-900 bg-gray-900' 
                      : 'border-gray-300'
                  }`}>
                    {selectedMethod === 'card' && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-grow text-left">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Creditcard</h4>
                </div>
                <div className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-blue-50">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section with payment button */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 sm:p-4">
        <button
          type="button"
          className="w-full py-3 px-4 sm:py-4 sm:px-6 bg-black text-white rounded-2xl font-medium text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
          onClick={async () => {
            try {
              // Cap the payment amount at the remaining bill amount
              const actualPaymentAmount = Math.min(subtotal, remainingAmount)
              
              if (actualPaymentAmount <= 0) {
                alert(t('billAlreadyPaid') || 'De rekening is al volledig betaald!')
                router.push('/')
                return
              }
              
              // Add payment to context
              addPayment({
                amount: actualPaymentAmount,
                tipAmount: tipAmount,
                serviceFee: serviceFee,
                total: actualPaymentAmount + serviceFee + tipAmount,
                splitMode: splitMode,
                items: selectedItems,
                peopleCount: peopleCount
              })
              
              // Create payment data URL params
              const params = new URLSearchParams({
                paymentId: `payment_${Date.now()}`,
                amount: actualPaymentAmount.toString(),
                serviceFee: serviceFee.toString(),
                tip: tipAmount.toString(),
                total: (actualPaymentAmount + serviceFee + tipAmount).toString(),
                splitMode: splitMode
              })
              
              // Redirect to thank you page with payment details
              router.push(`/thank-you/?${params.toString()}`)
            } catch (error) {
              console.error('Payment error:', error)
              alert(t('somethingWentWrong') || 'Er is iets misgegaan. Probeer het opnieuw.')
            }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            {t('payWith')} {selectedMethod === 'ideal' ? 'iDEAL' : selectedMethod === 'apple' ? 'Apple Pay' : t('creditCard') || 'Creditcard'}
          </span>
        </button>
      </div>
    </div>
  )
}