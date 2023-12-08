import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useMutationHook({
  api,
  queryKey,
  success,
  error,
  method,
  data,
  refresh,
}: {
  api: string;
  queryKey?: string;
  success?: string;
  error?: string;
  method: "post" | "delete" | "patch";
  data?: any;
  refresh?: boolean;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: async () =>
      await axios.request({
        url: api,
        method,
        data,
      }),
    onSettled: () => {
      queryKey &&
        queryClient.invalidateQueries([queryKey] as InvalidateQueryFilters);
      refresh && router.refresh();
    },
    onSuccess: () => success && toast.success(success),
    onError: () => toast.error(error || "Something went wrong"),
  });

  return { mutate, isPending };
}
