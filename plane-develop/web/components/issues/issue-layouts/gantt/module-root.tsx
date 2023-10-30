import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
// hooks
import { useMobxStore } from "lib/mobx/store-provider";
import useProjectDetails from "hooks/use-project-details";
// components
import { GanttChartRoot, IBlockUpdateData, renderIssueBlocksStructure } from "components/gantt-chart";
import { IssueGanttBlock, IssueGanttSidebarBlock } from "components/issues";
// types
import { IIssueUnGroupedStructure } from "store/issue";

export const ModuleGanttLayout: React.FC = observer(() => {
  const router = useRouter();
  const { workspaceSlug, moduleId } = router.query;

  const { projectDetails } = useProjectDetails();

  const { moduleIssue: moduleIssueStore, issueFilter: issueFilterStore } = useMobxStore();

  const appliedDisplayFilters = issueFilterStore.userDisplayFilters;

  const issues = moduleIssueStore.getIssues;

  const updateIssue = (block: any, payload: IBlockUpdateData) => {
    if (!workspaceSlug || !moduleId) return;

    moduleIssueStore.updateGanttIssueStructure(workspaceSlug.toString(), moduleId.toString(), block, payload);
  };

  const isAllowed = projectDetails?.member_role === 20 || projectDetails?.member_role === 15;

  return (
    <>
      <div className="w-full h-full">
        <GanttChartRoot
          border={false}
          title="Issues"
          loaderTitle="Issues"
          blocks={issues ? renderIssueBlocksStructure(issues as IIssueUnGroupedStructure) : null}
          blockUpdateHandler={updateIssue}
          BlockRender={IssueGanttBlock}
          SidebarBlockRender={IssueGanttSidebarBlock}
          enableBlockLeftResize={isAllowed}
          enableBlockRightResize={isAllowed}
          enableBlockMove={isAllowed}
          enableReorder={appliedDisplayFilters.order_by === "sort_order" && isAllowed}
        />
      </div>
    </>
  );
});
