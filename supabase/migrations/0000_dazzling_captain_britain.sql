CREATE TYPE "public"."freshness" AS ENUM('new', 'mid', 'old');--> statement-breakpoint
CREATE TYPE "public"."group_role" AS ENUM('owner', 'member');--> statement-breakpoint
CREATE TYPE "public"."play_result" AS ENUM('got', 'failed');--> statement-breakpoint
CREATE TABLE "arcades" (
	"arcade_id" serial PRIMARY KEY NOT NULL,
	"group_id" uuid NOT NULL,
	"name" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"memo" text,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crane_types" (
	"crane_type_id" serial PRIMARY KEY NOT NULL,
	"group_id" uuid,
	"name" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"group_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "group_role" DEFAULT 'member' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "group_members_group_id_user_id_pk" PRIMARY KEY("group_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"group_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invite_tokens" (
	"token_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invite_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "plays" (
	"play_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"arcade_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"prize_id" uuid,
	"date" timestamp with time zone NOT NULL,
	"result" "play_result" NOT NULL,
	"play_count" integer NOT NULL,
	"rate_per_play" integer NOT NULL,
	"memo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prize_categories" (
	"prize_category_id" serial PRIMARY KEY NOT NULL,
	"group_id" uuid,
	"name" text NOT NULL,
	"is_system" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prizes" (
	"prize_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"group_id" uuid NOT NULL,
	"name" text NOT NULL,
	"prize_category_id" integer NOT NULL,
	"crane_type_id" integer NOT NULL,
	"freshness" "freshness" NOT NULL,
	"photo_url" text,
	"estimated_value" integer,
	"memo" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "arcades" ADD CONSTRAINT "arcades_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crane_types" ADD CONSTRAINT "crane_types_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invite_tokens" ADD CONSTRAINT "invite_tokens_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plays" ADD CONSTRAINT "plays_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plays" ADD CONSTRAINT "plays_arcade_id_arcades_arcade_id_fk" FOREIGN KEY ("arcade_id") REFERENCES "public"."arcades"("arcade_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plays" ADD CONSTRAINT "plays_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plays" ADD CONSTRAINT "plays_prize_id_prizes_prize_id_fk" FOREIGN KEY ("prize_id") REFERENCES "public"."prizes"("prize_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prize_categories" ADD CONSTRAINT "prize_categories_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_group_id_groups_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("group_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_prize_category_id_prize_categories_prize_category_id_fk" FOREIGN KEY ("prize_category_id") REFERENCES "public"."prize_categories"("prize_category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prizes" ADD CONSTRAINT "prizes_crane_type_id_crane_types_crane_type_id_fk" FOREIGN KEY ("crane_type_id") REFERENCES "public"."crane_types"("crane_type_id") ON DELETE no action ON UPDATE no action;