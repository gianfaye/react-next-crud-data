import { useEffect, useState } from "react";
import styles from '../../styles/Home.module.css'
import {useRouter} from "next/router";

/*
* This page lists all the users from the `/users` endpoint
* */

const Users = () => {
  const router = useRouter()
  const [usersData, setUsersData] = useState([])

  const getUserData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const jsonResponse = await response.json()
    setUsersData(jsonResponse)
  }

  useEffect(() => {
    // Shorthand syntax as the default method for fetch is GET
    // fetch('https://jsonplaceholder.typicode.com/users')
    //   .then((response) => response.json())
    //   .then((json) => setUsersData(json));

    // Default syntax for fetch
    // fetch('https://jsonplaceholder.typicode.com/users', {
    //   method: 'GET',
    //   headers: {
    //     'Content-type': 'application/json; charset=UTF-8',
    //   },
    // })
    getUserData()
  },[])

  const goToRouteUser = (id) => {
    router.push(`/users/${id}`)
  }

  return (
    <div className={styles.container}>
      <h1>List of Users</h1>
      <div className={styles.grid}>
        {usersData.map(user => {
          const { id, name, email, username } = user
          return (
            <div key={id} className={styles.card}>
              <h2>{name}</h2>
              <span>Twitter: @{username}</span> <br/>
              <span>Email: {email}</span>
              <div>
                {/* Clicking this will redirect to the `/user/:userId` page */}
                <button onClick={() => goToRouteUser(id)}>Go to User page</button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Users
