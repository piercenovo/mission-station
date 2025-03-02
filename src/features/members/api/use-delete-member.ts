import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({
        param,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // 🔹 Verificamos si `responseData` tiene la propiedad `error`
        if ("error" in responseData) {
          throw new Error(responseData.error);
        }
        throw new Error("Error al eliminar el miembro");
      }
      return responseData as ResponseType;
    },
    onSuccess: () => {
      toast.success("Miembro eliminado");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al eliminar el miembro");
    },
  });

  return mutation;
};
