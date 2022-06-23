// import Head from 'next/head'
import ITSLayout from '@/components/ITSLayout'
import Link from 'next/link'

export default function PageNotFoundPage() {
  return (
    <ITSLayout
      pageName="404"
    >
        status code: 404
        <br />
      <Link href='/'>Home</Link>
    </ITSLayout>
  )
}
