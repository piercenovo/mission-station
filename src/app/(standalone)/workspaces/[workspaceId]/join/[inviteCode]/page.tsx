import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkSpaceIdJoinPageProps {
  params: Promise<{ workspaceId: string }>; // Asegura que params es asíncrono
}

const WorkSpaceIdJoinPage = async ({ params }: WorkSpaceIdJoinPageProps) => {
  const resolvedParams = await params; // Esperamos los parámetros

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({
    workspaceId: resolvedParams.workspaceId,
  });

  if (!initialValues) {
    redirect("/");
  }

  return (
    <div className="w-full lg:max-w-2xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkSpaceIdJoinPage;
