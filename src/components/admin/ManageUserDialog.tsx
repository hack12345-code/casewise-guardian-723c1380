
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User } from "@/types/admin";

interface ManageUserDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onBlock: () => void;
  onCancelSubscription: () => void;
  onDelete: () => void;
}

export const ManageUserDialog = ({
  user,
  isOpen,
  onClose,
  onBlock,
  onCancelSubscription,
  onDelete,
}: ManageUserDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage User Account</DialogTitle>
          <DialogDescription>
            {user?.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Button
            variant="destructive"
            onClick={onCancelSubscription}
            className="w-full"
          >
            Cancel Subscription
          </Button>
          
          <Button
            variant={user?.isBlocked ? "outline" : "destructive"}
            onClick={onBlock}
            className="w-full"
          >
            {user?.isBlocked ? 'Unblock User' : 'Block User from Prompting'}
          </Button>
          
          <Button
            variant="destructive"
            onClick={onDelete}
            className="w-full"
          >
            Delete Account
          </Button>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
