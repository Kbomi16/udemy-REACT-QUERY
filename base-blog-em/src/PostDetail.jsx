import { fetchComments } from './api'
import { useQuery } from '@tanstack/react-query'
import './PostDetail.css'

export function PostDetail({ post, deleteMutation, updateMutation }) {
  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id),
    staleTime: 2000,
  })
  if (isLoading) return <h3>로딩중...</h3>
  if (isError) return <h3>에러{error.toString()}</h3>

  return (
    <>
      <h3 style={{ color: 'blue' }}>{post.title}</h3>
      <div>
        <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
        {deleteMutation.isPending && <p className="loading">게시글 삭제중</p>}
        {deleteMutation.isError && (
          <p className="error">
            게시글 삭제 에러: {deleteMutation.error.toString()}
          </p>
        )}
        {deleteMutation.isSuccess && (
          <p className="success">게시글 삭제 완료!</p>
        )}
      </div>
      <div>
        <button onClick={() => updateMutation.mutate(post.id)}>
          Update title
        </button>
        {updateMutation.isPending && (
          <p className="looading">게시글 업데이트중</p>
        )}
        {updateMutation.isError && (
          <p className="error">
            게시글 업데이트 에러: {updateMutation.error.toString()}
          </p>
        )}
        {updateMutation.isSuccess && (
          <p className="success">게시글 업데이트 완료!</p>
        )}
      </div>
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  )
}
