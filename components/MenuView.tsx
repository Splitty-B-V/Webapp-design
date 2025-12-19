'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useBill } from '@/contexts/BillContext'
import LanguageToggle from '@/components/LanguageToggle'

interface MenuViewProps {
  isOpen: boolean
  onClose: () => void
  skipCategorySelection?: boolean
  onViewBill?: () => void
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

interface SubCategory {
  id: string
  nameKey: string
  fallbackName: string
  items: MenuItem[]
}

interface MenuCategory {
  id: string
  titleKey: string
  fallbackTitle: string
  image: string
  subCategories: SubCategory[]
}

const menuCategories: MenuCategory[] = [
  {
    id: 'food',
    titleKey: 'menuFood',
    fallbackTitle: 'ETEN',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop',
    subCategories: [
      {
        id: 'breakfast',
        nameKey: 'subBreakfast',
        fallbackName: 'ONTBIJT',
        items: [
          { id: 'f1', name: 'Eggs Benedict', description: 'Gepocheerde eieren met hollandaisesaus op brioche', price: 12.50, image: 'https://images.unsplash.com/photo-1608039829572-9b8d0041a1b6?w=200&h=200&fit=crop' },
          { id: 'f2', name: 'Pancakes', description: 'Fluffy pancakes met maple syrup en vers fruit', price: 10.00, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop' },
          { id: 'f3', name: 'Avocado Toast', description: 'Geroosterd zuurdesembrood met avocado en gepocheerd ei', price: 11.50, image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&h=200&fit=crop' },
          { id: 'f4', name: 'Croissant', description: 'Verse boter croissant met jam en boter', price: 4.50, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'italian',
        nameKey: 'subItalian',
        fallbackName: 'ITALIAANS',
        items: [
          { id: 'f5', name: 'Margherita Pizza', description: 'Klassieke Italiaanse pizza met verse mozzarella, tomaat en basilicum', price: 14.50, image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&h=200&fit=crop' },
          { id: 'f6', name: 'Pasta Carbonara', description: 'Romige pasta met spek, ei, pecorino en zwarte peper', price: 15.00, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop' },
          { id: 'f7', name: 'Lasagna', description: 'Huisgemaakte lasagna met bolognese en bechamelsaus', price: 16.50, image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=200&h=200&fit=crop' },
          { id: 'f8', name: 'Risotto ai Funghi', description: 'Romige risotto met gemengde paddenstoelen en parmezaan', price: 17.00, image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'burgers',
        nameKey: 'subBurgers',
        fallbackName: 'BURGERS',
        items: [
          { id: 'f9', name: 'Classic Beef Burger', description: '200g Black Angus beef met cheddar, bacon en truffelmayo', price: 18.50, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
          { id: 'f10', name: 'Chicken Burger', description: 'Krokante kip met sla, tomaat en knoflooksaus', price: 15.50, image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&h=200&fit=crop' },
          { id: 'f11', name: 'Veggie Burger', description: 'Beyond meat patty met avocado en chipotle mayo', price: 16.00, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'salads',
        nameKey: 'subSalads',
        fallbackName: 'SALADES',
        items: [
          { id: 'f12', name: 'Caesar Salad', description: 'Knapperige romaine sla, parmezaan, croutons en huisgemaakte dressing', price: 11.00, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop' },
          { id: 'f13', name: 'Greek Salad', description: 'Tomaat, komkommer, olijven, feta en rode ui', price: 10.50, image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=200&h=200&fit=crop' },
          { id: 'f14', name: 'Quinoa Bowl', description: 'Quinoa met geroosterde groenten, hummus en tahini', price: 13.50, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'mains',
        nameKey: 'subMains',
        fallbackName: 'HOOFDGERECHTEN',
        items: [
          { id: 'f15', name: 'Gegrilde Zalm', description: 'Verse zalmfilet met seizoensgroenten en citroenbotersaus', price: 22.00, image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop' },
          { id: 'f16', name: 'Ribeye Steak', description: '300g ribeye met peppersaus en gebakken aardappelen', price: 28.50, image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=200&h=200&fit=crop' },
          { id: 'f17', name: 'Kip Tandoori', description: 'Gemarineerde kip met basmatirijst en naan brood', price: 18.00, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&h=200&fit=crop' },
          { id: 'f18', name: 'Lamskotelet', description: 'Gegrilde lamskotelet met rozemarijn en knoflook', price: 26.00, image: 'https://images.unsplash.com/photo-1514516816566-de580c621376?w=200&h=200&fit=crop' },
        ]
      },
    ]
  },
  {
    id: 'beverages',
    titleKey: 'menuBeverages',
    fallbackTitle: 'DRANKEN',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop',
    subCategories: [
      {
        id: 'hot-drinks',
        nameKey: 'subHotDrinks',
        fallbackName: 'WARME DRANKEN',
        items: [
          { id: 'b1', name: 'Espresso', description: 'Sterke Italiaanse koffie, perfect gebrouwen', price: 2.80, image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=200&h=200&fit=crop' },
          { id: 'b2', name: 'Cappuccino', description: 'Espresso met opgeschuimde melk en cacaopoeder', price: 3.50, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=200&h=200&fit=crop' },
          { id: 'b3', name: 'Latte Macchiato', description: 'Warme melk met een shot espresso', price: 4.00, image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=200&h=200&fit=crop' },
          { id: 'b4', name: 'Thee', description: 'Selectie van premium thee', price: 3.00, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=200&h=200&fit=crop' },
          { id: 'b5', name: 'Warme Chocolademelk', description: 'Romige chocolademelk met slagroom', price: 4.50, image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'cold-drinks',
        nameKey: 'subColdDrinks',
        fallbackName: 'KOUDE DRANKEN',
        items: [
          { id: 'b6', name: 'Fresh Orange Juice', description: 'Vers geperst sinaasappelsap', price: 4.50, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop' },
          { id: 'b7', name: 'Iced Coffee', description: 'Koude espresso met melk en ijs', price: 4.50, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&h=200&fit=crop' },
          { id: 'b8', name: 'Smoothie', description: 'Gemengd fruit smoothie naar keuze', price: 5.50, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop' },
          { id: 'b9', name: 'Spa Blauw', description: 'Bruisend mineraalwater 500ml', price: 3.00, image: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=200&h=200&fit=crop' },
          { id: 'b10', name: 'Cola', description: 'Coca-Cola 330ml', price: 3.50, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'cocktails',
        nameKey: 'subCocktails',
        fallbackName: 'COCKTAILS',
        items: [
          { id: 'b11', name: 'Mojito', description: 'Klassieke cocktail met rum, munt, limoen en soda', price: 9.00, image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=200&h=200&fit=crop' },
          { id: 'b12', name: 'Margarita', description: 'Tequila, triple sec en limoen', price: 9.50, image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?w=200&h=200&fit=crop' },
          { id: 'b13', name: 'Piña Colada', description: 'Rum, kokosmelk en ananas', price: 10.00, image: 'https://images.unsplash.com/photo-1586500036706-41963de24d8b?w=200&h=200&fit=crop' },
          { id: 'b14', name: 'Aperol Spritz', description: 'Aperol, prosecco en soda', price: 8.50, image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'wine',
        nameKey: 'subWine',
        fallbackName: 'WIJN',
        items: [
          { id: 'b15', name: 'Huiswijn Wit', description: 'Glas huiswijn wit 150ml', price: 5.00, image: 'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=200&h=200&fit=crop' },
          { id: 'b16', name: 'Huiswijn Rood', description: 'Glas huiswijn rood 150ml', price: 5.00, image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=200&fit=crop' },
          { id: 'b17', name: 'Prosecco', description: 'Glas Italiaanse prosecco 150ml', price: 6.50, image: 'https://images.unsplash.com/photo-1594372365401-3b5ff14eaaed?w=200&h=200&fit=crop' },
        ]
      },
    ]
  },
  {
    id: 'kids',
    titleKey: 'menuKids',
    fallbackTitle: 'KINDERMENU',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop',
    subCategories: [
      {
        id: 'kids-food',
        nameKey: 'subKidsFood',
        fallbackName: 'KINDERETEN',
        items: [
          { id: 'k1', name: 'Mini Hamburger', description: 'Klein hamburgerje met frietjes en ketchup', price: 8.50, image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=200&h=200&fit=crop' },
          { id: 'k2', name: 'Pasta met Kaassaus', description: 'Romige pasta met zachte kaassaus', price: 7.00, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&h=200&fit=crop' },
          { id: 'k3', name: 'Kipnuggets', description: '6 krokante kipnuggets met frietjes en mayo', price: 9.00, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&h=200&fit=crop' },
          { id: 'k4', name: 'Mini Pizza', description: 'Kleine pizza margherita of salami', price: 8.00, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop' },
          { id: 'k5', name: 'Pannenkoek', description: 'Pannenkoek met stroop of poedersuiker', price: 6.50, image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'kids-drinks',
        nameKey: 'subKidsDrinks',
        fallbackName: 'KINDERDRANKEN',
        items: [
          { id: 'k6', name: 'Appelsap', description: 'Vers appelsap 200ml', price: 2.50, image: 'https://images.unsplash.com/photo-1576673442511-7e39b6545c87?w=200&h=200&fit=crop' },
          { id: 'k7', name: 'Chocomel', description: 'Koude chocolademelk 200ml', price: 2.50, image: 'https://images.unsplash.com/photo-1517578239113-b03992dcdd25?w=200&h=200&fit=crop' },
          { id: 'k8', name: 'Limonade', description: 'Verse limonade met munt', price: 3.00, image: 'https://images.unsplash.com/photo-1523371054106-bbf80586c38c?w=200&h=200&fit=crop' },
        ]
      },
      {
        id: 'kids-desserts',
        nameKey: 'subKidsDesserts',
        fallbackName: 'KINDERDESSERTS',
        items: [
          { id: 'k9', name: 'IJsje', description: '2 bolletjes ijs naar keuze', price: 4.00, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop' },
          { id: 'k10', name: 'Brownie', description: 'Warme chocolade brownie met ijs', price: 5.50, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=200&h=200&fit=crop' },
        ]
      },
    ]
  }
]

interface CartItem extends MenuItem {
  quantity: number
}

export default function MenuView({ isOpen, onClose, skipCategorySelection = false, onViewBill }: MenuViewProps) {
  const { t } = useLanguage()
  const { remainingAmount } = useBill()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const subCategoryTabsRef = useRef<HTMLDivElement>(null)

  // Get current main category data
  const currentMainCategory = menuCategories.find(c => c.id === selectedCategory)
  const allSubCategories = menuCategories.flatMap(c => c.subCategories.map(s => ({ ...s, mainCategoryId: c.id })))

  // Get all items for search
  const allItems = menuCategories.flatMap(c =>
    c.subCategories.flatMap(s =>
      s.items.map(item => ({ ...item, subCategoryName: s.name, mainCategoryName: c.fallbackTitle }))
    )
  )

  // Filter items based on search query
  const searchResults = searchQuery.trim()
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

  const isSearching = searchQuery.trim().length > 0

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Skip category selection and go directly to menu
      if (skipCategorySelection && !selectedCategory) {
        setSelectedCategory('food')
      }
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, skipCategorySelection])

  const handleClose = () => {
    setSelectedCategory(null)
    setActiveSubCategory(null)
    onClose()
  }

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0)
  const getTotalPrice = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  // Scroll to subcategory section when tab is clicked
  const scrollToSubCategory = (subCategoryId: string) => {
    const section = sectionRefs.current[subCategoryId]
    if (section && scrollContainerRef.current) {
      const containerTop = scrollContainerRef.current.getBoundingClientRect().top
      const sectionTop = section.getBoundingClientRect().top
      const offset = sectionTop - containerTop + scrollContainerRef.current.scrollTop - 10
      scrollContainerRef.current.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  // Scroll to main category (first subcategory of that main category)
  const scrollToMainCategory = (categoryId: string) => {
    const category = menuCategories.find(c => c.id === categoryId)
    if (category && category.subCategories.length > 0) {
      scrollToSubCategory(category.subCategories[0].id)
    }
  }

  // Update active subcategory based on scroll position
  useEffect(() => {
    if (!selectedCategory) return

    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top

      for (const subCat of allSubCategories) {
        const section = sectionRefs.current[subCat.id]
        if (section) {
          const sectionTop = section.getBoundingClientRect().top - containerTop
          const sectionBottom = sectionTop + section.offsetHeight

          if (sectionTop <= 100 && sectionBottom > 100) {
            setActiveSubCategory(subCat.id)
            // Also update main category if needed
            if (subCat.mainCategoryId !== selectedCategory) {
              setSelectedCategory(subCat.mainCategoryId)
            }
            break
          }
        }
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [selectedCategory, allSubCategories])

  // Auto-scroll subcategory tabs to show active one
  useEffect(() => {
    if (activeSubCategory && subCategoryTabsRef.current) {
      const activeTab = subCategoryTabsRef.current.querySelector(`[data-subcat="${activeSubCategory}"]`)
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [activeSubCategory])

  // Set initial active subcategory when category is selected
  useEffect(() => {
    if (selectedCategory && !activeSubCategory) {
      const category = menuCategories.find(c => c.id === selectedCategory)
      if (category && category.subCategories.length > 0) {
        setActiveSubCategory(category.subCategories[0].id)
      }
    }
  }, [selectedCategory, activeSubCategory])

  if (!isOpen) return null

  // Full Menu View with all items
  if (selectedCategory) {
    return (
      <>
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-slide-up-content {
            animation: slideUp 0.4s ease-out;
          }
        `}</style>
        <div className="fixed inset-0 z-50 bg-[#dcf5e5] overflow-hidden animate-fade-in">
          <div className="max-w-[500px] mx-auto h-full bg-white flex flex-col overflow-hidden animate-slide-up-content">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
            <div className="px-4 py-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={handleClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14.71 15.88 10.83 12l3.88-3.88c.39-.39.39-1.02 0-1.41a.996.996 0 0 0-1.41 0L8.71 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .38-.39.39-1.03 0-1.42" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full bg-white bg-center bg-no-repeat bg-contain shadow-sm border border-gray-100"
                    style={{ backgroundImage: 'url(/images/limon.jpeg)', backgroundSize: '70%' }}
                  />
                  <h1 className="text-base font-semibold text-gray-900">Limon Restaurant</h1>
                </div>
                <LanguageToggle />
              </div>

              {/* Search Bar */}
              <div className="mt-3">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2.5">
                  <svg className="w-5 h-5 text-gray-400 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('search') || 'Zoek'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ml-3 bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-full"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition-colors flex-shrink-0"
                    >
                      <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Main Category Tabs - Hide when searching */}
              {!isSearching && (
              <div className="mt-3 -mx-4 px-4 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1 relative">
                  {menuCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToMainCategory(category.id)}
                      className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors relative ${
                        selectedCategory === category.id
                          ? 'text-gray-900'
                          : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {t(category.titleKey) || category.fallbackTitle}
                      {selectedCategory === category.id && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-900 rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              )}
            </div>

            {/* Subcategory Tabs - Hide when searching */}
            {!isSearching && (
            <div
              ref={subCategoryTabsRef}
              className="overflow-x-auto bg-white"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex px-4 py-2 gap-2" style={{ WebkitOverflowScrolling: 'touch' }}>
                {allSubCategories.map((subCat) => (
                  <button
                    key={subCat.id}
                    data-subcat={subCat.id}
                    onClick={() => scrollToSubCategory(subCat.id)}
                    className={`px-4 py-2 text-xs font-medium whitespace-nowrap rounded-full transition-all ${
                      activeSubCategory === subCat.id
                        ? 'bg-gray-900 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {t(subCat.nameKey) || subCat.fallbackName}
                  </button>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Search Results */}
          {isSearching ? (
            <div
              className="flex-1 overflow-y-auto px-4 py-4 pb-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 mb-4">{searchResults.length} {t('resultsFound') || 'resultaten gevonden'}</p>
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                    >
                      <div className="flex p-4 gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-400 mb-1">{item.subCategoryName}</p>
                          <h3 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.description}</p>
                          <span className="font-bold text-gray-900 text-lg">
                            €{item.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-gray-500 text-center">{t('noResultsFor') || 'Geen resultaten gevonden voor'} "{searchQuery}"</p>
                </div>
              )}
            </div>
          ) : (
          /* Menu Items List - All subcategories */
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-4 py-4 pb-32"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {menuCategories.map((category) => (
              <div key={category.id}>
                {category.subCategories.map((subCategory) => (
                  <div
                    key={subCategory.id}
                    ref={(el) => { sectionRefs.current[subCategory.id] = el }}
                    className="mb-8"
                  >
                    {/* Subcategory Header */}
                    <h2 className="text-base font-bold text-gray-900 mb-4">
                      {t(subCategory.nameKey) || subCategory.fallbackName}
                    </h2>

                    {/* Items */}
                    <div className="space-y-3">
                      {subCategory.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                          <div className="flex p-4 gap-4">
                            {/* Item Image */}
                            <div className="relative w-24 h-24 flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover rounded-xl"
                              />
                            </div>

                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-base mb-1">{item.name}</h3>
                              <p className="text-gray-500 text-sm line-clamp-2 mb-2">{item.description}</p>
                              <span className="font-bold text-gray-900 text-lg">
                                €{item.price.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          )}

          {/* Sticky Pay Button - only show when there's an outstanding amount */}
          {remainingAmount > 0 && onViewBill && (
            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] p-4">
              <button
                onClick={() => {
                  handleClose()
                  onViewBill()
                }}
                className="w-full py-3.5 px-5 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-black active:scale-[0.98] transition-all flex items-center justify-between"
              >
                <span>{t('payNow') || 'Betaal nu'}</span>
                <span className="bg-white/20 px-3 py-1 rounded-lg">€{remainingAmount.toFixed(2).replace('.', ',')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      </>
    )
  }

  // Category Selection View
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
        <div className="max-w-[500px] mx-auto">
          <div className="bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden">
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {t('selectMenu') || 'Selecteer een menu'}
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Menu Categories */}
            <div
              className="px-5 py-5 space-y-4 overflow-y-auto max-h-[calc(85vh-120px)]"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {menuCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="w-full group relative overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  {/* Background Image */}
                  <div className="relative h-32 w-full">
                    <Image
                      src={category.image}
                      alt={t(category.titleKey) || category.fallbackTitle}
                      fill
                      className="object-cover"
                    />
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>

                  {/* Category Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white text-lg font-bold tracking-wide">
                      {t(category.titleKey) || category.fallbackTitle}
                    </h3>
                  </div>

                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Bottom safe area padding */}
            <div className="h-6 bg-white" />
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  )
}
