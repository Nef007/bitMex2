import {makeAutoObservable} from 'mobx'
import {systemAPI} from "../api/api";
import {notification} from "./info";
import {current_user} from "./currentUser";
import {v4 as uuid} from "uuid";


export const system = makeAutoObservable({

    filesDownloader: [],
    allVersions: [],
    version: {},
    loading: false,

    async createVersion(from) {
        try {
            const data = await systemAPI.create_Version(from, localStorage.getItem('userData'))
            await this.getAllVersion()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }

    },

    async getAllVersion() {
        try {
            this.setLoading()
            this.allVersions= await systemAPI.all_Versions(localStorage.getItem('userData'))
            this.setLoading()
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
        }

    },
    async changeVersion(id, form) {
        try {
            const data = await systemAPI.change_Version(id,  form, localStorage.getItem('userData'))
            await this.getAllVersion()
            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }

    },

    async deleteVersion(id) {
        try {
            this.setLoading()
            const data = await systemAPI.del_Version(id, localStorage.getItem('userData'))
            await this.getAllVersion()
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
    async getVersionIndex(id) {
        try {
            this.setLoading()
            this.version = await systemAPI.get_VersionIndex(id, localStorage.getItem('userData'))

            this.setLoading()
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    setLoading() {
        this.loading = !this.loading
    } ,

    cleanVersion() {
        this.version = {}
    } ,

     downloadFileBar (file){
        this.filesDownloader = [...this.filesDownloader, { ...file, downloadId: uuid() }];


     },
     removeFilesBar  (removeId) {
         this.filesDownloader = [
        ...this.filesDownloader.filter((file) => file.downloadId !== removeId),
    ];

}



})


