import { getGroupInfoAction } from "./AddGroupByUrlButtonActions";
import { saveRecentGroup } from "@/lib/RecentGroupsHelpers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/lib/hooks";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  reload: () => void;
};

export function AddGroupByUrlButton({ reload }: Props) {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="bg-green-500  p-2 flex items-center justify-center rounded-lg"
        >
          <>Add by URL</>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align={isDesktop ? "end" : "start"}
        className="[&_p]:text-sm flex flex-col gap-3 p-3 text-card dark:text-white bg-zinc-200 dark:bg-zinc-700"
      >
        <h3 className="font-bold text-lg">Add a group by URL</h3>
        <p>
          If a group was shared with you, you can paste its URL here to add it
          to your list.
        </p>
        <form
          className="flex gap-2"
          onSubmit={async (event) => {
            event.preventDefault();
            const [, groupId] =
              url.match(
                new RegExp(`${window.location.origin}/groups/([^/]+)`)
              ) ?? [];
            setPending(true);
            const group = groupId ? await getGroupInfoAction(groupId) : null;
            setPending(false);
            if (!group) {
              setError(true);
            } else {
              saveRecentGroup({ id: group.id, name: group.name });
              reload();
              setUrl("");
              setOpen(false);
            }
          }}
        >
          <Input
            type="url"
            required
            placeholder="https://spli-it.app/..."
            className="flex-1 text-base rounded-lg px-2 w-4/5 text-card"
            value={url}
            disabled={pending}
            onChange={(event) => {
              setUrl(event.target.value);
              setError(false);
            }}
          />
          <Button
            size="icon"
            type="submit"
            disabled={pending}
            className="bg-green-500 p-2 items-center justify-center rounded-lg"
          >
            {pending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </Button>
        </form>
        {error && (
          <p className="text-destructive">
            Oops, we are not able to find the group from the URL you provided…
          </p>
        )}
      </PopoverContent>
    </Popover>
  );
}
