import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react-lite";
import { mutate } from "swr";
import { useForm } from "react-hook-form";
import { Disclosure, Popover, Transition } from "@headlessui/react";
// mobx store
import { useMobxStore } from "lib/mobx/store-provider";
// services
import { CycleService } from "services/cycle.service";
// hooks
import useToast from "hooks/use-toast";
// components
import { SidebarProgressStats } from "components/core";
import ProgressChart from "components/core/sidebar/progress-chart";
import { CycleDeleteModal } from "components/cycles/delete-modal";
// ui
import { CustomRangeDatePicker } from "components/ui";
import { CustomMenu, Loader, ProgressBar } from "@plane/ui";
// icons
import {
  CalendarDays,
  ChevronDown,
  File,
  MoveRight,
  LinkIcon,
  PieChart,
  Trash2,
  UserCircle2,
  AlertCircle,
} from "lucide-react";
// helpers
import { capitalizeFirstLetter, copyUrlToClipboard } from "helpers/string.helper";
import {
  getDateRangeStatus,
  isDateGreaterThanToday,
  renderDateFormat,
  renderShortDateWithYearFormat,
} from "helpers/date-time.helper";
// types
import { ICycle } from "types";
// fetch-keys
import { CYCLE_DETAILS } from "constants/fetch-keys";

type Props = {
  isOpen: boolean;
  cycleId: string;
};

// services
const cycleService = new CycleService();

// TODO: refactor the whole component
export const CycleDetailsSidebar: React.FC<Props> = observer((props) => {
  const { isOpen, cycleId } = props;

  const [cycleDeleteModal, setCycleDeleteModal] = useState(false);

  const router = useRouter();
  const { workspaceSlug, projectId } = router.query;

  const { user: userStore, cycle: cycleDetailsStore } = useMobxStore();

  const user = userStore.currentUser ?? undefined;
  const cycleDetails = cycleDetailsStore.cycle_details[cycleId] ?? undefined;

  const { setToastAlert } = useToast();

  const defaultValues: Partial<ICycle> = {
    start_date: new Date().toString(),
    end_date: new Date().toString(),
  };

  const { setValue, reset, watch } = useForm({
    defaultValues,
  });

  const submitChanges = (data: Partial<ICycle>) => {
    if (!workspaceSlug || !projectId || !cycleId) return;

    mutate<ICycle>(CYCLE_DETAILS(cycleId as string), (prevData) => ({ ...(prevData as ICycle), ...data }), false);

    cycleService
      .patchCycle(workspaceSlug as string, projectId as string, cycleId as string, data, user)
      .then(() => mutate(CYCLE_DETAILS(cycleId as string)))
      .catch((e) => console.log(e));
  };

  const handleCopyText = () => {
    copyUrlToClipboard(`${workspaceSlug}/projects/${projectId}/cycles/${cycleId}`)
      .then(() => {
        setToastAlert({
          type: "success",
          title: "Cycle link copied to clipboard",
        });
      })
      .catch(() => {
        setToastAlert({
          type: "error",
          title: "Some error occurred",
        });
      });
  };

  useEffect(() => {
    if (cycleDetails)
      reset({
        ...cycleDetails,
      });
  }, [cycleDetails, reset]);

  const dateChecker = async (payload: any) => {
    try {
      const res = await cycleService.cycleDateCheck(workspaceSlug as string, projectId as string, payload);
      return res.status;
    } catch (err) {
      return false;
    }
  };

  const handleStartDateChange = async (date: string) => {
    setValue("start_date", date);
    if (
      watch("start_date") &&
      watch("end_date") &&
      watch("start_date") !== "" &&
      watch("end_date") &&
      watch("start_date") !== ""
    ) {
      if (!isDateGreaterThanToday(`${watch("end_date")}`)) {
        setToastAlert({
          type: "error",
          title: "Error!",
          message: "Unable to create cycle in past date. Please enter a valid date.",
        });
        return;
      }

      if (cycleDetails?.start_date && cycleDetails?.end_date) {
        const isDateValidForExistingCycle = await dateChecker({
          start_date: `${watch("start_date")}`,
          end_date: `${watch("end_date")}`,
          cycle_id: cycleDetails.id,
        });

        if (isDateValidForExistingCycle) {
          await submitChanges({
            start_date: renderDateFormat(`${watch("start_date")}`),
            end_date: renderDateFormat(`${watch("end_date")}`),
          });
          setToastAlert({
            type: "success",
            title: "Success!",
            message: "Cycle updated successfully.",
          });
          return;
        } else {
          setToastAlert({
            type: "error",
            title: "Error!",
            message:
              "You have a cycle already on the given dates, if you want to create your draft cycle you can do that by removing dates",
          });
          return;
        }
      }

      const isDateValid = await dateChecker({
        start_date: `${watch("start_date")}`,
        end_date: `${watch("end_date")}`,
      });

      if (isDateValid) {
        submitChanges({
          start_date: renderDateFormat(`${watch("start_date")}`),
          end_date: renderDateFormat(`${watch("end_date")}`),
        });
        setToastAlert({
          type: "success",
          title: "Success!",
          message: "Cycle updated successfully.",
        });
      } else {
        setToastAlert({
          type: "error",
          title: "Error!",
          message:
            "You have a cycle already on the given dates, if you want to create your draft cycle you can do that by removing dates",
        });
      }
    }
  };

  const handleEndDateChange = async (date: string) => {
    setValue("end_date", date);

    if (
      watch("start_date") &&
      watch("end_date") &&
      watch("start_date") !== "" &&
      watch("end_date") &&
      watch("start_date") !== ""
    ) {
      if (!isDateGreaterThanToday(`${watch("end_date")}`)) {
        setToastAlert({
          type: "error",
          title: "Error!",
          message: "Unable to create cycle in past date. Please enter a valid date.",
        });
        return;
      }

      if (cycleDetails?.start_date && cycleDetails?.end_date) {
        const isDateValidForExistingCycle = await dateChecker({
          start_date: `${watch("start_date")}`,
          end_date: `${watch("end_date")}`,
          cycle_id: cycleDetails.id,
        });

        if (isDateValidForExistingCycle) {
          await submitChanges({
            start_date: renderDateFormat(`${watch("start_date")}`),
            end_date: renderDateFormat(`${watch("end_date")}`),
          });
          setToastAlert({
            type: "success",
            title: "Success!",
            message: "Cycle updated successfully.",
          });
          return;
        } else {
          setToastAlert({
            type: "error",
            title: "Error!",
            message:
              "You have a cycle already on the given dates, if you want to create your draft cycle you can do that by removing dates",
          });
          return;
        }
      }

      const isDateValid = await dateChecker({
        start_date: `${watch("start_date")}`,
        end_date: `${watch("end_date")}`,
      });

      if (isDateValid) {
        submitChanges({
          start_date: renderDateFormat(`${watch("start_date")}`),
          end_date: renderDateFormat(`${watch("end_date")}`),
        });
        setToastAlert({
          type: "success",
          title: "Success!",
          message: "Cycle updated successfully.",
        });
      } else {
        setToastAlert({
          type: "error",
          title: "Error!",
          message:
            "You have a cycle already on the given dates, if you want to create your draft cycle you can do that by removing dates",
        });
      }
    }
  };

  const cycleStatus =
    cycleDetails?.start_date && cycleDetails?.end_date
      ? getDateRangeStatus(cycleDetails?.start_date, cycleDetails?.end_date)
      : "draft";
  const isCompleted = cycleStatus === "completed";

  const isStartValid = new Date(`${cycleDetails?.start_date}`) <= new Date();
  const isEndValid = new Date(`${cycleDetails?.end_date}`) >= new Date(`${cycleDetails?.start_date}`);

  const progressPercentage = cycleDetails
    ? Math.round((cycleDetails.completed_issues / cycleDetails.total_issues) * 100)
    : null;

  if (!cycleDetails) return null;

  return (
    <>
      {cycleDetails && workspaceSlug && projectId && (
        <CycleDeleteModal
          cycle={cycleDetails}
          isOpen={cycleDeleteModal}
          handleClose={() => setCycleDeleteModal(false)}
          workspaceSlug={workspaceSlug.toString()}
          projectId={projectId.toString()}
        />
      )}
      <div
        className={`fixed top-[66px] ${
          isOpen ? "right-0" : "-right-[24rem]"
        } h-full w-[24rem] overflow-y-auto border-l border-custom-border-200 bg-custom-sidebar-background-100 pt-5 pb-10 duration-300`}
      >
        {cycleDetails ? (
          <>
            <div className="flex flex-col items-start justify-center">
              <div className="flex gap-2.5 px-5 text-sm">
                <div className="flex items-center">
                  <span className="flex items-center rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 py-1 text-center text-xs capitalize">
                    {capitalizeFirstLetter(cycleStatus)}
                  </span>
                </div>
                <div className="relative flex h-full w-52 items-center gap-2">
                  <Popover className="flex h-full items-center justify-center rounded-lg">
                    {({}) => (
                      <>
                        <Popover.Button
                          disabled={isCompleted ?? false}
                          className={`group flex h-full items-center gap-2 whitespace-nowrap rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 py-1 text-xs ${
                            cycleDetails.start_date ? "" : "text-custom-text-200"
                          }`}
                        >
                          <CalendarDays className="h-3 w-3" />
                          <span>
                            {renderShortDateWithYearFormat(
                              new Date(`${watch("start_date") ? watch("start_date") : cycleDetails?.start_date}`),
                              "Start date"
                            )}
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
                            <CustomRangeDatePicker
                              value={watch("start_date") ? watch("start_date") : cycleDetails?.start_date}
                              onChange={(val) => {
                                if (val) {
                                  handleStartDateChange(val);
                                }
                              }}
                              startDate={watch("start_date") ? `${watch("start_date")}` : null}
                              endDate={watch("end_date") ? `${watch("end_date")}` : null}
                              maxDate={new Date(`${watch("end_date")}`)}
                              selectsStart
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
                          disabled={isCompleted ?? false}
                          className={`group flex items-center gap-2 whitespace-nowrap rounded border-[0.5px] border-custom-border-200 bg-custom-background-90 px-2 py-1 text-xs ${
                            cycleDetails.end_date ? "" : "text-custom-text-200"
                          }`}
                        >
                          <CalendarDays className="h-3 w-3" />

                          <span>
                            {renderShortDateWithYearFormat(
                              new Date(`${watch("end_date") ? watch("end_date") : cycleDetails?.end_date}`),
                              "End date"
                            )}
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
                          <Popover.Panel className="absolute top-10 -right-5 z-20 transform overflow-hidden">
                            <CustomRangeDatePicker
                              value={watch("end_date") ? watch("end_date") : cycleDetails?.end_date}
                              onChange={(val) => {
                                if (val) {
                                  handleEndDateChange(val);
                                }
                              }}
                              startDate={watch("start_date") ? `${watch("start_date")}` : null}
                              endDate={watch("end_date") ? `${watch("end_date")}` : null}
                              minDate={new Date(`${watch("start_date")}`)}
                              selectsEnd
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
                  <div className="flex w-full items-start justify-between gap-2">
                    <div className="max-w-[300px]">
                      <h4 className="text-xl font-semibold text-custom-text-100 break-words w-full">
                        {cycleDetails.name}
                      </h4>
                    </div>
                    <CustomMenu width="lg" ellipsis>
                      {!isCompleted && (
                        <CustomMenu.MenuItem onClick={() => setCycleDeleteModal(true)}>
                          <span className="flex items-center justify-start gap-2">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </span>
                        </CustomMenu.MenuItem>
                      )}
                      <CustomMenu.MenuItem onClick={handleCopyText}>
                        <span className="flex items-center justify-start gap-2">
                          <LinkIcon className="h-4 w-4" />
                          <span>Copy link</span>
                        </span>
                      </CustomMenu.MenuItem>
                    </CustomMenu>
                  </div>

                  <span className="whitespace-normal text-sm leading-5 text-custom-text-200 break-words w-full">
                    {cycleDetails.description}
                  </span>
                </div>

                <div className="flex flex-col  gap-4  text-sm">
                  <div className="flex items-center justify-start gap-1">
                    <div className="flex w-40 items-center justify-start gap-2 text-custom-text-200">
                      <UserCircle2 className="h-5 w-5" />
                      <span>Lead</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {cycleDetails.owned_by.avatar && cycleDetails.owned_by.avatar !== "" ? (
                        <img
                          src={cycleDetails.owned_by.avatar}
                          height={12}
                          width={12}
                          className="rounded-full"
                          alt={cycleDetails.owned_by.display_name}
                        />
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-800 capitalize  text-white">
                          {cycleDetails.owned_by.display_name.charAt(0)}
                        </span>
                      )}
                      <span className="text-custom-text-200">{cycleDetails.owned_by.display_name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-start gap-1">
                    <div className="flex w-40 items-center justify-start gap-2 text-custom-text-200">
                      <PieChart className="h-5 w-5" />
                      <span>Progress</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-custom-text-200">
                      <span className="h-4 w-4">
                        <ProgressBar value={cycleDetails.completed_issues} maxValue={cycleDetails.total_issues} />
                      </span>
                      {cycleDetails.completed_issues}/{cycleDetails.total_issues}
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
                        <Disclosure.Button>
                          <ChevronDown className={`h-3 w-3 ${open ? "rotate-180 transform" : ""}`} aria-hidden="true" />
                        </Disclosure.Button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-custom-text-200" />
                          <span className="text-xs italic text-custom-text-200">
                            {cycleStatus === "upcoming"
                              ? "Cycle is yet to start."
                              : "Invalid date. Please enter valid date."}
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
                                  {cycleDetails.total_issues -
                                    (cycleDetails.completed_issues + cycleDetails.cancelled_issues)}
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
                            <div className="relative">
                              <ProgressChart
                                distribution={cycleDetails.distribution.completion_chart}
                                startDate={cycleDetails.start_date ?? ""}
                                endDate={cycleDetails.end_date ?? ""}
                                totalIssues={cycleDetails.total_issues}
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
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center justify-start gap-2 text-sm">
                        <span className="font-medium text-custom-text-200">Other Information</span>
                      </div>

                      {cycleDetails.total_issues > 0 ? (
                        <Disclosure.Button>
                          <ChevronDown className={`h-3 w-3 ${open ? "rotate-180 transform" : ""}`} aria-hidden="true" />
                        </Disclosure.Button>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-custom-text-200" />
                          <span className="text-xs italic text-custom-text-200">
                            No issues found. Please add issue.
                          </span>
                        </div>
                      )}
                    </div>
                    <Transition show={open}>
                      <Disclosure.Panel>
                        {cycleDetails.total_issues > 0 ? (
                          <div className="h-full w-full py-4">
                            <SidebarProgressStats
                              distribution={cycleDetails.distribution}
                              groupedIssues={{
                                backlog: cycleDetails.backlog_issues,
                                unstarted: cycleDetails.unstarted_issues,
                                started: cycleDetails.started_issues,
                                completed: cycleDetails.completed_issues,
                                cancelled: cycleDetails.cancelled_issues,
                              }}
                              totalIssues={cycleDetails.total_issues}
                            />
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
