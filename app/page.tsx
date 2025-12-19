'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Footer from '@/components/Footer'
import ActionButtons from '@/components/ActionButtons'
import BTWSummary from '@/components/BTWSummary'
import { processOrderItems, calculateTotalBTW } from '@/lib/btw-calculator'
import { useBill } from '@/contexts/BillContext'
import { useLanguage } from '@/contexts/LanguageContext'
import BillFullyPaidView from '@/components/BillFullyPaidView'
import LanguageToggle from '@/components/LanguageToggle'
import LandingView from '@/components/LandingView'
import MenuView from '@/components/MenuView'

type ViewState = 'loading' | 'landing' | 'bill'

export default function BillPage() {
  const { orderItems, totalBill, paidAmount, remainingAmount, isFullyPaid, activeSplitMode, resetBill } = useBill()
  const { t } = useLanguage()
  const [currentView, setCurrentView] = useState<ViewState>('loading')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Handle loading
    const loadTimer = setTimeout(() => {
      setCurrentView('landing')
    }, 1500) // Show loading screen for 1.5 seconds

    return () => {
      clearTimeout(loadTimer)
    }
  }, [])
  
  const subtotal = totalBill
  const total = subtotal
  
  // Calculate BTW with proper rates
  const processedItems = processOrderItems(orderItems)
  const { totalBTW, btwBreakdown } = calculateTotalBTW(processedItems)
  
  const paidPercentage = Math.round((paidAmount / total) * 100)
  
  // Handle menu button click - opens menu drawer
  const handleViewMenu = () => {
    setIsMenuOpen(true)
  }

  // Handle pay bill button click
  const handleViewBill = () => {
    setCurrentView('bill')
  }

  // Show loading screen only during initial load
  if (currentView === 'loading') {
    return (
      <>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg) }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px) }
            to { opacity: 1; transform: translateY(0) }
          }
          
          @keyframes indeterminate {
            0% { transform: translateX(-100%) }
            100% { transform: translateX(200%) }
          }
          
          .splash {
            animation: fadeIn 400ms ease-out both;
          }
          
          .spinner {
            animation: spin 900ms linear infinite;
          }
          
          .progress-bar {
            animation: indeterminate 1500ms ease-in-out infinite;
          }
        `}</style>
        
        <div className="min-h-screen bg-white">
          <div className="splash flex flex-col min-h-screen max-w-[500px] mx-auto w-full">
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              <div className="w-full max-w-sm space-y-8">
                
                {/* Splitty Logo */}
                <div className="flex justify-center">
                  <Image 
                    src="/images/logo-trans.png" 
                    alt="Splitty" 
                    width={120} 
                    height={42}
                    className="opacity-80"
                  />
                </div>
                
                {/* Spinner */}
                <div className="flex justify-center">
                  <div className="spinner w-10 h-10 border-[3px] border-gray-200 border-t-gray-800 rounded-full"></div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full">
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="progress-bar h-full w-1/3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full"></div>
                  </div>
                </div>
                
                {/* Loading Text */}
                <div className="text-center space-y-2">
                  <p className="text-gray-700 text-sm font-medium">
                    {t('loadingBill') || 'Je rekening wordt geladen'}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {t('pleaseWait') || 'Even geduld alsjeblieft'}
                  </p>
                </div>
                
              </div>
            </main>
          </div>
        </div>
      </>
    )
  }
  
  // If bill is fully paid, show the fully paid view
  if (isFullyPaid) {
    return <BillFullyPaidView />
  }

  // Show landing page
  if (currentView === 'landing') {
    return (
      <>
        <LandingView onViewBill={handleViewBill} onViewMenu={handleViewMenu} />
        <MenuView isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onViewBill={handleViewBill} />
      </>
    )
  }

  return (
    <div
      className="min-h-screen bg-[#dcf5e5] relative"
      style={{ overscrollBehavior: 'none' }}
    >
      {/* Decorative side patterns */}
      <div
        className="fixed left-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: 'calc((100vw - 500px) / 2)',
          backgroundImage: 'url(/images/side-pattern.svg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-y',
          backgroundSize: 'cover',
          zIndex: 10
        }}
      />
      <div
        className="fixed right-0 top-0 bottom-0 pointer-events-none"
        style={{
          width: 'calc((100vw - 500px) / 2)',
          backgroundImage: 'url(/images/side-pattern.svg)',
          backgroundPosition: 'center',
          backgroundRepeat: 'repeat-y',
          backgroundSize: 'cover',
          zIndex: 10
        }}
      />
      <div className="flex flex-col min-h-screen max-w-[500px] mx-auto w-full" style={{ overscrollBehavior: 'none' }}>
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
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-28 h-28 rounded-full bg-white bg-center bg-no-repeat bg-contain shadow-lg"
            style={{ 
              backgroundImage: 'url(/images/limon.jpeg)',
              backgroundSize: '80%'
            }}
          ></div>
        </section>
        
        <main className="w-full flex-grow flex flex-col bg-white">
          {/* Spacing for logo overlap */}
          <div className="h-16 bg-white flex items-center justify-end px-4">
            <button
              onClick={handleViewMenu}
              className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t('viewMenu') || 'Bekijk menu'}
            </button>
          </div>
          
          {/* Active Split Mode Banner */}
          {activeSplitMode && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-sm sm:text-base text-green-800 font-medium">
                  {t('splitMode')}: <span className="font-bold">{
                    activeSplitMode === 'Betaal voor je items' ? t('payForItems') :
                    activeSplitMode === 'Gelijk verdelen' ? t('splitEqually') :
                    activeSplitMode === 'Aangepast bedrag' ? t('customAmount') :
                    activeSplitMode
                  }</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Total Amount Header - Clean & Modern */}
          <div className="bg-white border-b border-gray-200 px-4 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
            <div className="flex justify-between items-center mb-4 sm:mb-5">
              <div>
                <h1 className="text-gray-600 text-xs sm:text-sm font-normal mb-0.5">{t('table')} 1</h1>
                <p className="text-black text-lg sm:text-xl font-semibold">{t('outstandingAmount') || 'Nog openstaand bedrag'}</p>
              </div>
              <div className="text-right">
                <p className="text-black text-xl sm:text-2xl font-semibold">€{remainingAmount.toFixed(2).replace('.', ',')}</p>
              </div>
            </div>
            {/* Progress bar with percentage */}
            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-700 ease-out" style={{ width: `${paidPercentage}%` }}></div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <span className="text-xs sm:text-sm font-bold text-gray-700">{paidPercentage}%</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          {/* White background for order items */}
          <div className="bg-white shadow-sm">
            {/* Order Summary */}
            <div className="px-4 py-4 sm:px-6 sm:py-6">
              {/* Section Title */}
              <h2 className="text-black font-semibold text-base sm:text-lg mb-3 sm:mb-4">{t('order')}</h2>
              
              {/* Order items */}
              <div className="space-y-1.5 sm:space-y-2">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between group hover:bg-gray-50 -mx-1.5 px-1.5 py-1 sm:-mx-2 sm:px-2 sm:py-1.5 rounded-lg transition-colors">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-gray-100 text-gray-900 text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center">
                        {item.quantity}
                      </div>
                      <div>
                        <p className="text-black font-medium text-sm sm:text-base">{item.name}</p>
                        <p className="text-gray-500 text-xs sm:text-sm">€{item.unitPrice.toFixed(2).replace('.', ',')} {t('perUnit')}</p>
                      </div>
                    </div>
                    <span className="text-black font-semibold text-sm sm:text-base">€{item.totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                ))}
              </div>
              
              {/* Divider */}
              <div className="my-4 sm:my-6 border-t border-gray-200"></div>
              
              {/* Total Section */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-base sm:text-lg font-semibold text-black">{t('totalAmount')}</p>
                  <p className="text-xl sm:text-2xl font-bold text-black">€{total.toFixed(2).replace('.', ',')}</p>
                </div>
              </div>
              
              {/* Divider */}
              <div className="my-3 sm:my-4 border-t border-gray-200"></div>
              
              {/* BTW Section */}
              <BTWSummary btwBreakdown={btwBreakdown} totalBTW={totalBTW} />
            </div>
          </div>

          {/* Splitty Branding - Always at bottom */}
          <div className="mt-auto relative" style={{ backgroundColor: '#f7fef9' }}>
            <div className="relative px-4 py-6 sm:px-6 sm:py-8">
              {/* Logo section */}
              <div className="flex flex-col items-center mb-4 sm:mb-5">
                <Image
                  src="/images/logo-trans.png"
                  alt="Splitty"
                  width={60}
                  height={21}
                  className="mb-2 sm:mb-3 sm:w-20 sm:h-7"
                />

                <p className="text-xs sm:text-sm font-medium text-gray-700">
                  {t('payWithSmile')} 😊
                </p>
              </div>

              {/* Links section */}
              <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[10px] sm:gap-x-3 sm:gap-y-1 sm:text-xs">
                <span className="text-gray-500">{t('poweredBy')}</span>
                <span className="text-gray-400">•</span>
                <a href="https://www.splitty.nl/algemene-voorwaarden" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('terms')}
                </a>
                <span className="text-gray-400">•</span>
                <a href="https://www.splitty.nl/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('privacy')}
                </a>
                <span className="text-gray-400">•</span>
                <a href="https://www.splitty.nl/contact" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 transition-colors">
                  {t('contact')}
                </a>
              </div>
            </div>
          </div>
          
          {/* Bottom spacing for fixed buttons */}
          <div className="h-20 sm:h-24"></div>
        </main>
        
        {/* Fixed bottom action buttons */}
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-[500px] mx-auto bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
            <div className="p-3 sm:p-4">
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>

      {/* Menu View */}
      <MenuView isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} skipCategorySelection onViewBill={() => setIsMenuOpen(false)} />
    </div>
  )
}