
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { EnterpriseLead } from "@/types/admin";

interface EnterpriseLeadsListProps {
  leads: EnterpriseLead[];
}

export const EnterpriseLeadsList = ({ leads }: EnterpriseLeadsListProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.company_name}</TableCell>
                <TableCell>{lead.contact_name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone || 'N/A'}</TableCell>
                <TableCell className="max-w-xs truncate">
                  {lead.message}
                </TableCell>
                <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    lead.status === 'new' 
                      ? 'bg-blue-100 text-blue-800'
                      : lead.status === 'contacted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
