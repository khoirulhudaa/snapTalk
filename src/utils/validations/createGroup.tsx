import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../services/api';
import { groupProps } from '../interfaces/group';
import store from '../../store/store';

export const useGroupFormik = ({onError, onResponse}: {onError?: any, onResponse?: any}) => {

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  const auth = store.getState().authSlice.auth ?? null

  const formik = useFormik<groupProps>({
    initialValues: {
        group_name: '',
        description_group: '',
        logo: null
    },
    validationSchema: Yup.object({
      group_name: Yup.string()
      .min(3, 'Must be at least 3 characters')
      .required('This field is required.'),
      description: Yup.string()
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
    onSubmit: async (values: any, {resetForm}) => {
      try {
      
      if(abortSignal.aborted) return

      const formData = new FormData()
      formData.append('user_id', auth ? auth.user_id : '')
      formData.append('number_telephone', auth ? auth.number_telephone : '')
      formData.append('group_name', values.group_name)
      formData.append('group_description', values.description_group)
      if(values.logo && values.logo !== null) {
        formData.append('logo', values.logo);
      }

      console.log(values)

      const response = await API.createGroup(formData);
      console.log(response)

      if (response.data.status === 200) {
        onResponse(response.data.status)
        resetForm()
      } else {
        onError(response.data.message)
        resetForm()
      }
      
    } catch (error: any) {
        onError(error.message)
        resetForm()
      }
    }
  });

  return formik

};
