import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import { Disclosure, Popover, Transition } from "@headlessui/react";
import DatePicker from "react-datepicker";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// services
import { ModuleService } from "services/module.service";
// contexts
import { useProjectMyMembership } from "contexts/project-member.context";
// hooks
import useToast from "hooks/use-toast";
// components
import { LinkModal, LinksList, SidebarProgressStats } from "components/core";
import { DeleteModuleModal, SidebarLeadSelect, SidebarMembersSelect } from "components/modules";
import ProgressChart from "components/core/sidebar/progress-chart";
// ui
import { CustomSelect, CustomMenu, Loader, ProgressBar } from "@plane/ui";
// icon
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  File,
  LinkIcon,
  MoveRight,
  PieChart,
  Plus,
  Trash2,
} from "lucide-react";
// helpers
import { renderDateFormat, renderShortDateWithYearFormat } from "helpers/date-time.helper";
import { capitalizeFirstLetter, copyUrlToClipboard } from "helpers/string.helper";
// types
import { linkDetails, IModule, ModuleLink } from "types";
// fetch-keys
import { MODULE_DETAILS } from "constants/fetch-keys";
// constant
import { MODULE_STATUS } from "constants/module";

const defaultValues: Partial<IModule> = {
  lead: "",
  members_list: [],
  start_date: null,
  target_date: null,
  status: "backlog",
};

type Props = {
  isOpen: boolean;
  moduleId: string;
};

// services
const moduleService = new ModuleService();

// TODO: refactor this component
export const ModuleDetailsSidebar: React.FC<Props> = observer((props) => {
  const { isOpen, moduleId } = props;

  const [moduleDeleteModal, setModuleDeleteModal] = useState(false);
  const [moduleLinkModal, setModuleLinkModal] = useState(false);
  const [selectedLinkToUpdate, setSelectedLinkToUpdate] = useState<linkDetails | null>(null);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { module: moduleStore, user: userStore } = useMobxStore();

  const user = userStore.currentUser ?? undefined;
  const moduleDetails = moduleStore.moduleDetails[moduleId] ?? undefined;

  const { memberRole } = useProjectMyMembership();

  const { setToastAlert } = useToast();

  const { reset, watch, control } = useForm({
    defaultValues,
  });

  const submitChanges = (data: Partial<IModule>) => {
    if (!workspaceSlug || !projectId || !moduleId) return;

    mutate<IModule>(
      MODULE_DETAILS(moduleId as string),
      (prevData) => ({
        ...(prevData as IModule),
        ...data,
      }),
      false
    );

    moduleService
      .patchModule(workspaceSlug as string, projectId as string, moduleId as string, data, user)
      .then(() => mutate(MODULE_DETAILS(moduleId as string)))
      .catch((e) => console.log(e));
  };

  const handleCreateLink = async (formData: ModuleLink) => {
    if (!workspaceSlug || !projectId || !moduleId) return;

    const payload = { metadata: {}, ...formData };

    await moduleService
      .createModuleLink(workspaceSlug as string, projectId as string, moduleId as string, payload)
      .then(() => mutate(MODULE_DETAILS(moduleId as string)))
      .catch((err) => {
        if (err.status === 400)
          setToastAlert({
            type: "error",
            title: "Error!",
            message: "This URL already exists for this module.",
          });
        else
          setToastAlert({
            type: "error",
            title: "Error!",
            message: "Something went wrong. Please try again.",
          });
      });
  };

  const handleUpdateLink = async (formData: ModuleLink, linkId: string) => {
    if (!workspaceSlug || !projectId || !module) return;

    const payload = { metadata: {}, ...formData };

    const updatedLinks = moduleDetails.link_module.map((l) =>
      l.id === linkId
        ? {
            ...l,
            title: formData.title,
            url: formData.url,
          }
        : l
    );

    mutate<IModule>(
      MODULE_DETAILS(module.id),
      (prevData) => ({ ...(prevData as IModule), link_module: updatedLinks }),
      false
    );

    await moduleService
      .updateModuleLink(workspaceSlug as string, projectId as string, module.id, linkId, payload)
      .then(() => {
        mutate(MODULE_DETAILS(module.id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!workspaceSlug || !projectId || !module) return;

    const updatedLinks = moduleDetails.link_module.filter((l) => l.id !== linkId);

    mutate<IModule>(
      MODULE_DETAILS(module.id),
      (prevData) => ({ ...(prevData as IModule), link_module: updatedLinks }),
      false
    );

    await moduleService
      .deleteModuleLink(workspaceSlug as string, projectId as string, module.id, linkId)
      .then(() => {
        mutate(MODULE_DETAILS(module.id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCopyText = () => {
    copyUrlToClipboard(`${workspaceSlug}/projects/${projectId}/modules/${module?.id}`)
      .then(() => {
        setToastAlert({
          type: "success",
          title: "Link copied",
          message: "Module link copied to clipboard",
        });
      })
      .catch(() => {
        setToastAlert({
          type: "error",
          title: "Error!",
          message: "Some error occurred",
        });
      });
  };

  useEffect(() => {
    if (moduleDetails)
      reset({
        ...moduleDetails,
        members_list: moduleDetails.members_list ?? moduleDetails.members_detail?.map((m) => m.id),
      });
  }, [moduleDetails, reset]);

  const isStartValid = new Date(`${moduleDetails?.start_date}`) <= new Date();
  const isEndValid = new Date(`${moduleDetails?.target_date}`) >= new Date(`${moduleDetails?.start_date}`);

  const progressPercentage = moduleDetails
    ? Math.round((moduleDetails.completed_issues / moduleDetails.total_issues) * 100)
    : null;

  const handleEditLink = (link: linkDetails) => {
    setSelectedLinkToUpdate(link);
    setModuleLinkModal(true);
  };

  if (!moduleDetails) return null;

  return (
    <>
      <LinkModal
        isOpen={moduleLinkModal}
        handleClose={() => {
          setModuleLinkModal(false);
          setSelectedLinkToUpdate(null);
        }}
        data={selectedLinkToUpdate}
        status={selectedLinkToUpdate ? true : false}
        createIssueLink={handleCreateLink}
        updateIssueLink={handleUpdateLink}
      />
      <DeleteModuleModal isOpen={moduleDeleteModal} onClose={() => setModuleDeleteModal(false)} data={moduleDetails} />
      <div
        className={`fixed top-[66px] ${
          isOpen ? "right-0" : "-right-[24rem]"
        } h-full w-[24rem] overflow-y-auto border-l border-custom-border-200 bg-custom-sidebar-background-100 pt-5 pb-10 duration-300`}
      >
        {module ? (
          <>
            <div className="flex flex-col items-start justify-center">
              <div className="flex gap-2.5 px-5 text-sm">
                <div className="flex items-center ">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field: { value } }) => (
                      <CustomSelect
                        customButton={
                          <span className="flex cursor-pointer items-center rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 py-1 text-center text-xs capitalize">
                            {capitalizeFirstLetter(`${watch("status")}`)}
                          </span>
                        }
                        value={value}
                        onChange={(value: any) => {
                          submitChanges({ status: value });
                        }}
                      >
                        {MODULE_STATUS.map((option) => (
                          <CustomSelect.Option key={option.value} value={option.value}>
                            <span className="text-xs">{option.label}</span>
                          </CustomSelect.Option>
                        ))}
                      </CustomSelect>
                    )}
                  />
                </div>
                <div className="relative flex h-full w-52 items-center gap-2 text-sm">
                  <Popover className="flex h-full items-center justify-center rounded-lg">
                    {({}) => (
                      <>
                        <Popover.Button
                          className={`group flex h-full items-center gap-2 whitespace-nowrap rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 py-1 text-xs ${
                            moduleDetails.start_date ? "" : "text-custom-text-200"
                          }`}
                        >
                          <CalendarDays className="h-3 w-3" />
                          <span>
                            {renderShortDateWithYearFormat(new Date(`${moduleDetails.start_date}`), "Start date")}
                          </span>
                        </Popover.Button>

                        <Transition
                          as={React.Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute top-10 -right-5 z-20  transform overflow-hidden">
                            <DatePicker
                              selected={watch("start_date") ? new Date(`${watch("start_date")}`) : new Date()}
                              onChange={(date) => {
                                submitChanges({
                                  start_date: renderDateFormat(date),
                                });
                              }}
                              selectsStart
                              startDate={new Date(`${watch("start_date")}`)}
                              endDate={new Date(`${watch("target_date")}`)}
                              maxDate={new Date(`${watch("target_date")}`)}
                              shouldCloseOnSelect
                              inline
                            />
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                  <span>
                    <MoveRight className="h-3 w-3 text-custom-text-200" />
                  </span>
                  <Popover className="flex h-full items-center justify-center rounded-lg">
                    {({}) => (
                      <>
                        <Popover.Button
                          className={`group flex items-center gap-2 whitespace-nowrap rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 py-1 text-xs ${
                            moduleDetails.target_date ? "" : "text-custom-text-200"
                          }`}
                        >
                          <CalendarDays className="h-3 w-3 " />

                          <span>
                            {renderShortDateWithYearFormat(new Date(`${moduleDetails?.target_date}`), "End date")}
                          </span>
                        </Popover.Button>

                        <Transition
                          as={React.Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <Popover.Panel className="absolute top-10 -right-5 z-20  transform overflow-hidden">
                            <DatePicker
                              selected={watch("target_date") ? new Date(`${watch("target_date")}`) : new Date()}
                              onChange={(date) => {
                                submitChanges({
                                  target_date: renderDateFormat(date),
                                });
                              }}
                              selectsEnd
                              startDate={new Date(`${watch("start_date")}`)}
                              endDate={new Date(`${watch("target_date")}`)}
                              minDate={new Date(`${watch("start_date")}`)}
                              shouldCloseOnSelect
                              inline
                            />
                          </Popover.Panel>
                        </Transition>
                      </>
                    )}
                  </Popover>
                </div>
              </div>

              <div className="flex w-full flex-col gap-6 px-6 py-6">
                <div className="flex w-full flex-col items-start justify-start gap-2">
                  <div className="flex w-full items-start justify-between gap-2  ">
                    <div className="max-w-[300px]">
                      <h4 className="text-xl font-semibold break-words w-full text-custom-text-100">
                        {moduleDetails.name}
                      </h4>
                    </div>
                    <CustomMenu width="lg" ellipsis>
                      <CustomMenu.MenuItem onClick={() => setModuleDeleteModal(true)}>
                        <span className="flex items-center justify-start gap-2">
                          <Trash2 className="h-4 w-4" />
                          <span>Delete</span>
                        </span>
                      </CustomMenu.MenuItem>
                      <CustomMenu.MenuItem onClick={handleCopyText}>
                        <span className="flex items-center justify-start gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <span>Copy link</span>
                        </span>
                      </CustomMenu.MenuItem>
                    </CustomMenu>
                  </div>

                  <span className="whitespace-normal text-sm leading-5 text-custom-text-200 break-words w-full">
                    {moduleDetails.description}
                  </span>
                </div>

                <div className="flex flex-col  gap-4  text-sm">
                  <Controller
                    control={control}
                    name="lead"
                    render={({ field: { value } }) => (
                      <SidebarLeadSelect
                        value={value}
                        onChange={(val: string) => {
                          submitChanges({ lead: val });
                        }}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="members_list"
                    render={({ field: { value } }) => (
                      <SidebarMembersSelect
                        value={value}
                        onChange={(val: string[]) => {
                          submitChanges({ members_list: val });
                        }}
                      />
                    )}
                  />

                  <div className="flex items-center justify-start gap-1">
                    <div className="flex w-40 items-center justify-start gap-2 text-custom-text-200">
                      <PieChart className="h-5 w-5" />
                      <span>Progress</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-custom-text-200">
                      <span className="h-4 w-4">
                        <ProgressBar value={moduleDetails.completed_issues} maxValue={moduleDetails.total_issues} />
                      </span>
                      {moduleDetails.completed_issues}/{moduleDetails.total_issues}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-start gap-2 border-t border-custom-border-200 p-6">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <div className={`relative  flex  h-full w-full flex-col ${open ? "" : "flex-row"}`}>
                    <div className="flex w-full items-center justify-between gap-2    ">
                      <div className="flex items-center justify-start gap-2 text-sm">
                        <span className="font-medium text-custom-text-200">Progress</span>
                        {!open && progressPercentage ? (
                          <span className="rounded bg-[#09A953]/10 px-1.5 py-0.5 text-xs text-[#09A953]">
                            {progressPercentage ? `${progressPercentage}%` : ""}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>

                      {isStartValid && isEndValid ? (
                        <Disclosure.Button className="p-1">
                          <ChevronDown className={`h-3 w-3 ${open ? "rotate-180 transform" : ""}`} aria-hidden="true" />
                        </Disclosure.Button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle height={14} width={14} className="text-custom-text-200" />
                          <span className="text-xs italic text-custom-text-200">
                            Invalid date. Please enter valid date.
                          </span>
                        </div>
                      )}
                    </div>
                    <Transition show={open}>
                      <Disclosure.Panel>
                        {isStartValid && isEndValid ? (
                          <div className=" h-full w-full py-4">
                            <div className="flex  items-start justify-between gap-4 py-2 text-xs">
                              <div className="flex items-center gap-1">
                                <span>
                                  <File className="h-3 w-3 text-custom-text-200" />
                                </span>
                                <span>
                                  Pending Issues -{" "}
                                  {moduleDetails.total_issues -
                                    (moduleDetails.completed_issues + moduleDetails.cancelled_issues)}{" "}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-custom-text-100">
                                <div className="flex items-center justify-center gap-1">
                                  <span className="h-2.5 w-2.5 rounded-full bg-[#A9BBD0]" />
                                  <span>Ideal</span>
                                </div>
                                <div className="flex items-center justify-center gap-1">
                                  <span className="h-2.5 w-2.5 rounded-full bg-[#4C8FFF]" />
                                  <span>Current</span>
                                </div>
                              </div>
                            </div>
                            <div className="relative h-40 w-80">
                              <ProgressChart
                                distribution={moduleDetails.distribution.completion_chart}
                                startDate={moduleDetails.start_date ?? ""}
                                endDate={moduleDetails.target_date ?? ""}
                                totalIssues={moduleDetails.total_issues}
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            </div>

            <div className="flex w-full flex-col items-center justify-start gap-2 border-t border-custom-border-200 p-6">
              <Disclosure defaultOpen>
                {({ open }) => (
                  <div className={`relative  flex  h-full w-full flex-col ${open ? "" : "flex-row"}`}>
                    <div className="flex w-full items-center justify-between gap-2    ">
                      <div className="flex items-center justify-start gap-2 text-sm">
                        <span className="font-medium text-custom-text-200">Other Information</span>
                      </div>

                      {moduleDetails.total_issues > 0 ? (
                        <Disclosure.Button className="p-1">
                          <ChevronDown className={`h-3 w-3 ${open ? "rotate-180 transform" : ""}`} aria-hidden="true" />
                        </Disclosure.Button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle height={14} width={14} className="text-custom-text-200" />
                          <span className="text-xs italic text-custom-text-200">
                            No issues found. Please add issue.
                          </span>
                        </div>
                      )}
                    </div>
                    <Transition show={open}>
                      <Disclosure.Panel>
                        {moduleDetails.total_issues > 0 ? (
                          <>
                            <div className=" h-full w-full py-4">
                              <SidebarProgressStats
                                distribution={moduleDetails.distribution}
                                groupedIssues={{
                                  backlog: moduleDetails.backlog_issues,
                                  unstarted: moduleDetails.unstarted_issues,
                                  started: moduleDetails.started_issues,
                                  completed: moduleDetails.completed_issues,
                                  cancelled: moduleDetails.cancelled_issues,
                                }}
                                totalIssues={moduleDetails.total_issues}
                                module={moduleDetails}
                              />
                            </div>
                          </>
                        ) : (
                          ""
                        )}
                      </Disclosure.Panel>
                    </Transition>
                  </div>
                )}
              </Disclosure>
            </div>

            <div className="flex w-full flex-col border-t border-custom-border-200 px-6 pt-6 pb-10 text-xs">
              <div className="flex w-full items-center justify-between">
                <h4 className="text-sm font-medium text-custom-text-200">Links</h4>
                <button
                  className="grid h-7 w-7 place-items-center rounded p-1 outline-none duration-300 hover:bg-custom-background-90"
                  onClick={() => setModuleLinkModal(true)}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-2 space-y-2 hover:bg-custom-background-80">
                {memberRole && moduleDetails.link_module && moduleDetails.link_module.length > 0 ? (
                  <LinksList
                    links={moduleDetails.link_module}
                    handleEditLink={handleEditLink}
                    handleDeleteLink={handleDeleteLink}
                    userAuth={memberRole}
                  />
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <Loader className="px-5">
            <div className="space-y-2">
              <Loader.Item height="15px" width="50%" />
              <Loader.Item height="15px" width="30%" />
            </div>
            <div className="mt-8 space-y-3">
              <Loader.Item height="30px" />
              <Loader.Item height="30px" />
              <Loader.Item height="30px" />
            </div>
          </Loader>
        )}
      </div>
    </>
  );
});
