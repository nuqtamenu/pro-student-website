import { DestinationsFilter } from "@/components/destinations-filter";

export default function DestinationsPage() {
  return (
    <div className="bg-linear-to-b from-dark-orange via-light-orange to-white w-full">
      {/* Filter Cities By Countries*/}
      {/* United States Of America (New York, Los Angeles, Boston, Miami) */}

      <DestinationsFilter />
      {/* Canada (Toronto, VANCOUVER, MONTREAL, CALGARY) */}
      {/* United Kingdom (London, Cambridge, Oxford, Brighton) */}
      {/* Australia (Sydney, Melbourne, Brisbane, Perth) */}
      {/* Ireland (Dublin, Cork, Galway, Drogheda) */}
      {/* South Africa (Cape Town) */}
    </div>
  );
}
