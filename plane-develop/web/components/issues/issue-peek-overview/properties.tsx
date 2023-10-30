import { FC } from "react";
// ui icons
import { DoubleCircleIcon, UserGroupIcon } from "@plane/ui";
import { CalendarDays, Signal } from "lucide-react";
// components
import { IssuePropertyState } from "components/issues/issue-layouts/properties/state";
import { IssuePropertyPriority } from "components/issues/issue-layouts/properties/priority";
import { IssuePropertyAssignee } from "components/issues/issue-layouts/properties/assignee";
import { IssuePropertyDate } from "components/issues/issue-layouts/properties/date";
// types
import { IIssue, IState, IUserLite, TIssuePriorities } from "types";

interface IPeekOverviewProperties {
  issue: IIssue;
  issueUpdate: (issue: Partial<IIssue>) => void;
  states: IState[] | null;
  members: IUserLite[] | null;
  priorities: any;
}

export const PeekOverviewProperties: FC<IPeekOverviewProperties> = (props) => {
  const { issue, issueUpdate, states, members, priorities } = props;

  const handleState = (_state: IState) => {
    issueUpdate({ ...issue, state: _state.id });
  };

  const handlePriority = (_priority: TIssuePriorities) => {
    issueUpdate({ ...issue, priority: _priority });
  };

  const handleAssignee = (_assignees: string[]) => {
    issueUpdate({ ...issue, assignees: _assignees });
  };

  const handleStartDate = (_startDate: string) => {
    issueUpdate({ ...issue, start_date: _startDate });
  };

  const handleTargetDate = (_targetDate: string) => {
    issueUpdate({ ...issue, target_date: _targetDate });
  };

  return (
    <div className="space-y-4">
      {/* state */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-2 w-48 whitespace-nowrap">
          <div className="w-4 h-4 flex justify-center items-center overflow-hidden">
            <DoubleCircleIcon className="h-3.5 w-3.5 flex-shrink-0" />
          </div>
          <div className="font-medium text-custom-text-200 line-clamp-1">State</div>
        </div>
        <div className="w-full">
          <IssuePropertyState
            value={issue?.state_detail || null}
            onChange={handleState}
            states={states}
            disabled={false}
            hideDropdownArrow={true}
          />
        </div>
      </div>

      {/* assignees */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-2 w-48 whitespace-nowrap">
          <div className="w-4 h-4 flex justify-center items-center overflow-hidden">
            <UserGroupIcon className="h-3.5 w-3.5" />
          </div>
          <div className="font-medium text-custom-text-200 line-clamp-1">Assignees</div>
        </div>
        <div className="w-full">
          <IssuePropertyAssignee
            value={issue?.assignees || null}
            onChange={(ids: string[]) => handleAssignee(ids)}
            disabled={false}
            hideDropdownArrow={true}
            members={members}
          />
        </div>
      </div>

      {/* priority */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-2 w-48 whitespace-nowrap">
          <div className="w-4 h-4 flex justify-center items-center overflow-hidden">
            <Signal className="h-3.5 w-3.5" />
          </div>
          <div className="font-medium text-custom-text-200 line-clamp-1">Priority</div>
        </div>
        <div className="w-full">
          <IssuePropertyPriority
            value={issue?.priority || null}
            onChange={handlePriority}
            disabled={false}
            hideDropdownArrow={true}
          />
        </div>
      </div>

      {/* start_date */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-2 w-48 whitespace-nowrap">
          <div className="w-4 h-4 flex justify-center items-center overflow-hidden">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
          <div className="font-medium text-custom-text-200 line-clamp-1">Start date</div>
        </div>
        <div className="w-full">
          <IssuePropertyDate
            value={issue?.start_date || null}
            onChange={(date: string) => handleStartDate(date)}
            disabled={false}
            placeHolder={`Start date`}
          />
        </div>
      </div>

      {/* target_date */}
      <div className="flex items-center gap-2">
        <div className="flex-shrink-0 flex items-center gap-2 w-48 whitespace-nowrap">
          <div className="w-4 h-4 flex justify-center items-center overflow-hidden">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>
          <div className="font-medium text-custom-text-200 line-clamp-1">Target date</div>
        </div>
        <div className="w-full">
          <IssuePropertyDate
            value={issue?.target_date || null}
            onChange={(date: string) => handleTargetDate(date)}
            disabled={false}
            placeHolder={`Target date`}
          />
        </div>
      </div>
    </div>
  );
};
