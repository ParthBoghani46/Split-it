/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Importing types and functions related to RecentGroups
import { RecentGroupsState } from "@/pages/RecentGroupListPage";
import {
  RecentGroup,
  archiveGroup,
  deleteRecentGroup,
  getArchivedGroups,
  getStarredGroups,
  saveRecentGroup,
  starGroup,
  unarchiveGroup,
  unstarGroup,
} from "@/lib/RecentGroupsHelpers";

// Importing UI components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

// Importing icons
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Calendar, MoreHorizontal, Star, Users } from "lucide-react";

// Importing React utilities
import { Link } from "react-router-dom";
import { SetStateAction, useEffect, useState } from "react";

// Importing services
import { getGroup } from "@/services/Service";
export function RecentGroupListCard({
  group,
  state,
  setState,
}: {
  group: RecentGroup;
  state: RecentGroupsState;
  setState: (state: SetStateAction<RecentGroupsState>) => void;
}): JSX.Element | null {
  const toast = useToast();

  if (state.status === "pending") return null;

  const [group1, setGroup] = useState<any>(null); // Assuming Group is the type of your group object

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGroup = await getGroup(group.id);
        setGroup(fetchedGroup);
      } catch (error) {
        console.error("Error fetching group data:", error);
      }
    };
    fetchData();
  }, [group.id]);

  const refreshGroupsFromStorage = () =>
    setState({
      ...state,
      starredGroups: getStarredGroups(),
      archivedGroups: getArchivedGroups(),
    });

  const isStarred = state.starredGroups.includes(group.id);
  const isArchived = state.archivedGroups.includes(group.id);

  return (
    <div>
      <li key={group.id}>
        <Button
          className="h-20 w-full text-card dark:text-white py-3 rounded-lg bg-zinc-100 dark:bg-zinc-700 shadow-sm"
          asChild
        >
          <div
            className="text-base flex justify-between items-center"
            onClick={() => (window.location.href = `/groups/${group.id}`)}
          >
            <div className="w-full flex flex-col gap-1">
              <div className="text-base flex gap-2 justify-between items-center">
                <Link
                  to={`/groups/${group.id}`}
                  className="flex-1 overflow-hidden text-ellipsis px-4"
                >
                  {group.name}
                </Link>
                <span className="flex ">
                  <Button
                    asChild
                    size="icon"
                    variant="ghost"
                    className="mx-auto"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (isStarred) {
                        unstarGroup(group.id);
                      } else {
                        starGroup(group.id);
                        unarchiveGroup(group.id);
                      }
                      refreshGroupsFromStorage();
                    }}
                  >
                    {isStarred ? (
                      <StarFilledIcon className="w-4 h-4 text-orange-400 mx-auto" />
                    ) : (
                      <Star className="w-4 h-4 dark:text-white text-card mx-auto" />
                    )}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="mx-auto px-4"
                      >
                        <MoreHorizontal className="w-4 h-4 dark:text-white text-card mx-auto" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-zinc-300 dark:bg-zinc-600"
                    >
                      <DropdownMenuItem
                        className="text-red-500 text-md"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteRecentGroup(group);
                          setState({
                            ...state,
                            groups: state.groups.filter(
                              (g) => g.id !== group.id
                            ),
                          });
                          toast.toast({
                            title: "Group has been removed",
                            description:
                              "The group was removed from your recent groups list.",
                            action: (
                              <ToastAction
                                className="bg-red-500"
                                altText="Undo group removal"
                                onClick={() => {
                                  saveRecentGroup(group);
                                  setState({
                                    ...state,
                                    groups: state.groups,
                                  });
                                }}
                              >
                                Undo
                              </ToastAction>
                            ),
                          });
                        }}
                      >
                        Remove from recent groups
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="dark:text-white text-card"
                        onClick={(event) => {
                          event.stopPropagation();
                          if (isArchived) {
                            unarchiveGroup(group.id);
                          } else {
                            archiveGroup(group.id);
                            unstarGroup(group.id);
                          }
                          refreshGroupsFromStorage();
                        }}
                      >
                        {isArchived ? <>Unarchive group</> : <>Archive group</>}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </span>
              </div>
              <div className="font-normal dark:text-white text-card text-xs px-4">
                {group1 ? (
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center px-2">
                      <Users className="w-3 h-3 inline mr-1" />
                      <span>{group1.participants.length}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 inline mx-1" />
                      <span>{group1.createdAt}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-6 rounded-full" />
                    <Skeleton className="h-4 w-24 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Button>
      </li>
    </div>
  );
}
