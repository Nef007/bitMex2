import io from "socket.io-client";



export function socket (id){
   return  io(window.location.origin, {query: {id}}

)}










