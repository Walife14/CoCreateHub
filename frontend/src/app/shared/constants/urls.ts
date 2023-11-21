// const BASE_URL = 'http://localhost:5000'
// const BASE_URL = 'http://192.168.1.141:5000'
const BASE_URL = 'https://co-create-hub-8d7609aba189.herokuapp.com'

// AUTH

export const AUTH_LOGIN_URL = BASE_URL + '/api/auth/login'

export const AUTH_REGISTER_URL = BASE_URL + '/api/auth/register'

// USER

export const USER_UPDATE_URL = BASE_URL + '/api/users/update'

export const USER_BY_ID_URL = BASE_URL + '/api/users/user/'

export const USER_VISIBLE_TRUE_URL = BASE_URL + '/api/users/active-buddies'

export const USER_PROJECT_INVITE = BASE_URL + '/api/users/invite'

export const USER_HANDLE_INVITE = BASE_URL + '/api/users/invite/response'

// PROJECT

export const PROJECT_FETCH_ALL_URL = BASE_URL + '/api/projects'

export const PROJECT_CREATE_URL = BASE_URL + '/api/projects/create'

export const PROJECT_FETCH_BY_ID = BASE_URL + '/api/projects/project/'

export const PROJECT_UPDATE_URL = BASE_URL + '/api/projects/project/update'

export const PROJECT_DELETE_URL = BASE_URL + '/api/projects/project/delete'