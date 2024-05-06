/* eslint-disable @typescript-eslint/no-explicit-any */
// Importing UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Importing services
import { getGroup } from "@/services/Service";

// Importing schemas
import { GroupFormValues, groupFormSchema } from "@/lib/schemas";

// Importing external dependencies
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePlus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export type Props = {
  group?: NonNullable<Awaited<ReturnType<typeof getGroup>>>;
  onSubmit: (groupFormValues: any) => Promise<void>;
  protectedParticipantIds?: string[] | any;
};

export function GroupForm({
  group,
  onSubmit,
  protectedParticipantIds = [],
}: Props) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    // Default values are initially set to an empty object
    defaultValues: {},
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "participants",
    keyName: "key",
  });

  // Set default values for the form fields when the `group` prop changes
  useEffect(() => {
    if (group) {
      // If `group` prop is present, set default values based on `group` data
      form.reset({
        name: group.name,
        currency: group.currency,
        participants: group.participants,
      });
    } else {
      // If `group` prop is not present, set default values to defaults or empty
      form.reset({
        name: "",
        currency: "",
        participants: [{ name: "John" }, { name: "Jane" }, { name: "Jack" }],
      });
    }
  }, [group, form]);

  const [activeUser, setActiveUser] = useState<string | null>(null);
  useEffect(() => {
    if (activeUser === null) {
      const currentActiveUser =
        fields.find(
          (f) => f.id === localStorage.getItem(`${group?.id}-activeUser`)
        )?.name || "None";
      setActiveUser(currentActiveUser);
    }
  }, [activeUser, fields, group?.id]);

  const updateActiveUser = () => {
    if (!activeUser) return;
    if (group?.id) {
      const participant = group.participants.find(
        (p: { name: string }) => p.name === activeUser
      );
      if (participant?.id) {
        localStorage.setItem(`${group.id}-activeUser`, participant.id);
      } else {
        localStorage.setItem(`${group.id}-activeUser`, activeUser);
      }
    } else {
      localStorage.setItem("newGroup-activeUser", activeUser);
    }
  };

  return (
    <>
      <div className="w-screen min-h-screen dark:bg-zinc-800 bg-midnight-800">
        <div className="mx-auto flex-1 max-w-screen-lg w-full px-4 py-6 flex flex-col gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(async (values) => {
                await onSubmit(values);
              })}
            >
              <Card className="dark:bg-zinc-700 bg-zinc-100 text-card dark:text-white justify-center items-center rounded-lg p-8 mb-4 mt-4">
                <CardHeader>
                  <CardTitle className=" mb-4 font-semibold  text-3xl">
                    Group information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-wrap">
                        <FormLabel className="w-full sm:w-1/2 text-lg">
                          Group name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="rounded-lg dark:text-white text-card  w-full dark:bg-zinc-600 h-10 m-1 px-4"
                            placeholder="Summer vacations"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="w-full text-red-500" />
                        <FormDescription>
                          Enter a name for your group.
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="flex flex-wrap">
                        <FormLabel className="w-full sm:w-1/2 text-lg ">
                          Currency symbol
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="dark:text-white text-card rounded-lg w-full dark:bg-zinc-600 h-10 m-1 px-4"
                            placeholder="$, €, £…"
                            max={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="w-full text-red-500" />
                        <FormDescription>
                          We’ll use it to display amounts.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="dark:bg-zinc-700 bg-zinc-100 text-card dark:text-white justify-center items-center rounded-lg p-6">
                <CardHeader>
                  <CardTitle className=" mb-4 p-2 font-semibold text-3xl">
                    Participants
                  </CardTitle>
                  <CardDescription className="text-lg mb-2">
                    Enter the name for each participant
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-col gap-2">
                    {fields.map((item, index) => (
                      <li key={item.key}>
                        <FormField
                          control={form.control}
                          name={`participants.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="sr-only">
                                Participant #{index + 1}
                              </FormLabel>
                              <FormControl>
                                <div className="flex gap-2">
                                  <Input
                                    className="text-md dark:text-white text-card rounded-lg w-11/12 h-10 dark:bg-zinc-600 m-1 px-4"
                                    {...field}
                                  />
                                  {item.id &&
                                  protectedParticipantIds.includes(item.id) ? (
                                    <HoverCard>
                                      <HoverCardTrigger>
                                        <Button
                                          variant="ghost"
                                          className="text-destructive-"
                                          type="button"
                                          size="icon"
                                          disabled
                                        >
                                          <Trash2 className="w-6 h-6 ml-4 text-red-500 mt-3" />
                                        </Button>
                                      </HoverCardTrigger>
                                      <HoverCardContent
                                        align="end"
                                        className="text-sm w-full text-red-500"
                                      >
                                        This participant is part of expenses,
                                        and can not be removed.
                                      </HoverCardContent>
                                    </HoverCard>
                                  ) : (
                                    <Button
                                      variant="ghost"
                                      className="text-destructive"
                                      onClick={() => remove(index)}
                                      type="button"
                                      size="icon"
                                    >
                                      <Trash2 className="w-6 h-6 text-red-500 ml-4 " />
                                    </Button>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage className="w-full text-red-500" />
                            </FormItem>
                          )}
                        />
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-500 dark:hover:bg-zinc-600 font-bold py-2 px-4 rounded mt-3"
                    variant="secondary"
                    onClick={() => {
                      const newParticipant = {
                        name: "New",
                      };
                      append(newParticipant);
                    }}
                    type="button"
                  >
                    Add participant
                  </Button>
                </CardFooter>
              </Card>

              <Card className="dark:bg-zinc-700 bg-zinc-100 text-card dark:text-white justify-center items-center rounded-lg p-6 mb-4 mt-4">
                <CardHeader>
                  <CardTitle className="mb-4 font-semibold p-2 text-3xl">
                    Local settings
                  </CardTitle>
                  <CardDescription className="text-lg mb-2">
                    These settings are set per-device, and are used to customize
                    your experience.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {activeUser !== null && (
                      <FormItem className="mb-4">
                        <FormLabel className="text-lg block mb-1">
                          Active user
                        </FormLabel>
                        <FormControl className="flex w-full bg-white rounded-md py-2 px-3">
                          <Select
                            onValueChange={(value) => {
                              setActiveUser(value);
                            }}
                            defaultValue={activeUser}
                          >
                            <SelectTrigger className="flex px-4 h-10 rounded-lg border-0 text-md md:w-96 dark:bg-zinc-600 bg-zinc-200 md:gap-72 sm:w-48 sm:gap-32  hover:border-green-400">
                              <SelectValue placeholder="Select a participant" />
                            </SelectTrigger>
                            <SelectContent className=" dark:bg-zinc-600 bg-zinc-200 text-card dark:text-white rounded-lg md:w-96 border text-md border-green-400">
                              {[{ name: "None" }, ...form.watch("participants")]
                                .filter((item) => item.name.length > 0)
                                .map(({ name }) => (
                                  <SelectItem
                                    key={name}
                                    value={name}
                                    className="focus:bg-zinc-300 focus:text-card dark:hover:text-white dark:hover:bg-zinc-500 md:w-96 sm:w-48 text-md rounded-lg"
                                  >
                                    {name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="mt-1">
                          User used as default for paying expenses.
                        </FormDescription>
                      </FormItem>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex mt-4 gap-2">
                <Button
                  type="submit"
                  className="bg-green-600 flex w-24 h-10 items-center justify-center rounded-lg"
                  onClick={updateActiveUser}
                >
                  <BadgePlus className="w-4 h-4 mr-2" />{" "}
                  {group ? <>Save</> : <> Create</>}
                </Button>
                {!group && (
                  <Button className="bg-red-600 w-24 h-10 items-center justify-center rounded-lg">
                    <Link to="/groups">Cancel</Link>
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
