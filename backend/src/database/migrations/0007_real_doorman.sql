ALTER TYPE "public"."payment_method" ADD VALUE 'link';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'fpx';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'grabpay';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'gcash';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'paymaya';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'paypal';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'paytm';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'phone_number';--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'promptpay';--> statement-breakpoint
ALTER TABLE "seller_balances" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "seller_balances" CASCADE;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'buyer'::text;--> statement-breakpoint
DROP TYPE "public"."user_role";--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('buyer', 'admin');--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'buyer'::"public"."user_role";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE "public"."user_role" USING "role"::"public"."user_role";--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "slug" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "slug" varchar(250) NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_slug_unique" UNIQUE("slug");