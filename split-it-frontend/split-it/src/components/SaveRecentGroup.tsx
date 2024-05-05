import { RecentGroup, saveRecentGroup } from "@/lib/RecentGroupsHelpers";
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
