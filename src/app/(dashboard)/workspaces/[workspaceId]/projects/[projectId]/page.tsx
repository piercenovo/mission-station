import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

interface ProjectIdPageProps {
  params: Promise<{ projectId: string }>;
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const resolvedParams = await params;

  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <div>ProjectIdPage: {resolvedParams.projectId}</div>;
};

export default ProjectIdPage;
