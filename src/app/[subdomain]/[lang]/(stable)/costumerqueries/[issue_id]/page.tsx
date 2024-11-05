'use client'

export default function CustomerQueriesIs({ params }: { params: { issue_id: string | number } }) {
  const { issue_id } = params

  if (!issue_id) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div>{issue_id}</div>
    </>
  )
}
