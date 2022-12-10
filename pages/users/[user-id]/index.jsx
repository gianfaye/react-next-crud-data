import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from '../../../styles/Home.module.css'

/*
* This is the User page `/users/:userId`
* Posts from the user will be shown here in a list
*
* */

const User = () => {
  const router = useRouter()
  const userId = router.query['user-id']

  const [userData, setUserData] = useState({})
  const [postsData, setPostsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  // GET user from userId
  const getUserData = async (id) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
    const jsonResponse = await response.json()
    setUserData(jsonResponse)
  }

  // GET posts of the user using userId query params
  const getPostsData = async (id) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${id}`)
    const jsonResponse = await response.json()
    const sortedPosts = jsonResponse.sort((a,b) => a.id < b.id ? 1 : -1)
    setPostsData(sortedPosts)
  }

  // Toggles showing the Create Post form
  const toggleCreatePost = () => {
    setIsCreatingPost(!isCreatingPost)
  }

  // Method for handling the updating of title and body states every time the fields are updated
  const handleChange = (event) => {
    event.preventDefault()
    const fieldName = event.target.name
    const fieldValue = event.target.value
    const isTitle = fieldName === 'title'
    const isBody = fieldName === 'body'

    if(isTitle) {
      setTitle(fieldValue)
    }
    if(isBody){
      setBody(fieldValue)
    }
  }

  // Handles the POST request for submitting the new post of the user
  const handleSubmitNewPost = () => {
    if(!userId) return
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST', // method
      body: JSON.stringify({ // payload
        title: title,
        body: body,
        userId: userId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));
  }

  // Clicking the View post button will redirect to the Post page
  const goToRoutePost = (id) => {
    router.push(`/posts/${id}`)
  }

  useEffect(() => {
    if(!userId) return
    getUserData(userId)
    getPostsData(userId)
    setIsLoading(false)
  }, [userId])

  // Guard clause for rendering if data is not available yet
  if(isLoading) return (<>Loading...</>)

  return (
    <div className={styles.container}>
      <div>
        <h1> Posts by {userData.name}:</h1>
      </div>
      <div>
        <button onClick={toggleCreatePost}>Create a Post</button>
        {/* Only show the Create a Post form when `isCreatingPost` is `true` */}
        {isCreatingPost && (
          <div>
            <div>
              <label htmlFor="title">Title:</label>
              <input name='title' placeholder='Add title here' type="text" onChange={(event) => handleChange(event)}/>
            </div>
            <div>
              <label htmlFor="body">Body:</label>
              <div>
                <textarea name="body" id="" cols="30" rows="10" onChange={(event) => handleChange(event)}></textarea>
              </div>
            </div>
            <div>
              <button onClick={handleSubmitNewPost}>Submit</button>
            </div>
          </div>
        )}
      </div>
      {/*Renders the posts of the user*/}
      {postsData.map(post => {
        const {title, body, id} = post
        return (
          <div key={id}>
            <h3>{title}</h3>
            {/*Clicking View Post will redirect to the Post page, needs post id params*/}
            <button onClick={() => goToRoutePost(id)}>
              View Post
            </button>
          </div>
        )
      })}
    </div>
  )
}

export default User
