export type CategoryStatus = "active" | "draft" | "archived";

export type Category = {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  description: string | null;
  status: CategoryStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};
