import { pantryItem } from "@/app/(main)/pantry/types";
import { Input } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface SearchProps {
  pantryItems: pantryItem[];
  setFilteredPantryItems: Dispatch<SetStateAction<pantryItem[]>>;
}

export default function Search({
  pantryItems,
  setFilteredPantryItems,
}: SearchProps) {
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
