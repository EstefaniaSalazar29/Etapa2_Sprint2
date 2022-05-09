import { logInGoogle } from "./firebase.js";

const login = document.getElementById('login')

if(login !== null){
    login.addEventListener('click', async(e)=>{
        const {error,data} = await logInGoogle();
        if(error){
            console.log(error);
            alert('ERROR');
        }else{
            localStorage.setItem('user',JSON.stringify({email:data.email,uid:data.uid}))
        }
    })
}