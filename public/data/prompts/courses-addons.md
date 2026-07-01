## Data Structure

```ts
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
```

## References

instituteId:1
countryId:1
cityId:2
schoolId: 2
categoryId: 18

start id of courses from 4
start id of course addons from 2

## Task

Extract the accurate info about courses and addons from the image according to the Data Structure provided on the top.

Please add these notes to "ELTS Preparation: Available in Standard 20 lessons. This can be combined with an additional 5 or 10 General English lessons  
as part of our Intensive or Super Intensive Course
• Minimum level for IELTS Preparation: Level 4 (Bayswater)/B1 (CEFR)"

# Output

Give me json files for all courses extracted from the reference image accurately and also provide the translations for arabic.
