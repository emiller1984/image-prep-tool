import { dedicatedTemplate } from '../../config/templates'
import ImageSlot from './ImageSlot'

function getSlot(id) {
  return dedicatedTemplate.slots.find(s => s.id === id)
}

/**
 * Visual representation of the "Dedicated" email template.
 * Renders a 600px-wide email layout with interactive image drop zones.
 */
export default function DedicatedTemplate({ slotImages, slotFitModes, onImageDrop, onImageRemove, onFitModeChange }) {
  const renderSlot = (slotId) => (
    <ImageSlot
      slot={getSlot(slotId)}
      imageData={slotImages[slotId]}
      fitMode={slotFitModes[slotId] || 'fit'}
      onImageDrop={onImageDrop}
      onImageRemove={onImageRemove}
      onFitModeChange={onFitModeChange}
    />
  )

  return (
    <div className="w-[600px] mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Outer email background */}
      <div className="bg-[#e1e1e1] p-[10px]">

        {/* Header bar */}
        <div className="bg-white px-6 py-4 flex items-center justify-between">
          <div />
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-[#0B1126]">0 Points</span>
            <span className="text-sm text-[#254BD1] underline">Sign In</span>
          </div>
        </div>

        {/* Logo */}
        <div className="bg-white px-6 py-6 flex justify-center">
          <div className="w-[180px] h-[45px] bg-gray-200 rounded flex items-center justify-center">
            <span className="text-xs text-gray-400">Community Logo</span>
          </div>
        </div>

        {/* Block 2: Hero Placement Image */}
        <div className="px-[10px]">
          <div className="flex justify-center">
            {renderSlot('hero-placement')}
          </div>
        </div>

        {/* Block 3: Main merchant card with purple background */}
        <div className="px-[10px]">
          <div className="bg-[#201D52] p-[25px]" style={{ borderRadius: '20px 20px 0 0' }}>
            <div className="bg-white px-6 py-8 flex flex-col items-center text-center">
              {/* Dedicated Hero */}
              <div className="mb-5">
                {renderSlot('dedicated-hero')}
              </div>

              <h2 className="text-[25px] font-bold text-[#0B1126] leading-[30px] mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                Headline Text Goes Here
              </h2>
              <p className="text-sm text-[#5A5A5A] mb-3">
                Offer Code: Code123
              </p>
              <span className="inline-block bg-[#254BD1] text-white text-base px-5 py-2 rounded-full">
                Get Code
              </span>
            </div>
          </div>
        </div>

        {/* Block 4: Secondary Hero Placement */}
        <div className="px-[10px]">
          <div className="flex justify-center">
            {renderSlot('secondary-hero')}
          </div>
        </div>

        {/* Block 5: Body text section */}
        <div className="px-[10px]">
          <div className="bg-white px-10 py-10 text-center">
            <h1 className="text-[29px] font-bold text-[#0B1126] leading-[34px] mb-3">
              Feature headline text goes here for your community
            </h1>
            <p className="text-base text-[#0B1126] leading-5 mb-3">
              Descriptive body copy about the featured offer. This section highlights key promotions and seasonal deals for your audience.
            </p>
            <span className="inline-block bg-[#254BD1] text-white text-base px-5 py-2 rounded-full">
              Get Code
            </span>
          </div>
        </div>

        {/* Block 6: Duo section */}
        <div className="px-[10px]">
          <div className="bg-white pt-5">
            <h2 className="text-[25px] font-bold text-[#0B1126] leading-[30px] text-center px-5 mb-2">
              Featured Products
            </h2>
            <div className="flex">
              {/* Duo 1 */}
              <div className="w-1/2 p-5">
                <div className="mb-4">
                  {renderSlot('duo-1')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-1">
                  Product title goes here for featured item.
                </h5>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-1">
                  Brief product description text that highlights key features and benefits for the reader.
                </p>
                <p className="text-sm text-[#5A5A5A] leading-[18px] mb-1">
                  Offer Code: Code
                </p>
                <span className="text-sm font-bold text-[#254BD1] underline">
                  Shop Now
                </span>
              </div>
              {/* Duo 2 */}
              <div className="w-1/2 p-5">
                <div className="mb-4">
                  {renderSlot('duo-2')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-1">
                  Second product title with a description of the item.
                </h5>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-1">
                  Additional product description that provides more context about styling and versatility.
                </p>
                <span className="text-sm font-bold text-[#254BD1] underline">
                  Shop Now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 7: Trio section */}
        <div className="px-[10px]">
          <div className="bg-white pt-5">
            <h2 className="text-[25px] font-bold text-[#0B1126] leading-[30px] text-center mb-2">
              More Deals
            </h2>
            <div className="flex">
              {/* Trio 1 */}
              <div className="w-1/3 p-5">
                <div className="mb-4">
                  {renderSlot('trio-1')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-1">
                  Category Title
                </h5>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-1">
                  Short category description text.
                </p>
                <p className="text-sm text-[#5A5A5A] leading-[18px] mb-1">
                  Offer Code: CODE1
                </p>
                <span className="text-sm font-bold text-[#254BD1] underline">
                  Shop Now
                </span>
              </div>
              {/* Trio 2 */}
              <div className="w-1/3 p-5">
                <div className="mb-4">
                  {renderSlot('trio-2')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-1">
                  Category Title
                </h5>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-1">
                  Short category description text for the second item in the row.
                </p>
                <span className="text-sm font-bold text-[#254BD1] underline">
                  Shop Now
                </span>
              </div>
              {/* Trio 3 */}
              <div className="w-1/3 p-5">
                <div className="mb-4">
                  {renderSlot('trio-3')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-1">
                  Category Title
                </h5>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-1">
                  Short category description text for the third item.
                </p>
                <p className="text-sm text-[#5A5A5A] leading-[18px] mb-1">
                  Offer Code: CODE3
                </p>
                <span className="text-sm font-bold text-[#254BD1] underline">
                  Save Now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 8: Testimonial */}
        <div className="px-[10px]">
          <div className="bg-white p-5">
            <div className="bg-[#F1F1F1] rounded-[10px] p-5 text-center">
              <div className="text-2xl text-gray-400 mb-2">&ldquo;</div>
              <p className="text-base text-[#0B1126] leading-5 mb-2">
                &ldquo;Customer testimonial quote goes here.&rdquo;
              </p>
              <p className="text-sm font-bold text-[#0B1126]">
                -First L.
              </p>
            </div>
          </div>
        </div>

        {/* Block 9: Merchant card row */}
        <div className="p-[10px]">
          <div className="bg-white rounded-[20px] overflow-hidden">
            <div className="flex justify-center py-5 px-3">
              {/* Merchant 1 */}
              <div className="w-1/3 px-4 py-4 text-center">
                <div className="flex justify-center mb-4">
                  {renderSlot('merchant-1')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-2">
                  Merchant offer headline goes here
                </h5>
                <span className="inline-block border border-[#0B1126] text-[#0B1126] text-base px-5 py-2 rounded-full">
                  Book Now
                </span>
              </div>
              {/* Merchant 2 */}
              <div className="w-1/3 px-4 py-4 text-center">
                <div className="flex justify-center mb-4">
                  {renderSlot('merchant-2')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-2">
                  Merchant offer headline goes here
                </h5>
                <p className="text-sm text-[#5A5A5A] leading-[18px] mb-2">
                  Offer Code: CODE
                </p>
                <span className="inline-block border border-[#0B1126] text-[#0B1126] text-base px-5 py-2 rounded-full">
                  Save Now
                </span>
              </div>
              {/* Merchant 3 */}
              <div className="w-1/3 px-4 py-4 text-center">
                <div className="flex justify-center mb-4">
                  {renderSlot('merchant-3')}
                </div>
                <h5 className="text-base font-bold text-[#0B1126] leading-5 mb-2">
                  Merchant offer headline goes here
                </h5>
                <span className="inline-block border border-[#0B1126] text-[#0B1126] text-base px-5 py-2 rounded-full">
                  Get Code
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 10: Side-by-side deal cards */}
        <div className="px-[10px]">
          <div className="bg-white px-5">
            {/* Side-by-side 1 */}
            <div className="flex items-start py-5 border-b border-gray-100">
              <div className="flex-shrink-0">
                {renderSlot('side-by-side-1')}
              </div>
              <div className="ml-5 flex-1">
                <h4 className="text-lg font-bold text-[#0B1126] leading-[22px] mb-1">
                  Featured merchant offer headline text
                </h4>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-1">
                  Brief description of the merchant deal and what customers can save.
                </p>
                <p className="text-sm text-[#5A5A5A] leading-[18px] mb-2">
                  Offer Code: CODE
                </p>
                <span className="inline-block bg-[#254BD1] text-white text-base px-5 py-2 rounded-full">
                  Shop Now
                </span>
              </div>
            </div>
            {/* Side-by-side 2 */}
            <div className="flex items-start py-5" style={{ borderRadius: '0 0 20px 20px' }}>
              <div className="flex-shrink-0">
                {renderSlot('side-by-side-2')}
              </div>
              <div className="ml-5 flex-1">
                <h4 className="text-lg font-bold text-[#0B1126] leading-[22px] mb-1">
                  Second merchant offer headline text
                </h4>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-2">
                  Brief description of the second merchant deal with savings details.
                </p>
                <span className="inline-block bg-[#254BD1] text-white text-base px-5 py-2 rounded-full">
                  Book Now
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Block 11: Stacked placement */}
        <div className="p-[10px]">
          <div className="bg-white rounded-[20px] p-5">
            <div className="flex items-start">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#0B1126] leading-6 mb-1">
                  Closing Offer
                </h3>
                <p className="text-sm text-[#0B1126] leading-[18px] mb-3">
                  Description of the closing placement offer.
                </p>
                <span className="inline-block bg-[#254BD1] text-white text-base px-5 py-2 rounded-full">
                  Shop Now
                </span>
              </div>
              <div className="ml-3 flex-shrink-0">
                {renderSlot('stacked-placement')}
              </div>
            </div>
          </div>
        </div>

        {/* Block 12: Category icons */}
        <div className="p-[10px]">
          <div className="bg-[#201D52] rounded-[20px] p-5 text-center">
            <h2 className="text-[25px] font-bold text-white leading-[30px] mb-6">
              Explore 25+ categories of<br />the very best deals.
            </h2>
            <div className="flex justify-center gap-4 flex-wrap mb-4">
              {['Electronics', 'Cellphones', 'Automotive', 'Food', 'Travel', 'Health', 'Apparel', 'All Categories'].map((cat) => (
                <div key={cat} className="w-[60px] text-center">
                  <div className="w-[60px] h-[60px] bg-white/10 rounded-full mb-1" />
                  <span className="text-xs font-bold text-white">{cat}</span>
                </div>
              ))}
            </div>
            <span className="inline-block bg-[#254BD1] text-white text-base px-5 py-2 rounded-full">
              Sign In
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-[10px]">
          <p className="text-sm text-[#5A5A5A] leading-[18px]">
            Footer disclaimers and legal text would appear here. All links in this email are personalized and intended solely for the recipient.
          </p>
        </div>

      </div>
    </div>
  )
}
