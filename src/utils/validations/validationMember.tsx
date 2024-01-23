import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../services/api';
import { groupProps } from '../interfaces/group';
import store from '../../store/store';

export const useAddMember = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {
    
    const group = store.getState().groupSlice.group
    
    const formik = useFormik<groupProps>({
        initialValues: {
            number_telephone: '',
        },
        validationSchema: Yup.object({
            number_telephone: Yup.string()
            .min(10, 'Must be at least 10 numbers')
            .required('This field is required.'),
        }),
        onSubmit: async (values: any, {resetForm}) => {
            try {

                const data = {
                    group_id: group.group_id ?? '',
                    number_telephone: values.number_telephone
                }


                const response = await API.addMember(data)
                if(response.data.status === 401 || response.data.status === 404) {  
                    onError(response.data.message)
                }else {
                    onResponse(response.data.status)
                    resetForm()
                }
                
            } catch (error: any) {
                onError(error.message)
                resetForm()
            }
        }
    })

    return formik
}