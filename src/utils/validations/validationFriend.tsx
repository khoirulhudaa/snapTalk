import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../services/api';
import { signProps } from '../interfaces/sign';
import store from '../../store/store';

export const useFriendFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {
  
    const auth = store.getState().authSlice.auth ?? null
  
    const formik = useFormik<signProps>({
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
                    user_id: auth ? auth.user_id : '',
                    number_telephone: values.number_telephone
                }
                const response = await API.addFriend(data)
                
                if(response.data.status === 200) {  
                    onResponse(response.data.status)
                    resetForm()
                }else {
                    onError(response.data.message)
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