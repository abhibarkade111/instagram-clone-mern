import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext, options } from '../App'
import M from 'materialize-css'

const user = JSON.parse(localStorage.getItem('user'))

const Navbar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const { state, dispatch } = useContext(UserContext)
  // console.log(state)
  const history = useHistory()
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList = () => {

    if (state) {
      return [
        <li className="search" key="1"><i data-target="modal1" className="large  material-icons modal-trigger" style={{ color: 'black' }}>search</i></li>,
        <li key="64"><Link to="/">Home</Link></li>,

        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/create">Create Post</Link></li>,
        <li key="4"><Link to="/myfollowingpost">My Following Posts</Link></li>,
        <li key="5">
          <button className="btnn btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear()
              dispatch({ type: "CLEAR" })
              history.push('/signin')
            }}>Logout
          </button>
        </li>
      ]

    }
    else {
      return [
        <li key="6"><Link to="/signin">Signin</Link></li>,
        <li key="7"><Link to="/signup">Signup</Link></li>
      ]

    }
  }

  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
      .then(results => {
        // console.log(results)
        setUserDetails(results)
      })
  }

  
    // var elems = document.querySelectorAll('.sidenav');
    // M.Sidenav.init(elems, {} );

    document.addEventListener('DOMContentLoaded', function() {
      var elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems, {});
    });




  return (
<>
    <nav className="white">
      <div claSss="nav-wrapper ">
      <Link to={state ? "/" : "/signin"} className="brand-logo">Instagram</Link>
        <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
         </ul>
      </div>
    </nav>

   

    <ul class="sidenav" id="mobile-demo">
      {renderList()}
    </ul>


    <div id="modal1" className="modal" ref={searchModal} style={{ color: 'black' }}>
        <div className="modal-content">
          <input type="text" placeholder="Search users" value={search} onChange={(e) => fetchUsers(e.target.value)} />
          <ul style={{ color: 'black' }} className="collection">
            {userDetails.map(item => {
              // console.log(item)
              return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                M.Modal.getInstance(searchModal.current).close()
                setSearch('')
              }} > <li className="collection-item">{item.email}</li></Link>
            })}
          </ul>


        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>Close</button>
        </div>
      </div>
    </>

   



  )
}
export default Navbar