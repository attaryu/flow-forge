-- CreateTable
CREATE TABLE "users" (
    "users__id" UUID NOT NULL,
    "users__email" VARCHAR(255) NOT NULL,
    "users__password_hash" VARCHAR(255) NOT NULL,
    "users__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("users__id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "organizations__name" VARCHAR(255) NOT NULL,
    "organizations__created_by" UUID NOT NULL,
    "organizations__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "roles__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_members" (
    "id" UUID NOT NULL,
    "organization_members__user_id" UUID NOT NULL,
    "organization_members__organization_id" UUID NOT NULL,
    "organization_members__role_id" UUID NOT NULL,
    "organizationmembers__joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "organization_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" UUID NOT NULL,
    "user_sessions__user_id" UUID NOT NULL,
    "token" VARCHAR(500) NOT NULL,
    "user_sessions__expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "user_sessions__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" UUID NOT NULL,
    "workflows__tenant_id" UUID NOT NULL,
    "workflows__name" VARCHAR(255) NOT NULL,
    "workflows__description" TEXT,
    "workflows__definition" JSONB NOT NULL,
    "workflows__version" INTEGER NOT NULL DEFAULT 1,
    "workflows__status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "workflows__created_by" UUID NOT NULL,
    "workflows__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "workflows__updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_versions" (
    "id" UUID NOT NULL,
    "workflow_versions__workflow_id" UUID NOT NULL,
    "workflow_versions__definition" JSONB NOT NULL,
    "workflow_versions__version" INTEGER NOT NULL,
    "workflow_versions__created_by" UUID NOT NULL,
    "workflow_versions__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_triggers" (
    "id" UUID NOT NULL,
    "workflow_triggers__workflow_id" UUID NOT NULL,
    "workflow_triggers__trigger_type" VARCHAR(50) NOT NULL,
    "workflow_triggers__config" JSONB NOT NULL,
    "workflow_triggers__is_active" BOOLEAN NOT NULL DEFAULT true,
    "workflow_triggers__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_runs" (
    "id" UUID NOT NULL,
    "workflow_runs__workflow_id" UUID NOT NULL,
    "workflow_runs__tenant_id" UUID NOT NULL,
    "workflow_runs__triggered_by" UUID,
    "workflow_runs__trigger_type" VARCHAR(50),
    "workflow_runs__status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "workflow_runs__started_at" TIMESTAMP(3),
    "workflow_runs__ended_at" TIMESTAMP(3),
    "workflow_runs__total_duration_ms" INTEGER,
    "workflow_runs__error_message" TEXT,
    "workflow_runs__ai_diagnosis" TEXT,
    "workflow_runs__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_logs" (
    "id" UUID NOT NULL,
    "step_logs__run_id" UUID NOT NULL,
    "step_logs__step_id" VARCHAR(255) NOT NULL,
    "step_logs__step_name" VARCHAR(255) NOT NULL,
    "step_logs__step_type" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "input" JSONB,
    "output" TEXT,
    "step_logs__error_message" TEXT,
    "step_logs__duration_ms" INTEGER,
    "step_logs__retry_count" INTEGER NOT NULL DEFAULT 0,
    "step_logs__executed_at" TIMESTAMP(3) NOT NULL,
    "step_logs__created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "step_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_users__email_key" ON "users"("users__email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "organization_members_organization_members__user_id_organiza_key" ON "organization_members"("organization_members__user_id", "organization_members__organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "user_sessions_token_idx" ON "user_sessions"("token");

-- CreateIndex
CREATE INDEX "workflows_workflows__tenant_id_idx" ON "workflows"("workflows__tenant_id");

-- CreateIndex
CREATE INDEX "workflow_versions_workflow_versions__workflow_id_idx" ON "workflow_versions"("workflow_versions__workflow_id");

-- CreateIndex
CREATE INDEX "workflow_triggers_workflow_triggers__workflow_id_idx" ON "workflow_triggers"("workflow_triggers__workflow_id");

-- CreateIndex
CREATE INDEX "workflow_triggers_workflow_triggers__trigger_type_idx" ON "workflow_triggers"("workflow_triggers__trigger_type");

-- CreateIndex
CREATE INDEX "workflow_runs_workflow_runs__workflow_id_idx" ON "workflow_runs"("workflow_runs__workflow_id");

-- CreateIndex
CREATE INDEX "workflow_runs_workflow_runs__tenant_id_idx" ON "workflow_runs"("workflow_runs__tenant_id");

-- CreateIndex
CREATE INDEX "workflow_runs_workflow_runs__created_at_idx" ON "workflow_runs"("workflow_runs__created_at" DESC);

-- CreateIndex
CREATE INDEX "step_logs_step_logs__run_id_idx" ON "step_logs"("step_logs__run_id");

-- CreateIndex
CREATE INDEX "step_logs_step_logs__executed_at_idx" ON "step_logs"("step_logs__executed_at" DESC);

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_organizations__created_by_fkey" FOREIGN KEY ("organizations__created_by") REFERENCES "users"("users__id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_members__user_id_fkey" FOREIGN KEY ("organization_members__user_id") REFERENCES "users"("users__id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_members__organization_id_fkey" FOREIGN KEY ("organization_members__organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_members" ADD CONSTRAINT "organization_members_organization_members__role_id_fkey" FOREIGN KEY ("organization_members__role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_sessions__user_id_fkey" FOREIGN KEY ("user_sessions__user_id") REFERENCES "users"("users__id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_workflows__tenant_id_fkey" FOREIGN KEY ("workflows__tenant_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_workflows__created_by_fkey" FOREIGN KEY ("workflows__created_by") REFERENCES "users"("users__id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_versions" ADD CONSTRAINT "workflow_versions_workflow_versions__workflow_id_fkey" FOREIGN KEY ("workflow_versions__workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_versions" ADD CONSTRAINT "workflow_versions_workflow_versions__created_by_fkey" FOREIGN KEY ("workflow_versions__created_by") REFERENCES "users"("users__id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_triggers" ADD CONSTRAINT "workflow_triggers_workflow_triggers__workflow_id_fkey" FOREIGN KEY ("workflow_triggers__workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_workflow_runs__workflow_id_fkey" FOREIGN KEY ("workflow_runs__workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_workflow_runs__tenant_id_fkey" FOREIGN KEY ("workflow_runs__tenant_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_runs" ADD CONSTRAINT "workflow_runs_workflow_runs__triggered_by_fkey" FOREIGN KEY ("workflow_runs__triggered_by") REFERENCES "users"("users__id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_logs" ADD CONSTRAINT "step_logs_step_logs__run_id_fkey" FOREIGN KEY ("step_logs__run_id") REFERENCES "workflow_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
