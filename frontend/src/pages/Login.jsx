import React, { useContext, useState } from 'react'
import logo from "../assets/logo.svg"
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'

function Login() {
    let [show,setShow] = useState(false)
    let {serverUrl}=useContext(authDataContext)
    let {userData,setUserData}=useContext(userDataContext)
    let navigate = useNavigate()
    
    let [email, setEmail] = useState("")
    let [password, setPassword] = useState("")
    let [loading, setLoading] = useState(false)
    let [err,setErr] = useState("")

    const handleSignIn=async (e)=>{
        e.preventDefault()
        setLoading(true)
        try {
            let result = await axios.post(serverUrl+"/api/auth/login",{
                email,
                password
            },{withCredentials:true})
            setUserData(result.data)
            navigate("/")
            console.log(result)
            setErr("")
            setLoading(false)
            setEmail("")
            setPassword("")
        } catch (error) {
            setErr(error.response.data.message)
            setLoading(false)
        }
    }
  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center gap-[10px]'>
      <div className="absolute top-5 left-5 p-[10px]">
        <img src={logo} alt="" className="h-[30px]"/>
      </div>
      <form className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl mt-20 flex flex-col justify-center gap-[10px] p-[15px]' onSubmit={handleSignIn}>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign In</h1>
        <input type="email"  placeholder='email' required className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <div className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
            <input type={show?"text":"password"}  placeholder='password' required className='w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <span className='absolute right-5 top-[10px] text-[#24b2ff] cursor-pointer' onClick={()=>setShow(prev=>!prev)}>{show?"hidden":"show"}</span>
        </div>
        {err && <p className='text-center text-red-500'>*{err}</p>}
        <button className='w-full h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white' disabled={loading}>{loading?"Loading...":"Sign In"}</button>
        <p className='text-center cursor-pointer' onClick={()=>navigate("/signup")}>want to create a new account ? <span className='text-[#2a9bd8]'>Sign Up</span></p>
      </form>
    </div>
  )
}

export default Login
