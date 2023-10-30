import { useEffect, useState } from "react";
// next themes
import { useTheme } from "next-themes";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
import { useRouter } from "next/router";
import { applyTheme, unsetCustomCssVariables } from "helpers/theme.helper";
import { observer } from "mobx-react-lite";

const MobxStoreInit = observer(() => {
  // router
  const router = useRouter();
  const { workspaceSlug, projectId, cycleId, moduleId, globalViewId, viewId, inboxId } = router.query;
  // store
  const {
    theme: themeStore,
    user: userStore,
    workspace: workspaceStore,
    project: projectStore,
    cycle: cycleStore,
    module: moduleStore,
    globalViews: globalViewsStore,
    projectViews: projectViewsStore,
    inbox: inboxStore,
  } = useMobxStore();
  // state
  const [dom, setDom] = useState<any>();
  // theme
  const { setTheme } = useTheme();

  /**
   * Sidebar collapsed fetching from local storage
   */
  useEffect(() => {
    const localValue = localStorage && localStorage.getItem("app_sidebar_collapsed");
    const localBoolValue = localValue ? (localValue === "true" ? true : false) : false;
    if (localValue && themeStore?.sidebarCollapsed === undefined) {
      themeStore.toggleSidebar(localBoolValue);
    }
  }, [themeStore, userStore, setTheme]);

  /**
   * Setting up the theme of the user by fetching it from local storage
   */
  useEffect(() => {
    if (!userStore.currentUser) return;
    if (window) {
      setDom(window.document?.querySelector<HTMLElement>("[data-theme='custom']"));
    }
    setTheme(userStore.currentUser?.theme?.theme || "system");
    if (userStore.currentUser?.theme?.theme === "custom" && dom) {
      applyTheme(userStore.currentUser?.theme?.palette, false);
    } else unsetCustomCssVariables();
  }, [userStore.currentUser, setTheme, dom]);

  /**
   * Setting router info to the respective stores.
   */
  useEffect(() => {
    if (workspaceSlug) workspaceStore.setWorkspaceSlug(workspaceSlug.toString());
    if (projectId) projectStore.setProjectId(projectId.toString());
    if (cycleId) cycleStore.setCycleId(cycleId.toString());
    if (moduleId) moduleStore.setModuleId(moduleId.toString());
    if (globalViewId) globalViewsStore.setGlobalViewId(globalViewId.toString());
    if (viewId) projectViewsStore.setViewId(viewId.toString());
    if (inboxId) inboxStore.setInboxId(inboxId.toString());
  }, [
    workspaceSlug,
    projectId,
    cycleId,
    moduleId,
    globalViewId,
    viewId,
    inboxId,
    workspaceStore,
    projectStore,
    cycleStore,
    moduleStore,
    globalViewsStore,
    projectViewsStore,
    inboxStore,
  ]);

  return <></>;
});

export default MobxStoreInit;
