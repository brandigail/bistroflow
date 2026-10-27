import type { StaffRole } from "@/types";

export interface DemoStaff {
  /** Fixed so open login pages and sessions survive a demo-data reset. */
  id: string;
  name: string;
  role: StaffRole;
  pin: string;
  /** What this person can do, shown on the landing and login screens. */
  blurb: string;
}

// Public demo accounts. PINs are published on purpose and only ever stored hashed.
export const DEMO_STAFF: DemoStaff[] = [
  {
    id: "5a7e0000-0000-4000-8000-000000000001",
    name: "Maya (Waiter)",
    role: "waiter",
    pin: "1111",
    blurb: "Takes orders, settles bills",
  },
  {
    id: "5a7e0000-0000-4000-8000-000000000002",
    name: "Luca (Kitchen)",
    role: "kitchen",
    pin: "2222",
    blurb: "Runs the kitchen display",
  },
  {
    id: "5a7e0000-0000-4000-8000-000000000003",
    name: "Priya (Manager)",
    role: "manager",
    pin: "3333",
    blurb: "Everything, plus inventory and insights",
  },
];
