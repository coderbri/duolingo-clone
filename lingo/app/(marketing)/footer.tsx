import { Button } from "@/components/ui/button"
import Image from "next/image"

export const Footer = () => {
    return (
        <footer className="hidden lg:block h-20 w-full border-t-2 border-slate-200 p-2">
            <div className="max-w-screen-lg mx-auto flex items-center justify-evenly h-full">
                {/* <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/us-flag.svg" 
                        alt="English"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    English
                </Button> */}
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
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/fr-flag.svg" 
                        alt="French"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    French
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/it-flag.svg" 
                        alt="Italian"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Italian
                </Button>
                {/* <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/ge-flag.svg" 
                        alt="German"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    German
                </Button> */}
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/cr-flag.svg" 
                        alt="Croatian"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Croatian
                </Button>
                <Button size="lg" variant="ghost" className="w-full">
                    <Image
                        src="/jp-flag.svg" 
                        alt="Japanese"
                        height={32}
                        width={40}
                        className="mr-4 rounded-md"
                    />
                    Japanese
                </Button>
            </div>
        </footer>
    )
}