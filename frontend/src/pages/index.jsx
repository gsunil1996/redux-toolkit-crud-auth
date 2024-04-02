import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


const Home = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    const checkRefreshToken = localStorage.getItem('refresh_token')
    if (checkRefreshToken) {
      setLoading(false)
      router.push('/crud-operations')
    } else {
      setLoading(false)
      router.push('/login')
    }
  }, [])


  return <div>{loading && 'Loading...'}</div>
}


export default Home
