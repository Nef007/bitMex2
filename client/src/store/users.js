import {makeAutoObservable} from 'mobx'
import {userAPI} from "../api/api";
import {notification} from "./info";
import {current_user} from "./currentUser";
import {getSound} from "../asset/utils/utils";



export const users = makeAutoObservable({

    users: [],
    index_user: null,
    loading: false,
    loading_Logs: false,
    loading_AccessService: false,
    pagination: {
        current: 1,
        pageSize: 10,
        total: 0
    },
    async getUsers(params = {
        pagination: {
            current: 1,
            pageSize: 10
        }
    }) {
        this.setLoading()
        try {
            const data = await userAPI.all(params, localStorage.getItem('userData'));

            this.users = data.users
            this.pagination = {
                ...params.pagination,
                total: data.totalCount,
            }
            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },

    async getUser(id) {
        this.setLoading()
        try {
                const data= await userAPI.get(id, localStorage.getItem('userData'));
            this.index_user = {...this.index_user,  ...data}
            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },


    async delUser(id, callback) {
        try {
            const data = await userAPI.del(id, localStorage.getItem('userData'));
            callback()  // переход на /users
            notification.setInfo('success', data.message)

        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }

        }
    },
    async changeUser(id, valueForm) {
        this.setLoading()
        try {
            const data = await userAPI.change(id, valueForm, localStorage.getItem('userData'));
            await this.getUser(id)
            notification.setInfo('success', data.message)
            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async changeSetting(id, valueForm) {
        this.setLoading()
        try {
            const data = await userAPI.changeSetting(id, valueForm, localStorage.getItem('userData'));
            this.index_user = {...this.index_user, setting: {...this.index_user.setting, ...valueForm}}
            if(valueForm.sound){
                current_user.audio= new Audio(getSound(valueForm.sound))
            }

            notification.setInfo('success', data.message)
            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },


    async getLogs(id) {
        this.setLoadingLogs()
        try {

            const data = await userAPI.getLogs(id);
            this.index_user={ ...this.index_user , logs: data}
            this.setLoadingLogs()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoadingLogs()
        }
    },
    async getLogsFile(id) {

        try {
             await userAPI.getLogsFile(id);
        } catch (e) {
            notification.setInfo('error', e.message)

        }
    },

    async createAccessService(id, valueForm) {

        try {
            const data = await userAPI.createdAccessService(id, valueForm, localStorage.getItem('userData'));
            await this.getAllAccessService(id)
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async deleteAccessService(id, valueForm) {
        try {
            const data = await userAPI.deleteAccessService(id, valueForm, localStorage.getItem('userData'));

            await this.getAllAccessService(id)
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },

    async getAllAccessService(id) {
        this.setLoadingAccessService()
        try {
            const data = await userAPI.getAccessService(id);
            this.index_user={ ...this.index_user , access_services: data}
            this.setLoadingAccessService()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoadingAccessService()
        }
    },



    setLoading() {
        this.loading = !this.loading
    } ,
    setLoadingLogs() {
        this.loading_Logs = !this.loading_Logs
    },

    setLoadingAccessService() {
        this.loading_AccessService = !this.loading_AccessService
    } ,

})


