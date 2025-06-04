import React, { useContext, useRef, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaPlus } from "react-icons/fa6";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/UserContext';
import dp from "../assets/dp.webp"
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

function EditProfile() {
    let {edit,setEdit,userData,setUserData} = useContext(userDataContext)
    let {serverUrl} = useContext(authDataContext)

    let [firstName, setFirstName] = useState(userData.firstName || "")
    let [lastName, setLastName] = useState(userData.lastName || "")
    let [userName, setUserName] = useState(userData.userName || "")
    let [headline, setHeadline] = useState(userData.headline || "")
    let [location, setLocation] = useState(userData.location || "")
    let [gender, setGender] = useState(userData.gender || "")
    let [skills,setSkills] = useState(userData.skills || [])
    let [newSkills, setNewSkills] = useState("")
    let [education,setEducation] = useState(userData.education || [])
    let [newEducation, setNewEducation] = useState({
        college:"",
        degree:"",
        fieldOfStduy:""
    })
    let [experience,setExperience] = useState(userData.experience || [])
    let [newExperience, setNewExperience] = useState({
        title:"",
        company:"",
        description:""
    })

    let [frontendprofileImage, setFrontendprofileImage] = useState(userData.profileImage || dp)
    let [backendprofileImage, setBackendprofileImage] = useState(null)

    let [frontendcoverImage, setFrontendcoverImage] = useState(userData.coverImage || null)
    let [backendcoverImage, setBackendcoverImage] = useState(null)
    let [saving,setSaving] = useState(false)

    const profileImage=useRef()
    const coverImage=useRef()

    function addSkills(e){
        e.preventDefault()
        if(newSkills && !skills.includes(newSkills)){
            setSkills([...skills,newSkills])
        }
        setNewSkills("")
    }
    function removeSkill(skill){
        if(skills.includes(skill)){
            setSkills(skills.filter((s)=>s!==skill))
        }
    }

    function addEducation(e){
        e.preventDefault()
        if(newEducation.college && newEducation.degree && newEducation.fieldOfStduy){
            setEducation([...education,newEducation])
        }
        setNewEducation({
            college:"",
            degree:"",
            fieldOfStduy:""
        })
    }

    function removeEducation(edu){
        if(education.includes(edu)){
            setEducation(education.filter((e)=>e!==edu))
        }
    }

    function addExperience(e){
        e.preventDefault()
        if(newExperience.title && newExperience.company && newExperience.description){
            setExperience([...experience,newExperience])
        }
        setNewExperience({
            title:"",
            company:"",
            description:""
        })
    }

    function removeExperience(exp){
        if(experience.includes(exp)){
            setExperience(experience.filter((e)=>e!==exp))
        }
    }

    function handleprofileImage(e){
        let file = e.target.files[0]
        setBackendprofileImage(file)
        setFrontendprofileImage(URL.createObjectURL(file))
    }

    function handlecoverImage(e){
        let file = e.target.files[0]
        setBackendcoverImage(file)
        setFrontendcoverImage(URL.createObjectURL(file))
    }

    const handleSaveProfile=async ()=>{
        setSaving(true)
        try {
            let formdata = new FormData()
            formdata.append("firstName",firstName)
            formdata.append("lastName",lastName)
            formdata.append("userName",userName)
            formdata.append("headline",headline)
            formdata.append("location",location)
            formdata.append("skills",JSON.stringify(skills))
            formdata.append("education",JSON.stringify(education))
            formdata.append("experience",JSON.stringify(experience))

            if(backendprofileImage){
                formdata.append("profileImage",backendprofileImage)
            }

            if(backendcoverImage){
                formdata.append("coverImage",backendcoverImage)
            }

            let result = await axios.put(serverUrl+"/api/user/updateprofile",formdata,{withCredentials:true})
            setUserData(result.data)
            setSaving(false)
            setEdit(false)

        } catch (error) {
            console.log(error)
            setSaving(false)
        }
    }

  return (
    <div className='w-full h-[100vh] fixed top-0 z-[100] flex items-center justify-center'>

    <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleprofileImage}/>
    <input type="file" accept='image/*' hidden ref={coverImage} onChange={handlecoverImage}/>

        <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0'></div>
      <div className='w-[90%] max-w-[500px] h-[600px] bg-white relative z-[200] shadow-lg rounded-lg p-[10px] overflow-auto'>
        <div className='absolute top-[20px] right-[20px] cursor-pointer' onClick={()=>setEdit(false)}><RxCross2 className='w-[25px] h-[25px] text-gray-800 font-bold'/></div>

        <div className='w-full h-[150px] bg-gray-500 rounded-lg mt-[40px] overflow-hidden' onClick={()=>coverImage.current.click()}>
            <img src={frontendcoverImage} alt="" className='w-full'/>
            <FiCamera className='absolute right-5 top-[60px] w-[25px] h-[25px] text-white cursor-pointer'/>
        </div>

        <div className='w-[80px] h-[80px] rounded-full overflow-hidden absolute top-[150px] ml-5' onClick={()=>profileImage.current.click()}>
            <img src={frontendprofileImage} alt="" className='w-full h-full'/>
        </div>
        <div className='w-[20px] h-[20px] bg-[#17c1ff] absolute top-[200px] left-[95px] rounded-full flex justify-center items-center cursor-pointer'>
          <FaPlus  className='text-white'/>
        </div>

        <div className='w-full flex flex-col items-center justify-center gap-5 mt-[50px]'>
            <input type="text" placeholder='firstName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
            <input type="text" placeholder='lastName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
            <input type="text" placeholder='userName' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
            <input type="text" placeholder='headline' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
            <input type="text" placeholder='location' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={location} onChange={(e)=>setLocation(e.target.value)}/>
            <input type="text" placeholder='gender(male/female/other)' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[18px] border-2 rounded-lg' value={gender} onChange={(e)=>setGender(e.target.value)}/>

            <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                <h1 className='text-[19px] font-semibold'>Skills</h1>
                {skills && <div className='flex flex-col gap-[10px]'>
                    {skills.map((skill,index)=>(
                        <div key={index} className='w-full h-[40px] border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'><span>{skill}</span><RxCross2 className='w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={()=>removeSkill(skill)}/></div>
                    ))}
                </div>}
                <div className='flex flex-col gap-[10px] items-start'>
                    <input type="text" placeholder='add new skill' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newSkills} onChange={(e)=>setNewSkills(e.target.value)}/>
                    <button className='w-full h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={addSkills}>Add</button>
                </div>
            </div>


            <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                <h1 className='text-[19px] font-semibold'>Education</h1>
                {education && <div className='flex flex-col gap-[10px]'>
                    {education.map((edu,index)=>(
                        <div key={index} className='w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'>
                            <div>
                                <div>College: {edu.college}</div>
                                <div>Degree: {edu.degree}</div>
                                <div>Field of Study: {edu.fieldOfStduy}</div>
                            </div>
                            <RxCross2 className='w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={()=>removeEducation(edu)}/></div>
                    ))}
                </div>}
                <div className='flex flex-col gap-[10px] items-start'>
                    <input type="text" placeholder='college' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})}/>

                    <input type="text" placeholder='degree' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})}/>

                    <input type="text" placeholder='Field of Study' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newEducation.fieldOfStduy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStduy:e.target.value})}/>
                    <button className='w-full h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={addEducation}>Add</button>
                </div>
            </div>


            <div className='w-full p-[10px] border-2 border-gray-600 flex flex-col gap-[10px] rounded-lg'>
                <h1 className='text-[19px] font-semibold'>Experiences</h1>
                {experience && <div className='flex flex-col gap-[10px]'>
                    {experience.map((exp,index)=>(
                        <div key={index} className='w-full border-[1px] border-gray-600 bg-gray-200 rounded-lg p-[10px] flex justify-between items-center'>
                            <div>
                                <div>Title: {exp.title}</div>
                                <div>Company: {exp.company}</div>
                                <div>Description: {exp.description}</div>
                            </div>
                            <RxCross2 className='w-[20px] h-[20px] text-gray-800 font-bold cursor-pointer' onClick={()=>removeExperience(exp)}/></div>
                    ))}
                </div>}
                <div className='flex flex-col gap-[10px] items-start'>
                    <input type="text" placeholder='title' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience,title:e.target.value})}/>

                    <input type="text" placeholder='company' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})}/>

                    <input type="text" placeholder='description..' className='w-full h-[50px] outline-none border-gray-600 px-[10px] py-[5px] text-[16px] border-2 rounded-lg' value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience,description:e.target.value})}/>
                    <button className='w-full h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={addExperience}>Add</button>
                </div>
            </div>

            <button className='w-full h-[50px] rounded-full bg-[#24b2ff] mt-[40px] text-white' disable={saving} onClick={()=>handleSaveProfile()}>{saving?"saving...":"Save Profile"}</button>
        </div>

      </div>
    </div>
  )
}

export default EditProfile
