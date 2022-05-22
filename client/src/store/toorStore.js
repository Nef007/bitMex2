import {makeAutoObservable} from 'mobx'
import {toorAPI, userAPI} from "../api/api";
import {notification} from "./info";
import {current_user} from "./currentUser";






export const toorStore = makeAutoObservable({
    toors: [],
    myToors: [],
    adminToors: [],
    loading: false,



    async create(form) {

        try {
            const data = await toorAPI.create(form, localStorage.getItem('userData'));
            await this.getAll()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async change(id, form) {

        try {
            const data = await toorAPI.change(id, form, localStorage.getItem('userData'));
            await this.getAll()
            await this.getMyAll()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async delete(id) {
        try {
            const data = await toorAPI.delete(id, localStorage.getItem('userData'));

            await this.getAll()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },

    async getAll() {
        this.setLoading()
        try {
            const data= await toorAPI.all(localStorage.getItem('userData'));

            this.toors= data.map(item=> ({...item, isRevers: false,  key: item.id, }))

            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },
    async getMyAll() {
        this.setLoading()
        try {
            const data= await toorAPI.myAll(localStorage.getItem('userData'));

            this.myToors= data.map(item=> ({...item, isRevers: false,  key: item.id, }))

            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },
    async getAdminAll() {
        this.setLoading()
        try {
            const data= await toorAPI.adminAll(localStorage.getItem('userData'));

            this.adminToors= data.map(item=> ({...item, isRevers: false,  key: item.id, }))

            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },

    changeRevers(id) {
        try {
            this.toors= this.toors.map(item=>
                {
                    if(item.id===id){
                        item.isRevers=!item.isRevers
                    }
                    return item
                }
            )

        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },


    setLoading() {
        this.loading = !this.loading
    } ,

})


