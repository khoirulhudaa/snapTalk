import { signProps } from "../utils/interfaces/sign";
import api from './axios';

const API = {

    // Account user
    checkAccount: (body: signProps) => {
        return api.post('/account/signin/user', body)
    },
    createAccount: (body: signProps) => {
        return api.post('/account/signup/user', body)
    },
    updateProfile: (body: any) => {
        return api.post('/account/user', body)
    },

    // Groups
    createGroup: (body: any) => {
        return api.post('/group', body)
    },
    getAllGroups: (user_id: string) => {
        return api.get(`/account/list/groups/${user_id}`)
    },
    removeGroup: (group_id: string) => {
        return api.delete(`/group/remove/${group_id}`)
    },
    addMember: (body: any) => {
        return api.post('/group/add/member', body)
    },
    leftGroup: (body: any) => {
        return api.post('/group/remove/member', body)
    },
    updateProfileGroup: (body: any) => {
        return api.post('/group/update', body)
    },

    // Friens
    getAllRelationship: (number_telephone: string) => {
        return api.get(`/account/relationship/${number_telephone}`)
    },
    addFriend: (body: any) => {
        return api.post('/account/add/relation', body)
    },
    removeRelationship: (body: any) => {
        return api.post('/account/remove/relation', body)
    },

    // Chat
    createChat: (body: any) => {
        return api.post('/send-chat', body)
    },
    getAllChatPersonal: (body: any) => {
        console.log('personal:',body)
        return api.post('/chat/messagePersonal', body)
    },
    getAllChatGroup: (group_id: string) => {
        return api.post(`/chat/messageGroup/${group_id}`)
    },
    removeChat: (body: any) => {
        return api.post('/chat_remove', body)
    }

}

export default API;