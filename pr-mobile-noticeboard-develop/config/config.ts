const prod = {
  url: {
    KEYCLOAK_BASE_URL: 'http://211.170.25.109:9080/auth',
    API_BASE_URL: 'http://devops-tools.pmsplus.co.kr:19184',
    FE_BASE_URL: 'http://devops-tools.pmsplus.co.kr:9933/',
  },
}

const dev = {
  url: {
    KEYCLOAK_BASE_URL: 'http://10.250.109.121:9080/auth',
    API_BASE_URL: 'http://10.250.109.121:9084',
    FE_BASE_URL: 'http://localhost:3000/',
  },
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod
