import { recipe } from "@/app/(main)/recipe/types";
import { Input } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface SearchProps {
  recipes: recipe[];
  setFilteredRecipes: Dispatch<SetStateAction<recipe[]>>;
}

export default function Search({ recipes, setFilteredRecipes }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const filterrecipes = () => {
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        setFilteredRecipes(
          recipes.filter((item) => item.name.toLowerCase().includes(search))
        );
      } else {
        setFilteredRecipes(recipes);
      }
    };

    filterrecipes();
  }, [searchTerm, recipes, setFilteredRecipes]);

  const handleInputChange = () => {
    if (ref.current) {
      setSearchTerm(ref.current.value);
    }
  };

  return (
    <Input placeholder="Search" inputRef={ref} onChange={handleInputChange} />
  );
}
