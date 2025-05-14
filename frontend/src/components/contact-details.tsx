"use client"

import { useState, useEffect } from "react"; // Added useState, useEffect
import { Facebook, Twitter, Linkedin, Globe, Mail, User as UserIcon, Calendar, Clock, Info, UserPlus, MessageSquare, Loader2, CheckCircle, XCircle } from "lucide-react"; // Added UserPlus, MessageSquare, Loader2, CheckCircle, XCircle
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User as UserType, SearchedUser } from "@/types"; // UserType can be User or SearchedUser
import { format } from "date-fns";
import { useApi } from "@/hooks/use-api"; // Import useApi

// Import AlertDialog components from shadcn/ui
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ContactDetailsProps {
  user: UserType | SearchedUser | null;
  // We might need a prop to know if we are in "add friend context" if not inferable
  // isAddingFlow?: boolean; // Or infer this by checking if user is in contacts
}

export function ContactDetails({ user }: ContactDetailsProps) {
  const {
    contacts, // List of current user's contacts
    createPrivateChatAndUpdateContacts,
    isCreatingChat,
    createChatError,
    lastCreatedChatInfo,
    currentUserDetail, // The logged-in user
  } = useApi();

  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"loading" | "success" | "error" | null>(null);
  const [alertMessage, setAlertMessage] = useState("");

  const isAlreadyContact = user ? contacts.some(contact => contact.id === user.id) : false;
  const isSelf = user ? user.id === currentUserDetail?.id : false;


  useEffect(() => {
    if (isCreatingChat) {
      setAlertStatus("loading");
      setAlertMessage("Adding contact...");
      setIsAlertDialogOpen(true);
    } else if (!isCreatingChat && alertStatus === "loading") { // Transition from loading
      if (createChatError) {
        setAlertStatus("error");
        setAlertMessage(createChatError || "Failed to add contact. Please try again.");
      } else if (lastCreatedChatInfo) {
        setAlertStatus("success");
        setAlertMessage(`Successfully added ${user?.profile.nickname || user?.username}!`);
        // Contact list is updated by createPrivateChatAndUpdateContacts
      }
      // Keep dialog open for success/error message unless user closes it
    }
  }, [isCreatingChat, createChatError, lastCreatedChatInfo, alertStatus, user]);


  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-medium">No contact selected</h3>
          <p className="text-muted-foreground">Select a contact to view details</p>
        </div>
      </div>
    );
  }

  const handleAddFriend = async () => {
    if (!user || isAlreadyContact || isSelf) return;

    setAlertStatus("loading");
    setAlertMessage("Adding contact...");
    setIsAlertDialogOpen(true); // Open dialog immediately

    await createPrivateChatAndUpdateContacts(user.id);
    // useEffect above will handle updating alertStatus and message based on context changes
  };

  const handleNewChat = () => {
    // Placeholder for initiating a new chat with an existing contact
    // This would typically involve navigating to a chat screen or opening a chat window
    console.log("Initiating new chat with:", user.username);
    // Example: navigate(`/chat/${user._id}`);
    alert(`Starting chat with ${user.profile.nickname || user.username}`);
  };

  const closeAlertDialog = () => {
    setIsAlertDialogOpen(false);
    setAlertStatus(null); // Reset status when dialog is closed
    setAlertMessage("");
  };


  return (
    <>
      <div className="flex-1 flex flex-col h-full bg-muted/20 border-l border-border overflow-y-auto custom-scrollbar">
        <div className="p-6 sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.profile.nickname || user.username} />
                <AvatarFallback>{(user.profile.nickname || user.username).substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{user.profile.nickname || user.username}</h2>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.status && ( // User might not have status if it's a SearchedUser without full details yet
                     <Badge variant={user.status.online ? "default" : "secondary"}>
                        {user.status.online ? "Online" : "Offline"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {!isSelf && ( // Don't show add/chat button for self
                isAlreadyContact ? (
                <Button className="rounded-full" onClick={handleNewChat}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    New Chat
                </Button>
                ) : (
                <Button className="rounded-full" onClick={handleAddFriend} disabled={isCreatingChat}>
                    {isCreatingChat ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    Add Friend
                </Button>
                )
            )}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-max">
          {/* About Card */}
          <Card className="col-span-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-md">
                <Info className="h-4 w-4" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{user.profile.bio || "No bio provided"}</p>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-md">
                <UserIcon className="h-4 w-4" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">EMAIL</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">USERNAME</p>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">@{user.username}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card - Conditionally render if status and createdAt exist */}
          {(user.status || user.createdAt) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-md">
                  <Clock className="h-4 w-4" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.createdAt && (
                    <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">JOINED</p>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
                    </div>
                    </div>
                )}
                {user.status && user.status.lastSeen && ( // Ensure lastSeen exists
                    <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">LAST SEEN</p>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">
                        {user.status.online
                            ? "Online now"
                            : `${format(new Date(user.status.lastSeen), "MMMM d, yyyy 'at' h:mm a")}`}
                        </p>
                    </div>
                    </div>
                )}
              </CardContent>
            </Card>
          )}


          {/* Social Links Card - Remains the same for now */}
          <Card className="col-span-full">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-md">
                <Globe className="h-4 w-4" />
                Social Links (Placeholder)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {/* Placeholder buttons, these would need actual links and logic */}
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" disabled><Facebook className="h-5 w-5" /></Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" disabled><Twitter className="h-5 w-5" /></Button>
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10" disabled><Linkedin className="h-5 w-5" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Alert Dialog for Add Friend Status */}
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {alertStatus === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
              {alertStatus === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
              {alertStatus === "error" && <XCircle className="h-5 w-5 text-red-500" />}
              {alertStatus === "loading" ? "Processing" : alertStatus === "success" ? "Success" : alertStatus === "error" ? "Error" : "Notification"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage || (alertStatus === "success" ? "Action completed successfully." : alertStatus === "error" ? "An error occurred." : "Please wait...")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {alertStatus !== "loading" && (
                // For success/error, allow user to close.
                // AlertDialogAction can be used for a confirm/continue, AlertDialogCancel for a cancel.
                // Here, a simple "OK" button to close.
                 <Button onClick={closeAlertDialog}>OK</Button>
            )}
            {/* If loading, footer might be empty or have a cancel option if applicable */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}