// Importing components related to RecentGroups
import {
  RecentGroups,
  getArchivedGroups,
  getGroupsAction,
  getRecentGroups,
  getStarredGroups,
} from "@/lib/RecentGroupsHelpers";
import { RecentGroupListCard } from "../components/RecentGroupListCard";
import { AddGroupByUrlButton } from "@/components/AddGroupByUrlButton";

// Importing UI components
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Importing services
import { getGroups } from "@/services/Service";

// Importing React utilities
import { PropsWithChildren, SetStateAction, useEffect, useState } from "react";

// Importing Navbar component
import Navbar from "../components/Navbar";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

export type RecentGroupsState =
  | { status: "pending" }
  | {
      status: "partial";
      groups: RecentGroups;
      starredGroups: string[];
      archivedGroups: string[];
    }
  | {
      status: "complete";
      groups: RecentGroups;
      groupsDetails: Awaited<ReturnType<typeof getGroups>>;
      starredGroups: string[];
      archivedGroups: string[];
    };

function sortGroups(
  state: RecentGroupsState & { status: "complete" | "partial" }
) {
  const starredGroupInfo = [];
  const groupInfo = [];
  const archivedGroupInfo = [];
  for (const group of state.groups) {
    if (state.starredGroups.includes(group.id)) {
      starredGroupInfo.push(group);
    } else if (state.archivedGroups.includes(group.id)) {
      archivedGroupInfo.push(group);
    } else {
      groupInfo.push(group);
    }
  }
  return {
    starredGroupInfo,
    groupInfo,
    archivedGroupInfo,
  };
}

export function RecentGroupListPage() {
  const [state, setState] = useState<RecentGroupsState>({ status: "pending" });

  function loadGroups() {
    const groupsInStorage = getRecentGroups();
    const starredGroups = getStarredGroups();
    const archivedGroups = getArchivedGroups();
    setState({
      status: "partial",
      groups: groupsInStorage,
      starredGroups,
      archivedGroups,
    });
    getGroupsAction(groupsInStorage.map((g) => g.id)).then((groupsDetails) => {
      setState({
        status: "complete",
        groups: groupsInStorage,
        groupsDetails,
        starredGroups,
        archivedGroups,
      });
    });
  }

  useEffect(() => {
    loadGroups();
  }, []);

  if (state.status === "pending") {
    return (
      <GroupsPage reload={loadGroups}>
        <p>
          <Loader2 className="w-4 m-4 mr-2 inline animate-spin" /> Loading
          recent groups…
        </p>
      </GroupsPage>
    );
  }

  if (state.groups.length === 0) {
    return (
      <GroupsPage reload={loadGroups}>
        <div className="text-lg space-y-2 max-w-screen-lg w-full px-4 mx-auto my-10">
          <p>You have not visited any group recently.</p>
          <p>
            <Button variant="link">
              <Link
                to={`/groups/create`}
                className="w-full text-primary hover:underline "
              >
                Create one
              </Link>
            </Button>
            {"  "}
            or ask a friend to send you the link to an existing one.
          </p>
        </div>
      </GroupsPage>
    );
  }

  const { starredGroupInfo, groupInfo, archivedGroupInfo } = sortGroups(state);

  return (
    <GroupsPage reload={loadGroups}>
      {starredGroupInfo.length > 0 && (
        <>
          <h2 className="flex dark:text-white text-card p-2 text-xl px-4 font flex-col mx-auto sm:flex-row mt-4 justify-between rounded-lg gap-3 max-w-screen-lg w-full">
            Starred groups
          </h2>
          <GroupList
            groups={starredGroupInfo}
            state={state}
            setState={setState}
          />
        </>
      )}

      {groupInfo.length > 0 && (
        <>
          <h2 className="flex dark:text-white text-card p-2 px-4 flex-col text-xl  mx-auto sm:flex-row mt-4 justify-between rounded-lg gap-3 max-w-screen-lg w-full">
            Recent groups
          </h2>
          <GroupList groups={groupInfo} state={state} setState={setState} />
        </>
      )}

      {archivedGroupInfo.length > 0 && (
        <>
          <h2 className="mt-6 mb-2 flex dark:text-white text-card p-2 px-4 flex-col mx-auto text-xl sm:flex-row justify-between rounded-lg gap-3 max-w-screen-lg w-full opacity-50">
            Archived groups
          </h2>
          <div className="opacity-50">
            <GroupList
              groups={archivedGroupInfo}
              state={state}
              setState={setState}
            />
          </div>
        </>
      )}
    </GroupsPage>
  );
}

function GroupList({
  groups,
  state,
  setState,
}: {
  groups: RecentGroups;
  state: RecentGroupsState;
  setState: (state: SetStateAction<RecentGroupsState>) => void;
}) {
  return (
    <ul className="grid sm:grid-cols-2 mx-auto max-w-screen-lg w-full px-4 py-6  gap-6">
      {groups.map((group: { id: string }) => (
        <RecentGroupListCard
          key={group.id}
          group={group}
          state={state}
          setState={setState}
        />
      ))}
    </ul>
  );
}

function GroupsPage({
  children,
  reload,
}: PropsWithChildren<{ reload: () => void }>) {
  return (
    <>
      <div className="w-screen min-h-screen dark:bg-zinc-800 bg-midnight-800">
        <Navbar />

        <div className="flex  flex-col  mx-auto sm:flex-row text-card dark:text-white pt-32 rounded-lg gap-3  ">
          <div className="  rounded-lg flex px-6 justify-between mx-auto flex-row sm:items-center max-w-screen-lg w-full">
            <h1 className="font-bold text-3xl flex-1">
              <Link to="/groups">My groups</Link>
            </h1>
            <div className="flex gap-2">
              <AddGroupByUrlButton reload={reload} />
              <Button
                asChild
                className="bg-green-500  p-2 flex items-center justify-center rounded-lg"
              >
                <Link to="/groups/create">
                  <>Create</>
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
