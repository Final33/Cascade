import UpgradePage from "@/app/upgrade/page"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog"

export function UpgradeDialog({
	upgradeDialogOpen,
	setUpgradeDialogOpen,
}: {
	upgradeDialogOpen: boolean
	setUpgradeDialogOpen: (value: boolean) => void
}) {
	return (
		<Dialog
			open={upgradeDialogOpen}
			onOpenChange={() => setUpgradeDialogOpen(false)}
		>
			<DialogContent className="w-[90vw] max-w-[1200px] h-[95vh]">
				<UpgradePage />
			</DialogContent>
		</Dialog>
	)
}
