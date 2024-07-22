import { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchPosts, deletePost, updatePost } from './api'
import { PostDetail } from './PostDetail'
const maxPostPage = 10

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState(null)

  const queryClient = useQueryClient()

  // prefetching으로 페이지네이션 로딩시간 줄이기
  useEffect(() => {
    if (currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage),
      })
    }
  }, [currentPage, queryClient])

  // replace with useQuery
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000,
  })
  if (isLoading) return <h3>로딩중...</h3>
  if (isError) return <h3>에러{error.toString()}</h3>

  return (
    <>
      <ul>
        {data.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button
          disabled={currentPage <= 1}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue - 1)
          }}
        >
          Previous page
        </button>
        <span>Page {currentPage}</span>
        <button
          disabled={currentPage >= maxPostPage}
          onClick={() => {
            setCurrentPage((previousValue) => previousValue + 1)
          }}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  )
}
