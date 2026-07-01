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

// <---------- CATEGORY TABLE ------------->
export type Category = {
  id: number;
  slug: string;
  categoryName: Localized;
  categoryDescription?: Localized;
  image?: string;
  type: "course" | "accommodation" | "transfer" | "fee";
};

// <---------- SCHOOL ------------->

export type SchoolFee = {
  feeName: Localized;
  feeAmount: number;
  feeFrequency: Frequency;
  optional: boolean;
  categoryId?: number;
  feeCategoryId?: number;
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
  totalClassrooms?: number;
  totalCapacity?: number;
  schoolClosureDates?: Dates[];
  countryId: number;
  cityId: number;
  instituteId: number;
  note?: Localized;
};

// <---------- COURSE ------------->
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
  courseIntensity?: Localized;
  courseDescription?: Localized;
  image?: string;
  discount?: number;
  instituteId: number;
  schoolId: number;
  coursePlans: CoursePlan[];
  categoryId: number;
  requiredLevel?: Localized;
  minimumAge?: number;
  courseDates?: Dates;
  oneLessonMins?: number;
  note?: Localized;
};

// <---------- COURSE ADDON ------------->
export type CourseAddon = {
  id: number;
  schoolId: number;
  addonName: Localized;
  lessons?: number;
  price: number;
  note?: Localized;
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

// <---------- TRANSFER ------------->

export type Transfer = {
  id: number;
  transferName: Localized;
  transferDescription?: Localized;
  pickupLocation: Localized;
  amount: number;
  tripType: TripType;
  transferCategoryId?: number;
  categoryId?: number;
  note?: Localized;
  schoolId: number;
};

// <---------- BLOG ------------->
export type Blog = {
  id: number;
  title: Localized;
  slug: string;
  description: Localized;
  image: string;
  content: Localized; // html content can converted by html-react-parser
  publishedAt: Localized;
};
