import moment from "moment";
import droid from "../../asset/sound/droid.mp3";
import kaplya from "../../asset/sound/kaplya.mp3";
import signalizatsiya from "../../asset/sound/signalizatsiya.mp3";


export function createPassword() {

        let a = "par",
            b = "abcdefghijklmnopqrstuvwxyz1234567890",
            c = 6;
        for (let ma = 0; ma < c; ma++) {
            a += b[Math.floor(Math.random() * b.length)];
        }

        return a

}

export   function getDate  (date) {
    let rez = Math.ceil((+new Date(date) - new Date()) / 24 / 60 / 60 / 1000);


    if (rez < 0) {
        return  moment(date).format('HH:mm DD.MM.YYYY')

    } else return  moment(date).startOf('minute').fromNow()
}

export   function getSound  (value) {
    if(value==="droid"){
        return droid
    }
    if(value==="kaplya"){
        return kaplya
    }
    if(value==="signalizatsiya"){
        return signalizatsiya
    }

}


