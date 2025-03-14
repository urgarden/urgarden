import { useState } from "react";

export const useSearch = <T extends { name: string }>(items: T[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    searchQuery,
    setSearchQuery,
    filteredItems,
  };
};
