# 05 Footer

For the footer component, we need to prepare some "flags" from the Flagpack Library, which contains a Figma file containing all nationality flags. For this project, we'll use the following flags: English, Spanish, French, Italian, Croatian, and Japanese.

We'll then return to the `(marketing)/` directory and work on the **footer** component.

## Implementation Details:

### Footer Component:

The footer component is implemented to provide navigation options for different languages. It includes buttons with flags representing each language, allowing users to switch between language options. Each button is accompanied by the respective language name.

```tsx
import { Button } from "@/components/ui/button"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/es-flag.svg" 
                        alt="Spanish"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Spanish
                </Button>
                <!-- Similar buttons for other languages -->
            </div>
        </footer>
    )
}
```

This footer component serves as the finishing touch for the marketing/landing page, providing users with easy access to language options. The next section will focus on creating the learning platform.

<div align="center">
<img src="./imgs/05-Footer.png" width="450px" height="auto">
</div>