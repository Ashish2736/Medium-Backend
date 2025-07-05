import type { SignupInput } from "@tdem6842/medium-common";
import { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../config";
import axios from "axios";

export const Auth = ({ type }: { type: "signup" | "signin" }) =>{
    const navigate = useNavigate();
    const [postInput, setPostInput] = useState<SignupInput>({
        name:"",
        username:"",
        password:""
    });

    async function sendRequest(){
        try{
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInput);
            const jwt = response.data;
            localStorage.setItem("token", jwt);
            navigate("/blogs");

        }catch(e){
            alert("")
        }
    }




    return <div className="h-screen flex justify-center flex-col">
              <div className="flex justify-center">
               <div>
                <div className="px-10">
            <div className="text-3xl font-extrabold">
            Create an account
         </div>
         <div className="text-slate-400 text-left">
            {type === "signin"? "Don't Have an account?" : "Already Have an account?"} 
            <Link className="pl-2 underline" to={type==="signin"? "/signup" : "/signin"}>
            {type ==="signin"? "Sign up" : "Sign in"}
            </Link>
        </div>
    </div>
    <div className="pt-8">
        {type === "signup" ? <LabelledInput label="Name" placeholder="Name here" onChange={(e)=>{
        setPostInput({
            ...postInput,
            name: e.target.value
        })
    }} /> : null }

     <LabelledInput label="Username" placeholder="Username@gmail.com" onChange={(e)=>{
        setPostInput({
            ...postInput,
            username: e.target.value
        })
    }} />
     <LabelledInput label="Password" type={"password"} placeholder="Password" onChange={(e)=>{
        setPostInput({
            ...postInput,
            password: e.target.value
        })
    }} />
    <button onClick={sendRequest} type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg
     text-sm mt-8 px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 w-full dark:focus:ring-gray-700 dark:border-gray-700">{type === "sign up" ? "Signup" : "Signin"}</button>

       </div>
     </div>
   </div>
</div>
}



interface LabelledInputType{
    label:string,
    placeholder:string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string
}

function LabelledInput({ label, placeholder , onChange, type }: LabelledInputType){
    return  <div>
            <label className="block mb-2 text-sm text-gray-900 pt-4 font-semibold">{label}</label>
            <input  onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
             focus:border-blue-500 block p-2.5 w-full" placeholder={placeholder} required />
        </div>
}