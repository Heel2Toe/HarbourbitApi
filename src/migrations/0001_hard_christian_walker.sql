ALTER TABLE "journals" ALTER COLUMN "content" SET DATA TYPE varchar(2000);--> statement-breakpoint
ALTER TABLE "journals" ADD COLUMN "sentiment" varchar(10) NOT NULL;