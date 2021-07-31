import React, { useState, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'


const Signin = () => {
    const {state,dispatch}= useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const postData = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "Please enter valid email", classes: "#c62828 red darken-3" })
            return
        }
        fetch("/signin", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }).then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data.err) {
                    //    console.log(data)
                    M.toast({ html: data.err, classes: "#c62828 red darken-3" })
                }
                else if (data.error) {
                    M.toast({ html: data.error, classes: "#c62828 red darken-3" })
                }
                else {
                    localStorage.setItem("jwt",data.token)
                    localStorage.setItem("user", JSON.stringify(data.user))
                    // console.log(data)
                    dispatch({type:"USER",payload:data.user })
                    M.toast({ html: "Sign in successfully", classes: "#43a047 green darken-2" })
                    history.push('/')
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
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} ></input>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()} >Login
                </button>
                <h6>
                    <Link to="/signup">Don't have an account?</Link>
                </h6>
                <h6>
                    <Link to="/reset">Forgot password?</Link>
                </h6>
            </div>
        </div>
    )
}

export default Signin