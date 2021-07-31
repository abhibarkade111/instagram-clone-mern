import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'


const Reset = () => {
    const history = useHistory()
    const [email, setEmail] = useState("")
    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Please enter valid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/reset-password", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.error) {
                    //    console.log(data)
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    M.toast({ html: data.message, classes: "#c62828 green darken-3" })
                }
               
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-feild">

                <h2 className="hed">Instagram</h2>
                <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} ></input>
               
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()} >Reset Password
                </button>
                <h6>
                    <Link to="/signup">Don't have an account?</Link>
                </h6>
              
            </div>
        </div>
    )
}

export default Reset