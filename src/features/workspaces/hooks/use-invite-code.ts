import { useParams } from "next/navigation";

export const useInviteCode = () => {
  const paramas = useParams();
  return paramas.inviteCode as string;
};
