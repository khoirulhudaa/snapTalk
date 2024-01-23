import { useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Default } from "../../assets/images"
import SweetAlert from "../../components/alertBox"
import Button from "../../components/button"
import ErrorMessage from '../../components/errorMessage'
import InputField from "../../components/inputField"
import { useUpdateProfileFormik } from "../../utils/validations/validationUpdateProfile"

const Profile = () => {

    const [error, setError] = useState<string>('')

    const auth = useSelector((state: any) => state.authSlice.auth)

    const handleErrorMessage = (error: string) => {
        setError(error)
    }
    
    const handleResponseMessage = (response: number) => {
      if(response === 200) {
        SweetAlert({
            text: 'Successfully update profile!',
            icon: 'success',
            showCancelButton: false
        })
      }
    }
    
    const useUpdateFormik = useUpdateProfileFormik({
        onError: handleErrorMessage,
        onResponse: handleResponseMessage
    })

    return (
    <div className='w-screen h-screen flex'>
      <div className="relative w-screen md:w-[30vw] h-screen bg-blue-400 flex flex-col items-center">
        <Link to={'/chat'}>
            <div className="w-[45px] h-[45px] border border-white rounded-full overflow-hidden flex items-center justify-center absolute left-5 top-5 cursor-pointer active:scale-[0.97] hover:brightness-[90%] duration-100 bg-white text-blue-500">
                <FaArrowLeft />
            </div>
        </Link>
        <div className="w-[180px] mt-[80px] bg-slate-300 h-[180px] shadow-lg rounded-full overflow-hidden border border-slate-200">
            <img src={auth && auth.photo_profile === 'default.jpg' ? Default : auth?.photo_profile} alt="photoProfile" />
        </div>
        <p className="mt-8 text-white text-[22px]">{auth ? auth.username : ''}</p>
        <p className="mt-4 text-white text-[17px]">{auth ? auth.number_telephone : ''}</p>
      </div>
      <div className="reltive md:inline hidden w-[70vw] h-screen p-[50px] bg-white">
        <form onSubmit={useUpdateFormik.handleSubmit}>
            {
                error !== '' ? (
                    <ErrorMessage error={error} />
                ):
                    null
            }
            <div className="mb-5 w-[60%]">
                <InputField 
                    id="username"
                    label="Username"
                    name="username" 
                    onChange={useUpdateFormik.handleChange}
                    onBlur={useUpdateFormik.handleBlur}
                    onError={useUpdateFormik.errors.username}
                    onTouched={useUpdateFormik.touched.username}
                    value={useUpdateFormik.values.username}
                />
            </div>
            <div className="mb-5 w-[60%]">
                <InputField 
                    id="number_telephone"
                    label="Number telephone"
                    name="number_telephone" 
                    onChange={useUpdateFormik.handleChange}
                    onBlur={useUpdateFormik.handleBlur}
                    onError={useUpdateFormik.errors.number_telephone}
                    onTouched={useUpdateFormik.touched.number_telephone}
                    value={useUpdateFormik.values.number_telephone}
                />
            </div>
            <div className="mb-5 w-[60%]">
                <InputField 
                    id="photo_profile"
                    label="New photo profile (optional)"
                    name="photo_profile" 
                    type="file"
                    onChange={(e: any) => {
                        useUpdateFormik.setFieldValue('photo_profile', e.target.files[0])
                    }}
                    onBlur={useUpdateFormik.handleBlur}
                />
            </div>
            <Button text="Save profile" typeButton="submit" />
        </form>
      </div>
    </div>
  )
}

export default Profile
