# 21 Challenge Sound Effects

This section focuses on adding sound effects for feedback when the user selects either a correct or incorrect challenge option.

## Table of Contents

- [Downloading the Sound Files](#downloading-the-sound-files)
- [Setting Up the Sound Files](#setting-up-the-sound-files)
- [Upcoming Section](#upcoming-section)

## Downloading the Sound Files

To create a sound effect for when the user selects a correct or incorrect option, follow these steps:

1. Visit [freesound.com](https://freesound.org/) and create an account.
2. Find appropriate sounds for the "correct" and "incorrect" options and add them to the `public/` directory.

## Setting Up the Sound Files

To implement the sounds in the app, follow the same process as done for the challenge options' audio files in the Lesson route directory’s **`Card` component**.

1. Set it up by navigating to the **`Quiz` component** and destructuring the sound effect source (or the _HTMLMediaState_) for the "correct.wav" file using `useAudio` (import this element from `react-use`).

    #### `lingo/app/lesson/quiz.tsx`

    ```tsx
    //... code omitted for brevity
    export const Quiz = ({/* ... */}: Props) => {
        const [
            correctAudio,
            _c,
            correctControls,
        ] = useAudio({ src: "/correct.wav" });
        const [
            incorrectAudio,
            _i,
            incorrectControls,
        ] = useAudio({ src: "/incorrect.wav" });
        // ...
    };
    ```

2. The sound effect requires three elements, but we only need two: one for the audio file and one for the audio file's controls. To bypass the unused second argument, use `_c` as a placeholder. Duplicate this code for the "incorrect.wav" file, replacing "correct" with "incorrect" and `_c` with `_i` accordingly.

3. Next, find a place for these audio files within the rendered component. Place them at the top, just under the fragment:

    ```tsx
    //... code omitted for brevity
    export const Quiz = ({/* ... */}: Props) => {
        const [
            correctAudio,
            _c,
            correctControls,
        ] = useAudio({ src: "/correct.wav" });
        const [
            incorrectAudio,
            _i,
            incorrectControls,
        ] = useAudio({ src: "/incorrect.wav" });
        // ...
        return (
            <>
                {incorrectAudio}
                {correctAudio}
                {/*...*/}
            </>
        );
    };
    ```

4. With the audio now rendered, you can utilize the controls set up earlier. Find the `onContinue` method and, within the first _if-clause_ (after checking for no errors with the Hearts and before the `setStatus` state action), include the following:

    ```tsx
    const onContinue = () => {
        // ...
        if (correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        // ...
                        correctControls.play();
                        setStatus("correct");
                    })
                    .catch(/*...*/);
            });
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        // ...
                        
                        incorrectControls.play();
                        setStatus("wrong");
                        
                        // ...
                    })
                    .catch(() => toast.error("Something went wrong. Please try again."));
            });
        }
    }
    ```

Now you can go back to the application and test the correct and incorrect responses to hear sound feedback when selecting a challenge option.


## Upcoming Section

The next section will focus on creating the Challenge Finish Screen upon finishing all content within the lesson.
