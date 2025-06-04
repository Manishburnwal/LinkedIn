import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { RxCrossCircled } from "react-icons/rx";
import dp from "../assets/dp.webp"

function Notification() {

    let {serverUrl}=useContext(authDataContext)
    let [notificationData, setNotificationData]=useState([])

    const handleGetNotification=async ()=>{
        try {
            let result=await axios.get(serverUrl+"/api/notification/get",{withCredentials:true})
            setNotificationData(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteNotification=async (id)=>{
        try {
            let result=await axios.delete(serverUrl+`/api/notification/deleteone/${id}`,{withCredentials:true})
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }

    const handleClearAllNotification=async ()=>{
        try {
            let result=await axios.delete(serverUrl+"/api/notification",{withCredentials:true})
            await handleGetNotification()
        } catch (error) {
            console.log(error)
        }
    }

    function handleMessage(type){
        if(type=="like"){
            return "liked your post"
        }
        else if(type=="comment"){
            return  "commented on your post"
        } else {
            return "accepted your connection request"
        }
    }

    // Helper function to truncate long text
    const truncateText = (text, maxLength = 100) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    }

    // Helper function to get user display name safely
    function getUserDisplayName(user) {
        if (!user) return "Unknown User";
        
        const firstName = user.firstName || "";
        const lastName = user.lastName || "";
        
        if (!firstName && !lastName) return "Unknown User";
        
        return `${firstName} ${lastName}`.trim();
    }

    useEffect(()=>{
        handleGetNotification()
    },[])

    useEffect(()=>{
        console.log("Notification data:", notificationData);
        notificationData.forEach((noti, index) => {
            console.log(`Notification ${index}:`, {
                relatedUser: noti.relatedUser,
                firstName: noti?.relatedUser?.firstName,
                lastName: noti?.relatedUser?.lastName
            });
        });
    }, [notificationData])

  return (
    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
      <Nav/>
      <div className='w-full h-[100px] bg-[white] shadow-lg rounded-lg flex items-center p-[10px] text-[22px] text-gray-600 justify-between'>
        <div>
            Notifications {notificationData.length}
        </div>
        {notificationData.length>0 && <button className='min-w-[100px] cursor-pointer h-[40px] border-2 border-[#ec4545] text-[#ec4545] rounded-full hover:bg-[#ec4545] hover:text-white transition-colors duration-200' onClick={handleClearAllNotification}>clear all</button>}
      </div>
      
      {notificationData.length>0 && 
        <div className='w-[100%] max-w-[900px] shadow-lg rounded-lg bg-white flex flex-col h-[calc(100vh-250px)] overflow-auto'>
          {notificationData.map((noti,index)=>(
            <div className='w-full p-[20px] flex justify-between items-start border-b-2 border-b-gray-200 last:border-b-0' key={index}>
              <div className='flex-1 min-w-0'> {/* min-w-0 prevents flex item from overflowing */}
                <div className='flex items-center gap-[10px] mb-[10px]'>
                  <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer flex-shrink-0'>
                    <img src={noti?.relatedUser?.profileImage || dp} alt="" className='w-full h-full object-cover'/>
                  </div>
                  <div className='text-[16px] font-semibold text-gray-700 flex-1 min-w-0'>
                    {`${getUserDisplayName(noti?.relatedUser)} ${handleMessage(noti.type)}`}
                  </div>
                </div>
                
                {noti.relatedPost && 
                  <div className='flex items-start gap-[15px] ml-[60px] p-[15px] bg-gray-50 rounded-lg'>
                    {noti?.relatedPost?.image && (
                      <div className='w-[80px] h-[60px] overflow-hidden rounded-lg flex-shrink-0'>
                        <img src={noti?.relatedPost?.image} alt="" className='w-full h-full object-cover'/>
                      </div>
                    )}
                    <div className='flex-1 min-w-0'>
                      <p className='text-[14px] text-gray-600 leading-relaxed break-words'>
                        {truncateText(noti?.relatedPost?.description)}
                      </p>
                    </div>
                  </div>
                }
              </div>
              
              <div className='flex justify-center items-center gap-[10px] ml-[15px] flex-shrink-0' onClick={()=>handleDeleteNotification(noti._id)}>
                <RxCrossCircled className='w-[25px] cursor-pointer h-[25px] text-red-600 hover:text-red-800 transition-colors duration-200 font-bold rounded-full'/>
              </div>
            </div>
          ))}
        </div>
      }   
    </div>
  )
}

export default Notification