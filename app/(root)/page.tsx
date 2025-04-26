import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import InterviewCard from '@/components/InterviewCard'
import { getCurrentUser } from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.actions'

const Page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewsByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! })
  ])

  const hasPastInterviews = userInterviews?.length > 0;
  const hasUpcomingInterviews = latestInterviews?.length > 0;
  return (
    <>
    <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Pratice & Feedback</h2>
          <p className='text-lg'>Pratice on real Interview Question & get Intant feedback</p>
          <Button asChild className='btn-primary'>
            <Link href="/interview">Started an Interview</Link>
          </Button>
        </div>
        <Image src="/robot.png" alt='robo-image' width={400} height={400} className='max-sm:hidden' />
    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>Your Interviews</h2>
      <div className="interviews-section">
        {
          hasPastInterviews ? (
            userInterviews?.map((interview)=>(
              <InterviewCard {...interview} key={interview.id}/>
            ))
          ):
          <p>You Have&apos;t taken any Interviews yet</p>
        }
      </div>
    </section>

    <section className='flex flex-col gap-6 mt-8'>
      <h2>Take an Interview</h2>
      <div className="interviews-section">
      {
          hasUpcomingInterviews ? (
            latestInterviews?.map((interview)=>(
              <InterviewCard {...interview} key={interview.id}/>
            ))
          ):
          <p>Tere are no new interview avelable</p>
        }
      </div>
    </section>
    </>
  )
}

export default Page