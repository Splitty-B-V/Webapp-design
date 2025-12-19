'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function PayEquallyPage() {
  const { t } = useLanguage()
  const [currentView, setCurrentView] = useState<'split-count' | 'pay-for-people'>('split-count')
  const [splitCount, setSplitCount] = useState(6)
  const [payingFor, setPayingFor] = useState(0)
  const [othersSelecting] = useState(2) // Simulated websocket data
  const [othersPayingFor] = useState(1) // Simulated websocket data - currently selecting
  const [alreadyPaid] = useState(1) // Simulated websocket data - already paid
  
  const totalAmount = 122.60
  const perPersonAmount = totalAmount / splitCount
  const maxSelectablePeople = splitCount - othersPayingFor - alreadyPaid
  const totalPeopleSelected = payingFor + othersPayingFor + alreadyPaid
  const remainingAvailable = splitCount - totalPeopleSelected // People still available to be selected
  const progressPercentage = (totalPeopleSelected / splitCount) * 100

  const handleUpdateSplit = () => {
    setCurrentView('pay-for-people')
  }

  const handleChangeSplit = () => {
    setCurrentView('split-count')
    setPayingFor(0) // Reset selection when going back
  }

  if (currentView === 'split-count') {
    return (
      <div className="max-w-[500px] mx-auto bg-white rounded-t-[20px] max-h-[95vh] overflow-hidden animate-slide-up flex flex-col" style={{ touchAction: 'pan-y', overscrollBehavior: 'contain', scrollBehavior: 'smooth' }}>
        <h2 id="split-bill-title" className="sr-only">{t('splitBill')}</h2>
        <p id="split-bill-description" className="sr-only">{t('howToSplit')}</p>
        <div className="sticky top-0 left-0 right-0 bg-white rounded-t-[20px] z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="w-10"></div>
            <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Close" type="button">
              <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <div className="flex flex-col h-full" style={{ maxHeight: 'calc(-100px + 95vh)' }}>
              <div className="flex-shrink-0 pt-4 pb-3 px-4 sm:pt-6 sm:pb-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10"></div>
                  <h2 className="text-lg sm:text-xl font-bold text-black">{t('splitEqually')}</h2>
                  <div className="w-10"></div>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 text-center">{t('howManyPeopleSplitting')}</p>
                
                {/* Live indicator - cleaner design */}
                {othersSelecting > 0 && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-xs text-blue-700">{othersSelecting} {othersSelecting === 1 ? t('personChoosing') : t('peopleChoosing')}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 px-4 py-3 sm:py-6 overflow-y-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                  <h3 className="text-center text-xs sm:text-sm font-medium text-gray-600 mb-4 sm:mb-6">{t('numberOfPeople')}</h3>
                  <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <button 
                      onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                      className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:shadow-sm"
                      disabled={splitCount <= 2}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                      </svg>
                    </button>
                    <div className="bg-white rounded-2xl px-6 py-3 sm:px-8 sm:py-4 shadow-lg">
                      <span className="text-3xl sm:text-5xl font-bold text-black">{splitCount}</span>
                    </div>
                    <button 
                      onClick={() => setSplitCount(splitCount + 1)}
                      className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-xs sm:text-sm">{t('totalAmount')}</span>
                        <span className="font-semibold text-black text-sm sm:text-base">€{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                      <p className="text-center text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">{t('perPerson')}</p>
                      <p className="text-center text-2xl sm:text-3xl font-bold text-green-700">€{perPersonAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 sm:p-4">
                <button 
                  onClick={handleUpdateSplit}
                  className="w-full py-3 px-4 sm:py-4 sm:px-6 bg-black text-white rounded-2xl font-medium text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {t('continue')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[500px] mx-auto bg-white rounded-t-[20px] max-h-[95vh] overflow-hidden animate-slide-up flex flex-col" style={{ touchAction: 'pan-y', overscrollBehavior: 'contain', scrollBehavior: 'smooth' }}>
      <h2 id="split-bill-title" className="sr-only">Split the bill</h2>
      <p id="split-bill-description" className="sr-only">Choose how you want to pay</p>
      <div className="sticky top-0 left-0 right-0 bg-white rounded-t-[20px] z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="w-10"></div>
          <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Close" type="button">
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full">
          <div className="flex flex-col h-full" style={{ maxHeight: 'calc(-100px + 85vh)' }}>
            <div className="flex-shrink-0 pt-4 pb-2 px-4 sm:pt-5 sm:pb-2">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-10"></div>
                <h2 className="text-lg sm:text-xl font-bold text-black">{t('payForPeople')}</h2>
                <div className="w-10"></div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 text-center mb-3">{t('howManyPayingFor')}</p>
              
              {/* Split info card with change button */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mx-auto max-w-xs">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 mb-0.5">{t('billDividedBy')}</p>
                    <p className="text-sm font-bold text-gray-900">{splitCount} {splitCount === 1 ? t('person') : t('people')} • €{perPersonAmount.toFixed(2)} {t('each')}</p>
                  </div>
                  <button 
                    onClick={handleChangeSplit}
                    className="px-3 py-1.5 bg-gray-600 text-white text-xs font-medium rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t('change')}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1 px-4 pt-2 pb-3 sm:pt-2 sm:pb-6 overflow-y-auto">
              <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                {/* Progress bar with live status */}
                <div className="mb-6 sm:mb-8">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                    {/* Already paid - green */}
                    {alreadyPaid > 0 && (
                      <div 
                        className="absolute h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                        style={{ width: `${(alreadyPaid / splitCount) * 100}%` }}
                      />
                    )}
                    {/* Others currently selecting - gray */}
                    {othersPayingFor > 0 && (
                      <div 
                        className="absolute h-full bg-gradient-to-r from-gray-400 to-gray-500 transition-all duration-500"
                        style={{ 
                          left: `${(alreadyPaid / splitCount) * 100}%`,
                          width: `${(othersPayingFor / splitCount) * 100}%` 
                        }}
                      />
                    )}
                    {/* Your selection - blue */}
                    {payingFor > 0 && (
                      <div 
                        className="absolute h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out"
                        style={{ 
                          left: `${((alreadyPaid + othersPayingFor) / splitCount) * 100}%`,
                          width: `${(payingFor / splitCount) * 100}%` 
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-2 sm:mt-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {othersSelecting > 0 && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                      )}
                      <span className="text-xs sm:text-sm font-medium text-gray-700">{totalPeopleSelected} {t('of')} {splitCount} {t('selected')}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-green-600">{Math.round(progressPercentage)}%</span>
                  </div>
                  {/* Websocket info integrated */}
                  {othersSelecting > 0 && (
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                        {othersSelecting} {othersSelecting === 1 ? t('personChoosing') : t('peopleChoosing')}
                      </span>
                      <span className="font-medium text-gray-700">{remainingAvailable} {remainingAvailable === 1 ? t('spotLeft') : t('spotsLeft')}</span>
                    </div>
                  )}
                </div>
                
                {/* Number selector */}
                <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <button 
                    onClick={() => setPayingFor(Math.max(0, payingFor - 1))}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:shadow-sm"
                    disabled={payingFor <= 0}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                    </svg>
                  </button>
                  <div className="bg-white rounded-2xl px-6 py-3 sm:px-8 sm:py-4 shadow-lg">
                    <span className="text-3xl sm:text-5xl font-bold text-black">{payingFor}</span>
                  </div>
                  <button 
                    onClick={() => setPayingFor(Math.min(maxSelectablePeople, payingFor + 1))}
                    className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:shadow-sm"
                    disabled={payingFor >= maxSelectablePeople}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </button>
                </div>
                
                {/* Amount cards */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-white rounded-xl p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">{t('perPerson')}</p>
                      <p className="text-base sm:text-lg font-semibold text-black">€{perPersonAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">{t('totalAmount')}</p>
                      <p className="text-base sm:text-lg font-semibold text-black">€{totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className={`${payingFor > 0 ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gray-100 border-gray-300'} border rounded-xl sm:rounded-2xl p-4 sm:p-6`}>
                    <p className="text-center text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                      {payingFor > 0 ? `${t('youPayFor')} ${payingFor} ${payingFor === 1 ? t('person') : t('people')}` : t('notPayingForAnyone')}
                    </p>
                    <p className={`text-center text-2xl sm:text-3xl font-bold ${payingFor > 0 ? 'text-green-700' : 'text-gray-500'}`}>
                      €{(payingFor * perPersonAmount).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-100 rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">{t('stillToBePaid')}</p>
                        <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">{splitCount - totalPeopleSelected} {(splitCount - totalPeopleSelected) === 1 ? t('person') : t('people')}</p>
                      </div>
                      <p className="text-base sm:text-lg font-semibold text-gray-800">€{((splitCount - totalPeopleSelected) * perPersonAmount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 bg-white border-t border-gray-100 p-3 sm:p-4">
              <button 
                disabled={payingFor === 0}
                className={`w-full py-3 px-4 sm:py-4 sm:px-6 ${payingFor > 0 ? 'bg-black text-white hover:scale-[1.02] active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'} rounded-2xl font-medium text-sm sm:text-base transition-all duration-200`}
              >
                {payingFor === 0 ? t('selectAtLeastOnePerson') : t('continueToTip')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}