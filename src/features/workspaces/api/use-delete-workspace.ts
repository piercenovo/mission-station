import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$delete"]
>;

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$delete"]({
        param,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // 🔹 Verificamos si `responseData` tiene la propiedad `error`
        if ("error" in responseData) {
          throw new Error(responseData.error);
        }
        throw new Error("Error al eliminar el espacio de trabajo");
      }
      return responseData as ResponseType;
    },
    onSuccess: ({ data }) => {
      toast.success("Espacio de trabajo eliminado");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar el espacio de trabajo");
    },
  });

  return mutation;
};
