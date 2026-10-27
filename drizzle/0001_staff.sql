CREATE TYPE "public"."staff_role" AS ENUM('waiter', 'kitchen', 'manager');--> statement-breakpoint
CREATE TABLE "staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"role" "staff_role" NOT NULL,
	"pin_hash" text NOT NULL,
	CONSTRAINT "staff_name_unique" UNIQUE("name")
);
