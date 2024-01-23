import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../services/api';
import { signProps } from '../interfaces/sign';
import store from '../../store/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSignIn } from '../../store/authSlice';

export const useUpdateProfileFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const auth = store.getState().authSlice.auth
  const dispatch = useDispatch()

  const formik = useFormik<signProps>({
    initialValues: {
      number_telephone: '',
      username: '',
      photo_profile: null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('This field is required.'),
      number_telephone: Yup.string()
      .min(10, 'Must be at least 10 numbers')
      .required('This field is required.'),
      photo_profile: Yup.mixed()
        .test('fileType', 'Only JPG and PNG', (value: any) => {
            if (!value) return true;
            const supportedFormats = ['image/jpeg', 'image/png'];
            const fileExtension = value.type;
            const isExtensionSupported = supportedFormats.includes(fileExtension);
            return isExtensionSupported;
        })
        .test('fileSize', 'Maximal size is 5MB.', (value: any) => {
              if (!value) return true;
              return value.size <= 5 * 1024 * 1024;
        })
        .notRequired(),
    }),
    onSubmit: async (values: any) => {
      try {
      
      if(abortSignal.aborted) return
      
      const formData = new FormData()
      formData.append('user_id', auth.user_id ?? '') 
      formData.append('username', values.username) 
      formData.append('number_telephone', values.number_telephone) 
      if(values.photo_profile && values.photo_profile !== null) {
          formData.append('photo_profile', values.photo_profile) 
      }

      const response = await API.updateProfile(formData);
      console.log('update:', response)
      if (response.data.status === 200) {
        onResponse(response.data.status)
        dispatch(authSignIn(response.data.data))
    } else {
        onError(response.data.message)
    }
    
} catch (error: any) {
        onError(error.message)
      }
    }
  });

  useEffect(() => {
    formik.setValues({
        username: auth.username ?? '',
        number_telephone: auth.number_telephone ?? '',
    })
  }, [auth])

  return formik

};
