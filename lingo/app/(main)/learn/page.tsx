import { Header } from "./header";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { FeedWrapper } from "@/components/feed-wrapper";


const LearnPage = () => {
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={{ title: "Spanish", imageSrc: "/es-flag.svg" }}
                    hearts={5}
                    points={100}
                    hasActiveSubscription={false}
                />
            </StickyWrapper>
            <FeedWrapper>
                {/* <div className="h-[500px] w-full bg-blue-200" /> */}
                <Header title="Spanish" />
                <div className="space-y-4">
                    <div className="h-[700px] bg-blue-200 w-full" />
                </div>
            </FeedWrapper>
        </div>
    );
}

export default LearnPage;