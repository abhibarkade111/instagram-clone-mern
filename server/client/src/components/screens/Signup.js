import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'


const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    useEffect(() => {
        if (url) {
            uploadFields()
        }
    }, [url])
    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Please enter valid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                password,
                pic: url
            })
        }).then(res => res.json())
            .then(data => {
                if (data.err) {
                    //    console.log(data)
                    M.toast({ html: data.err, classes: "#c62828 red darken-3" })
                }
                else if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    // console.log(data)
                    M.toast({ html: data.message, classes: "#43a047 green darken-2" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err);
            })
    }

    const uploadPic = () => {
        const data = new FormData()
        data.append("file", image)
        data.append("upload_preset", "instagram-clone")
        data.append("cloud_name", "technicalab")
        fetch("	https://api.cloudinary.com/v1_1/technicalab/image/upload", {
            method: "post",
            body: data
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                setUrl(data.url)
            })
            .catch(err => {
                console.log(err);
            })
    }
    const postData = () => {
        if (image) {
            uploadPic()
        }
        else {
            uploadFields()

        }

    }

    return (
        <div className="mycard">
            <div className="card auth-card input-feild">

                <h2 className="hed">Instagram</h2>
                <input type="text" placeholder="name" value={name} onChange={(e) => setName(e.target.value)}></input>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} ></input>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>

                <div className="file-field input-field">
                    <div className="btn #64b5f6 blue darken-1">
                        <span>Upload pic</span>
                        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()} >Signup
                </button>
                <h6>
                    <Link to="/signin">Already have an account?</Link>
                </h6>


            </div>
        </div>
    )
}

export default Signup