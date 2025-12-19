'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

interface SplitEquallyViewProps {
  total: number
  onBack: () => void
  onContinue: (amount: number) => void
}

export default function SplitEquallyView({ total, onBack, onContinue }: SplitEquallyViewProps) {
  const [numberOfPeople, setNumberOfPeople] = useState(2)
  const { t } = useLanguage()
  
  const perPersonAmount = total / numberOfPeople

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
          <h2 className="text-lg sm:text-xl font-bold text-black">{t('splitEqually')}</h2>
          <div className="w-10"></div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 text-center">
          {t('withHowManyPeople')}
        </p>
      </div>

      {/* Main content */}
      <div className="flex-1 px-4 py-3 sm:py-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
          <h3 className="text-center text-xs sm:text-sm font-medium text-gray-600 mb-4 sm:mb-6">{t('people')}</h3>
          
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
            <button 
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:shadow-sm"
              onClick={() => setNumberOfPeople(Math.max(2, numberOfPeople - 1))}
              disabled={numberOfPeople <= 2}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
            
            <div className="bg-white rounded-2xl px-6 py-3 sm:px-8 sm:py-4 shadow-lg">
              <span className="text-3xl sm:text-5xl font-bold text-black">{numberOfPeople}</span>
            </div>
            
            <button 
              className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setNumberOfPeople(numberOfPeople + 1)}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {/* Total amount */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-xs sm:text-sm">{t('totalAmount')}</span>
                <span className="font-semibold text-black text-sm sm:text-base">€{total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            {/* Per person amount */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <p className="text-center text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                {t('perPerson')}
              </p>
              <p className="text-center text-2xl sm:text-3xl font-bold text-green-700">
                €{perPersonAmount.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section inside modal */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 sm:p-4">
        <button 
          className="w-full py-3 px-4 sm:py-4 sm:px-6 bg-black text-white rounded-2xl font-medium text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          onClick={() => onContinue(numberOfPeople)}
        >
          {t('continueToTip')}
        </button>
      </div>
    </div>
  )
}