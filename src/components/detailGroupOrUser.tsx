import React, { useEffect, useState } from "react"
import { FaPenAlt, FaTrash } from "react-icons/fa"
import API from "../services/api"
import { useAddMember } from "../utils/validations/validationMember"
import SweetAlert from "./alertBox"
import Button from "./button"
import ErrorMessage from "./errorMessage"
import InputField from "./inputField"
import { Link } from "react-router-dom"
import { Default, DefaultGroup } from "../assets/images"

interface detailProps {
    show?: boolean,
    type?: string,
    onclick?: any,
    group_id?: string,
    groupAccess?: string,
    numberTLP?: string,
    handleStatus?: any,
    typeAccount?: string,
    cancel?: any,
    name?: string,
    photo?: string,
    members?: any,
    handleStatusMember?: any
}

const DetailGroupOrUser:React.FC<detailProps> = ({
    show,
    type,
    onclick,
    group_id,
    groupAccess,
    numberTLP,
    handleStatus,
    typeAccount,
    cancel,
    name,
    photo,
    members,
    handleStatusMember
}) => {

    const [error, setError] = useState<string>('')

    const handleErrorMessage = (error: string) => {
        setError(error)
    }

    const handleResponseMessage = (response: number) => {
        if(response === 200) {
            SweetAlert({
                icon: 'success',
                text: 'Successfully add member',
                showCancelButton: false
            })
            handleStatusMember()
        }
    }
    
    const addMemberFormik = useAddMember({
        onError: handleErrorMessage,
        onResponse: handleResponseMessage
    })

    useEffect(() => {
        if(group_id) {
            addMemberFormik.setFieldValue('group_id', group_id)
        }
    }, [group_id])

    const handleClose = () => {
        addMemberFormik.resetForm();
        onclick()
    }

    const handleLeftFinaly = async (number: string) => {
        const data = {
            group_id,
            number_telephone: number
        }
        const result = await API.leftGroup(data)
        alert(result.data.status)
        if(result.data.status === 200) {
            SweetAlert({
                text: 'Successfully left group!',
                icon: 'success',
                showCancelButton: false
            })
            handleStatusMember()
        } else {
            SweetAlert({
                text: `${result.data.message}`,
                icon: 'error',
                showCancelButton: false
            })
            handleStatusMember()
        }
    }

    const handleLeft = (number?: string) => {
        SweetAlert({
            text: 'Conform left/kick the group ?',
            icon: 'question',
            onClick: () => handleLeftFinaly(number as string)
        })
    }

    const handleRemoveGroupFinally = async (group_id: string) => {
        const result = await API.removeGroup(group_id)
        if(result.data.status === 200) {
            SweetAlert({
                text: 'Successfully delete group!',
                icon: 'success',
                showCancelButton: false
            })
            handleStatus()
        } else {
            SweetAlert({
                text: `${result.data.message}`,
                icon: 'error',
                showCancelButton: false
            })
            handleStatus()
        }
    }

    const handleRemoveGroup = () => {
        SweetAlert({
            text: 'Conform left and delete group ?',
            icon: 'question',
            onClick: () => handleRemoveGroupFinally(group_id as string)
        })
    }

    switch(type) {
        case "group":
            return (
              <div className={`fixed top-0 ${show ? 'right-0' : 'right-[-150%]'} h-screen z-[222] w-screen md:border-l-2 border-none md:border-l-slate-300 p-4 flex justify-center overflow-hidden bg-white duration-200`}>
                  {
                    typeAccount === 'group' ? (
                        <div className="w-full md:inline hidden md:w-[70vw] h-screen p-2 md:p-[70px]">
                            <form onSubmit={addMemberFormik.handleSubmit}>
                                {
                                    error !== '' ? (
                                        <ErrorMessage error={error} />
                                    ): 
                                        null
                                }
                                <InputField 
                                    label="Number telephone"
                                    id="number_telephone"
                                    name="number_telephone"
                                    onChange={addMemberFormik.handleChange}
                                    onBlur={addMemberFormik.handleBlur}
                                    onError={addMemberFormik.errors.number_telephone}
                                    onTouched={addMemberFormik.touched.number_telephone}
                                    value={addMemberFormik.values.number_telephone}
                                />
                                <div className="w-max mt-4 flex items-center">
                                    <Button typeButton="submit" text="Add member" />
                                </div>
                            </form>
                        </div>
                    ):
                        null
                  }
                  <div className={`w-full pb-4 md:w-[30vw] h-max flex ${typeAccount === 'group' ? 'md:border-l-[1px] md:border-l-slate-400 pl-4' : 'border-l-0'} justify-center flex-col text-center w-[90%] mb-6`}>
                      <div className="w-full  hidden md:flex items-center">
                        <div className="md:w-[60px] md:h-[60px] w-[200px] h-[200px] ml-auto mr-auto text-white text-[40px] bg-blue-500 border-2 md:mr-0 md:mb-0 mb-[30px] md:ml-3 overflow-hidden border-white rounded-full text-center flex justify-center items-center">
                            <img src={photo === 'defaultGroup.jpg' ? DefaultGroup : photo} alt="photoGroup" />
                        </div> 
                        <p className="max-w-[75%] md:inline hidden overflow-hidden overflow-ellipsis whitespace-nowrap ml-4">{name}</p>
                      </div>
                      {
                        typeAccount === 'group' ? (
                            <Link to={`/profileGroup/${group_id}`}>
                                <div className="mt-5 w-max items-center text-center mx-auto md:ml-3 p-2 cursor-pointer active:scale-[0.98] hover:brightness-[90%] duration-100 border border-blue-400 text-blue-500 hidden md:flex rounded-lg">Update group <FaPenAlt className='ml-2' /></div>
                            </Link>
                        ):
                            null
                      }
                      <div className="w-full h-[78vh] md:h-[58vh] bg-slate-100 rounded-[14px] p-4 overflow-y-auto mt-4 mb-5 md:my-7">
                       {
                        members && members.length > 0 ? (
                            members.map((data: any, index: number) => (
                                <div key={index} className="w-full flex items-center mb-4">
                                    <div className="md:w-[58px] md:h-[50px] overflow-hidden overflow-ellipsis whitespace-nowrap text-white text-[32px] bg-blue-500 border-2 border-white rounded-full text-center hidden md:flex justify-center items-center">
                                        { data.username.split(' ').slice(0, 2).map((word: any) => word.substring(0, 1)).join('') }
                                    </div> 
                                    <div className="w-full flex items-center justify-between">
                                        <p className="max-w-[65%] overflow-hidden overflow-ellipsis whitespace-nowrap md:mt-0 mt-3 md:ml-4">{ data.username }</p>
                                        <FaTrash onClick={() => handleLeft(data?.number_telephone)} className='text-red-500 cursor-pointer active:scale-[0.98] hover:brightness-[90%]' />
                                    </div>
                                </div>
                            ))
                        ):
                            null
                       }
                      </div>
                        <div className="flex items-center w-full justify-between px-1">
                            <Button onClick={() => handleClose()} method="delete" typeButton="outline" text="Close now" />    
                            {
                                typeAccount === 'personal' ? (
                                    null        
                                ):
                                    <Button onClick={() => groupAccess === numberTLP ? handleRemoveGroup() : handleLeft(numberTLP)} method="delete" text={`${groupAccess === numberTLP ? 'delete' : 'Left'} the group`} />            
                            }        
                        </div>
                  </div>
              </div>
            )   
        default:
            return (
              <div className={`fixed top-0 ${show ? 'right-0' : 'right-[-100%]'} w-screen md:w-[30vw] h-screen z-[999999999] border-l-2 border-l-slate-300 p-4 flex flex-col justify-center bg-white duration-200`}>
                  <div className="w-full h-max flex justify-center items-center flex-col text-center w-[90%] mb-6">
                      <div className="md:w-[120px] border border-slate-400 overflow-hidden md:h-[120px] text-white text-[40px] bg-blue-500 border-2 border-white rounded-full text-center flex justify-center items-center">
                          <img src={photo === 'default.jpg' ? Default : photo} alt="photo_profile" />
                      </div> 
                      
                      <p className="text-center my-7">{group_id}</p>
                      <Button onClick={cancel} method="delete" typeButton="outline" text="Close now" />            
                  </div>
              </div>
            )
    }
}

export default DetailGroupOrUser
