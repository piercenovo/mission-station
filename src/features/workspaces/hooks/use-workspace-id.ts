import { useParams } from "next/navigation";

export const useWorkspaceId = () => {
  const paramas = useParams();

  return paramas.workspaceId as string;
};
