import { CopyButton } from "@/components/CopyButton";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useBaseUrl } from "@/lib/hooks";
interface Group {
  id: string;
  name: string;
}

import { Share } from "lucide-react";

type Props = {
  group: Group;
};

export function ShareButton({ group }: Props) {
  const baseUrl = useBaseUrl();
  const url = baseUrl && `${baseUrl}/groups/${group.id}/expenses?ref=share`;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          title="Share"
          size="icon"
          className="bg-primary px-4 rounded-lg"
        >
          <Share className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="[&_p]:text-sm flex flex-col gap-3 bg-zinc-200 dark:bg-zinc-700 text-card dark:text-white"
      >
        <p>
          For other participants to see the group and add expenses, share its
          URL with them.
        </p>
        {url && (
          <div className="flex gap-2">
            <Input
              className="flex-1 w-4/5 bg-white rounded-lg text-card px-2"
              defaultValue={url}
              readOnly
            />
            <div className="bg-green-400 p-1 rounded-lg items-center justify-center hover:bg-green-500">
              <CopyButton text={url} />
            </div>
            <ShareUrlButton
              text={`Join my group ${group.name} on Spliit`}
              url={url}
            />
          </div>
        )}
        <p>
          <strong>Warning!</strong> Every person with the group URL will be able
          to see and edit expenses. Share with caution!
        </p>
      </PopoverContent>
    </Popover>
  );
}
