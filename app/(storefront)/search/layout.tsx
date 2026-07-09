import Collections from "@/app/_components/Collections"
import FilterList from "@/app/_components/filter/FilterList"
import { sortOption } from "@/lib/constants"

export default function SearchLayout({ 
    children,
}: { 
    children: React.ReactNode 
}) {
  return (
    <div className="mx-auto flex flex-col gap-8  px-4 md:flex-row py-8">
        <div className=" md:max-w-31.25">
            <Collections/>
        </div>
        <div className="">{children}</div>
        <div className=" md:max-w-31.25 text-sm">
            <FilterList list={sortOption} title="Sort by"/>
        </div>
    </div>
  )
}