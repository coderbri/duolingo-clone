# 22 Challenge Finish Screen

This section of the project focuses on building the end screen that appears upon successfully completing a lesson. The objective is to create a render where the Lesson Page temporarily displays a message to the user, indicating they have finished the challenge. Afterward, the user is redirected back to the Learn page, as there are no more challenges in the current lesson. This development ensures that the application behaves correctly at the end of lessons, maintaining a seamless user experience.

## Table of Contents
1. [Identifying the Underlying Issue of the Program](#identifying-the-underlying-issue-of-the-program)
   - [1. Server Action: `actions/challenge-progress.ts`](#1-server-action-actionschallenge-progressts)
   - [2. Lesson Page: `lesson/page.tsx`](#2-lesson-page-lessonpagetsx)
   - [3. Queries File: `db/queries.ts`](#3-queries-file-dbqueriests)
   - [4. Seed Script: `scripts/seed.ts`](#4-seed-script-scriptsseedts)
2. [Resolving the Issue](#resolving-the-issue)
   - [Fixing the Issue: Updating the Seed Script](#fixing-the-issue-updating-the-seed-script)
   - [Fixing the Issue: Updating the Quiz Component](#fixing-the-issue-updating-the-quiz-component)
3. [Rendering the Finish Screen](#rendering-the-finish-screen)
   - [New Component: `<ResultCard />`](#new-component-resultcard)
   - [ Adding Another `<Footer />` Component](#adding-another-footer--component)
   - [New Import: Confetti from `react-use`](#new-import-confetti-from-react-use)
   - [New Audio File: `finish.mp3`](#new-audio-file-finishmp3)
   - [Wrapping Up the Finish Screen](#wrapping-up-the-finish-screen)
4. [Upcoming Section](#upcoming-section)



## Identifying the Underlying Issue of the Program

During development, the program contains incorrect, seeded data, as it relies on placeholder data to perform tasks. This ensures the correct functioning of individual components and proper rendering of the UI. However, this seeded data causes issues, which will be resolved in a future section by creating an Admin Dashboard for managing course and lesson content. Such issues typically won't occur in a production environment.

### 1. Server Action: `actions/challenge-progress.ts`
The data flow begins with the **server action, `challenge-progress.ts`**. Currently, the page redirects to the Learn Page via the `revalidatePath("/lesson")` method for the Lesson Page. This is triggered when a user completes a lesson.

### 2. Lesson Page: `lesson/page.tsx`
When a user finishes the last challenge, the **Lesson Page** (`app/lesson/page.tsx`) runs two query functions: `getLesson()` and `getUserProgress()`. When the path is revalidated, these functions are called again. However, when a user finishes the last challenge, the page now holds the next lesson, leading to the _first uncompleted lesson_ being unlocked in the user's progress.

### 3. Queries File: `db/queries.ts`
The `getLesson` function, located in the **Queries file**, calls `getCourseProgress()`, which attempts to fetch the current lesson the user is on. However, after completing the last challenge of the lesson, the new page renders the next lesson, and the first uncompleted lesson becomes the current one. Since the user finished the last challenge of the current lesson, it no longer remains the _first uncompleted lesson_. 

This flow is generally fine, as the `<Quiz />` component is built to handle the transition by rendering the completed lesson. However, this logic creates an issue stemming from the Seed Script.

### 4. Seed Script: `scripts/seed.ts`
In the **Seed Script**, only the first lesson is production-ready. Upon examining the **challenges' database insert**, it's apparent that there are no challenges assigned to lessons beyond the first.

#### `scripts/seed.ts`
```ts
// ...
await db.insert(schema.lesson).values([
    { id: 1, unitId: 1, order: 1, title: "Nouns" },
    { /*...*/ },
]);

await db.insert(schema.challenges).values([
    { id: 1, lessonId: 1, /* ...ommitted for brevity */ },
    { id: 2, lessonId: 1, /* ...ommitted for brevity */ },
    { /*...*/ },
]);
// ...
```

Consequently, the `getCourseProgress()` query cannot find the `firstUncompletedLesson`, resulting in `undefined` values for `activeLesson` and `activeLessonId`. Because these values are `undefined`, the `getLesson()` method also fails to retrieve the lesson data, leading to the page redirecting back to the Learn Page due to the absence of a current lesson.



## Resolving the Issue

### Fixing the Issue: Updating the Seed Script
The solution begins by duplicating the database insert for challenges to create an additional lesson entity after the first lesson is completed. This ensures continuity for the user beyond the initial lesson.

```ts
// ...
await db.insert(schema.challenges).values([
    {
        id: 4,
        lessonId: 2, // Verbs
        type: "SELECT",
        order: 1,
        question: 'Which one of these is "the man"?',
    },
    {
        id: 5,
        lessonId: 2, // Verbs
        type: "ASSIST",
        order: 2,
        question: '"the man"',
    },
    {
        id: 6,
        lessonId: 2, // Verbs
        type: "SELECT",
        order: 3,
        question: 'Which one of these is "the robot"?',
    },
]);

console.log("Seeding finished");
// ...
```

Once this is implemented and seeded, the user is no longer immediately redirected to the Learn Page after completing a challenge. However, a new error occurs when the "NEXT" button is clicked, due to the mismanagement of the `activeIndex` in the `onNext` method.

### Fixing the Issue: Updating the Quiz Component
The issue in the `Quiz` component stems from how the `onNext` method calculates the `activeIndex` of challenges. When the current challenge index exceeds the available challenges in the lesson, it tries to reference an undefined challenge. To fix this, an `if-clause` is added to handle situations where there are no remaining challenges, and instead render the Finish Challenge Screen.

```tsx
export const Quiz = ({
    // ...
    const onContinue = () => {/*...*/};

    if (true || !challenge) {
        return (
            <div>
                Finished the challenge!
            </div>
        );
    }

    const title = /*...*/;
    return (<>{/*...*/}</>);
});
```

Seed the database. With this clause in place, the user will now see a message indicating they have completed the lesson.



## Rendering the Finish Screen

An SVG file is added for the Finish Screen, and the _if-clause_ created earlier is updated to render a stylized screen with a message, image, and results. This screen informs the user that they have completed the lesson and displays their total points and remaining hearts.

```tsx
if (!challenge) {
    return (
        <>
            <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                <Image
                    src="/finish.svg"
                    alt="Finish"
                    className="hidden lg:block"
                    height={100}
                    width={100}
                />
                <Image
                    src="/finish.svg"
                    alt="Finish"
                    className="block lg:hidden"
                    height={50}
                    width={50}
                />
                <h1 className="text-xl lg:text:3xl font-bold text-neutral-700">
                    Great job! <br /> You&apos;ve completed the lesson.
                </h1>
                <div className="flex items-center gap-x-4 w-full">
                    <ResultCard
                        variant="points"
                        value={challenges.length * 10}
                    />
                    <ResultCard
                        variant="hearts"
                        value={hearts}
                    />
                </div>
            </div>
        </>
    );
}
```

In the case that there are errors rendering, troubleshoot by seeding the database and access the lesson anew. Nothing should show up and that is perfectly fine as this is the screen we need to be seeing to style.

### New Component: `<ResultCard />`
A new component is added to render the user’s results, showing both their points and hearts.

```tsx
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
    value: number;
    variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: Props) => {
    const imageSrc = variant === "hearts" ? "/heart.svg" : "/points.svg";
    
    return (
        <div className={cn(
            "rounded-2xl border-2 w-full",
            variant === "points" && "bg-orange-400 border-orange-400",
            variant === "hearts" && "bg-rose-500 border-rose-500",
        )}>
            <div className={cn(
                "p-1.5 text-white rounded-t-xl font-bold text-center uppercase text-xs",
                variant === "hearts" && "bg-rose-500",
                variant === "points" && "bg-orange-400",
            )}>
                {variant === "hearts" ? "Hearts left" : "Total XP" }
            </div>
            <div className={cn(
                "rounded-2xl bg-white items-center flex justify-center p-6 font-bold text-lg",
                variant === "hearts" && "text-rose-500",
                variant === "points" && "text-orange-400",
            )}>
                <Image
                    alt="Icon"
                    src={imageSrc}
                    height={30}
                    width={30}
                    className="mr-1.5"
                />
                {value}
            </div>
        </div>
    );
};
```


Let’s go over each section in detail, transforming the bullet points into full prose, and making sure to integrate the missing notes properly.

### Adding Another `<Footer />` Component

In this section, a new `<Footer />` component is required to allow users to practice a completed lesson again. This functionality is critical for users to revisit and practice lessons they have already finished, enhancing the overall learning experience. To enable this, the `lessonId` is needed. 

However, instead of fetching and updating this value dynamically on the frontend, it will be set using the `initialLessonId` passed through the `Quiz` component. This approach avoids unnecessary revalidation or mutation of state on the frontend, as the `lessonId` is managed by the backend. As the user completes lessons, these lessons will transition into "practice" lessons, making the "Practice Again" button functional. When clicked, the button will retrieve the updated lesson URL, allowing the user to review and reattempt previous challenges.

One potential issue to be aware of is that the property `lessonId` might raise an error, as it expects a number but may receive a boolean. This will be addressed in a future section, ensuring the component functions as intended.

---

### New Import: Confetti from `react-use`

To create a more engaging user experience when a lesson is completed, a confetti effect will be introduced. The confetti effect helps to celebrate the user's achievement and adds a dynamic visual element to the application.

First, install the `react-confetti` package by running the following command in another terminal:

```bash
npm i react-confetti
```

Once the package is installed, it will be used to render confetti when the user completes a lesson. The confetti effect needs to be adaptable to different window sizes to ensure a seamless experience across various devices. This will be accomplished by using the `useWindowSize` hook from the `react-use` package, which will provide the necessary width and height values for the confetti to render appropriately.

---

### New Audio File: `finish.mp3`

To further enhance the user experience, an audio cue will be added to signify the completion of a lesson. Just as sound effects were added in previous sections for correct and incorrect answers, a new audio file—`finish.mp3`—will be imported and played when the user finishes a lesson.

This audio will be triggered in the `Quiz` component, just before the `<Confetti />` element. By doing so, the sound effect will play at the same time as the confetti animation, creating a more immersive experience. The addition of this audio provides feedback to the user that they have successfully completed the lesson, adding to the celebratory atmosphere of the Finish Screen.

---

### Wrapping Up the Finish Screen

At this point, the Finish Screen logic is almost complete. The final step involves updating the _if-clause_ that determines when the Finish Screen should be rendered. Previously, a placeholder `or true` statement was used to force the Finish Screen to display during testing. This condition can now be removed, allowing the screen to appear only when there is no challenge content left for the user to complete. In other words, the screen will display once the user has successfully completed all challenges within the lesson.

To ensure everything is functioning properly, it is important to reseed the database and then attempt to complete a lesson. This will allow you to see how the Finish Screen renders in real-time and verify that all components, including the confetti and sound effects, are working as expected.

Here is the final version of the `lesson/quiz.tsx` file, which includes the necessary imports and logic for the Finish Screen:


#### `lesson/quiz.tsx`

```tsx
// NEW IMPORTS
import Image from "next/image";
import Confetti from "react-confetti";
import { useAudio, useWindowSize } from "react-use";
import { useRouter } from "next/navigation";
import { ResultCard } from "./result-card";
// ... other imports ommitted for brevity

export const Quiz = ({/*...*/}: Props) => {
    const { width, height } = useWindowSize();
    const router = useRouter();
    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
    // ... code ommitted for brevity
    
    if (!challenge) {
        return (
            <>
                {finishAudio}
                <Confetti
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />
                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image
                        src="/finish.svg"
                        alt="Finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    />
                    <Image
                        src="/finish.svg"
                        alt="Finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    />
                    <h1 className="text-xl lg:text:3xl font-bold text-neutral-700">
                        Great job! <br /> You&apos;ve completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        );
    }
    // ... code ommitted for brevity
}
```

In this code, the confetti effect and audio are triggered when there are no challenges left to complete, and the Finish Screen is rendered with a celebratory message, displaying the user's total points and remaining hearts. Additionally, a `<Footer />` component is included to allow the user to practice the completed lesson again by fetching the correct `lessonId`. 

With this, the Finish Screen is fully implemented, and the celebratory features (confetti and audio) will trigger when a user finishes a lesson, providing both visual and auditory feedback.


<div align="center">
<img src="./imgs/22-Challenge_Finish_Screen.gif"
    alt="Challenge Finish Screen"
    width="450px" height="auto">
</div>

## Upcoming Section

In the next section of the project, the focus will shift to building a model for **Practice Lessons**. This mode will allow users to reattempt lessons they have already completed, earning additional experience points, regaining hearts and maintaining engagement with the content.
