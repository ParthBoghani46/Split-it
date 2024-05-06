/* eslint-disable react-hooks/exhaustive-deps */

// Importing assets
import CategoryIcon from "@/assets/CategoryIcon";

// Importing UI components from the components/ui folder
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Importing hooks from the lib folder
import { useMediaQuery } from "@/lib/hooks";

// Importing React utilities
import { forwardRef, useEffect, useState, useRef } from "react";

// Importing additional libraries
import { CommandList } from "cmdk";
import { ChevronDown } from "lucide-react";
interface Category {
  id: number;
  grouping: string;
  name: string;
  // expenses: Expense[];
}
type Props = {
  onValueChange: (categoryId: Category["id"]) => void;
  defaultValue: Category["id"];
};

const categories = [
  { id: 1, grouping: "Uncategorized", name: "Payment" },
  { id: 2, grouping: "Uncategorized", name: "General" },
  { id: 3, grouping: "Entertainment", name: "Entertainment" },
  { id: 4, grouping: "Entertainment", name: "Games" },
  { id: 5, grouping: "Entertainment", name: "Movies" },
  { id: 6, grouping: "Entertainment", name: "Music" },
  { id: 7, grouping: "Entertainment", name: "Sports" },
  { id: 8, grouping: "Food and Drink", name: "Food and Drink" },
  { id: 9, grouping: "Food and Drink", name: "Dining Out" },
  { id: 10, grouping: "Food and Drink", name: "Groceries" },
  { id: 11, grouping: "Food and Drink", name: "Liquor" },
  { id: 12, grouping: "Home", name: "Home" },
  { id: 13, grouping: "Home", name: "Electronics" },
  { id: 14, grouping: "Home", name: "Furniture" },
  { id: 15, grouping: "Home", name: "Household Supplies" },
  { id: 16, grouping: "Home", name: "Maintenance" },
  { id: 17, grouping: "Home", name: "Mortgage" },
  { id: 18, grouping: "Home", name: "Pets" },
  { id: 19, grouping: "Home", name: "Rent" },
  { id: 20, grouping: "Home", name: "Services" },
  { id: 21, grouping: "Life", name: "Childcare" },
  { id: 22, grouping: "Life", name: "Clothing" },
  { id: 23, grouping: "Life", name: "Education" },
  { id: 24, grouping: "Life", name: "Gifts" },
  { id: 25, grouping: "Life", name: "Insurance" },
  { id: 26, grouping: "Life", name: "Medical Expenses" },
  { id: 27, grouping: "Life", name: "Taxes" },
  { id: 28, grouping: "Transportation", name: "Transportation" },
  { id: 29, grouping: "Transportation", name: "Bicycle" },
  { id: 30, grouping: "Transportation", name: "Bus/Train" },
  { id: 31, grouping: "Transportation", name: "Car" },
  { id: 32, grouping: "Transportation", name: "Gas/Fuel" },
  { id: 33, grouping: "Transportation", name: "Hotel" },
  { id: 34, grouping: "Transportation", name: "Parking" },
  { id: 35, grouping: "Transportation", name: "Plane" },
  { id: 36, grouping: "Transportation", name: "Taxi" },
  { id: 37, grouping: "Utilities", name: "Utilities" },
  { id: 38, grouping: "Utilities", name: "Cleaning" },
  { id: 39, grouping: "Utilities", name: "Electricity" },
  { id: 40, grouping: "Utilities", name: "Heat/Gas" },
  { id: 41, grouping: "Utilities", name: "Trash" },
  { id: 42, grouping: "Utilities", name: "TV/Phone/Internet" },
  { id: 43, grouping: "Utilities", name: "Water" },
];

export default function CategorySelector({
  onValueChange,
  defaultValue,
}: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number>(defaultValue);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setValue(defaultValue);
    onValueChange(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (open && buttonRef.current) {
      buttonRef.current.focus(); // Focus the button when the component is open
    }
  }, [open]);
  const selectedCategory =
    categories.find((cat) => cat.id == value) || categories[0];

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <CategoryButton category={selectedCategory} open={open} />
        </PopoverTrigger>
        <PopoverContent className="p-0 " align="start">
          <CategoryCommand
            onValueChange={(id) => {
              setValue(id);
              onValueChange(id);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <CategoryButton category={selectedCategory} open={open} />
      </DrawerTrigger>
      <DrawerContent className="p-0 bg-white text-card dark:bg-zinc-700 dark:text-white">
        <CategoryCommand
          onValueChange={(id) => {
            setValue(id);
            onValueChange(id);
            setOpen(false);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

function CategoryCommand({
  onValueChange,
}: {
  onValueChange: (categoryId: Category["id"]) => void;
}) {
  // Create a map to keep track of used groupings
  const usedGroupings = new Map<string, boolean>();

  return (
    <Command className="bg-white text-card dark:bg-zinc-700 dark:text-white">
      <CommandInput
        placeholder="Search category..."
        className="bg-white text-card dark:bg-zinc-700 dark:text-white"
      />
      <div className="w-full max-h-[300px] overflow-y-auto">
        <CommandList className="bg-white text-card dark:bg-zinc-700 dark:text-white">
          <CommandEmpty>No results found.</CommandEmpty>
          {categories.map((cat) => {
            // Check if the grouping has been used before
            if (!usedGroupings.has(cat.grouping)) {
              // Add the grouping to the map
              usedGroupings.set(cat.grouping, true);
              return (
                <CommandGroup key={cat.grouping} heading={cat.grouping}>
                  {categories
                    .filter((c) => c.grouping === cat.grouping)
                    .map((c) => (
                      <CommandItem
                        key={c.id}
                        onSelect={() => onValueChange(c.id)}
                      >
                        <CategoryIcon categoryId={c.id} />
                        <span>{c.name}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              );
            }
            return null; // Return null if the grouping has been used before
          })}
        </CommandList>
      </div>
    </Command>
  );
}
type CategoryButtonProps = {
  category: Category;
  open: boolean;
};
const CategoryButton = forwardRef<HTMLButtonElement, CategoryButtonProps>(
  ({ category, open, ...props }: ButtonProps & CategoryButtonProps, ref) => {
    return (
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-controls="category-list"
        className="flex items-center justify-between rounded-lg w-full bg-white dark:bg-zinc-600  h-10 m-1 px-4"
        ref={ref}
        {...props}
      >
        <CategoryLabel category={category} />
        <ChevronDown className="ml-2 h-5 w-5 shrink-0" />
      </Button>
    );
  }
);
CategoryButton.displayName = "CategoryButton";

function CategoryLabel({ category }: { category: Category }) {
  return (
    <div className="flex items-center gap-3">
      <CategoryIcon categoryId={category.id} />
      {category.name}
    </div>
  );
}
