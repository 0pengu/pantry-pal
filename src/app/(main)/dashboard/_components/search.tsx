import { useFilteredPantryItemsState } from "@/app/(main)/dashboard/store";
import { pantryItem } from "@/app/(main)/dashboard/types";
import { Input } from "@mui/material";
import { useEffect, useRef, useState } from "react";

interface SearchProps {
  pantryItems: pantryItem[];
}

export default function Search({ pantryItems }: SearchProps) {
  const setFilteredPantryItems = useFilteredPantryItemsState(
    (state) => state.setPantryItems
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filterPantryItems = () => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        setFilteredPantryItems(
          pantryItems.filter((item) => item.name.toLowerCase().includes(search))
        );
      } else {
        setFilteredPantryItems(pantryItems);
      }
    };

    filterPantryItems();
  }, [searchTerm, pantryItems, setFilteredPantryItems]);

  const handleInputChange = () => {
    if (ref.current) {
      setSearchTerm(ref.current.value);
    }
  };

  return (
    <Input placeholder="Search" inputRef={ref} onChange={handleInputChange} />
  );
}
