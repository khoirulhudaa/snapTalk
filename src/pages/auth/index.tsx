import { useEffect, useState } from 'react'
import { Human1, Human4 } from '../../assets/images'
import ErrorMessage from '../../components/errorMessage'
import InputField from '../../components/inputField'
import { useSignInFormik } from '../../utils/validations/validationLogin'
import { useSignUpFormik } from '../../utils/validations/validationRegister'
import Ably from 'ably'

const Auth = () => {

const [error, setError] = useState<string>('')
const [type, setType] = useState<boolean>(false)

const ably = new Ably.Realtime('e87l2A.h1L5zQ:N2VQ6cUTikKzFtbVU2quPgMpxF2P4TCIZPN_d7gSBeE');
const channel = ably.channels.get('chat');
 
useEffect(() => {
    return () => {
        channel.unsubscribe('chat_received');
        ably.close();
      };    
}, [])

const handleErrorMessage = (error: string) => {
    setError(error)
}

 const hanleResponseMessage = (response: number) => {
  if(response === 200) setType(false)
 }

 const signinFormik = useSignInFormik({
    onError: handleErrorMessage,
 })

 const signupFormik = useSignUpFormik({
  onError: handleErrorMessage,
  onResponse: hanleResponseMessage
 })

 const handleSetType = () => {
  setType(!type)
  setError('')
  signupFormik.resetForm();
  signinFormik.resetForm();
 }

  return (
    <div className='w-screen h-screen flex'>
      <div className='w-[30vw] md:inline hidden bg-white h-screen p-8'>
        <h1>SnapTalk for you</h1>
        <img src={!type ? Human4 : Human1} alt="human" className='absolute bottom-0' />
      </div>
      <div className='w-screen md:w-[70vw] bg-blue-300 h-screen p-4 md:p-10'>
        {
            type ? (
                <form onSubmit={signupFormik.handleSubmit} className='z-[344]'>
                    {
                      error !== '' ? (
                          <ErrorMessage error={error} />
                      ):
                          null
                    }
                    <div className='mb-6 block w-full md:w-[60%] mt-[30px] md:mt-[60px]'>
                        <h2 className='text-white mb-4 text-[26px] md:text-[35px]'>Username</h2>
                        <InputField 
                            name='username'
                            onBlur={signupFormik.handleBlur}
                            onChange={signupFormik.handleChange}
                            onError={signupFormik.errors.username}
                            onTouched={!!signupFormik.touched.username}
                            value={signupFormik.values.username}
                            id='username'
                        />
                    </div>
                    <div className='mb-6 block w-full md:w-[60%] mt-[30px] md:mt-[50px]'>
                        <h2 className='text-white mb-4 text-[26px] md:text-[35px]'>Number telephone</h2>
                        <InputField 
                            name='number_telephone'
                            onBlur={signupFormik.handleBlur}
                            onChange={signupFormik.handleChange}
                            onError={signupFormik.errors.number_telephone}
                            onTouched={!!signupFormik.touched.number_telephone}
                            value={signupFormik.values.number_telephone}
                            id='number_telephone'
                        />
                        <br />
                        <div className='my-5'></div>
                        <small className='text-[14px]'>Youn have account ? <a onClick={() => handleSetType()} className='text-blue-600 cursor-pointer'>Here</a></small>
                        <br />
                        <button type='submit' className='outline-blue-500 border-0 mt-5 px-[40px] py-4 active:scale-[0.98] bg-blue-500 text-white'>SIGN UP</button>
                    </div>
                </form>
            ):
                <form onSubmit={signinFormik.handleSubmit} className='mb-6 block w-full md:w-[60%] z-[444] mt-[30px] md:mt-[100px]'>
                    {
                      error !== '' ? (
                          <ErrorMessage error={error} />
                      ):
                          null
                    }
                    <h2 className='text-white mb-4 text-[26px] md:text-[35px]'>Number telephone</h2>
                    <InputField 
                        name='number_telephone'
                        onBlur={signinFormik.handleBlur}
                        onChange={signinFormik.handleChange}
                        onError={signinFormik.errors.number_telephone}
                        onTouched={!!signinFormik.touched.number_telephone}
                        value={signinFormik.values.number_telephone}
                        id='number_telephone'
                    />
                    <br />
                    <div className='my-5'></div>
                    <small className='text-[14px]'>Youn don't have account ? <a onClick={() => handleSetType()} className='text-blue-600 cursor-pointer'>Here</a></small>
                    <br />
                    <button type='submit' className='outline-blue-500 border-0 mt-5 px-[40px] py-4 active:scale-[0.98] bg-blue-500 text-white'>SIGN IN</button>
                </form>
        }
      </div>
    </div>
  )
}

export default Auth