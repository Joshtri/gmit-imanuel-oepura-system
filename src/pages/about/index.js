import VisionAndMission from "@/components/about/visionAndMission";
import History from "@/components/about/history";

export default function About() {
  return (
    <div>
      <div className="flex justify-center items-center h-[50vh]">
        <img
          src="/header/about.png"
          alt="About Us"
          className="w-full h-full object-cover"
        />
        <h1 className="absolute text-6xl font-bold mt-4">About Us</h1>
      </div>

      <VisionAndMission />
      <History />
    </div>
  );
}
