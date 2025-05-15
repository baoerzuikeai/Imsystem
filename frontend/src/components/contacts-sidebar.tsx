"use client"

import { useState, useEffect } from "react"
import { Search, ArrowLeft, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { User,SearchedUser } from "@/types"
import { useApi } from "@/hooks/use-api"

interface ContactsSidebarProps {
  isOpen: boolean
  onSelectUser: (user: User | SearchedUser) => void // Allow selecting searched users too
  selectedUser: User | SearchedUser | null
}

export function ContactsSidebar({ isOpen, onSelectUser, selectedUser }: ContactsSidebarProps) {
  const{isAuthenticated,contacts,isLoadingContacts,searchedUsers,isSearchingUsers,performUserSearch,currentUserDetail
  } =useApi()

  const [isAddingMode, setIsAddingMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState(""); // For adding mode search
  const [listSearchQuery, setListSearchQuery] = useState(""); // For filtering existing contacts

  const debouncedSearchKeyword = useDebounce(searchKeyword, 500); // Debounce search input
  useEffect(() => {
    if (isAddingMode && debouncedSearchKeyword.trim() && isAuthenticated) {
      performUserSearch(debouncedSearchKeyword.trim());
    } else if (isAddingMode && !debouncedSearchKeyword.trim()) {
      // Clear search results if keyword is empty
      // The performUserSearch in context already handles this by setting searchedUsers to []
      performUserSearch(""); // Or directly setSearchedUsers([]) if you prefer managing it here
    }
  }, [debouncedSearchKeyword, isAddingMode, isAuthenticated, performUserSearch]);

  const handleToggleMode = () => {
    setIsAddingMode(!isAddingMode);
    setSearchKeyword(""); // Clear search keyword when toggling mode
    setListSearchQuery(""); // Clear list filter
    // if (!isAddingMode) {
    //   // Optionally clear selected user when switching to add mode if it's from contacts
    // }
  };

   // Filter for existing contacts list
   const filteredContacts = contacts.filter(
    (user) =>
      (user.profile.nickname || user.username).toLowerCase().includes(listSearchQuery.toLowerCase())
  );

  const usersToDisplay = isAddingMode
  ? searchedUsers.filter(user => user.id !== currentUserDetail?.id) // Filter out self from search results
  : filteredContacts;

  const isLoadingList = isAddingMode ? isSearchingUsers : isLoadingContacts;

  if (!isOpen) {
    return null
  }

  return (
    <div className="border-r border-border bg-background h-full w-80 flex flex-col shadow-sm">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isAddingMode && (
            <Button variant="ghost" size="icon" onClick={handleToggleMode} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Contacts</span>
            </Button>
          )}
          <h2 className="text-xl font-bold">
            {isAddingMode ? "Add New Contact" : "Contacts"}
          </h2>
        </div>
        {!isAddingMode && (
             <Button variant="outline" size="icon" className="rounded-full" onClick={handleToggleMode}>
                <Users className="h-4 w-4" /> {/* Icon for adding contacts */}
                <span className="sr-only">Add New Contact</span>
            </Button>
        )}
      </div>

      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={isAddingMode ? "Search users to add..." : "Search your contacts..."}
            className="pl-8"
            value={isAddingMode ? searchKeyword : listSearchQuery}
            onChange={(e) => isAddingMode ? setSearchKeyword(e.target.value) : setListSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoadingList && (
          <div className="p-4 text-center text-muted-foreground">Loading...</div>
        )}
        {!isLoadingList && usersToDisplay.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            {isAddingMode
              ? (searchKeyword.trim() ? "No users found." : "Enter name or email to search.")
              : "No contacts yet."}
          </div>
        )}
        {/* TODO: Display searchUsersError or contactsError if they exist */}
        <div className="flex flex-col">
          {usersToDisplay.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors ${
                selectedUser?.id === user.id ? "bg-accent/50" : ""
              }`}
              onClick={() => onSelectUser(user)}
            >
              <Avatar>
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.profile.nickname || user.username} />
                <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{user.profile.nickname || user.username}</h3>
                <p className="text-xs text-muted-foreground truncate">{user.email || "No email provided"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

