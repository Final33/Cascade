"use client"
import React, { useState, useContext, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"

import SideBarContent from "./SidebarContent"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
	DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DocumentContext } from "@/context/DocumentContext"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser-client"
import { v4 as uuidv4 } from "uuid"

import { toast } from "@/components/ui/use-toast"

import { UserContext } from "@/context/UserContext"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"



interface SidebarProps {
  userData?: any
  isLoading?: boolean
  isAuthenticated?: boolean
  onCollapseChange?: (collapsed: boolean) => void
  onAuthSuccess?: () => void
}

const Sidebar = ({ userData: propUserData, isLoading, isAuthenticated, onCollapseChange, onAuthSuccess }: SidebarProps) => {
	const { userData } = useContext(UserContext)
	const userPlan = userData?.plan
	const [isCollapsed, setIsCollapsed] = useState(false)

	const [deleteDocumentDialogOpen, setDeleteDocumentDialogOpen] =
		useState(false)
	const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
		null
	)
	const [editingDocumentId, setEditingDocumentId] = useState<string | null>(
		null
	)

	const [newDocumentTitle, setNewDocumentTitle] = useState<string>("")
	const [currentSelectedDocumentId, setCurrentSelectedDocumentId] = useState<
		string | null
	>(null)
	const [supabase, setSupabase] = useState<ReturnType<typeof createSupabaseBrowserClient> | null>(null)
	
	useEffect(() => {
		// Initialize Supabase client only on the client side
		setSupabase(createSupabaseBrowserClient())
	}, [])

	const pathnameRouter = usePathname()
	const router = useRouter()
	const { documentData, refreshDocumentData } = useContext(DocumentContext)

	const sortedDocuments = useMemo(() => {
		return documentData.sort(
			(a, b) =>
				new Date(b.created_at).getTime() -
				new Date(a.created_at).getTime()
		)
	}, [documentData])

	const isActive = useMemo(() => {
		return (path: string) => {
			if (path === "/dashboard") {
				return pathnameRouter === path
			} else {
				return pathnameRouter.startsWith(path)
			}
		}
	}, [pathnameRouter])

	useEffect(() => {
		setCurrentSelectedDocumentId(pathnameRouter.split("/")[3])
	}, [pathnameRouter])

	useEffect(() => {
		onCollapseChange?.(isCollapsed)
	}, [isCollapsed, onCollapseChange])

	async function updateDocumentTitle(id: string, title: string) {
		if (!supabase) return
		
		const { error } = await (supabase as any)
			.from("documents")
			.update({ title })
			.eq("id", id)
		if (error) console.error(error)
		refreshDocumentData()
		setEditingDocumentId(null)
	}

	async function createDocument() {
		if (!supabase) return
		
		const session = await supabase.auth.getSession()
		if (session.data.session) {
			const user = session.data.session.user
			const id = uuidv4()
			const { data, error } = await (supabase as any).from("documents").insert([
				{
					id: id,
					title: "New Essay",
					user_id: user.id,
					created_at: new Date().toISOString(),
				},
			])
			if (error) console.log(error)
			setCurrentSelectedDocumentId(id)

			router.push(`/dashboard/documents/${id}`)
			refreshDocumentData()
		}
	}

	async function deleteDocument(id: string) {
		if (!supabase) return
		
		if (documentData.length <= 1) {
			toast({
				title: "Error",
				description: "You cannot delete the last document.",
			})
			setDeleteDocumentDialogOpen(false)
			return
		}

		const { data, error } = await (supabase as any)
			.from("documents")
			.update({ hidden: true })
			.eq("id", id)
		if (error) console.log(error)
		refreshDocumentData()
		setDeleteDocumentDialogOpen(false)
	}

	async function logout() {
		if (!supabase) return
		
		await supabase.auth.signOut()
		router.push("/")
		router.refresh()
	}

	// Don't render until supabase client is ready
	if (!supabase) {
		return null
	}

	return (
		<>
			<div className={`
        hidden md:flex h-screen flex-col fixed left-0 top-0 bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out shadow-lg
        ${isCollapsed ? 'w-28' : 'w-64'}
      `}>
				<SideBarContent
					currentSelectedDocumentId={currentSelectedDocumentId}
					userPlan={userPlan}
					createDocument={createDocument}
					logout={logout}
					editingDocumentId={editingDocumentId}
					setEditingDocumentId={setEditingDocumentId}
					selectedDocumentId={selectedDocumentId}
					setSelectedDocumentId={setSelectedDocumentId}
					deleteDocumentDialogOpen={deleteDocumentDialogOpen}
					setDeleteDocumentDialogOpen={setDeleteDocumentDialogOpen}
					newDocumentTitle={newDocumentTitle}
					setNewDocumentTitle={setNewDocumentTitle}
					updateDocumentTitle={updateDocumentTitle}
					sortedDocuments={sortedDocuments}
					userData={userData}
					isActive={isActive}
					setCurrentSelectedDocumentId={setCurrentSelectedDocumentId}
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
					isAuthenticated={isAuthenticated}
					onAuthSuccess={onAuthSuccess}
				/>
			</div>

			<div className="md:hidden">
				<header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="outline"
								size="icon"
								className="shrink-0 md:hidden"
							>
								<Menu className="h-5 w-5" />
								<span className="sr-only">
									Toggle navigation menu
								</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="flex flex-col w-64 p-0">
							<SideBarContent
								currentSelectedDocumentId={
									currentSelectedDocumentId
								}
								userPlan={userPlan}
								createDocument={createDocument}
								logout={logout}
								editingDocumentId={editingDocumentId}
								setEditingDocumentId={setEditingDocumentId}
								selectedDocumentId={selectedDocumentId}
								setSelectedDocumentId={setSelectedDocumentId}
								deleteDocumentDialogOpen={
									deleteDocumentDialogOpen
								}
								setDeleteDocumentDialogOpen={
									setDeleteDocumentDialogOpen
								}
								newDocumentTitle={newDocumentTitle}
								setNewDocumentTitle={setNewDocumentTitle}
								updateDocumentTitle={updateDocumentTitle}
								sortedDocuments={sortedDocuments}
								userData={userData}
								isActive={isActive}
								setCurrentSelectedDocumentId={
									setCurrentSelectedDocumentId
								}
								isCollapsed={false}
								setIsCollapsed={setIsCollapsed}
								isAuthenticated={isAuthenticated}
								onAuthSuccess={onAuthSuccess}
							/>
						</SheetContent>
					</Sheet>
				</header>
			</div>

			<Dialog
				open={deleteDocumentDialogOpen}
				onOpenChange={() => setDeleteDocumentDialogOpen(false)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Delete</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this idea?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={() => selectedDocumentId && deleteDocument(selectedDocumentId)}
						>
							Confirm
						</Button>
						<Button
							onClick={() => setDeleteDocumentDialogOpen(false)}
						>
							Cancel
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>


		</>
	)
}

export default React.memo(Sidebar)