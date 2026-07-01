## Data Structure

```ts
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
```

## Schoool's Previous Data

```json
{
  "id": 2,
  "schoolName": { "en": "Bayswater Liverpool", "ar": "بايسووتر ليفربول" },
  "schoolDescription": {
    "en": "42-46 Whitechapel, Liverpool",
    "ar": "٤٢-٤٦ وايتشابل، ليفربول"
  },
  "slug": "bayswater-liverpool",
  "logo": "bayswater-logo.png",
  "image": "liverpool-school.jpg",
  "fees": [
    {
      "feeName": { "en": "Registration Fee", "ar": "رسوم التسجيل" },
      "feeAmount": 100,
      "feeFrequency": "fixed",
      "optional": false,
      "feeCategoryId": 1,
      "note": { "en": "", "ar": "" }
    },
    {
      "feeName": { "en": "Material Fee", "ar": "رسوم المواد" },
      "feeAmount": 50,
      "feeFrequency": "fixed",
      "optional": false,
      "feeCategoryId": 2,
      "note": { "en": "", "ar": "" }
    },
    {
      "feeName": { "en": "Insurance", "ar": "التأمين" },
      "feeAmount": 25,
      "feeFrequency": "weekly",
      "optional": true,
      "feeCategoryId": 4,
      "note": { "en": "", "ar": "" }
    }
  ],
  "instituteId": 1,
  "countryId": 1,
  "cityId": 2,
  "note": { "en": "", "ar": "" }
}
```

Please udpate the data according to the structure and grab that data from the ref image
