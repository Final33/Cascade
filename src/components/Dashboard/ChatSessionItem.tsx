"use client"

import { useState } from "react"
import { MoreHorizontal, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ChatSession } from "@/types/chat"

interface ChatSessionItemProps {
  session: ChatSession
  isSelected: boolean
  onSelect: (session: ChatSession) => void
  onRename: (sessionId: string, newTitle: string) => void
  onDelete: (sessionId: string) => void
}

export default function ChatSessionItem({
  session,
  isSelected,
  onSelect,
  onRename,
  onDelete
}: ChatSessionItemProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [newTitle, setNewTitle] = useState(session.title)

  const handleRename = () => {
    if (newTitle.trim() && newTitle.trim() !== session.title) {
      onRename(session.id, newTitle.trim())
    }
    setIsRenaming(false)
  }

  const handleDelete = () => {
    onDelete(session.id)
    setIsDeleting(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(date))
  }

  return (
    <>
      <div
        className={cn(
          "group relative w-full text-left p-3 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01]",
          "hover:bg-gray-50 border border-transparent hover:shadow-sm cursor-pointer",
          isSelected 
            ? "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-900 shadow-sm" 
            : "text-gray-700"
        )}
        onClick={() => onSelect(session)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-medium mb-2 line-clamp-2 pr-2">
              {session.title}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(session.created_at)}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity",
                  "hover:bg-gray-200 flex-shrink-0",
                  isSelected && "opacity-100"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setNewTitle(session.title)
                  setIsRenaming(true)
                }}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  setIsDeleting(true)
                }}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Rename Dialog */}
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
            <DialogDescription>
              Give this conversation a new name that describes its content.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter new chat title..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename()
                } else if (e.key === 'Escape') {
                  setIsRenaming(false)
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenaming(false)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!newTitle.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this conversation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">{session.title}</p>
              <p className="text-sm text-gray-500 mt-1">
                Created on {formatDate(session.created_at)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
