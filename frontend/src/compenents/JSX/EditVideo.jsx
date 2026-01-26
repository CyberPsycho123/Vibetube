import { useState } from "react";
import "../CSS/Videouploads.css";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../../config";

export default function EditVideo() {
    const { id } = useParams()
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
        setValue,
        formState: { errors, isSubmitting },
    } = useForm()


    const video_data = async () => {
        const res = await fetch(`${config.API_BASE_URL}/videodata`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({ id: id })
        });
        const response = await res.json()
        if (response.success == true) {
            const video = response.videos
            setImagePreview(video.thumbnail)
            setValue("title", video.title)
            setValue("desc", video.desc)
        }

    }

    const authenticate = async () => {
        const res = await fetch(`${config.API_BASE_URL}/loged`, { method: "POST", credentials: 'include' });
        const response = await res.json()
        if (response.success == true) {
            navigate(`/admin/edit/${id}`)
        }
        else {
            navigate('/login')
        }
    }
    useEffect(() => {
        async function authenticated() {
            await authenticate()
            await video_data()
        }
        authenticated()
    }, [])



    const onsubmit = async (form) => {
        await delay(2)
        const formData = new FormData()
        formData.append("image", form.image[0])
        formData.append("title", form.title)
        formData.append("desc", form.desc)
        formData.append("id", id)
        formData.append("visibility",form.visibility)

        const res = await fetch(`${config.API_BASE_URL}/editvideo`, {
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
    };


    return (
        <>
            <form className="upload-wrapper" onSubmit={handleSubmit(onsubmit)}>
                <div className="upload-card">
                    <h1>Change Video Settings</h1>

                    {/* Image Upload */}
                    <div className="input-group">
                        <label>Upload Thumbnail</label>

                        <div className="upload-box">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" />
                            ) : (
                                <p className="text-gray">Click below to upload Thumbnail</p>
                            )}
                            <input type="file" accept="image/*" name="image" {...register("image")} onChange={handleImageChange} />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="input-group">
                        <label>Title</label>
                        <input type="text" placeholder="Enter Video title" name="title" {...register("title", { required: { value: true, message: "This field is required" }, minLength: { value: 4, message: "This title is too short" } })} />
                        {errors.title && (<p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.title.message}</p>)}
                    </div>

                    {/* Description */}
                    <div className="input-group">
                        <label>Description</label>
                        <textarea placeholder="Enter description" name="desc" {...register("desc", { required: { value: true, message: "This field is required" }, minLength: { value: 20, message: "This title is too short" } })}></textarea>
                        {errors.desc && (<p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.desc.message}</p>)}
                    </div>

                    <div className="input-group">
                        <label>Category</label>
                        <select name="visibility" {...register("visibility", { required: { value: true, message: "This field is required" } })}>
                            <option selected>Public</option>
                            <option>Private</option>
                        </select>
                    </div>

                    {/* Upload Button */}
                    <button type="submit" className="upload-btn" disabled={isSubmitting}>{isSubmitting ? "editing" : "Edit Video"}</button>
                    <p style={{ color: 'green', marginTop: 20, textAlign: 'center' }}>{success && "Successfully Edited"}</p>
                </div>
            </form>
        </>
    );
}
