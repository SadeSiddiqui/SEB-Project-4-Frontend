import React, { SyntheticEvent, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IComment } from "../interfaces/comment";
import { IUser } from "../interfaces/user";
import { ICondition } from "../interfaces/conditions";
import { baseUrl } from "../config";
import clouds from "../assets/clouds.jpeg"

type Comments = null | Array<IComment>;

function Community({ user }: { user: null | IUser }) {
  const navigate = useNavigate();
  const { conditionId } = useParams();
  console.log(conditionId)

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [errorData, setErrorData] = useState({
    title: "",
    content: "",
  });

  const [comments, setComments] = React.useState<Comments>(null);

  //handle change function, sees whats written in the fields
  function handleChange(e: any) {
    const fieldName = e.target.name;
    const newFormData = structuredClone(formData);
    newFormData[fieldName as keyof typeof formData] = e.target.value;
    setFormData(newFormData);
    setErrorData({
      title: "",
      content: "",
    });
  }


  //Handle submit fuinction, add comment to database
  async function handleSubmit(e: SyntheticEvent) {
    try {
      // e.preventDefault();
      const token = localStorage.getItem("token");
      console.log(token);
      console.log(formData);
      const resp = await axios.post(`${baseUrl}/posts/${conditionId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("resp", resp.data);
      navigate(`/posts/${conditionId}`);
      location.reload();
      setFormData({
        title: "",
        content: "",
      });
    } catch (e: any) {
      setErrorData(e.response.data.errors);
    }
  }

  React.useEffect(() => {
    async function fetchComments() {
      const resp = await fetch(`${baseUrl}/conditions/${conditionId}`);
      console.log(resp);
      const data = await resp.json();
      console.log(data.comments);
      setComments(data.comments);
    }
    fetchComments();
  }, []);



  async function deleteComment(e: any) {
    try {
      const token = localStorage.getItem("token");
      console.log(token);

      const commentId = e.currentTarget.value;
      console.log(commentId)
      await axios.delete(`${baseUrl}/posts/` + commentId, {
        headers: { Authorization: `Bearer ${token}` },
      });
      location.reload();
    } catch (e: any) {
      console.log(e.response.data);
    }
  }


  return (
    <>
     <div style ={{
        backgroundImage: `url(${clouds})`,
        backgroundSize: 'cover',
        minHeight: '100vH',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
      <div className="section hero is-flex is-fullheight is-flex-direction-row">
        <div className="container comment is-max-desktop custom-border-radius p-6">
          <form onSubmit={handleSubmit}>
            <div className="title is-size-2 pl-1 mb-5 has-text-dark">Add Post</div>

            <div className="field">
              <label className="label"></label>
              <div className="control has-icons-right">
                <input
                  className="input"
                  placeholder="Title"
                  type="text"
                  name={"title"}
                  onChange={handleChange}
                  value={formData.title}
                />
                <span className="icon is-small is-right">
                  <i className="fa-solid fa-heading"></i>
                </span>
                {errorData.title && (
                  <small className="has-text-danger">{errorData.title}</small>
                )}
              </div>
            </div>

            <div className="field">
              <label className="label"></label>
              <div className="control has-icons-right">
                <input
                  className="input"
                  placeholder="What do you want to say?"
                  type="text"
                  name={"content"}
                  //function to handle typing changes
                  onChange={handleChange}
                  value={formData.content}
                />
                <span className="icon is-small is-right">
                  <i className="fa-regular fa-comment"></i>
                </span>
                {errorData.content && (
                  <small className="has-text-danger">{errorData.content}</small>
                )}
              </div>
            </div>
            <button className="button is-light ml-auto my-3"> Add Post </button>
          </form>
        </div>

        <div className="section is-flex is-flex-direction-column-reverse">
          {/* <div className="column-reverse"> */}
          <div className="columns is-multiline">
            <div>
              {comments?.map((comment: any) => {
                return (
                  <div className="card comment my-2" key={comment._id}>
                    <div className="card content">
                      <p className="title">{comment.title}</p>
                    </div>

                    <p className="subtitle mx-1 my-2 ">{comment.content}</p>

                    {comment && user && user._id === comment.user && (
                      <div>
                        <button
                          onClick={deleteComment}
                          value={comment.id}
                          className="button deleteComment ml-1 mb-1 is-danger"
                        >
                          Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      </div>
    </>
  );
}

export default Community


