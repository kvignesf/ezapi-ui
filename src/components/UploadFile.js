import React from 'react';
import { useForm } from 'react-hook-form';

const UploadFile = ({ parseFile }) => {
    const { register, handleSubmit } = useForm()
    const onChange = (data) => {
        let file = data["swaggerAPI"][0]
        parseFile(file)
    }

    return (
        <form onChange={handleSubmit(onChange)}>
            <input ref={register} required name="swaggerAPI" type="file" accept=".json" />
        </form>
    )
}

export default UploadFile;