export const CatalogCategoryEnum = {
  Livestock: 'livestock',
  Crops: 'crops',
  Machinery: 'machinery',
} as const;

export type CatalogCategory =
  (typeof CatalogCategoryEnum)[keyof typeof CatalogCategoryEnum];
