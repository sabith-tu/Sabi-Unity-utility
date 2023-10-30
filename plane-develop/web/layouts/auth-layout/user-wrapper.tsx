import { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
// ui
import { Spinner } from "@plane/ui";
// store
import { useMobxStore } from "lib/mobx/store-provider";

export interface IUserAuthWrapper {
  children: ReactNode;
}

export const UserAuthWrapper: FC<IUserAuthWrapper> = (props) => {
  const { children } = props;
  // store
  const { user: userStore } = useMobxStore();
  // router
  const router = useRouter();
  // fetching user information
  const { data: currentUser, error } = useSWR("CURRENT_USER_DETAILS", () => userStore.fetchCurrentUser());
  // fetching user settings
  useSWR("CURRENT_USER_SETTINGS", () => userStore.fetchCurrentUserSettings());

  if (!currentUser && !error) {
    return (
      <div className="h-screen grid place-items-center p-4">
        <div className="flex flex-col items-center gap-3 text-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    const redirectTo = router.asPath;
    router.push(`/?next=${redirectTo}`);
    return null;
  }

  return <>{children}</>;
};
