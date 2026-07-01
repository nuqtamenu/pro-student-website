## Data Structure

```ts
// Common Variables
export type Localized = {
  en: string;
  ar: string;
};

export type Frequency = "fixed" | "weekly" | "monthly" | "annually";

export type TripType = "oneWay" | "roundTrip";

export type Dates = {
  from: Date | string;
  to: Date | string;
};

// <---------- ACCOMMODATION ------------->
export type RoomLocation = {
  name: Localized;
  mapUrl: null | string;
};

interface TravelTime {
  min: number;
  max: number;
  unit: "minutes" | "hours";
}

interface Transport {
  mode: Localized;
  icon?: string;
}
interface CommuteOption {
  travelTime: TravelTime;
  transport: Transport;
}

export type Accommodation = {
  id: number;
  accommodationName: Localized;
  accommodationDescription?: Localized;
  image?: string;
  categoryId: number;
  note?: Localized;
  minimumAge?: number;
  durationWeeks?: number;
  accommodationDates?: Dates;
  schoolId: number;
  price: number;
  priceFrequency: Frequency;
  location?: RoomLocation[] | null;
  commuteOptions?: CommuteOption[] | null;
};

// <---------- ACCOMMODATION ADDON ------------->
export type AccommodationAddon = {
  id: number;
  addonName: Localized;
  duration?: {
    from: Date | string;
    to: Date | string;
  };
  amount: number;
  frequency: Frequency;
  location?: Localized;
  note?: Localized;
  schoolId: number;
  categoryId: number;
};
```

## References

instituteId:1
countryId:1
cityId:2
schoolId: 2
categoryId for Homestay Accommodation: 7
categoryId for Student Residence Accommodation: 8

accomodation id starts from 15
accomodation addons id starts from 6

## Task

# Output

Give me json files for all accomodations and accomodation-addons extracted from the reference image accurately, according to the DS provided above and also provide the translations for arabic.
