import { Sidebar } from "@/components/sidebar";
import { MobileHeader } from "@/components/mobile-header";

type Props = {
    children: React.ReactNode;
};

const MainLayout = ({
    children,
}: Props) => {
    return (
        <>
            <Sidebar className="hidden lg:flex" />
            <MobileHeader />
            <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
                <div className="bg-rose-300 h-full">
                    {children}
                </div>
            </main>
        </>
    );
};

export default MainLayout;