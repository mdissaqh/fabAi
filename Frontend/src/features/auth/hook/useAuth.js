import { useDispatch } from "react-redux";
import { setError, setLoading, setUser } from "../auth.slice";
import { getMe, login, register } from "../service/auth.api";


export function useAuth() {
    const dispatch = useDispatch()
    async function registerHandler({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            await register({ email, username, password })
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function loginHandler({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
        }
        catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    async function getMeHandler() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        }
        catch (err) {
            dispatch(setError(err.response?.data?.message || "User not found"))
        } finally {
            dispatch(setLoading(false))
        }
    }
    return {
        registerHandler,
        loginHandler,
        getMeHandler
    }
}