import { getDb } from "@/db";
import { staff } from "@/db/schema";
import type { StaffMember } from "@/types";

export async function getStaff(): Promise<StaffMember[]> {
  return getDb().select({ id: staff.id, name: staff.name, role: staff.role }).from(staff).orderBy(staff.name);
}
