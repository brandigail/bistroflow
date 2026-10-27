import type { Metadata } from "next";
import { KdsBoard } from "@/features/kds/kds-board";

export const metadata: Metadata = { title: "Kitchen | BistroFlow" };

export default function KdsPage() {
  return <KdsBoard />;
}
