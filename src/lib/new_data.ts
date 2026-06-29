// Accomodation
export type Localized = {
  en: string;
  ar: string;
};

export type AmountFrequency = "fixed" | "weekly" | "monthly" | "annually";

export type TripType = "oneWay" | "roundTrip";

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

export type AccommodationPlan = {
  planName: Localized;
  amount: number;
  frequency: AmountFrequency;
  optional: boolean;
};

// <---------- ACCOMMODATION ------------->
export type Accommodation = {
  id: number;
  accommodationName: Localized;
  accommodationDescription?: Localized;
  image?: string;
  accommodationCategoryId: number;
  note?: Localized;
  minimumAge?: number;
  durationWeeks?: number;
  accommodationDates?: Date | string | null;
  schoolId: number;
  price: number;
  priceFrequency: AmountFrequency;
  location?: RoomLocation[] | null;
  commuteOptions?: CommuteOption[] | null;
  accommodationPlans: AccommodationPlan[];
};

// Transfers

export type TransferOption = {
  optionName: Localized;
  pickupLocation: Localized;
  amount: number;
  tripType: TripType;
};

export type TransferPackage = {
  packageName: Localized;
  transferOptions: TransferOption[];
};

// <---------- TRANSFER ------------->
export type Transfer = {
  id: number;
  schoolId: number;
  serviceName: Localized;
  serviceNote?: Localized;
  transferPackages: TransferPackage[];
};

// Institute

export type SchoolFee = {
  name: Localized;
  amount: number;
  optional: boolean;
  frequency: AmountFrequency;
};

export type School = {
  id: number;
  name?: Localized;
  description?: Localized;
  slug: string;
  image?: string;
  fees: SchoolFee[];
  countryId: number;
  cityId: number;
};

// <---------- INSTITUTE ------------->
export type Institute = {
  id: number;
  name: Localized;
  description?: Localized;
  slug: string;
  logo?: string;
  image?: string;
  schools: School[];
};

// Courses
export type CoursePricing = {
  weekRange?: {
    min: number;
    max: number | null;
  };
  price: number;
  frequency: AmountFrequency;
};
export type ProgramCourse = {
  courseName: Localized;
  lessonsPerWeek?: number;
  discount: number;
  pricingTiers: CoursePricing[];
};

export type ProgramAddon = {
  addonName: Localized;
  lessons?: number;
  price: number;
  note?: Localized;
};
export type SchoolProgram = {
  programName: Localized;
  description?: Localized;
  image?: string;
  courses: ProgramCourse[];
  addOns?: ProgramAddon[];
};

export type Course = {
  id: number;
  name: Localized;
  description?: Localized;
  image?: string;
  discount: number;
  schoolId: number;
  instituteId: number;
  cityId: number;
  countryId: number;
  programs: SchoolProgram[];
};

export type Currency = {
  currencyName: string;
  currencyIcon: string;
  currencyCode: string;
};
// <---------- COUNTRY ------------->
export type Country = {
  id: number;
  name: Localized;
  description: Localized;
  slug: string;
  image: string;
  currency: Currency;
};

// <---------- CITY ------------->
export type City = {
  id: number;
  name: Localized;
  description: Localized;
  slug: string;
  image: string;
  countryId: number;
};
