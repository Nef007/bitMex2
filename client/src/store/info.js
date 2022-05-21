import {makeAutoObservable} from 'mobx'
import {notifiAPI} from "../api/api";
import {current_user} from "./currentUser";


export const notification = makeAutoObservable({

    info: {},
    all: [],
    loading: false,
    pagination: {
        current: 1,
        pageSize: 10,
        total: 0
    },


    async create(from) {
        try {
            const data = await notifiAPI.create(from, localStorage.getItem('userData'))

            await this.getNotifis()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }

    },

    async getNotifis(params = {
        pagination: {
            current: 1,
            pageSize: 10
        }
    }) {
        try {
            this.setLoading()
            const data = await notifiAPI.all(params, localStorage.getItem('userData'))
            this.all = data.notifis

            this.pagination = {
                ...params.pagination,
                total: data.totalCount,
            }

            this.setLoading()

            notification.setInfo('success', data.message)
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }

    },
    async delete(id) {
        try {
            this.setLoading()
            const data = await notifiAPI.del(id, localStorage.getItem('userData'))
            await this.getNotifis()
            this.setLoading()
            notification.setInfo('success', data.message)
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async getUsers(id) {
        try {
            this.setLoading()
            const data = await notifiAPI.getUsers(id, localStorage.getItem('userData'))

            this.all = this.all.map(item=>{
                if(item.id===id){
                    item.users=data
                }
                return item
            })
            this.setLoading()
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }

        }
    },

    cleanUsersInfo(id){
        this.all= this.all.map(item=>{
            if(item.id===id){
                item.users=[]
            }
            return item
        })
    },


    setInfo(status, message) {

        this.info = {
            status,
            message
        }

    },
    setLoading() {
        this.loading = !this.loading
    } ,



})


