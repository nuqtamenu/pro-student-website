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

// Currency
export type Currency = {
  code: string;
  symbol: string;
  currencyName: Localized;
};

// <---------- COUNTRY ------------->
export type Country = {
  id: number;
  countryName: Localized;
  countryDescription: Localized;
  slug: string;
  image: string;
  currency: Currency;
};

// <---------- CITY ------------->
export type City = {
  id: number;
  cityName: Localized;
  cityDescription: Localized;
  slug: string;
  image: string;
  countryId: number;
};

// <---------- INSTITUTE ------------->
export type Institute = {
  id: number;
  instituteName: Localized;
  instituteDescription?: Localized;
  slug: string;
  logo?: string;
  image?: string;
};

// <---------- CATEGORY TABLES ------------->
export type Category = {
  id: number;
  slug: string;
  categoryName: Localized;
  categoryDescription?: Localized;
  image?: string;
};

export type CourseCategory = Category;
export type AccommodationCategory = Category;
export type TransferCategory = Category;
export type FeeCategory = Category;

// <---------- SCHOOL ------------->

export type SchoolFee = {
  feeName: Localized;
  feeAmount: number;
  feeFrequency: Frequency;
  optional: boolean;
  feeCategoryId: number;
  note?: Localized;
};

export type School = {
  id: number;
  schoolName: Localized;
  schoolDescription?: Localized;
  slug: string;
  logo?: string;
  image?: string;
  fees: SchoolFee[];
  instituteId: number;
  countryId: number;
  cityId: number;
  note?: Localized;
};

// <---------- COURSE -------------> [Course Addons will be added later]
export type CoursePlan = {
  price: number;
  priceFrequency: Frequency;
  weekRange?: {
    min: number;
    max: number | null;
  };
  lessonsPerWeek?: number;
  note?: Localized;
};

export type Course = {
  id: number;
  courseName: Localized;
  courseDescription?: Localized;
  image?: string;
  discount?: number;
  instituteId: number;
  schoolId: number;
  coursePlans: CoursePlan[];
  courseCategoryId: number;
  requiredLevel?: Localized;
  minimumAge?: number;
  courseDates?: Dates;
  note?: Localized;
  // Hours per week is 45 mins * number of lessons per week
};

// <---------- ACCOMMODATION -------------> [Accommodation Addons/Extras will be added later]
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
  frequency: Frequency;
  optional: boolean;
};

export type Accommodation = {
  id: number;
  accommodationName: Localized;
  accommodationDescription?: Localized;
  image?: string;
  accommodationCategoryId: number;
  note?: Localized;
  minimumAge?: number;
  durationWeeks?: number;
  accommodationDates?: Dates;
  schoolId: number;
  price: number;
  priceFrequency: Frequency;
  location?: RoomLocation[] | null;
  commuteOptions?: CommuteOption[] | null;
  accommodationPlans: AccommodationPlan[];
};

// <---------- TRANSFER ------------->

export type TransferOption = {
  id: number;
  transferName: Localized;
  transferDescription?: Localized;
  pickupLocation: Localized;
  amount: number;
  tripType: TripType;
  transferCategoryId: number;
  note?: Localized;
  schoolId: number;
};
