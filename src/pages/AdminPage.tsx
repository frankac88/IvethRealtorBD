import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Globe,
  ImagePlus,
  LogOut,
  Mail,
  MessageSquare,
  Pencil,
  Phone,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useLogoutMutation } from "@/features/auth/hooks";
import { useLeadsQuery } from "@/features/leads/hooks";
import {
  emptyProjectFormValues,
  projectToFormValues,
  type ProjectFormValues,
  type ProjectItem,
} from "@/features/projects/catalog";
import {
  useAdminProjectsQuery,
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "@/features/projects/hooks";
import { useToast } from "@/hooks/use-toast";

type RequiredProjectField = Exclude<keyof ProjectFormValues, "featured">;
type BilingualProjectFieldKey = Exclude<keyof ProjectFormValues, "title" | "priceFrom" | "featured">;

const REQUIRED_PROJECT_FIELDS: Array<[RequiredProjectField, string]> = [
  ["title", "Título"],
  ["priceFrom", "Precio desde"],
  ["unitsEs", "Unidades ES"],
  ["unitsEn", "Units EN"],
  ["rentalEs", "Renta ES"],
  ["rentalEn", "Rental EN"],
  ["deliveryEs", "Entrega ES"],
  ["deliveryEn", "Delivery EN"],
  ["locationEs", "Ubicación ES"],
  ["locationEn", "Location EN"],
  ["shortDescriptionEs", "Descripción corta ES"],
  ["shortDescriptionEn", "Short description EN"],
  ["strategicSummaryEs", "Resumen estratégico ES"],
  ["strategicSummaryEn", "Strategic summary EN"],
];

const interestLabels: Record<string, string> = {
  precon: "Preconstrucción",
  miami: "Miami",
  orlando: "Orlando",
  financing: "Financiamiento",
  other: "Otro",
};

const bilingualFieldRows: Array<{
  labelEs: string;
  labelEn: string;
  esKey: BilingualProjectFieldKey;
  enKey: BilingualProjectFieldKey;
  textarea?: boolean;
  optional?: boolean;
}> = [
  { labelEs: "Ubicación", labelEn: "Location", esKey: "locationEs", enKey: "locationEn" },
  { labelEs: "Renta", labelEn: "Rental", esKey: "rentalEs", enKey: "rentalEn" },
  { labelEs: "Entrega", labelEn: "Delivery", esKey: "deliveryEs", enKey: "deliveryEn" },
  { labelEs: "Unidades", labelEn: "Units", esKey: "unitsEs", enKey: "unitsEn" },
  {
    labelEs: "Descripción corta",
    labelEn: "Short description",
    esKey: "shortDescriptionEs",
    enKey: "shortDescriptionEn",
    textarea: true,
  },
  {
    labelEs: "Resumen estratégico",
    labelEn: "Strategic summary",
    esKey: "strategicSummaryEs",
    enKey: "strategicSummaryEn",
    textarea: true,
  },
];

const AdminPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    data: leads = [],
    isLoading: isLoadingLeads,
    isFetching: isFetchingLeads,
    refetch: refetchLeads,
  } = useLeadsQuery();
  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    isFetching: isFetchingProjects,
    refetch: refetchProjects,
    error: projectsError,
  } = useAdminProjectsQuery();

  const logoutMutation = useLogoutMutation();
  const createProjectMutation = useCreateProjectMutation();
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const [activeTab, setActiveTab] = useState("projects");
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [formValues, setFormValues] = useState<ProjectFormValues>(emptyProjectFormValues);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const refreshing = isFetchingLeads || isFetchingProjects || logoutMutation.isPending;
  const projectsSubmitting = createProjectMutation.isPending || updateProjectMutation.isPending;

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(editingProject?.imageUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [editingProject, imageFile]);

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title)),
    [projects],
  );

  const resetProjectForm = () => {
    setEditingProject(null);
    setFormValues(emptyProjectFormValues);
    setImageFile(null);
  };

  const updateField = <K extends keyof ProjectFormValues>(field: K, value: ProjectFormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const validateProjectForm = () => {
    const missingField = REQUIRED_PROJECT_FIELDS.find(([field]) => formValues[field].trim().length === 0);
    if (missingField) {
      throw new Error(`El campo "${missingField[1]}" es obligatorio.`);
    }

    if (!editingProject && !imageFile) {
      throw new Error("Debes subir una imagen para crear el proyecto.");
    }
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/login");
  };

  const handleRefresh = async () => {
    await Promise.all([refetchLeads(), refetchProjects()]);
  };

  const handleProjectSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      validateProjectForm();

      if (editingProject) {
        await updateProjectMutation.mutateAsync({
          projectId: editingProject.id,
          payload: { values: formValues, imageFile },
        });
        toast({
          title: "Proyecto actualizado",
          description: "Se guardaron los cambios y los metadatos automáticos del proyecto.",
        });
      } else {
        await createProjectMutation.mutateAsync({
          values: formValues,
          imageFile,
        });
        toast({
          title: "Proyecto creado",
          description: "El proyecto y su imagen fueron guardados en Supabase.",
        });
      }

      resetProjectForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar el proyecto.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  const handleEditProject = (project: ProjectItem) => {
    setEditingProject(project);
    setFormValues(projectToFormValues(project));
    setImageFile(null);
    setActiveTab("projects");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteProject = async (project: ProjectItem) => {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${project.title}"? Esto borrará también su imagen de Supabase.`,
    );

    if (!confirmed) return;

    try {
      await deleteProjectMutation.mutateAsync(project.id);

      if (editingProject?.id === project.id) {
        resetProjectForm();
      }

      toast({
        title: "Proyecto eliminado",
        description: "El proyecto y su imagen fueron eliminados de Supabase.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar el proyecto.";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div>
            <h2 className="text-xl font-serif">Panel de administración</h2>
            <p className="text-sm text-muted-foreground">Gestiona leads y proyectos desde un solo lugar</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing || isLoadingLeads || isLoadingProjects}
            >
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <section className="rounded-lg bg-background shadow">
              <div className="border-b p-4 md:p-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-serif">{editingProject ? "Editar proyecto" : "Nuevo proyecto"}</h2>
                    <p className="text-sm text-muted-foreground">
                      Completa solo los datos que corresponden a los placeholders actuales del diseño: precio, renta, entrega, unidades, descripción, resumen y foto principal.
                    </p>
                  </div>

                  {editingProject ? (
                    <Button type="button" variant="outline" onClick={resetProjectForm}>
                      Cancelar edición
                    </Button>
                  ) : null}
                </div>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-6 p-4 md:p-6">
                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_360px]">
                  <div className="space-y-4">
                    <label className="space-y-2">
                      <span className="text-sm font-medium">Nombre del proyecto</span>
                      <Input
                        value={formValues.title}
                        onChange={(event) => updateField("title", event.target.value)}
                        placeholder="Ej. EDGE HOUSE"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium">Precio desde (USD)</span>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        value={formValues.priceFrom}
                        onChange={(event) => updateField("priceFrom", event.target.value)}
                        placeholder="Ej. 450000"
                      />
                    </label>

                    <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="project-featured"
                          checked={formValues.featured}
                          onCheckedChange={(checked) => updateField("featured", checked === true)}
                        />
                        <div className="space-y-1">
                          <Label htmlFor="project-featured">Destacado</Label>
                          <p className="text-sm text-muted-foreground">
                            Cuando esté marcado, este proyecto queda disponible como destacado para los bloques que usan Supabase.
                          </p>
                        </div>
                      </div>
                    </div>

                    {bilingualFieldRows.map((field) => {
                      const FieldComponent = field.textarea ? Textarea : Input;

                      return (
                        <div key={field.esKey} className="grid gap-4 md:grid-cols-2">
                          <label className="space-y-2">
                            <span className="text-sm font-medium">
                              {field.labelEs} ES{field.optional ? " (opcional)" : ""}
                            </span>
                            <FieldComponent
                              value={formValues[field.esKey]}
                              onChange={(event) => updateField(field.esKey, event.target.value)}
                              className={field.textarea ? "min-h-[110px]" : undefined}
                            />
                          </label>

                          <label className="space-y-2">
                            <span className="text-sm font-medium">
                              {field.labelEn} EN{field.optional ? " (optional)" : ""}
                            </span>
                            <FieldComponent
                              value={formValues[field.enKey]}
                              onChange={(event) => updateField(field.enKey, event.target.value)}
                              className={field.textarea ? "min-h-[110px]" : undefined}
                            />
                          </label>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-4">
                    <label className="space-y-2">
                      <span className="text-sm font-medium">Foto del proyecto</span>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                      />
                    </label>

                    <div className="rounded-lg border border-dashed p-4">
                      {imagePreviewUrl ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreviewUrl}
                            alt="Vista previa del proyecto"
                            className="aspect-[4/3] w-full rounded-md object-cover"
                          />
                          <p className="text-xs text-muted-foreground">
                            {imageFile ? "Vista previa de la nueva imagen" : "Imagen actual del proyecto"}
                          </p>
                        </div>
                      ) : (
                        <div className="flex min-h-[260px] flex-col items-center justify-center text-center text-muted-foreground">
                          <ImagePlus className="mb-3 h-10 w-10 opacity-50" />
                          <p className="text-sm">Sube una imagen para este proyecto</p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground">Se genera automáticamente</p>
                      <ul className="mt-2 space-y-1">
                        <li>• Badge superior de la tarjeta</li>
                        <li>• Filtros por ubicación, renta y estrategia</li>
                        <li>• Orden al final del catálogo</li>
                        <li>• Estado publicado</li>
                      </ul>
                      <p className="mt-3 text-xs">
                        La foto se guarda en el bucket project-images de Supabase.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                  <Button type="button" variant="outline" onClick={resetProjectForm} disabled={projectsSubmitting}>
                    Limpiar
                  </Button>
                  <Button type="submit" disabled={projectsSubmitting}>
                    {projectsSubmitting ? "Guardando..." : editingProject ? "Guardar cambios" : "Crear proyecto"}
                  </Button>
                </div>
              </form>
            </section>

            <section className="overflow-hidden rounded-lg bg-background shadow">
              <div className="border-b p-4">
                <p className="text-sm text-muted-foreground">
                  {projects.length} proyecto{projects.length !== 1 ? "s" : ""} en Supabase
                </p>
                {projectsError ? (
                  <p className="mt-2 text-sm text-destructive">
                    No se pudieron cargar los proyectos de Supabase. Verifica la configuración antes de usar este panel.
                  </p>
                ) : null}
              </div>

              {projects.length === 0 && !isLoadingProjects ? (
                <div className="p-12 text-center text-muted-foreground">
                  <ImagePlus size={40} className="mx-auto mb-3 opacity-40" />
                  <p>Aún no hay proyectos almacenados en Supabase.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead>Renta</TableHead>
                        <TableHead>Entrega</TableHead>
                        <TableHead>Unidades</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Actualizado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedProjects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="h-12 w-16 rounded object-cover"
                              />
                              <div>
                                <p className="font-medium">{project.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {project.priceFrom ? `Desde $${project.priceFrom.toLocaleString("en-US")}` : "Sin precio"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {project.badge.es} / {project.badge.en}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{project.location.es}</TableCell>
                          <TableCell>{project.type.es}</TableCell>
                          <TableCell>{project.delivery.es}</TableCell>
                          <TableCell>{project.residences.es}</TableCell>
                          <TableCell>{project.isPublished ? "Publicado" : "Borrador"}</TableCell>
                          <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                            {project.updatedAt ? format(new Date(project.updatedAt), "dd/MM/yy HH:mm") : "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}>
                                <Pencil size={14} className="mr-1" />
                                Editar
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteProject(project)}
                                disabled={deleteProjectMutation.isPending}
                              >
                                <Trash2 size={14} className="mr-1" />
                                Eliminar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </section>
          </TabsContent>

          <TabsContent value="leads">
            <div className="overflow-hidden rounded-lg bg-background shadow">
              <div className="flex items-center justify-between border-b p-4">
                <p className="text-sm text-muted-foreground">
                  {leads.length} lead{leads.length !== 1 ? "s" : ""} recibido{leads.length !== 1 ? "s" : ""}
                </p>
              </div>

              {leads.length === 0 && !isLoadingLeads ? (
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
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
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
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;

