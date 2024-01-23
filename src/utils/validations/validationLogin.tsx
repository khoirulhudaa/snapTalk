import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import API from '../../services/api';
import { authSignIn, saveToken } from '../../store/authSlice';
import { signProps } from '../interfaces/sign';

export const useSignInFormik = ({onError}: {onError?: any}) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
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
                const response = await API.checkAccount(values)
                if(response.data.status === 401 || response.data.status === 404) {  
                    onError(response.data.message)
                }else {
                    dispatch(authSignIn(response.data.data))
                    dispatch(saveToken(response.data.token))
                    resetForm()
                    navigate('/chat')
                }
                
            } catch (error: any) {
                onError(error.message)
            }
        }
    })

    return formik
}