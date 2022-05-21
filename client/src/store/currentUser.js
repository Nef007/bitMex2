import {makeAutoObservable} from 'mobx'
import {authAPI, notifiAPI, userAPI} from "../api/api";
import {notification} from "./info";
import {socket} from "../api/socketConnect";
import {getSound} from "../asset/utils/utils";
import notifi from "../asset/sound/notifi.mp3";



export const current_user = makeAutoObservable({
    user: {},
    isAuth: false,
    isReset: false,
    initialized: false,
    notification: [],
    loading: false,
    socket: null,
    audio: null,
    logout() {

        this.isAuth = false
        this.socket= null
        localStorage.removeItem('userData')
    },
    async login(value) {

        this.setLoading()
        try {

            const data = await authAPI.login(value)
            localStorage.setItem('userData', data.token);
            this.user = data.user
            this.socket= socket(data.user.id)
            this.audio= new Audio(getSound(data.dataInfo.setting.sound))
            this.notification = data.dataInfo.notifi

            if(data.user.role==="Пользователь"){

              //  this.followSocketResponse()
            }

          //  this.followSocketNotifi()

            if(data.user.status==="Временный"){

                this.isReset = true

            }else this.isAuth = true

            this.setLoading()


        } catch (e) {
            this.setLoading()
            notification.setInfo('error', e.message )

         }

    },
    async me(){
        try {
            const data = await authAPI.auth(localStorage.getItem('userData'));
            this.user = data.user
            this.socket= socket(data.user.id)
            this.audio= new Audio(getSound(data.dataInfo.setting.sound))

            this.notification = data.dataInfo.notifi

            if(data.user.role==="Пользователь"){
              //  this.followSocketResponse()
            }

          //  this.followSocketNotifi()

            if(data.user.status==="Временный"){

                this.isReset = true

            }else this.isAuth = true

            localStorage.setItem('userData', data.token);
        }catch (e) {
            this.logout()
        }


    } ,
    async initializedApp(){
        await this.me()

        this.initialized = true

    },
    async register(from, value) {

        try {
            const data = await authAPI.register(from, value)

            notification.setInfo('success', data.message )
        } catch (e) {

            notification.setInfo('error', e.message )

        }

    },

    async seen(array) {
        try {

            const data = await notifiAPI.seeNotifi(array, localStorage.getItem('userData'))
            this.notification =   await notifiAPI.getNotifi( localStorage.getItem('userData'))
            notification.setInfo('success', data.message)

        } catch (e) {
            notification.setInfo('error', e.message)

            if(e.message==="Не действительный токен"){
                this.logout()
            }


        }

    },
    async changePassword(form) {
        try {
            const data = await userAPI.change(this.user.id, form, localStorage.getItem('userData'))
           this.isAuth= true
           this.isReset= false

            notification.setInfo('success', data.message)

        } catch (e) {
            notification.setInfo('error', e.message)
            if(e.message==="Не действительный токен"){
                this.logout()
            }
        }

    },



    // followSocketResponse() {
    //     this.socket.on('ADDED:RESPONSE', async ()=>{
    //         // console.log('Принял новый ответ')
    //         await requests.getAll("response")
    //         await requests.getAll("send")
    //         this.audio.play()
    //
    //     })
    //    },
    //
    // followSocketRequest() {
    //    this.socket.on('ADDED:REQUEST', async ()=>{
    //       // console.log('Принял новый запрос')
    //        await requests.getAll("wait")
    //
    //
    //    })
    //
    //     this.socket.on('ADDED:WAIT', async ()=>{
    //       // console.log('Принял новый запрос') //  для обновление у других операторов
    //        await requests.getAll("wait")
    //
    //
    //    })
    //
    // },
    //
    // followSocketNotifi() {
    //    this.socket.on('ADDED:NOTIFI', async ()=>{
    //
    //        try{
    //            this.notification =   await notifiAPI.getNotifi( localStorage.getItem('userData'))
    //            const audio = new Audio(notifi)
    //            await audio.play()
    //        }catch (e) {
    //            console.log("Ошибка получения оповещения")
    //        }
    //
    //
    //    })
    //
    // },

    setLoading() {
        this.loading = !this.loading
    } ,

})


