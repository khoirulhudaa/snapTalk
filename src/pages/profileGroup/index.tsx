import { useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Default } from "../../assets/images"
import SweetAlert from "../../components/alertBox"
import Button from "../../components/button"
import ErrorMessage from '../../components/errorMessage'
import InputField from "../../components/inputField"
import { useUpdateProfileGroupFormik } from "../../utils/validations/validationUpdateGroup"

const Profile = () => {

    const [error, setError] = useState<string>('')

    const group = useSelector((state: any) => state.groupSlice.group)

    const handleErrorMessage = (error: string) => {
        setError(error)
    }
    
    const handleResponseMessage = (response: number) => {
      if(response === 200) {
        SweetAlert({
            text: 'Successfully update group!',
            icon: 'success',
            showCancelButton: false
        })
      }
    }
    
    const useUpdateFormik = useUpdateProfileGroupFormik({
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
            <img src={group && group.logo === 'default.jpg' ? Default : group?.logo} alt="photoProfile" />
        </div>
        <p className="mt-8 text-white text-[22px]">{group ? group.group_name : ''}</p>
        <p className="mt-4 text-white text-[17px]">{group ? group.number_telephone : ''}</p>
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
                    id="group_name"
                    label="Group name"
                    name="group_name" 
                    onChange={useUpdateFormik.handleChange}
                    onBlur={useUpdateFormik.handleBlur}
                    onError={useUpdateFormik.errors.group_name}
                    onTouched={useUpdateFormik.touched.group_name}
                    value={useUpdateFormik.values.group_name}
                />
            </div>
            <div className="mb-5 w-[60%]">
                <InputField 
                    id="group_description"
                    label="Group description"
                    name="group_description" 
                    onChange={useUpdateFormik.handleChange}
                    onBlur={useUpdateFormik.handleBlur}
                    onError={useUpdateFormik.errors.group_description}
                    onTouched={useUpdateFormik.touched.group_description}
                    value={useUpdateFormik.values.group_description}
                />
            </div>
            <div className="mb-5 w-[60%]">
                <InputField 
                    id="logo"
                    label="New photo group (optional)"
                    name="logo" 
                    type="file"
                    onChange={(e: any) => {
                        useUpdateFormik.setFieldValue('logo', e.target.files[0])
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
