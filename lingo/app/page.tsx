import { Button } from "@/components/ui/button";

export default function Home() {
  return(
    <div>
      <p>Hello Lingo</p>
      <p className="text-green-600 font-bold">Hello, Again!</p>
      <Button>Click Me</Button>
      <Button size="sm" variant="destructive">Styled Btn</Button>
      <Button size="lg" variant="premium">Custom Btn Variant</Button>
    </div>
  )
}
