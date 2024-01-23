import React from "react"
import InputField from "./inputField"
import { useFriendFormik } from "../utils/validations/validationFriend"
import SweetAlert from "./alertBox"
import Button from "./button"

interface alertProps {
    show?: boolean,
    cancel?: () => void,
    handleShow: any,
    handleStatus: any
}

const AlertFriend:React.FC<alertProps> = ({
    show,
    cancel,
    handleShow,
    handleStatus
}) => {
    
const handleErrorMessage = (error: string) => {
    SweetAlert({
        text: `${error}`,
        icon: 'warning',
        showCancelButton: false
    })
    handleShow(false)
    handleStatus()
}

const handleResponse = (response: number) => {
    if(response === 200) {
        SweetAlert({
            text: 'Success add friend',
            icon: 'success',
            showCancelButton: false
        })
        handleShow(false)
        handleStatus()
    }
}

const friendFormik = useFriendFormik({
    onError: handleErrorMessage,
    onResponse: handleResponse
})

    return (
    <div className={`w-full z-[99999999999] fixed right-0 top-0 ${show ? 'flex' : 'hidden'} z-[99999999999] duration-100 h-screen overflow-hidden bg-opacity-[0.9] bg-slate-400 flex items-center justify-center`}>
      <div className="bg-white w-[94vw] md:w-[50vw] rounded-lg p-6">
        <form onSubmit={friendFormik.handleSubmit}>
            <InputField 
                label="Number telephone"
                name="number_telephone"
                onChange={friendFormik.handleChange}
                onBlur={friendFormik.handleBlur}
                value={friendFormik.values.number_telephone}
                id="number_telephone"
                placeholder="08x787xx78xx7"
                onError={friendFormik.errors.number_telephone}
                onTouched={friendFormik.touched.number_telephone}
            />
            <div className="my-4"></div>
            <div className="flex items-center">
                <Button text="Add friend" type="submit" />
                <div className="mx-3"></div>
                <Button text="Cancel" typeButton="outline" type="button" onClick={cancel} />
            </div>
        </form>
      </div>
    </div>
  )
}

export default AlertFriend
