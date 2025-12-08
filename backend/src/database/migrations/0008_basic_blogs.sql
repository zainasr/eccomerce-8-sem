CREATE TABLE "blogs" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" varchar(200) NOT NULL,
  "slug" varchar(250) NOT NULL UNIQUE,
  "excerpt" text,
  "content" text NOT NULL,
  "cover_image" varchar(500),
  "status" varchar(20) NOT NULL DEFAULT 'draft',
  "author_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "published_at" timestamp,
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);
CREATE INDEX "blogs_status_idx" ON "blogs" ("status");
CREATE INDEX "blogs_published_at_idx" ON "blogs" ("published_at");

