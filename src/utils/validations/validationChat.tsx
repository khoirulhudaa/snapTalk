import { useFormik } from 'formik';
import * as Yup from 'yup';
import API from '../../services/api';
import { chatProps } from '../interfaces/chat';
import socketIOClient from "socket.io-client";

export const useChatFormik = ({onError, onResponse, type_chat, sender_id, recipient_id}: {onError?: any, onResponse?: any, type_chat?: string, sender_id?: string, recipient_id?: string}) => {

  const abortController = new AbortController()
  const abortSignal = abortController.signal

  console.log(1)


  const formik = useFormik<chatProps>({
    initialValues: {
      message: '',
    },
    validationSchema: Yup.object({
      message: Yup.string()
      .min(1, 'Must be at least 10 numbers')
      .required('This field is required.'),
    }),
    onSubmit: async (values: any, {resetForm}) => {
        try {
        
            if(abortSignal.aborted) return

            const data = {
                message: values.message,
                type_chat,
                sender_id,
                recipient_id
            }
            
            const response = await API.createChat(data);
            console.log('chat:', response)
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
