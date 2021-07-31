import React, { useState, useContext } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import M from 'materialize-css'


const Signin = () => {
    const history = useHistory()
    const [password, setPassword] = useState("")
    const {token} = useParams()
    console.log(token)
    const postData = () => {
        
        fetch("/new-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
           
                password,
                token
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.err) {
                    //    console.log(data)
                    M.toast({ html: data.err, classes: "#c62828 red darken-3" })
                }
                else {
                      M.toast({ html:data.message, classes: "#43a047 green darken-2" })
                    history.push('/signin')
                }
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-feild">

                <h2 className="hed">Instagram</h2>
                <input type="password" placeholder=" enter a new password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()} >Update password
                </button>
                
            </div>
        </div>
    )
}

export default Signin