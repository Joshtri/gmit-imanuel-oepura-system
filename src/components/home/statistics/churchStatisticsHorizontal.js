import { useEffect, useState } from "react";
import StatPieChart from "./statPieChart";
import { chartData } from "../../../json/dummyHome";

export default function ChurchStatisticsHorizontal() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Now we show 1 chart at a time, so total slides equals chartData length
  const totalSlides = chartData.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 5000); // Reduced to 5 seconds since only showing 1 chart

    return () => clearInterval(interval);
  }, [totalSlides]);

  return (
    <div className="block md:hidden w-full bg-base-300 p-6 py-8 overflow-hidden">
      <div className="flex flex-col h-96">
        {/* Chart container that takes most of the height */}
        <div className="flex-1 relative overflow-hidden min-h-0">
          <div
            className="transition-transform duration-500 ease-in-out h-full flex"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {chartData.map((chart, index) => (
              <div
                key={index}
                className="h-full w-full flex-shrink-0 flex justify-center items-center px-8"
              >
                <div className="w-80 h-80">
                  <StatPieChart
                    title={chart.title}
                    data={chart.data}
                    size="normal"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Indicators at bottom */}
        <div className="flex justify-center space-x-2 py-4">
          {Array.from({ length: totalSlides }, (_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-primary" : "bg-primary-content"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}