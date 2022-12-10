import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";

/*
* This page renders the post, updates the post title and body,
* and deletes the post
*
* */

const Post = () => {
  const router = useRouter()
  const postId = router.query['post-id']
  const [postData, setPostData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const titleInputRef = useRef('')
  const bodyInputRef = useRef('')

  // GET post data using postId
  const getPostData = async (id) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const jsonResponse = await response.json()
    setPostData(jsonResponse)
    setTitle(jsonResponse.title)
    setBody(jsonResponse.body)
  }

  // Handles the deletion of the post, needs postId
  const handleDeletePost = () => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'DELETE',
    })
    router.push('/')
  }

  // Toggles the Edit Post form view
  const toggleEditPost = () => {
    setIsEditingPost(!isEditingPost)
  }

  // Handles the updating of the post
  const handleUpdatePost = () => {
    // Gets the current values of the fields
    const newTitle = titleInputRef.current.value
    const newBody = bodyInputRef.current.value

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify({
        id: postId,
        title: newTitle,
        body: newBody,
        userId: postData.userId,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((response) => response.json())
      .then((json) => {
        // Updates the title and body states
        setTitle(newTitle)
        setBody(newBody)
      })
    setIsEditingPost(false)
  }

  useEffect(() => {
    if(!postId) return
    getPostData(postId)
    setIsLoading(false)
  }, [postId])

  // Guard clause for rendering if data is not available yet
  if(isLoading) return (<>Loading...</>)

  // This form will render if in Editing mode
  if(isEditingPost) return (
    <div>
      <div>
        <label htmlFor="title">Title:</label>
        {/*Add reference as `titleInputRef` to be referenced later on when form is submitted*/}
        <input name='title' ref={titleInputRef} defaultValue={title} placeholder='Add title here' type="text" />
      </div>
      <div>
        <label htmlFor="body">Body:</label>
        <div>
          {/*Add reference as `bodyInputRef` to be referenced later on when form is submitted*/}
          <textarea name="body" ref={bodyInputRef} defaultValue={body} id="" cols="30" rows="10" >
          </textarea>
        </div>
      </div>
      <div>
        {/*Clicking Cancel will retain the original post data*/}
        <button onClick={toggleEditPost}>Cancel</button>
        {/*Clicking Submit will update the post data*/}
        <button onClick={handleUpdatePost}>Submit</button>
      </div>
    </div>
  )

  // The post will render if in View Mode
  return (
    <>
      <h1>{title}</h1>
      <p>{body}</p>
      <div>
        <button onClick={toggleEditPost}>Edit</button>
        <button onClick={handleDeletePost}>Delete</button>
      </div>
    </>
  )
}

export default Post
