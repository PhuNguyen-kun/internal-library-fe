import axiosInstance from '@/utils/axiosInstance'
import type {LoginPayload, SignupPayload} from '@/types/Common/auth'

export const login = (payload: LoginPayload) => {
  return axiosInstance.post('/auth/login', payload)
}

export const signup = (payload: SignupPayload) => {
  return axiosInstance.post('/auth/signup', payload);
};

export const logout = () => {
  return axiosInstance.post('/auth/logout')
}

export  const profile = () => {
  return axiosInstance.get('/auth/profile')
}

export const loginGoogle = (token: string) => {
  return axiosInstance.post('/auth/login-google', {token})
}
