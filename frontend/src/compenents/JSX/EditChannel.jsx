import { useState } from "react";
import "../CSS/Videouploads.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import config from "../../config";

export default function EditVideo() {
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate()
    const [success, setsuccess] = useState(false)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const delay = (time) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, time * 1000)
        })
    }



    const {
        register,
        handleSubmit,
        watch,
        setError,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm()


    const channel_data = async () => {
        const res = await fetch(`${config.API_BASE_URL}/channeldata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
        });
        const response = await res.json()
        if (response.success == true) {
            const channel = response.channels
            setImagePreview(channel.logo)
            setValue("channel", channel.channel)
        }
    }

    const authenticate = async () => {
        const res = await fetch(`${config.API_BASE_URL}/loged`, { method: "POST", credentials: 'include' });
        const response = await res.json()
        if (response.success == true) {
            navigate("/admin/channeledit")
        }
        else {
            navigate('/login')
        }
    }
    useEffect(() => {
        async function authenticated() {
            await authenticate()
            await channel_data()
        }
        authenticated()
    }, [])



    const onsubmit = async (form) => {
        await delay(2)
        const formData = new FormData()
        formData.append("image", form.image[0])
        formData.append("channel", form.channel)

        const res = await fetch(`${config.API_BASE_URL}/editchannel`, {
            method: "POST",
            credentials: "include",
            body: formData
        });

        const responsed = await res.json()
        if (responsed.success == true) {
            setsuccess(true)
            await delay(4)
            setsuccess(false)
        }
        else {
            setError("channel", {type: "manual",message: responsed.message});
        }
    };


    return (
        <>
            <form className="upload-wrapper" onSubmit={handleSubmit(onsubmit)}>
                <div className="upload-card">
                    <h1>Change Channel Settings</h1>

                    {/* Image Upload */}
                    <div className="input-group">
                        <label>Upload Logo</label>
                        <div className="box-content" style={{ justifyContent: 'center', display: 'flex' }}>
                            <div className="upload-box" style={{ width: '50%' }}>
                                {imagePreview ? (
                                    <img src={imagePreview} style={{ width: '100%' }} alt="Preview" />
                                ) : (
                                    <p className="text-gray">Click below to upload channel logo</p>
                                )}
                                <input type="file" accept="image/*" name="image" {...register("image")} onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="input-group">
                        <label>channel name</label>
                        <input type="text" placeholder="channel name" name="title" {...register("channel", { required: { value: true, message: "This field is required" }, minLength: { value: 4, message: "This title is too short" } })} />
                        {errors.channel && (<p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.channel.message}</p>)}
                    </div>



                    {/* Upload Button */}
                    <button type="submit" className="upload-btn" disabled={isSubmitting}>{isSubmitting ? "editing" : "Edit channel"}</button>
                    <p style={{ color: 'green', marginTop: 20, textAlign: 'center' }}>{success && "Successfully Edited"}</p>
                </div>
            </form>
        </>
    );
}
