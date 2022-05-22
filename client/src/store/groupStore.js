import {makeAutoObservable} from 'mobx'
import {groupAPI, userAPI} from "../api/api";
import {notification} from "./info";
import {current_user} from "./currentUser";






export const groupStore = makeAutoObservable({
    groups: [],
    loading: false,



    async createGroup(form) {

        try {
            const data = await groupAPI.create(form, localStorage.getItem('userData'));
            await this.getGroups()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async changeGroup(id, form) {

        try {
            const data = await groupAPI.change(id, form, localStorage.getItem('userData'));
            await this.getGroups()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async deleteGroup(id) {
        try {
            const data = await groupAPI.delete(id, localStorage.getItem('userData'));

            await this.getGroups()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },

    async getGroups() {
        this.setLoading()
        try {
            const data= await groupAPI.all(localStorage.getItem('userData'));

            this.groups= data.map(item=> ({...item, isRevers: false,  key: item.id, }))

            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },

    changeRevers(id) {
        try {
            this.groups= this.groups.map(item=>
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


