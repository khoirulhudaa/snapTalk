import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../services/api';
import { signProps } from '../interfaces/sign';

export const useSignUpFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const formik = useFormik<signProps>({
    initialValues: {
      number_telephone: '',
      username: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('This field is required.'),
      number_telephone: Yup.string()
      .min(10, 'Must be at least 10 numbers')
      .required('This field is required.'),
    }),
    onSubmit: async (values: any, {resetForm}) => {
      try {
      
      if(abortSignal.aborted) return
      
      const response = await API.createAccount(values);
      if (response.data.status === 200) {
        onResponse(response.data.status)
        resetForm()
      } else {
        onError(response.data.message)
      }
      
      } catch (error: any) {
        onError(error.message)
      }
    }
  });

  return formik

};
