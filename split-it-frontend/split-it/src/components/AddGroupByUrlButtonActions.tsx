//Importing services
import { getGroup } from "@/services/Service";

export async function getGroupInfoAction(groupId: string) {
  "use server";
  return getGroup(groupId);
}
