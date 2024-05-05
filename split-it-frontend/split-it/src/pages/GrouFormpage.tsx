import { GroupForm } from "@/components/GroupForm";
import { createGroup } from "@/services/Service";
import { groupFormSchema } from "@/lib/schemas";
import { z } from "zod";
import { saveRecentGroup } from "@/lib/RecentGroupsHelpers";
import Navbar from "@/components/Navbar";

// eslint-disable-next-line react-refresh/only-export-components
export const recentGroupsSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string().optional(),
  })
);

export type RecentGroups = z.infer<typeof recentGroupsSchema>;
export type RecentGroup = RecentGroups[number];
async function createGroupAction(values: unknown) {
  console.log("111");
  const groupFormValues = groupFormSchema.parse(values);
  const group = await createGroup(groupFormValues);
  const recentGroup: RecentGroup = {
    id: group,
    name: groupFormValues.name,
  };
  saveRecentGroup(recentGroup);
  window.location.href = `/groups/${group}/expenses`;
}

function GroupFormPage() {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800">
      <Navbar />
      <div className="pt-24"></div>
      <GroupForm onSubmit={createGroupAction} />
    </div>
  );
}
export default GroupFormPage;
