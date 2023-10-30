import React from "react";

import { useRouter } from "next/router";

import useSWR from "swr";

// layouts
import { AppLayout } from "layouts/app-layout";
import { ProjectSettingLayout } from "layouts/setting-layout";
// services
import { IntegrationService } from "services/integrations";
import { ProjectService } from "services/project";
// components
import { SingleIntegration } from "components/project";
import { ProjectSettingHeader } from "components/headers";
// ui
import { EmptyState } from "components/common";
import { Loader } from "@plane/ui";
// images
import emptyIntegration from "public/empty-state/integration.svg";
// types
import { IProject } from "types";
import type { NextPage } from "next";
// fetch-keys
import { PROJECT_DETAILS, WORKSPACE_INTEGRATIONS } from "constants/fetch-keys";
// helper
// import { useMobxStore } from "lib/mobx/store-provider";

// services
const integrationService = new IntegrationService();
const projectService = new ProjectService();

const ProjectIntegrations: NextPage = () => {
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  // const { project: projectStore } = useMobxStore();

  // const projectDetails = projectId ? projectStore.project_details[projectId.toString()] : null;

  const { data: projectDetails } = useSWR<IProject>(
    workspaceSlug && projectId ? PROJECT_DETAILS(projectId as string) : null,
    workspaceSlug && projectId ? () => projectService.getProject(workspaceSlug as string, projectId as string) : null
  );

  const { data: workspaceIntegrations } = useSWR(
    workspaceSlug ? WORKSPACE_INTEGRATIONS(workspaceSlug as string) : null,
    () => (workspaceSlug ? integrationService.getWorkspaceIntegrationsList(workspaceSlug as string) : null)
  );

  const isAdmin = projectDetails?.member_role === 20;

  return (
    <AppLayout header={<ProjectSettingHeader title="Integrations Settings" />}>
      <ProjectSettingLayout>
        <div className={`pr-9 py-8 gap-10 w-full overflow-y-auto ${isAdmin ? "" : "opacity-60"}`}>
          <div className="flex items-center py-3.5 border-b border-custom-border-200">
            <h3 className="text-xl font-medium">Integrations</h3>
          </div>
          {workspaceIntegrations ? (
            workspaceIntegrations.length > 0 ? (
              <div>
                {workspaceIntegrations.map((integration) => (
                  <SingleIntegration key={integration.integration_detail.id} integration={integration} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="You haven't configured integrations"
                description="Configure GitHub and other integrations to sync your project issues."
                image={emptyIntegration}
                primaryButton={{
                  text: "Configure now",
                  onClick: () => router.push(`/${workspaceSlug}/settings/integrations`),
                }}
                disabled={!isAdmin}
              />
            )
          ) : (
            <Loader className="space-y-5">
              <Loader.Item height="40px" />
              <Loader.Item height="40px" />
              <Loader.Item height="40px" />
              <Loader.Item height="40px" />
            </Loader>
          )}
        </div>
      </ProjectSettingLayout>
    </AppLayout>
  );
};

export default ProjectIntegrations;
