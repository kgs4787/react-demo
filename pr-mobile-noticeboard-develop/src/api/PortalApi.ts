import axios from 'axios'
import { config } from '@/config/config'

export const portalApi = {
    setAccessMenulog,
}

function setAccessMenulog(
    projectId:  number,
    params: {
        menu_url: string
        menu_name: string
    },
    token:string,
) {
    const formData = new FormData()

    formData.append('menu_url', params.menu_url)
    formData.append('menu_name', params.menu_name)

    return instance.post(`/tms/${projectId}/apicall/setAccessMenuLog`,
    formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: bearerAuth(token),
        },
    })
}

// -- Axios
const instance = axios.create({
  baseURL: config.url.API_BASE_URL,
})

instance.interceptors.response.use(
  (response) => {
    return response
  },
  function (error) {
    if (error.response.status === 404) {
      return { status: error.response.status }
    }
    return Promise.reject(error.response)
  },
)

// Token 불러오는 함수
function bearerAuth(token: string) {
  return `Bearer ${token}`
}
