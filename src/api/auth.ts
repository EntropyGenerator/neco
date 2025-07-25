import { api } from "./api";

export class UserEntity {
    id: string = ``; // uuid
    name: string = ``;
    email: string = ``;
    groups: string[] = [];
}

export class AuthAPI {
    static login = async (email: string, password: string): Promise<boolean> => {
        let result = false;
        await api.post(`/auth/login`,{
            email:email,
            password:password,
        }).then((r) => {
            localStorage.setItem('token',r.data.token)
            localStorage.setItem('user_id',r.data.user)
            result = true
        }).catch((e)=>{
            console.log(e)
        })
        return result
    }
}