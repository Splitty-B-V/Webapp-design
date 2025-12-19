'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useBill } from '@/contexts/BillContext'
import { useLanguage } from '@/contexts/LanguageContext'
import LanguageToggle from '@/components/LanguageToggle'

interface LandingViewProps {
  onViewBill: () => void
  onViewMenu: () => void
}

export default function LandingView({ onViewBill, onViewMenu }: LandingViewProps) {
  const { totalBill, orderItems } = useBill()
  const { t } = useLanguage()
  const [hasOrdered, setHasOrdered] = useState(true)
  const [isItemsExpanded, setIsItemsExpanded] = useState(false)

  // Get total items count
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#dcf5e5] relative" style={{ overscrollBehavior: 'none' }}>
      {/* Decorative side patterns */}
      <div
        className="fixed left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: 'calc((100vw - 500px) / 2)',
          minWidth: '50px',
          backgroundImage: 'url(/images/side-pattern.svg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-y',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />
      <div
        className="fixed right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: 'calc((100vw - 500px) / 2)',
          minWidth: '50px',
          backgroundImage: 'url(/images/side-pattern.svg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-y',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />

      {/* Debug Toggle Button - hidden on mobile */}
      <button
        onClick={() => setHasOrdered(!hasOrdered)}
        className="hidden md:block fixed left-2 top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-r-lg px-2 py-3 text-xs font-medium border border-l-0 border-gray-200"
      >
        <div className="flex flex-col items-center gap-1">
          <span className="text-gray-500">Test</span>
          <div className={`w-8 h-4 rounded-full transition-colors ${hasOrdered ? 'bg-emerald-500' : 'bg-gray-300'}`}>
            <div className={`w-3 h-3 bg-white rounded-full mt-0.5 transition-transform ${hasOrdered ? 'translate-x-4' : 'translate-x-0.5'}`} />
          </div>
          <span className={`${hasOrdered ? 'text-emerald-600' : 'text-gray-500'}`}>
            {hasOrdered ? 'Besteld' : 'Leeg'}
          </span>
        </div>
      </button>

      <div className="flex flex-col min-h-screen max-w-[500px] mx-auto w-full relative z-10" style={{ overscrollBehavior: 'none' }}>

        {/* Restaurant Banner */}
        <section
          className="relative w-full h-48 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://firebasestorage.googleapis.com/v0/b/sunday-dem.appspot.com/o/dbdebaf6-974f-4632-b60d-8edcd8017f04%2Fcover%2Fcover_800x452.jpeg?alt=media&token=e818cc4e-ab9c-41b4-88da-c92879caff1b")'
          }}
        >
          {/* Language Toggle */}
          <div className="absolute top-4 right-4 z-50">
            <LanguageToggle />
          </div>

          {/* Logo at bottom, overlapping into content */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-28 h-28 rounded-full bg-white bg-center bg-no-repeat bg-contain shadow-lg"
            style={{
              backgroundImage: 'url(/images/limon.jpeg)',
              backgroundSize: '80%'
            }}
          ></div>
        </section>

        {/* Main Content */}
        <main className="flex-1 flex flex-col bg-white">
          {/* Spacing for logo overlap */}
          <div className="h-16"></div>

          {/* Header with table info and amount */}
          <div className="border-b border-gray-100 px-4 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6">
            {hasOrdered ? (
              <>
                <div className="flex justify-between items-start mb-4 sm:mb-5">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <h1 className="text-gray-500 text-xs sm:text-sm font-medium">{t('table')} 1</h1>
                    </div>
                    <p className="text-gray-900 text-lg sm:text-xl font-semibold">{t('payableAmount') || 'Te betalen bedrag'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 text-2xl sm:text-3xl font-bold tracking-tight">€{totalBill.toFixed(2).replace('.', ',')}</p>
                  </div>
                </div>

                {/* Expandable Items Section */}
                <div>
                  {/* Clickable header */}
                  <button
                    onClick={() => setIsItemsExpanded(!isItemsExpanded)}
                    className="flex items-center gap-3 group"
                  >
                    <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 group-hover:bg-gray-200 transition-colors">
                      <span className="text-gray-900 text-sm font-medium">{totalItems} items</span>
                      <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isItemsExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <span className="text-gray-400 text-xs">{t('inclusiveOfTaxes') || 'Inclusief BTW'}</span>
                  </button>

                  {/* Expandable items list */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isItemsExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-1">
                        {orderItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between py-2"
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div className="bg-gray-100 text-gray-900 text-xs font-bold w-6 h-6 rounded flex items-center justify-center flex-shrink-0">
                                {item.quantity}
                              </div>
                              <div className="min-w-0">
                                <p className="text-black font-medium text-sm truncate">{item.name}</p>
                                <p className="text-gray-500 text-xs">€{item.unitPrice.toFixed(2).replace('.', ',')} {t('perUnit') || 'per stuk'}</p>
                              </div>
                            </div>
                            <span className="text-black font-semibold text-sm ml-4 flex-shrink-0">€{item.totalPrice.toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Empty state - nothing ordered */
              <div className="text-center py-2">
                {/* Table badge */}
                <div className="inline-flex items-center gap-2 bg-emerald-50 rounded-full px-4 py-2 mb-6">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">{t('table')} 1</span>
                </div>

                {/* Title */}
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1.5 sm:mb-2">{t('nothingOrderedYet') || 'Er is nog niets besteld!'} 🍽️</h1>
                <p className="text-gray-500 text-xs sm:text-sm">{t('askWaiterSpecialties') || 'Vraag een ober naar onze specialiteiten!'}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex-1 flex flex-col">
            <div className="px-4 py-5 sm:px-6 sm:py-6 space-y-2.5">
              {hasOrdered ? (
                <>
                  {/* Pay Now Button */}
                  <button
                    onClick={onViewBill}
                    className="w-full py-3.5 px-5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black active:scale-[0.98] transition-all"
                  >
                    {t('viewBillAndPay') || 'Bekijk rekening & betaal'}
                  </button>

                  {/* View Menu Button */}
                  <button
                    onClick={onViewMenu}
                    className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200 transition-all"
                  >
                    {t('viewMenu') || 'Bekijk menu'}
                  </button>
                </>
              ) : (
                /* View Menu Button only when nothing ordered */
                <button
                  onClick={onViewMenu}
                  className="w-full py-3 px-4 rounded-xl bg-gray-100 text-[#03d15f] font-semibold text-sm hover:bg-gray-200 transition-all"
                >
                  {t('viewMenu') || 'Bekijk menu'}
                </button>
              )}
            </div>

            {/* Splitty Branding */}
            <div className="mt-auto px-4 py-6 sm:px-6 sm:py-8">
              <div className="flex flex-col items-center mb-4 sm:mb-5">
                <Image
                  src="/images/logo-trans.png"
                  alt="Splitty"
                  width={60}
                  height={21}
                  className="mb-2 sm:mb-3 sm:w-20 sm:h-7"
                />
                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  {t('payWithSmile') || 'Betalen met een glimlach'} 😊
                </p>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 text-center">{t('poweredBy') || 'Powered by Splitty'}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
