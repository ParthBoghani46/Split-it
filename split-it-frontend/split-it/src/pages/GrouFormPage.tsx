// Importing components
import { GroupForm } from "@/components/GroupForm";
import Navbar from "@/components/Navbar";

// Importing services
import { createGroup } from "@/services/Service";

// Importing schema
import { groupFormSchema } from "@/lib/schemas";

// Importing Zod
import { z } from "zod";

// Importing helper function
import { saveRecentGroup } from "@/lib/RecentGroupsHelpers";

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
