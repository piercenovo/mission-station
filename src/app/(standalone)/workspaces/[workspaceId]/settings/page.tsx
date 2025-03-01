import { getCurrent } from "@/features/auth/actions";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";

interface WorkSpaceIdSettingsPageProps {
  params: Promise<{ workspaceId: string }>; // Asegura que params es asíncrono
}

const WorkSpaceIdSettingsPage = async ({
  params,
}: WorkSpaceIdSettingsPageProps) => {
  const resolvedParams = await params; // Esperamos los parámetros

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspace({
    workspaceId: resolvedParams.workspaceId,
  });

  if (!initialValues) {
    redirect(`/workspaces/${resolvedParams.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkSpaceIdSettingsPage;
