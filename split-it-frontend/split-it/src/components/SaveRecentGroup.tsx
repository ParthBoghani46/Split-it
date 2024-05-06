// Importing types and functions related to RecentGroups
import { RecentGroup, saveRecentGroup } from "@/lib/RecentGroupsHelpers";

// Importing React utility
import { useEffect } from "react";
type Props = {
  group: RecentGroup;
};

export function SaveGroupLocally({ group }: Props) {
  useEffect(() => {
    saveRecentGroup(group);
  }, [group]);

  return null;
}
