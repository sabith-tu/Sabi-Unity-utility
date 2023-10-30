import { useRouter } from "next/router";
import Link from "next/link";
import { observer } from "mobx-react-lite";
import { Plus } from "lucide-react";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// hooks
import useLocalStorage from "hooks/use-local-storage";
// ui
import { Breadcrumbs, BreadcrumbItem, Button, Tooltip } from "@plane/ui";
import { Icon } from "components/ui";
// helper
import { replaceUnderscoreIfSnakeCase, truncateText } from "helpers/string.helper";

const moduleViewOptions: { type: "grid" | "gantt_chart"; icon: any }[] = [
  {
    type: "gantt_chart",
    icon: "view_timeline",
  },
  {
    type: "grid",
    icon: "table_rows",
  },
];

export const ModulesListHeader: React.FC = observer(() => {
  // router
  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { project: projectStore } = useMobxStore();
  const projectDetails = projectId ? projectStore.project_details[projectId.toString()] : undefined;

  const { storedValue: modulesView, setValue: setModulesView } = useLocalStorage("modules_view", "grid");

  return (
    <div
      className={`relative z-10 flex w-full flex-shrink-0 flex-row items-center justify-between gap-x-2 gap-y-4 border-b border-custom-border-200 bg-custom-sidebar-background-100 p-4`}
    >
      <div className="flex w-full flex-grow items-center gap-2 overflow-ellipsis whitespace-nowrap">
        <div>
          <Breadcrumbs onBack={() => router.back()}>
            <BreadcrumbItem
              link={
                <Link href={`/${workspaceSlug}/projects`}>
                  <a className={`border-r-2 border-custom-sidebar-border-200 px-3 text-sm `}>
                    <p>Projects</p>
                  </a>
                </Link>
              }
            />
            <BreadcrumbItem title={`${truncateText(projectDetails?.name ?? "Project", 32)} Modules`} />
          </Breadcrumbs>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {moduleViewOptions.map((option) => (
          <Tooltip
            key={option.type}
            tooltipContent={<span className="capitalize">{replaceUnderscoreIfSnakeCase(option.type)} Layout</span>}
            position="bottom"
          >
            <button
              type="button"
              className={`grid h-7 w-7 place-items-center rounded p-1 outline-none duration-300 hover:bg-custom-sidebar-background-80 ${
                modulesView === option.type ? "bg-custom-sidebar-background-80" : "text-custom-sidebar-text-200"
              }`}
              onClick={() => setModulesView(option.type)}
            >
              <Icon iconName={option.icon} className={`!text-base ${option.type === "grid" ? "rotate-90" : ""}`} />
            </button>
          </Tooltip>
        ))}
        <Button
          variant="primary"
          prependIcon={<Plus />}
          onClick={() => {
            const e = new KeyboardEvent("keydown", { key: "m" });
            document.dispatchEvent(e);
          }}
        >
          Add Module
        </Button>
      </div>
    </div>
  );
});
