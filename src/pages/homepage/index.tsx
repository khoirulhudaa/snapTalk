import { useEffect, useRef, useState } from 'react'
import { FaChevronRight, FaSignOutAlt, FaSpinner, FaTelegram, FaTimes, FaTrash, FaUserFriends, FaUserPlus } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import Ably from 'ably'
import { Default, DefaultGroup } from '../../assets/images'
import SweetAlert from '../../components/alertBox'
import AlertFriend from '../../components/alertFriend'
import AlertGroup from '../../components/alertGroup'
import DetailGroupOrUser from '../../components/detailGroupOrUser'
import InputField from '../../components/inputField'
import convertToHourMinute from '../../helpers/formatDate'
import parseDate from '../../helpers/parseDate'
import API from '../../services/api'
import { getGroupDetail } from '../../store/groupSlice'

const Homepage = () => {

const navigate = useNavigate()
const dispatch = useDispatch()

const [status, setStatus] = useState<boolean>(false)
const [search, setSearch] = useState<string>('')
const [typeSelect, setTypeSelect] = useState<string>('')
const [id, setId] = useState<string>('')
const [name, setName] = useState<string>('')
const [photo, setPhoto] = useState<string>('')
const [message, setMessage] = useState<string>('')
const [groupAccess, setGroupAccess] = useState<any>(null)
const [showFriend, setShowFriend] = useState<boolean>(false)
const [showGroup, setShowGroup] = useState<boolean>(false)
const [showDetail, setShowDetail] = useState<boolean>(false)
const [activeRemove, setActiveRemove] = useState<boolean>(false)
const [indexSelect, setIndexSelect] = useState<number>(0)
const [relations, setRelations] = useState<any[]>([])
const [chats, setChats] = useState<any[]>([])
const [members, setMembers] = useState<any[]>([])
const [loading, setLoading] = useState<boolean>(false)
const [showSidebar, setShowSidebar] = useState<boolean>(false)

const auth = useSelector((state: any) => state.authSlice.auth)
const chatContainerRef = useRef<any>(null);

const ably = new Ably.Realtime('e87l2A.h1L5zQ:N2VQ6cUTikKzFtbVU2quPgMpxF2P4TCIZPN_d7gSBeE');
const channel = ably.channels.get('chat');

useEffect(() => {
    channel.subscribe('chat_received', () => {
        setStatus(true);
    });
  }, [channel]);

const sendMessage = (e: any) => {
  e.preventDefault();
  const data = {
    message: message,
    type_chat: typeSelect,
    sender_id: auth?.number_telephone ?? '',
    recipient_id: id,
  };
  channel.publish('chat', data);
  setMessage('');
};

useEffect(() => {
    (async () => {
        const result = await API.getAllRelationship(auth.number_telephone)   
        if(id && typeSelect) {
            console.log(status)
            const data = {
                sender: auth.number_telephone ?? '',
                recipient: id ?? ''
            }
            const resultChats = typeSelect === 'group' ? await API.getAllChatGroup(id) : await API.getAllChatPersonal(data);
            const result = [...resultChats.data.data]; 
            
            const resultChatFilter = result.sort((a: any, b: any) => {
                let dateA = parseDate(a.created_at).getTime();
                let dateB = parseDate(b.created_at).getTime();
                return dateA - dateB;
            });
            
            setChats(resultChatFilter);
            setLoading(false)

            const finalResult = relations
            .filter(data => data.type_account === 'group')
            .filter(data => data.group_id === id);
        
            if (finalResult.length > 0 && finalResult[0].members) {
                setMembers(finalResult[0].members);
                dispatch(getGroupDetail(finalResult[0]));
            }
        
        }
        setRelations(result.data.data) 
        setStatus(false)
    })()
}, [status, relations.length, id])

if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
}

const handleShow = (e?: boolean) => {
    setShowFriend(e ?? false)
    setShowGroup(e ?? false)
    setStatus(true)
}

const handleSelectAccount = (photo: string, type: string, id: string, name: string, access?: string) => {
    setShowSidebar(false)
    setChats([])
    setLoading(true)
    setPhoto(photo)
    setTypeSelect(type)
    setId(id)
    setName(name)
    setGroupAccess(access ?? null)
}

const handleSignOut = () => {
    SweetAlert({
        icon: 'question',
        text: 'Confirm for signout ?',
        route: '/',
        navigate: navigate
    })
}

const handleRemoveRelation = async (number_telephone?: string) => {
    const data = {
        myNumber: auth ? auth.number_telephone : '',
        number_telephone
    }

    const result = await API.removeRelationship(data)
    if(result.data.status === 200) {
        SweetAlert({
            icon: 'success',
            text: 'Successfully remove contact!',
            showCancelButton: false
        })
        setStatus(true)
        setActiveRemove(false)
    }else {
        SweetAlert({
            icon: 'error',
            text: `${result.data.message}`,
            showCancelButton: false
        })
        setStatus(true)
        setActiveRemove(false)
    }
}

const handleActiveRemove = (active: boolean, index: number) => {
    setActiveRemove(active)
    setIndexSelect(index)
}

const handleRemoveGroupFinally = async (group_id: string) => {
    const result = await API.removeGroup(group_id)
    if(result.data.status === 200) {
        SweetAlert({
            text: 'Successfully delete group!',
            icon: 'success',
            showCancelButton: false
        })
        setStatus(true)
        setActiveRemove(false)
    } else {
        SweetAlert({
            text: `${result.data.message}`,
            icon: 'error',
            showCancelButton: false
        })
        setStatus(true)
        setActiveRemove(false)
    }

}

const handleRemoveGroup = async (group_id: string, group_name: string) => {
    SweetAlert({
        text: `Confirm delete group (${group_name}) ?`,
        icon: 'question',
        onClick: () => handleRemoveGroupFinally(group_id)
    })
}

const handleStatus = () => {
    setStatus(true)
    setName('')
    setPhoto('')
    setTypeSelect('')
}

const handleUpdateGroup = (group_id: string) => {
    setShowDetail(!showDetail)
    const finalResult = relations
    .filter(data => data.type_account === 'group')
    .filter(data => data.group_id === group_id);
    setMembers(finalResult[0].members ?? [])  
    dispatch(getGroupDetail(finalResult[0]))
}

const handleRemoveChatFinally = (chat_id?: string) => {
    const data = {
        type_chat: typeSelect,
        chat_id
    }
    channel.publish('chat_remove', data);
}

const handleRemoveChat = (chat_id?: string) => {
    SweetAlert({
        text: 'Confirm delete chat ?',
        icon: 'question',
        onClick: () => handleRemoveChatFinally(chat_id)
    })
}

const getPhotoSource = () => {
    if (photo === 'default.jpg') {
        return Default;
    } else if (photo === 'defaultGroup.jpg') {
        return DefaultGroup;
    } else {
        return photo;
    }
};

const setClear = () => {
    setShowSidebar(false)
    setName('')
    setPhoto('')
    setTypeSelect('')
    setId('')
    setChats([])
    setShowDetail(false)
    setShowFriend(false)
    setShowGroup(false)
}

return (
    <div className='relative w-sceen flex h-screen h-screen overflow-hidden'>
        <div className='relative w-screen flex h-screen'>
            
            {/* left  content */}
            <div className={`fixed md:relative ${showSidebar ? 'left-[0%]' : 'left-[-100%] md:left-[0%]'} w-screen md:z-[1] z-[33] md:w-[30vw] border-r-[1px] border-white h-screen bg-white overflow-hidden`}>
                {/* profile */}
                <div className='relaitve left-0 top-0 w-screen md:w-[30vw] bg-white'>
                    <div className='w-full bg-blue-400 px-4 py-[11px] flex items-center md:justify-between'>
                        <Link to={`/profile/${auth.number_telephone}`} className='w-max md:w-full'>
                            <div className='flex items-center w-full overflow-hidden'>
                                <div className='cursor-pointer active:scale-[0.98] hover:brightness-[90%] rounded-full flex items-center justify-center bg-contain overflow-hidden bg-white w-[50px] h-[50px] shadow-md border-[1px] border-slate-200 mr-3'>
                                    <img src={auth.photo_profile === 'default.jpg' ? Default : `${auth.photo_profile}`} alt="photo" className='w-full h-full' />
                                </div>
                                <p className='md:flex hidden overflow-hidden overflow-ellipsis whitespace-nowrap font-normal text-white overflow-hidden overflow-ellipsis whitespace-nowrap w-[70%]'>{auth ? auth.username : ''}</p>
                            </div>
                        </Link>
                        <div className='md:ml-0 ml-3 flex text-[22px] text-white items-center'>
                            <div title='Add friend' onClick={() => setShowFriend(true)} className='text-[25px] cursor-pointer active:scale-[94%] hover:brightness-[94%]'>
                                <FaUserPlus className='' /> 
                            </div>
                            <div className='mx-3'></div>
                            <div title='Create-group' onClick={() => setShowGroup(true)} className='text-[28px] relative top-[0.7px] cursor-pointer active:scale-[94%] hover:brightness-[94%]'>
                                <FaUserFriends />
                            </div>
                            <div className='mx-4 md:hidden'></div>
                            <div title='SignOut' onClick={() => handleSignOut()} className='text-[25px] relative top-[0.7px] cursor-pointer active:scale-[94%] hover:brightness-[94%] md:hidden'>
                                <FaSignOutAlt />
                            </div>
                        </div>
                        <div onClick={() => setClear()} className='md:hidden text-[28px] flex ml-auto cursor-pointer active:scale-[0.97] text-white hover:brightness-[90%]'>
                            <FaTimes />
                        </div>
                    </div>

                    {/* search */}
                    <div className='w-full px-5 py-5'>
                        <InputField 
                            name='search'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder='search users...'
                        />
                    </div>
                </div>

                {/* list friendlists and groups */}
                <div className='w-full h-full pb-[190px] mt-2 overflow-y-auto'>
                    <div className='h-max overflow-y-auto'>
                        {
                            relations && relations.length > 0 ? (
                                (() => {
                                    const filteredData = relations.filter((data: any) => {
                                        if (!search) {
                                          return true;
                                        } else {
                                          return data?.type_account === 'personal' ? data.username.toLowerCase().includes(search.toLowerCase()) : data.group_name.toLowerCase().includes(search.toLowerCase());
                                        }
                                    });

                                    if(filteredData.length === 0) {
                                        return (
                                            <div className='w-full h-[50vh] flex items-center justify-center'>
                                                <p>
                                                    <b className='mr-1'>
                                                        {`${search}`}
                                                    </b>
                                                    not available!...
                                                </p>
                                            </div>
                                        )
                                    }
                                    
                                    return filteredData.map((data: any, index: number) => (
                                        <div key={index} className='relative w-[90%] cursor-pointer mx-auto h-[70px] border-b-[1px] overflow-hidden border-b-slate-100 flex items-center'>
                                            <div onClick={() => handleSelectAccount((data?.type_account === 'personal' ? data?.photo_profile : data?.logo), data?.type_account, (data?.type_account === 'personal' ? data?.number_telephone : data?.group_id), (data?.type_account === 'personal' ? data?.username : data?.group_name), (data?.type_account === 'personal' ? data?.number_telephone : data?.group_number_telephone) )} className='rounded-full overflow-hidden flex items-center justify-center w-[40px] h-[40px] border border-slate-300 mr-3 hover:bg-blue-100 active:scale-[0.99]'>
                                                <img src=
                                                    {
                                                        data?.type_account === 'personal' ? data?.photo_profile === null || data?.photo_profile === 'default.jpg' ? Default : data?.photo_profile :  
                                                        data?.type_account === 'group' ? data?.logo === null || data?.logo === 'defaultGroup.jpg' ? DefaultGroup : data?.logo : Default
                                                    } 
                                                    alt="photo" 
                                                />
                                            </div>
                                            <p onClick={() => handleSelectAccount((data?.type_account === 'personal' ? data?.photo_profile : data?.logo), data?.type_account, (data?.type_account === 'personal' ? data?.number_telephone : data?.group_id), (data?.type_account === 'personal' ? data?.username : data?.group_name), (data?.type_account === 'personal' ? data?.number_telephone : data?.group_number_telephone) )} className='max-w-[70%] overflow-hidden overflow-ellipsis whitespace-nowrap hover:text-blue-400 active:scale-[0.99]'>
                                                {data?.username ?? '(G) ' + data?.group_name}
                                            </p>
                                            {
                                                data?.type_account ===  'group' ? (
                                                    data?.group_access === auth?.user_id ? (
                                                        <>
                                                            <FaChevronRight onClick={() => handleActiveRemove(!activeRemove, index)} className={`absolute ${activeRemove && indexSelect === index ? 'right-[80px] rotate-[-180deg]' : 'right-1'} duration-400 text-slate-500 z-[9] hover:scale-[1.2] duration-100 active:scale-[0.99]`} />
                                                            <div onClick={() => data?.type_account === 'personal' ? handleRemoveRelation(data?.number_telephone) : handleRemoveGroup(data?.group_id, data?.group_name)} className={`w-[60px] z-[9] h-full absolute ${activeRemove && indexSelect === index ? 'right-[0%]' : 'right-[-100%]'} duration-500 ease top-0 bg-red-500 text-white hover:brightness-[90%] active:scale-[0.95] flex items-center justify-center`}>
                                                                <FaTrash />
                                                            </div>
                                                        </>
                                                    ):
                                                        null
                                                ):
                                                    <>
                                                        <FaChevronRight onClick={() => handleActiveRemove(!activeRemove, index)} className={`absolute ${activeRemove && indexSelect === index ? 'right-[80px] rotate-[-180deg]' : 'right-1'} duration-400 text-slate-500 z-[9] hover:scale-[1.2] duration-100 active:scale-[0.99]`} />
                                                        <div onClick={() => data?.type_account === 'personal' ? handleRemoveRelation(data?.number_telephone) : handleRemoveGroup(data?.group_id, data?.group_name)} className={`w-[60px] z-[9] h-full absolute ${activeRemove && indexSelect === index ? 'right-[0%]' : 'right-[-100%]'} duration-500 ease top-0 bg-red-500 text-white hover:brightness-[90%] active:scale-[0.95] flex items-center justify-center`}>
                                                            <FaTrash />
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    ))
                                })()
                            ):(
                                <div className='w-full h-full text-center flec items-center justify-center text-slate-500 font-normal'>
                                    Not contact, come on add relations
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            {/* right content */}
            <div className='relative overflow-x-hidden bg-slate-100 w-screen md:w-[70vw] h-screen'>
                {/* Contact/Group name */}
                <div className='fixed md:right-0 bg-blue-400 overflow-hidden top-0 w-screen md:w-[70vw] border-l-[1px] border-white h-max px-4 py-[11px] flex z-[3] items-center justify-between'>
                    {
                        photo === '' && name === '' ? (
                            null
                        ):
                            <div className='w-full overflow-hidden flex h-max items-center'>
                                <div onClick={() => typeSelect === 'group' ? handleUpdateGroup(id) : setShowDetail(!showDetail)} className='rounded-full cursor-pointer hover:brightness-[94%] active:scale-[0.98] flex items-center justify-center bg-contain overflow-hidden bg-white w-[50px] h-[50px] shadow-md border-[1px] border-slate-200 mr-3'>
                                    <img src={getPhotoSource()} alt='photo' className='w-full h-full' />
                                </div>
                                <p className='w-max-[80%] overflow-hidden overflow-ellipsis whitespace-nowrap font-normal text-white overflow-hidden overflow-ellipsis whitespace-nowrap w-[70%]'>{name ? name : null}</p>
                            </div>
                    }
                    <div onClick={() => setShowSidebar(true)} className='rounded-full ml-auto text-white text-[22px] md:hidden flex flex-col items-center justify-center cursor-pointer hover:brigntness-[94%] active:scale-[0.98] w-[50px] h-[50px]'>
                        <div className='w-[30px] h-[2px] my-1 bg-white'></div>
                        <div className='w-[30px] h-[2px] my-1 bg-white'></div>
                        <div className='w-[30px] h-[2px] my-1 bg-white'></div>
                    </div>
                    <div className='rounded-full ml-auto text-white text-[22px] hidden md:flex items-center justify-center cursor-pointer hover:brigntness-[94%] active:scale-[0.98] w-[50px] h-[50px]'>
                        <FaSignOutAlt onClick={() => handleSignOut()} />
                    </div>
                </div>

                {/* Show all message */}
                <div className='relative top-[80px] left-0 pb-[100px] overflow-y-auto w-full h-[90%]' ref={chatContainerRef}>
                    {
                        name === '' && photo === '' ? (
                            <h2 className='text-center text-slate-400 top-[45%] relative font-bold text-[24px] md:text-[30px]'>Welcome at SnapTalk!</h2>
                        ):
                            <>
                            {
                                !loading ? (
                                    chats && chats.length > 0 ? (
                                        chats.map((data: any, index: number) => (
                                            <div key={index} className={`max-w-[70%] md:max-w-[60%] overflow-hidden ${data?.sender_id === auth.number_telephone ? 'ml-auto pr-4 pl-4 md:border-0 border-[2px] border-blue-200' : 'pl-4 pr-8'} w-max m-5 h-max bg-white shadow-md flex-wrap flex flex-col rounded-lg py-4 cursor-pointer`}>
                                                <p className='w-[100] overflow-wrap-break-word break-all'>{data?.message}</p>
                                                <div className='flex mt-4 items-center justify-between'>
                                                    <small>{convertToHourMinute(data?.created_at)}</small>
                                                    {
                                                       data?.sender_id === auth.number_telephone ? (
                                                           <small className='text-red-500 ml-8 text-[16px] active:scale-[0.9] cursor-pointer hover:brightness-[90%]' onClick={() => handleRemoveChat(data?.chat_id)}><FaTrash /></small>
                                                       ) :
                                                        null
                                                    }
                                                </div>
                                            </div>
                                        ))
                                    ):
                                        <h2 className='text-center text-slate-400 top-[45%] relative font-bold text-[30px]'>Message not found</h2>
                                ):(
                                    <div className='w-full h-full flex flex-col justify-center items-center text-center'>
                                        <FaSpinner className='animate-spin duration-300 text-[24px]' />
                                        <p className='mt-7'>Loading messages...</p>
                                    </div>
                                )
                            }
                        </>
                    }
                </div>

                {/* Input message (typing) */}
                <div className='fixed px-2 md:px-6 bottom-0 md:right-0 z-[9] pb-2 shadow-lg bg-white border-t-[1px] border-t-slate-200 w-screen md:w-[70vw] min-h-[12%] flex justify-center items-center'>
                    <form onSubmit={(e) => id !== '' ? sendMessage(e) : null} className='relative h-full flex w-full items-center'>
                        <div className='w-[92%] relative bottom-2'>
                            <InputField 
                                id='message'
                                name='message' 
                                disabled={id === ''}
                                typeInput='message'
                                value={message} 
                                onChange={(e: any) => setMessage(e.target.value)}
                                placeholder='Type your message...' 
                            />
                        </div>
                        <div onClick={(e) => id !== '' ? sendMessage(e) : null} className={`w-[50px] relative top-1 ml-3 h-[46px] md:h-[50px] rounded-full overflow-hidden ${id !== '' ? 'cursor-pointer hover:brightness-[90%] active:scale-[0.98]' : 'cursor-not-allowed'} flex items-center justify-center text-[25px] bg-blue-400 text-white`}>
                            <FaTelegram />
                        </div>
                    </form>
                </div>

            </div>

            {/* Add frind and group */}
            <AlertFriend handleStatus={() => handleStatus()} handleShow={(e?: boolean) => handleShow(e)} show={showFriend} cancel={() => setShowFriend(false)} />
            <AlertGroup handleStatus={() => handleStatus()} handleShow={(e?: boolean) => handleShow(e)} showGroup={showGroup} cancel={() => setShowGroup(false)} />
       
            {/* Detail */}
            <DetailGroupOrUser members={members} show={showDetail} photo={photo} name={name} typeAccount={typeSelect} handleStatusMember={() => setStatus(true)} handleStatus={() => handleStatus()} groupAccess={groupAccess} numberTLP={auth ? auth.number_telephone : ''} group_id={id ?? ''} onclick={() => setShowDetail(false)} type={typeSelect} cancel={() => setShowDetail(false)} />
        </div>
    </div>
  )
}

export default Homepage
