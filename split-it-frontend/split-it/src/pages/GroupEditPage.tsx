/* eslint-disable @typescript-eslint/no-explicit-any */
// Importing components
import { GroupForm } from "@/components/GroupForm";
import Navbar from "@/components/Navbar";
import { GroupTabs } from "@/components/GroupTabs";
import { ShareButton } from "@/components/ShareButton";
import { SaveGroupLocally } from "@/components/SaveRecentGroup";

// Importing services
import {
  getGroup,
  getGroupExpensesParticipants,
  updateGroup,
} from "@/services/Service";

// Importing schema
import { groupFormSchema } from "@/lib/schemas";

// Importing React utilities
import { useEffect, useState } from "react";

// Importing Link component from react-router-dom
import { Link } from "react-router-dom";

// Importing a component for 404 page
const notFound = () => <h1>404 - Not Found</h1>;

let name: string;
interface GroupEditPageProps {
  params: {
    groupId: string;
  };
}

const GroupEditPage: React.FC<GroupEditPageProps> = ({
  params: { groupId },
}) => {
  const [group, setGroup] = useState<any>(null); // Assuming Group is the type of your group object

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedGroup = await getGroup(groupId);
        name = fetchedGroup.name;

        setGroup(fetchedGroup);
      } catch (error) {
        notFound();
        console.error("Error fetching group data:", error);
      }
    };
    fetchData();
  }, [groupId]);

  async function updateGroupAction(values: unknown) {
    "use server";
    const groupFormValues = groupFormSchema.parse(values);
    const group = await updateGroup(groupId, groupFormValues);
    window.location.href = `/groups/${group.id}`;
  }

  const [protectedParticipantIds, setProtectedParticipantIds] = useState<
    string[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch protected participant IDs
        const participantIds: string[] = (await getGroupExpensesParticipants(
          groupId
        )) as string[];
        setProtectedParticipantIds(participantIds);
      } catch (error) {
        console.error("Error fetching protected participant IDs:", error);
        // Handle error
      }
    };

    fetchData();
  }, [groupId]);
  if (!group) {
    return notFound();
  }

  return (
    <div className="w-full min-h-screen bg-midnight-800 dark:bg-zinc-800 text-card dark:text-white">
      <Navbar />
      <div>
        <div className="flex flex-row mx-auto  pt-32 justify-between px-6 rounded-lg gap-3 pb-2 max-w-screen-lg w-full">
          <h1 className="font-semibold text-3xl">
            <Link to={`/groups/${groupId}`}>{name}</Link>
          </h1>

          <div className="flex gap-2 justify-between">
            <GroupTabs groupId={groupId} />

            <ShareButton group={group} />
          </div>
        </div>

        <SaveGroupLocally group={{ id: group.id, name: group.name }} />
      </div>

      <GroupForm
        group={group}
        onSubmit={updateGroupAction}
        protectedParticipantIds={protectedParticipantIds}
      />
    </div>
  );
};

export default GroupEditPage;
