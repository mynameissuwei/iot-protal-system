import Service from "@/axios";
import { API_ENN_OPERATION_PLATFORM } from "@/const";

export function getInfoDoc(params: any): Promise<any> {
  return Service({
    method: "get",
    url: `${API_ENN_OPERATION_PLATFORM}/info/doc/${params.id}`,
    data: params,
  });
}
