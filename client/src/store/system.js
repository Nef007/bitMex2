import {makeAutoObservable} from 'mobx'
import {systemAPI} from "../api/api";
import {notification} from "./info";
import {current_user} from "./currentUser";
import {v4 as uuid} from "uuid";


export const system = makeAutoObservable({
    timeupdate: 60,
    index: [],
    log: [],
    filesDownloader: [],
    allVersions: [],
    version: {},
    defaultActiveKey: "1",
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
    async setTimeUpdate(form) {
        try {
           const data = await systemAPI.setTimeUpdate(form, localStorage.getItem('userData'))
            this.timeupdate=form.timeupdate

            notification.setInfo('success', data.message)
        } catch (e) {
            notification.setInfo('error', e.message)
        }

    },
    async getTimeUpdate() {
        try {
           this.timeupdate = await systemAPI.getTimeUpdate(localStorage.getItem('userData'))
        } catch (e) {
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
    async getLog() {
        try {
            this.setLoading()
            this.log = await systemAPI.getLog( localStorage.getItem('userData'))

            this.setLoading()
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async getIndex() {
        try {
            this.setLoading()
            this.index = await systemAPI.getIndex( )

           this.defaultActiveKey = String(system.index.findIndex((item=> item.rootSymbol==="XBT")))

            this.setLoading()
        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                current_user.logout()
            }
        }
    },
    async deleteLog() {
        try {

           const data = await systemAPI.deleteLog( localStorage.getItem('userData'))
             notification.setInfo('success', data.message)

        } catch (e) {

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


