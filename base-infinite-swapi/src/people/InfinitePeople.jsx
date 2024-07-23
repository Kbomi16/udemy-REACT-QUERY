import InfiniteScroll from 'react-infinite-scroller'
import { Person } from './Person'
import { useInfiniteQuery } from '@tanstack/react-query'

const initialUrl = 'https://swapi.dev/api/people/'
const fetchUrl = async (url) => {
  const response = await fetch(url)
  return response.json()
}

export function InfinitePeople() {
  // TODO: get data for InfiniteScroll via React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['sw-people'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => {
      return lastPage.next || undefined
    },
  })

  if (isLoading) {
    return <div className="loading">로딩중...</div>
  }
  if (isError) {
    return <div className="error">에러!!! {error.toString()}</div>
  }
  return (
    <>
      {isFetching && <div className="loading">로딩중...</div>}
      <InfiniteScroll
        initialLoad={false}
        loadMore={() => {
          if (!isFetching) fetchNextPage()
        }}
        hasMore={hasNextPage}
      >
        {data.pages.map((pageData) => {
          return pageData.results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              hairColor={person.hair_color}
              eyeColor={person.eye_color}
            />
          ))
        })}
      </InfiniteScroll>
    </>
  )
}
