import React from "react"
import { useGroupFormik } from "../utils/validations/createGroup"
import SweetAlert from "./alertBox"
import Button from "./button"
import InputField from "./inputField"

interface alertProps {
    showGroup?: boolean,
    cancel?: () => void,
    handleShow: any,
    handleStatus: any
}

const AlertGroup:React.FC<alertProps> = ({
    showGroup,
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
}

const handleResponse = (response: number) => {
    if(response === 200) {
        SweetAlert({
            text: 'Success add group',
            icon: 'success',
            showCancelButton: false
        })
        handleShow(false)
        handleStatus()
    }
}

const groupFormik = useGroupFormik({
    onError: handleErrorMessage,
    onResponse: handleResponse
})

return (
    <div className={`w-full fixed right-0 top-0 ${showGroup ? 'flex' : 'hidden'} z-[99999999999] duration-100 h-screen overflow-hidden bg-opacity-[0.9] bg-slate-400 flex items-center justify-center`}>
      <div className="bg-white w-[94vw] md:w-[50vw] rounded-lg p-6">
        <form onSubmit={groupFormik.handleSubmit}>
            <div className="mb-5">
                <InputField 
                    label="Group name"
                    name="group_name"
                    onChange={groupFormik.handleChange}
                    onBlur={groupFormik.handleBlur}
                    value={groupFormik.values.group_name}
                    id="group_name"
                    placeholder="Group Fish man"
                    onError={groupFormik.errors.group_name}
                    onTouched={groupFormik.touched.group_name}
                />
            </div>
            <div className="mb-5">
                <InputField 
                    label="Description"
                    name="description_group"
                    onChange={groupFormik.handleChange}
                    onBlur={groupFormik.handleBlur}
                    value={groupFormik.values.description_group}
                    id="description_group"
                    placeholder="This is a group..."
                    onError={groupFormik.errors.description_group}
                    onTouched={groupFormik.touched.description_group}
                />
            </div>
            <div className="mb-5">
                <InputField 
                    label="Photo group"
                    name="logo"
                    type="file"
                    onChange={(event: any) => {
                        groupFormik.setFieldValue("logo", event.target.files[0])
                    }}
                    onBlur={groupFormik.handleBlur}
                    id="logo"
                />
            </div>
            <div className="my-4"></div>
            <div className="flex items-center">
                <Button text="Create new group" type="submit" />
                <div className="mx-3"></div>
                <Button text="Cancel" typeButton="outline" type="button" onClick={cancel} />
            </div>
        </form>
      </div>
    </div>
  )
}

export default AlertGroup
