import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
const user = JSON.parse(localStorage.getItem('user'))
// console.log(user.name);

const Profile = () => {
    const [mypics, setPic] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const [image, setImage] = useState("")
    // console.log(state)
    useEffect(() => {
        fetch('/mypost', {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('jwt')
            }
        }).then(res => res.json())
            .then(result => {
                // console.log(result);
                setPic(result.mypost)
            })
    }, [])

    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset","instagram-clone")
            data.append("cloud_name","technicalab")
            fetch("	https://api.cloudinary.com/v1_1/technicalab/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
            // console.log(data);
            // console.log(data)
            // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
            // dispatch({type:"UPDATEPIC", payload:data.url})
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                // console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC", payload:result.pic})
            })
        })
        .catch(err=>{
            console.log(err);
        })
        }
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
       
    }
    return (
        <div style={{ maxWidth: "750px", margin: "0px auto" }}>
            <div style={{
                   
                    margin: "18px 0px",
                    borderBottom: "1px solid grey"
                }}>


                <div style={{
                    display: "flex",
                    justifyContent: "space-around",
                   
                }}>
                    <div>
                        <img style={{ width: "130px", height: "130px", borderRadius: "50%", padding:"5px" }}
                            src={state ? state.pic : "loading"} alt="Profile photo"
                        />


                    </div>

                    <div>


                        <h4>{state ? state.name : user.name}</h4>
                        <h5>{state ? state.email : user.email}</h5>
                        <div style={{ display: "flex", justifyContent: "space-between", width: "108%" }}>
                            <h6>{mypics.length} posts</h6>
                            <h6>{state.followers!=undefined ? state.followers.length : "0"} followers</h6>
                            <h6>{state.following!=undefined ? state.following.length : "0"} following</h6>
                        </div>
                    </div>

                </div>
                
                 <div className="file-field input-field" style={{margin:"10px"}}>
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Update pic</span>
                        <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </div>
            <div className="gallery">
                {
                    mypics.map(item => {
                        return (
                            <img key={item._id} className="item"
                                src={item.photo} alt={item.title}
                            />
                        )
                    })
                }

            </div>
        </div>
    )
}

export default Profile