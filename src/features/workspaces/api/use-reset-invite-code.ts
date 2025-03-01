import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ]["$post"]({
        param,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // 🔹 Verificamos si `responseData` tiene la propiedad `error`
        if ("error" in responseData) {
          throw new Error(responseData.error);
        }
        throw new Error("Error al restablecer el código de invitación");
      }
      return responseData as ResponseType;
    },
    onSuccess: ({ data }) => {
      toast.success("Código de invitación restablecido");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (error) => {
      toast.error(
        error.message || "Error al restablecer el código de invitación"
      );
    },
  });

  return mutation;
};
