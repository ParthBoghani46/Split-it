/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Importing components
import CategorySelector from "@/components/CategorySelector";
import { DeletePopup } from "@/components/DeletePopup";

// Importing UI components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Importing services
import { getExpense, getGroup } from "@/services/Service";

// Importing schemas and utilities
import {
  ExpenseFormValues,
  SplittingOptions,
  expenseFormSchema,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

// Importing external dependencies
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { Link } from "react-router-dom";
import useQueryParams from "./useQueryParams";
import { useForm } from "react-hook-form";
import { match } from "ts-pattern";
import { useEffect, useState } from "react";

enum SplitMode {
  EVENLY = "EVENLY",
  BY_SHARES = "BY_SHARES",
  BY_PERCENTAGE = "BY_PERCENTAGE",
  BY_AMOUNT = "BY_AMOUNT",
}
export type Props = {
  group: NonNullable<Awaited<ReturnType<typeof getGroup>>>;
  expense?: NonNullable<Awaited<ReturnType<typeof getExpense>>>;
  onSubmit: (values: ExpenseFormValues) => Promise<void>;
  onDelete?: () => Promise<void>;
};

const enforceCurrencyPattern = (value: string) =>
  value
    // replace first comma with #
    .replace(/[.,]/, "#")
    // remove all other commas
    .replace(/[.,]/g, "")
    // change back # to dot
    .replace(/#/, ".")
    // remove all non-numeric and non-dot characters
    .replace(/[^\d.]/g, "");

const getDefaultSplittingOptions = (group: Props["group"]) => {
  if (!group || !group.participants) {
    return {
      splitMode: "EVENLY" as const,
      paidFor: [],
    };
  }

  const defaultValue = {
    splitMode: "EVENLY" as const,
    paidFor: group.participants.map(({ id }: { id: string }) => ({
      participantId: id,
      shares: "1" as unknown as number,
    })),
  };

  if (typeof localStorage === "undefined") return defaultValue;
  const defaultSplitMode = localStorage.getItem(
    `${group.id}-defaultSplittingOptions`
  );
  if (defaultSplitMode === null) return defaultValue;
  const parsedDefaultSplitMode = JSON.parse(
    defaultSplitMode
  ) as SplittingOptions;

  if (parsedDefaultSplitMode.paidFor === null) {
    parsedDefaultSplitMode.paidFor = defaultValue.paidFor;
  }

  // if there is a participant in the default options that does not exist anymore,
  // remove the stale default splitting options

  for (const parsedPaidFor of parsedDefaultSplitMode.paidFor!) {
    if (
      !group.participants.some(
        ({ id }: { id: string }) => id === parsedPaidFor.participantId
      )
    ) {
      localStorage.removeItem(`${group.id}-defaultSplittingOptions`);
      return defaultValue;
    }
  }

  return {
    splitMode: parsedDefaultSplitMode.splitMode,
    paidFor: parsedDefaultSplitMode.paidFor!.map((paidFor) => ({
      participantId: paidFor.participantId,
      shares: String(paidFor.shares) as unknown as number,
    })),
  };
};

async function persistDefaultSplittingOptions(
  groupId: string,
  expenseFormValues: ExpenseFormValues
) {
  if (localStorage && expenseFormValues.saveDefaultSplittingOptions) {
    const computePaidFor = (): SplittingOptions["paidFor"] => {
      if (expenseFormValues.splitMode === "EVENLY") {
        return expenseFormValues.paidFor.map(({ participantId }) => ({
          participantId,
          shares: "100" as unknown as number,
        }));
      } else if (expenseFormValues.splitMode === "BY_AMOUNT") {
        return null;
      } else {
        return expenseFormValues.paidFor;
      }
    };

    const splittingOptions = {
      splitMode: expenseFormValues.splitMode,
      paidFor: computePaidFor(),
    } satisfies SplittingOptions;

    localStorage.setItem(
      `${groupId}-defaultSplittingOptions`,
      JSON.stringify(splittingOptions)
    );
  }
}

export function ExpenseForm({ group, expense, onSubmit, onDelete }: Props) {
  const isCreate = expense === undefined;

  const { getQueryParam } = useQueryParams();
  const [selectedCategory, setSelectedCategory] = useState(1);

  const getSelectedPayer = (field?: { value: string }) => {
    if (isCreate && typeof window !== "undefined") {
      const activeUser = localStorage.getItem(`${group?.id}-activeUser`); // Added optional chaining for group.id
      if (activeUser && activeUser !== "None" && !field?.value) {
        // Changed condition to check if field?.value is falsy
        return activeUser;
      }
    }
    return field?.value;
  };
  const defaultSplittingOptions = getDefaultSplittingOptions(group);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: expense
      ? {
          title: expense.title,
          expenseDate: expense.expenseDate ?? new Date(),
          amount: String(expense.amount / 100) as unknown as number, // hack
          categoryId: expense.categoryId,
          paidBy: expense.paidById,
          paidFor: expense.paidFor.map(
            ({
              participantId,
              shares,
            }: {
              participantId: string;
              shares: number;
            }) => ({
              participant: participantId,
              shares: String(shares) as unknown as number,
            })
          ),
          splitMode: expense.splitMode,
          saveDefaultSplittingOptions: false,
          isReimbursement: expense.isReimbursement,
          notes: expense.notes ?? "",
        }
      : getQueryParam("reimbursement")
      ? {
          title: "Reimbursement",
          expenseDate: new Date(),
          amount: String(
            (Number(getQueryParam("amount")) || 0) / 100
          ) as unknown as number, // hack
          categoryId: 1, // category with Id 1 is Payment
          paidBy: getQueryParam("from") ?? undefined,
          paidFor: [
            getQueryParam("to")
              ? {
                  participantId: getQueryParam("to")!,
                  shares: "1" as unknown as number,
                }
              : undefined,
          ],
          isReimbursement: true,
          splitMode: defaultSplittingOptions.splitMode,
          saveDefaultSplittingOptions: false,
          notes: "",
        }
      : {
          title: getQueryParam("title") ?? "",
          expenseDate: getQueryParam("date")
            ? new Date(getQueryParam("date") as string)
            : new Date(),
          amount: (getQueryParam("amount") || 0) as unknown as number, // hack,
          categoryId: getQueryParam("categoryId")
            ? Number(getQueryParam("categoryId"))
            : 0,
          paidFor: defaultSplittingOptions.paidFor,
          paidBy: getSelectedPayer(),
          isReimbursement: false,
          splitMode: defaultSplittingOptions.splitMode,
          saveDefaultSplittingOptions: false,
          notes: "",
        },
  });

  if (!isCreate) {
    useEffect(() => {
      const fetchData = async () => {
        if (expense) {
          setSelectedCategory(expense.categoryId);
          await form.reset({
            title: expense.title,
            expenseDate: expense.expenseDate,
            amount: String(expense.amount / 100) as unknown as number, // hack
            categoryId: expense.categoryId,
            paidBy: expense.paidById,
            paidFor: expense.paidFor.map(
              ({
                participantId,
                shares,
              }: {
                participantId: string;
                shares: number;
              }) => ({
                participantId: participantId,
                shares: String(shares) as unknown as number,
              })
            ),
            splitMode: expense.splitMode,
            saveDefaultSplittingOptions: false,
            isReimbursement: expense.isReimbursement,
            notes: expense.notes ?? "",
          });
        }
      };

      fetchData();
    }, [expense]);
  }

  // const form = useForm<ExpenseFormValues>({
  //   resolver: zodResolver(expenseFormSchema),
  //   defaultValues: {},
  // });
  // useEffect(() => {
  //   if (expense) {
  //     form.reset({
  //       title: expense.title,
  //       expenseDate: expense.expenseDate,
  //       amount: String(expense.amount / 100) as unknown as number, // hack
  //       categoryId: expense.categoryId,
  //       paidBy: expense.paidById,
  //       paidFor: expense.paidFor.map(
  //         ({
  //           participantId,
  //           shares,
  //         }: {
  //           participantId: string;
  //           shares: number;
  //         }) => ({
  //           participantId: participantId,
  //           shares:
  //             shares !== 1
  //               ? (String(shares / 100) as unknown as number)
  //               : (String(shares) as unknown as number),
  //         })
  //       ),
  //       splitMode: expense.splitMode,
  //       saveDefaultSplittingOptions: false,
  //       isReimbursement: expense.isReimbursement,
  //       notes: expense.notes ?? "",
  //     });
  //   } else {
  //     getQueryParam("reimbursement")
  //       ? {
  //           title: "Reimbursement",
  //           expenseDate: new Date(),
  //           amount: String(
  //             (Number(getQueryParam("amount")) || 0) / 100
  //           ) as unknown as number, // hack
  //           categoryId: 1, // category with Id 1 is Payment
  //           paidBy: getQueryParam("from") ?? undefined,
  //           paidFor: [
  //             getQueryParam("to")
  //               ? {
  //                   participantId: getQueryParam("to")!,
  //                   shares: "1" as unknown as number,
  //                 }
  //               : undefined,
  //           ],
  //           isReimbursement: true,
  //           splitMode: defaultSplittingOptions.splitMode,
  //           saveDefaultSplittingOptions: false,
  //           notes: "",
  //         }
  //       : {
  //           title: getQueryParam("title") ?? "",
  //           expenseDate: getQueryParam("date")
  //             ? new Date(getQueryParam("date") as string)
  //             : new Date(),
  //           amount: (getQueryParam("amount") || 0) as unknown as number, // hack,
  //           categoryId: getQueryParam("categoryId")
  //             ? Number(getQueryParam("categoryId"))
  //             : 0,
  //           paidFor: defaultSplittingOptions.paidFor,
  //           paidBy: getSelectedPayer(),
  //           isReimbursement: false,
  //           splitMode: defaultSplittingOptions.splitMode,
  //           saveDefaultSplittingOptions: false,
  //           notes: "",
  //         };
  //   }
  // });
  const submit = async (values: ExpenseFormValues) => {
    try {
      await persistDefaultSplittingOptions(group.id, values);
      return onSubmit(values);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const paidByTemp = expense ? expense.paidBy : "";

  return (
    <div className="w-screen min-h-screen dark:bg-zinc-800 bg-midnight-800">
      <div className="mx-auto max-w-screen-lg w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submit)}>
            <Card className="bg-zinc-100 dark:bg-zinc-700 text-card dark:text-white  justify-center items-center rounded-lg p-6 mb-4 mt-4">
              <CardHeader>
                <CardTitle className="font-semibold mb-4 text-3xl">
                  {isCreate ? <>Create expense</> : <>Edit expense</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="flex flex-wrap">
                      <FormLabel className="w-full sm:w-1/2 text-lg">
                        Expense title
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-base rounded-lg w-full h-10 m-1 px-4 dark:bg-zinc-600"
                          placeholder="Monday evening restaurant"
                          {...field}
                          onBlur={async () => {
                            field.onBlur(); // avoid skipping other blur event listeners since we overwrite `field`
                          }}
                        />
                      </FormControl>
                      <FormMessage className="w-full text-red-500" />
                      <FormDescription>
                        Enter a description for the expense.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expenseDate"
                  render={({ field }) => (
                    <FormItem className="sm:order-1">
                      <FormLabel className="w-full sm:w-1/2 text-lg">
                        Expense date
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="date-base rounded-lg w-full h-10 m-1 px-4 dark:bg-zinc-600"
                          type="date"
                          value={formatDate(new Date(field.value))}
                          onChange={(event) => {
                            return field.onChange(new Date(event.target.value));
                          }}
                        />
                      </FormControl>
                      <FormMessage className="w-full text-red-500" />
                      <FormDescription>
                        Enter the date the expense was made.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem className="sm:order-3">
                      <FormLabel className="w-full sm:w-1/2 text-lg">
                        Amount
                      </FormLabel>
                      <div className="flex items-baseline gap-2">
                        <span>{group?.currency}</span>
                        <FormControl>
                          <Input
                            {...field}
                            className="text-base max-w-[150px]  rounded-lg  h-10 m-1 px-4 dark:bg-zinc-600"
                            type="text"
                            inputMode="decimal"
                            step={0.01}
                            placeholder="0.00"
                            onChange={(event) =>
                              onChange(
                                enforceCurrencyPattern(event.target.value)
                              )
                            }
                            onClick={(e) => e.currentTarget.select()}
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage className="w-full text-red-500" />

                      <FormField
                        control={form.control}
                        name="isReimbursement"
                        render={({ field }) => (
                          <FormItem className="flex flex-row gap-2 items-center space-y-0 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel className="w-full">
                                This is a reimbursement
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="order-3 sm:order-2">
                      <FormLabel className="w-full sm:w-1/2 text-lg">
                        Category
                      </FormLabel>
                      <CategorySelector
                        defaultValue={selectedCategory} // Pass selected category as defaultValue
                        onValueChange={(categoryId) => {
                          // Handle category change
                          setSelectedCategory(categoryId); // Update selected category state
                          field.onChange(categoryId); // Update form field value
                        }}
                      />
                      <FormMessage className="w-full text-red-500" />
                      <FormDescription>
                        Select the expense category.
                      </FormDescription>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paidBy"
                  render={({ field }) => (
                    <FormItem className="sm:order-5">
                      <FormLabel className="w-full sm:w-1/2 text-lg">
                        Paid by
                      </FormLabel>
                      <Select
                        onValueChange={(value: any) => {
                          form.setValue("paidBy", value as any, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                        }}
                        defaultValue={field.value}
                        // onValueChange={field.onChange}
                        // defaultValue={getSelectedPayer(field)}
                      >
                        <SelectTrigger className="flex items-center justify-between rounded-lg w-full border-0 bg-white dark:bg-zinc-600 text-card dark:text-white h-10 m-1 px-4">
                          <SelectValue placeholder="Select a participant" />
                        </SelectTrigger>
                        <SelectContent className=" bg-white dark:bg-zinc-600 rounded-lg md:w-96 border border-green-400 text-card dark:text-white">
                          {(group?.participants || []).map(
                            ({ id, name }: { id: string; name: string }) => (
                              <SelectItem
                                key={id}
                                value={id.toString()}
                                className=" md:w-96 sm:w-48 flex rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-500 focus:text-card dark:focus:text-white"
                                defaultValue={paidByTemp}
                              >
                                {name}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage className="w-full text-red-500" />
                      <FormDescription>
                        Select the participant who paid the expense.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="sm:order-6">
                      <FormLabel className="w-full sm:w-1/2 text-lg">
                        Notes
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="text-card dark:text-white bg-white dark:bg-zinc-600 border-0"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card className="bg-zinc-100 dark:bg-zinc-700 text-card dark:text-white justify-center items-center rounded-lg p-6 mb-4 mt-4">
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <span className="text-2xl font-semibold">Paid for</span>
                  <Button
                    variant="link"
                    type="button"
                    className="bg-green-500 hover:bg-green-600 font-bold py-2 px-4 rounded mt-3"
                    onClick={() => {
                      const paidFor = form.getValues().paidFor;
                      const allSelected =
                        paidFor.length === group.participants.length;
                      const newPaidFor = allSelected
                        ? []
                        : group.participants.map((participant: any) => ({
                            participantId: participant.id,
                            shares:
                              paidFor.find(
                                (pfor: any) =>
                                  pfor.participantId === participant.id
                              )?.shares ?? 1,
                          }));

                      form.setValue("paidFor", newPaidFor, {
                        shouldDirty: true,
                        shouldTouch: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    {Array.isArray(form.getValues().paidFor) && group
                      ? form.getValues().paidFor.length === 0 ||
                        form.getValues().paidFor.length <
                          group.participants.length
                        ? "Select all"
                        : "Deselect all"
                      : "Select none"}
                  </Button>
                </CardTitle>
                <CardDescription className="mb-3 text-lg">
                  Select who the expense was paid for.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paidFor"
                  render={() => (
                    <FormItem className="sm:order-4 row-span-2 space-y-0">
                      {(group?.participants || []).map(
                        ({ id, name }: { id: string; name: string }) => (
                          <FormField
                            key={id}
                            control={form.control}
                            name="paidFor"
                            render={({ field }) => {
                              return (
                                <div className="flex items-center border-t last-of-type:border-b border-slate-300 dark:border-slate-500 last-of-type:!mb-4 px-6 py-3">
                                  <FormItem className="flex-1 flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value.some(
                                          ({ participantId }) =>
                                            participantId === id
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                {
                                                  participantId: id,
                                                  shares: "1",
                                                },
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value.participantId !== id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="text-md font-normal flex-1">
                                      {name}
                                    </FormLabel>
                                  </FormItem>
                                  {form.getValues().splitMode !== "EVENLY" && (
                                    <FormField
                                      name={`paidFor[${field.value.findIndex(
                                        ({ participantId }) =>
                                          participantId === id
                                      )}].shares`}
                                      render={() => {
                                        const sharesLabel = (
                                          <span
                                            className={cn("text-md ", {
                                              "text-muted": !field.value?.some(
                                                ({ participantId }) =>
                                                  participantId === id
                                              ),
                                            })}
                                          >
                                            {match(form.getValues().splitMode)
                                              .with(SplitMode.BY_SHARES, () => (
                                                <>share(s)</>
                                              ))
                                              .with(
                                                SplitMode.BY_PERCENTAGE,
                                                () => <>%</>
                                              )
                                              .with(SplitMode.BY_AMOUNT, () => (
                                                <>{group.currency}</>
                                              ))
                                              .otherwise(() => (
                                                <></>
                                              ))}
                                          </span>
                                        );
                                        return (
                                          <div>
                                            <div className="flex gap-1 items-center">
                                              {form.getValues().splitMode ===
                                                "BY_AMOUNT" && sharesLabel}
                                              <FormControl>
                                                <Input
                                                  key={String(
                                                    !field.value?.some(
                                                      ({ participantId }) =>
                                                        participantId === id
                                                    )
                                                  )}
                                                  className=" w-[80px] dark:text-white dark:bg-zinc-600 rounded-lg px-2 h-8"
                                                  type="text"
                                                  disabled={
                                                    !field.value?.some(
                                                      ({ participantId }) =>
                                                        participantId === id
                                                    )
                                                  }
                                                  value={
                                                    field.value?.find(
                                                      ({ participantId }) =>
                                                        participantId === id
                                                    )?.shares
                                                  }
                                                  onChange={(event) =>
                                                    field.onChange(
                                                      field.value.map((p) =>
                                                        p.participantId === id
                                                          ? {
                                                              participantId: id,
                                                              shares:
                                                                enforceCurrencyPattern(
                                                                  event.target
                                                                    .value
                                                                ),
                                                            }
                                                          : p
                                                      )
                                                    )
                                                  }
                                                  inputMode={
                                                    form.getValues()
                                                      .splitMode === "BY_AMOUNT"
                                                      ? "decimal"
                                                      : "numeric"
                                                  }
                                                  step={
                                                    form.getValues()
                                                      .splitMode === "BY_AMOUNT"
                                                      ? 0.01
                                                      : 1
                                                  }
                                                />
                                              </FormControl>
                                              {[
                                                "BY_SHARES",
                                                "BY_PERCENTAGE",
                                              ].includes(
                                                form.getValues().splitMode
                                              ) && sharesLabel}
                                            </div>
                                            <FormMessage className="float-right text-red-500 w-full" />
                                          </div>
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              );
                            }}
                          />
                        )
                      )}
                      <FormMessage className="w-full text-red-500" />
                    </FormItem>
                  )}
                />

                <Collapsible
                  className="mt-5"
                  defaultOpen={form.getValues().splitMode !== "EVENLY"}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="link" className="mx-4 ">
                      <u>Advanced splitting options…</u>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid sm:grid-cols-2 gap-6 pt-3">
                      <FormField
                        control={form.control}
                        name="splitMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="w-full sm:w-1/2">
                              Split mode
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={(value: any) => {
                                  form.setValue("splitMode", value as any, {
                                    shouldDirty: true,
                                    shouldTouch: true,
                                    shouldValidate: true,
                                  });
                                }}
                                defaultValue={field.value}
                              >
                                <SelectTrigger className="flex items-center border-0 justify-between rounded-lg w-full bg-white text-card dark:bg-zinc-600 dark:text-white h-10 m-1 px-4">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className=" bg-white text-card dark:bg-zinc-600 dark:text-white rounded-lg md:w-96 border border-green-400">
                                  <SelectItem
                                    className="md:w-96 sm:w-48 flex rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-500 focus:text-card dark:focus:text-white"
                                    value="EVENLY"
                                  >
                                    Evenly
                                  </SelectItem>
                                  <SelectItem
                                    className="md:w-96 sm:w-48 flex rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-500 focus:text-card dark:focus:text-white"
                                    value="BY_SHARES"
                                  >
                                    Unevenly – By shares
                                  </SelectItem>
                                  <SelectItem
                                    className="md:w-96 sm:w-48 flex rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-500 focus:text-card dark:focus:text-white"
                                    value="BY_PERCENTAGE"
                                  >
                                    Unevenly – By percentage
                                  </SelectItem>
                                  <SelectItem
                                    className="md:w-96 sm:w-48 flex rounded-lg focus:bg-zinc-100 dark:focus:bg-zinc-500 focus:text-card dark:focus:text-white"
                                    value="BY_AMOUNT"
                                  >
                                    Unevenly – By amount
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormDescription>
                              Select how to split the expense.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="saveDefaultSplittingOptions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row gap-2 items-center space-y-0 pt-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div>
                              <FormLabel className="w-full sm:w-1/2">
                                Save as default splitting options
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            <div className="flex mt-4 gap-2">
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 flex w-24 h-10 items-center justify-center rounded-lg"
              >
                <Save className="w-4 h-4 mr-2" />
                {<>Crate</>}
              </Button>
              {!isCreate && onDelete && (
                <DeletePopup onDelete={onDelete}></DeletePopup>
              )}
              <Button
                variant="ghost"
                className="bg-zinc-100 dark:bg-zinc-600 hover:bg-zinc-300 dark:hover:bg-zinc-500 w-24 h-10 items-center justify-center rounded-lg"
              >
                {group?.id && <Link to={`/groups/${group.id}`}>Cancel</Link>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

function formatDate(date?: Date) {
  if (!date || isNaN(date as any)) date = new Date();
  return date.toISOString().substring(0, 10);
}
