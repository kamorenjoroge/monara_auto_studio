import type { ApprovalStatus } from "@/lib/types";

// Small label showing where a car is in the approval process.
const styles: Record<ApprovalStatus, string> = {
  pending: "bg-primary/20 text-primary-dark",
  approved: "bg-whatsapp/15 text-whatsapp-dark",
  rejected: "bg-destructive/10 text-destructive",
};

const labels: Record<ApprovalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

const ApprovalBadge = ({ status }: { status: ApprovalStatus }) => {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
};

export default ApprovalBadge;