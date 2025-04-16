"use client"

import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { User } from "@/types"

interface ContactDetailsProps {
  user: User | null
}

export function ContactDetails({ user }: ContactDetailsProps) {
  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/20">
        <div className="text-center">
          <h3 className="text-lg font-medium">No contact selected</h3>
          <p className="text-muted-foreground">Select a contact to view details</p>
        </div>
      </div>
    )
  }

  // Mock data for contact details
  const contactDetails = {
    email: user.id === "user-2" ? "npeever1@ihg.com" : `${user.name.toLowerCase().replace(" ", ".")}@example.com`,
    about:
      user.id === "user-2"
        ? "I love reading, traveling and discovering new things. You need to be happy in life."
        : "No information provided",
    phone: user.id === "user-2" ? "973-760-6954" : "555-XXX-XXXX",
    country: user.id === "user-2" ? "Thailand" : "United States",
    gender: user.id === "user-2" ? "Female" : "Not specified",
    website: user.id === "user-2" ? "https://laborasyon.com" : "",
    lastSeen: user.id === "user-2" ? "2 minute ago" : user.status === "online" ? "Online" : "1 hour ago",
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-muted/20 border-l border-border">
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{contactDetails.email}</p>
          </div>
        </div>
        <Button className="rounded-full">New Chat</Button>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">ABOUT</h3>
          <p className="text-sm">{contactDetails.about}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">PHONE</h3>
          <p className="text-sm">{contactDetails.phone}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">COUNTRY</h3>
          <p className="text-sm">{contactDetails.country}</p>
        </div>

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">GENDER</h3>
          <p className="text-sm">{contactDetails.gender}</p>
        </div>

        {contactDetails.website && (
          <div>
            <h3 className="text-xs font-medium text-muted-foreground mb-2">WEBSITE</h3>
            <p className="text-sm">{contactDetails.website}</p>
          </div>
        )}

        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">LAST SEEN</h3>
          <p className="text-sm">{contactDetails.lastSeen}</p>
        </div>

        <div className="flex gap-3 pt-4">
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Facebook className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Twitter className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Linkedin className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Instagram className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
