import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLogoutMutation } from "@/features/auth/hooks";
import { useLeadsQuery } from "@/features/leads/hooks";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, RefreshCw, Mail, Phone, Globe, MessageSquare } from "lucide-react";
import { format } from "date-fns";

const AdminPage = () => {
  const navigate = useNavigate();
  const { data: leads = [], isLoading, isFetching, refetch } = useLeadsQuery();
  const logoutMutation = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/login");
  };

  const refreshing = isFetching || logoutMutation.isPending;

  const interestLabels: Record<string, string> = {
    precon: "Preconstrucción",
    miami: "Miami",
    orlando: "Orlando",
    financing: "Financiamiento",
    other: "Otro",
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-serif text-xl">Panel de Leads</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading || refreshing}>
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              <span className="ml-1 hidden sm:inline">Actualizar</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} disabled={logoutMutation.isPending}>
              <LogOut size={14} />
              <span className="ml-1 hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {leads.length} lead{leads.length !== 1 ? "s" : ""} recibido{leads.length !== 1 ? "s" : ""}
            </p>
          </div>

          {leads.length === 0 && !isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-40" />
              <p>Aún no hay leads registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>País</TableHead>
                    <TableHead>Interés</TableHead>
                    <TableHead>Mensaje</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {format(new Date(lead.created_at), "dd/MM/yy HH:mm")}
                      </TableCell>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>
                        <a href={`mailto:${lead.email}`} className="text-primary hover:underline flex items-center gap-1">
                          <Mail size={13} /> {lead.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {lead.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone size={13} /> {lead.phone}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {lead.country ? (
                          <span className="flex items-center gap-1">
                            <Globe size={13} /> {lead.country}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>{interestLabels[lead.interest || ""] || lead.interest || "—"}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">{lead.message || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
