import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // 🔹 Verificamos si `responseData` tiene la propiedad `error`
        if ("error" in responseData) {
          throw new Error(responseData.error);
        }
        throw new Error("Error al actualizar el espacio de trabajo");
      }
      return responseData as ResponseType;
    },
    onSuccess: ({ data }) => {
      toast.success("Espacio de trabajo actualizado");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el espacio de trabajo");
    },
  });

  return mutation;
};
