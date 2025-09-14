export default function VisionAndMission() {
  return (
    <div className="bg-gray-100 text-gray-900 p-8">
      {/* Vision Section - Image Left, Text Right */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
        <h2 className="text-4xl font-bold mb-6 order-1 md:hidden">Our Vision</h2>
        
        <div className="flex-1 order-2 md:order-1">
          <img
            src="/about/vision.png"
            alt="Vision"
            className="w-full h-64 md:h-full object-cover rounded-lg"
          />
        </div>
        
        <div className="flex-1 order-3 md:order-2 md:pl-8">
          <h2 className="text-4xl font-bold md:mb-6 hidden md:block">Our Vision</h2>
          <p className="text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </div>
      </div>

      {/* Mission Section - Text Left, Image Right */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        <h2 className="text-4xl font-bold md:mb-6 order-1 md:hidden">Our Mission</h2>
        
        <div className="flex-1 order-3 md:order-1 md:pr-8">
          <h2 className="text-4xl font-bold mb-6 hidden md:block">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
          </p>
        </div>
        
        <div className="flex-1 order-2">
          <img
            src="/about/vision.png"
            alt="Mission"
            className="w-full h-64 md:h-full object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  )
}