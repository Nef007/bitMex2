import {makeAutoObservable} from 'mobx'
import {accountAPI, userAPI} from "../api/api";
import {notification} from "./info";
import {current_user} from "./currentUser";






export const accountStore = makeAutoObservable({
    accounts: [],
    loading: false,

    loadingDataUser:{
        loading: false,
        userId: ''

    },




    async create(form) {

        try {
            this.setLoading()
            const data = await accountAPI.create( form, localStorage.getItem('userData'));
            await this.getAll()
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
    async change(id, form) {

        try {
            const data = await accountAPI.change(id, form, localStorage.getItem('userData'));
            await this.getAll()
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
            const data = await accountAPI.delete(id, localStorage.getItem('userData'));

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
            this.accounts= await accountAPI.all(localStorage.getItem('userData'));
            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },

 async getData(id) {
        this.setLoadingGetData(id)
        try {
           const data= await accountAPI.getData(id,localStorage.getItem('userData'));

           this.accounts = this.accounts.map(item=>{
               if(item.id===id){
                   item=data
               }
               return item
           })

            this.setLoadingGetData(id)
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoadingGetData(id)
        }
    },

    async getDataAll(groupId) {
        this.setLoading()
        try {
           const data= await accountAPI.getDataAll(groupId,localStorage.getItem('userData'));

           this.accounts = this.accounts.map(item=>{
               data.map(jtem=> {
                   if(item.id===jtem.id){
                       item=jtem
                   }
               })
               return item
           })

            this.setLoading()
        } catch (e) {
            notification.setInfo('error', e.message)
            this.setLoading()
        }
    },


    setLoading() {
        this.loading = !this.loading
    } ,
    setLoadingGetData(id) {
        this.loadingDataUser={
            loading: !this.loadingDataUser.loading,
            userId: id
        }
    } ,

})


