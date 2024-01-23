import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React from 'react';

interface inputProps {
    label?: string,
    onBlur?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => void,
    value?: any,
    placeholder?: string,
    type?: string,
    name?: string,
    id?: string,
    typeInput?: string,
    options?: { label: string, value: string }[],
    onError?: string | undefined,
    onTouched?: boolean | undefined,
    disabled?: boolean,
    datackEditor?: any,
    onChangeCKEditor?: any
}

const InputField = React.forwardRef(({
  label,
  onBlur,
  value,
  onChange,
  placeholder,
  type,
  name,
  id,
  typeInput,
  options,
  onError,
  onTouched,
  disabled,
  datackEditor,
  onChangeCKEditor
}: inputProps, ref: any) => {
    switch (typeInput) {
      case "select-input":
          return (
              <>
                <label htmlFor={id}>{label}</label>
                <div className='h-3'></div>
                <select 
                    id={id}
                    disabled={disabled}
                    name={name} 
                    ref={ref}
                    className={`w-[100%] h-[40x] p-4 outline-0 text-[15px] rounded-lg ${onError && onTouched ? 'border-b-[2px] border-red-500 text-[red]' : 'border border-white text-slate-600'} ${disabled ? 'bg-gray-100' : 'bg-slate-100' }`} 
                    value={value !== undefined ? value : (type === 'number' ? 0 : '')} 
                    onChange={onChange}
                    onBlur={onBlur}>
                    {
                        options && options.map((opt, index) => (
                            <option key={opt.value} value={opt.value} disabled={index === 0}>
                                {opt.label}
                            </option>
                        ))
                    }
                </select>
                {
                    onError && onTouched ? (
                        <small className='text-[red] text-[12px] font-normal my-2'>
                            {onError}
                        </small>
                    ): null
                }
            </>
        )
    case "textarea-input":
        return (
            <>
            <label htmlFor={id}>{label}</label>
            <div className='h-3'></div>
            <textarea
                id={id}
                name={name}
                disabled={disabled}
                value={value !== undefined ? value : (type === 'number' ? 0 : '')}
                ref={ref}
                onChange={onChange}
                onBlur={onBlur}
                style={{ height: '80px' }}
                className={`w-[100%] h-[40x] p-4 outline-0 text-[15px] rounded-lg ${onError && onTouched ? 'border-b-[2px] border-red-500 text-[red]' : 'border border-white text-slate-600'} ${disabled ? 'bg-gray-100' : 'bg-slate-100' }`} 
                placeholder={placeholder}
            >
            </textarea>
            {
                onError && onTouched ? (
                    <small className='text-[red] text-[12px] font-normal my-2'>
                        {onError}
                    </small>
                ): null
            }
          </>
        )
    case "ckEditor":
        return (
            <>
                <label htmlFor={id}>{label}</label>
                <div className='h-3'></div>
                <CKEditor
                    editor={ClassicEditor}
                    data={datackEditor}
                    onChange={onChangeCKEditor}
                />
            </>
        )
    case "message":
        return (
            <>
              <label htmlFor={id}>{label}</label>
              <div className='h-3'></div>
              <input
                  id={id}
                  type={type}
                  name={name}
                  ref={ref}
                  disabled={disabled}
                  value={value !== undefined ? value : (type === 'number' ? 0 : '')}
                  onChange={onChange}
                  onBlur={onBlur}
                  className={`px-2 py-3 rounded-md mt-3 w-full outline-slate-200 outline-[1px] border-[1px] border-slate-200 ${onError && onTouched ? 'border-red-500 text-red-500' : ''} ${disabled ? 'bg-gray-100' : '' }`} // Tambahkan kelas sesuai kondisi yang sesuai
                  placeholder={placeholder}
              />
              {
                  onError && onTouched ? (
                      <small className='text-[red] text-[12px] font-normal my-2'>
                          {onError}
                      </small>
                  ): null
              }
            </>
        )
    default:
      return (
          <>
            <label htmlFor={id}>{label}</label>
            <div className='h-3'></div>
            <input
                id={id}
                type={type}
                name={name}
                ref={ref}
                disabled={disabled}
                value={value !== undefined ? value : (type === 'number' ? 0 : '')}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-[100%] h-[40x] p-4 outline-0 text-[15px] rounded-lg ${onError && onTouched ? 'border-b-[2px] border-red-500 text-[red]' : 'border border-white text-slate-600'} ${disabled ? 'bg-gray-100' : 'bg-slate-100' }`} 
                placeholder={placeholder}
            />
            {
                onError && onTouched ? (
                    <small className='text-[red] text-[12px] font-normal my-2'>
                        {onError}
                    </small>
                ): null
            }
          </>
      )
  }
});

export default InputField;