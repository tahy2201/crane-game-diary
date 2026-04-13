CREATE TABLE "plays" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"memo" text,
	"spent" integer NOT NULL,
	"result" text NOT NULL,
	"played_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "result_check" CHECK ("plays"."result" IN ('got', 'failed'))
);
