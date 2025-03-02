import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // 🔹 Verificamos si `responseData` tiene la propiedad `error`
        if ("error" in responseData) {
          throw new Error(responseData.error);
        }
        throw new Error("Error al actualizar el miembro");
      }
      return responseData as ResponseType;
    },
    onSuccess: ({ data }) => {
      toast.success("Miembro actualizado");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      queryClient.invalidateQueries({ queryKey: ["member", data.$id] });
    },
    onError: (error) => {
      toast.error(error.message || "Error al actualizar el miembro");
    },
  });

  return mutation;
};
