import { redirect } from "next/navigation";

import { getUserProgress } from "@/db/queries";
import { FeedWrapper } from "@/components/feed-wrapper";
import { UserProgress } from "@/components/user-progress";
import { StickyWrapper } from "@/components/sticky-wrapper";

import { Header } from "./header";

const LearnPage = async () => {
    const userProgressData = getUserProgress();
    
    const [
        userProgress
    ] = await Promise.all([
        userProgressData
    ]);
    
    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }
    
    
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse}
                    hearts={userProgress.hearts}
                    points={userProgress.points}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                {/* <div className="h-[500px] w-full bg-blue-200" /> */}
                <Header title={userProgress.activeCourse.title} />
                <div className="space-y-4">
                    <div className="h-[700px] bg-blue-200 w-full" />
                </div>
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;