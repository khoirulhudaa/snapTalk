import { useFormik } from 'formik';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import API from '../../services/api';
import { getGroupDetail } from '../../store/groupSlice';
import store from '../../store/store';
import { signProps } from '../interfaces/sign';

export const useUpdateProfileGroupFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const group = store.getState().groupSlice.group
  console.log(group)
  const dispatch = useDispatch()

  const formik = useFormik<signProps>({
    initialValues: {
      group_description: '',
      group_name: '',
      logo: null,
    },
    validationSchema: Yup.object({
      group_name: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('This field is required.'),
      group_description: Yup.string()
      .notRequired(),
      logo: Yup.mixed()
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
      formData.append('group_id', group.group_id ?? '') 
      formData.append('group_name', values.group_name) 
      formData.append('group_description', values.group_description) 
      if(values.logo && values.logo !== null) {
          formData.append('logo', values.logo) 
      }

      const response = await API.updateProfileGroup(formData);
      console.log('update:', response)
      if (response.data.status === 200) {
        onResponse(response.data.status)
        dispatch(getGroupDetail(response.data.data))
        formik.setErrors({})
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
        group_name: group.group_name ?? '',
        group_description: group.group_description ?? '',
    })
  }, [group])

  return formik

};
