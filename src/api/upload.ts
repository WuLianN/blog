import { defHttp } from '@/utils/http/axios'
import { ContentTypeEnum } from '@/enums/httpEnum'

export function uploadFile(data: any) {
  return defHttp.post<any>({
    url: '/upload/file',
    headers: {
      'Content-Type': ContentTypeEnum.FORM_DATA,
    },
    data,
  })
}
