import { useEffect, useState } from "react";
import {useRouter} from "next/router";
import styles from '../../styles/Home.module.css'

/*
* This page lists all the posts from the `/posts` endpoint
* */

const Posts = () => {
  const router = useRouter()
  const [usersByIdData, setUsersByIdData] = useState([])
  const [postsData, setPostsData] = useState([])

  const getPostData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const jsonResponse = await response.json()
    setPostsData(jsonResponse)
  }

  const getUserData = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const jsonResponse = await response.json()
    /* Transforming data structure for easy lookup on render */
    const usersById = jsonResponse.reduce((accumulator, user) => {
      const userId = user.id
      accumulator[userId] = user
      return accumulator
    })
    setUsersByIdData(usersById)
  }

  useEffect(() => {
    // Shorthand syntax as the default method for fetch is GET
    // fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then((response) => response.json())
    //   .then((json) => setPostsData(json));

    // Default syntax for fetch
    // fetch('https://jsonplaceholder.typicode.com/posts', {
    //   method: 'GET',
    //   headers: {
    //     'Content-type': 'application/json; charset=UTF-8',
    //   },
    // })
    getUserData()
    getPostData()
  },[])

  const goToRoutePost = (id) => {
    router.push(`/posts/${id}`)
  }

  return (
    <div className={styles.container}>
      <h1>List of Posts</h1>
      <div className={styles.grid}>
        {postsData.map(post => {
          const { id, userId, title } = post
          const author = usersByIdData[userId]
          const authorName = author?.name ?? ''
          return (
            <div key={id} className={styles.card}>
              <h2>{title}</h2>
              {/* Conditionally rendering author as some posts don't have a valid `userId` */}
              {!!author && (
                <div>
                  <span>Author: {authorName}</span>
                </div>
              )}
              <div>
                {/* Clicking this will redirect to the `/post/:postId` page */}
                <button onClick={() => goToRoutePost(id)}>Go to Post page</button>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default Posts
