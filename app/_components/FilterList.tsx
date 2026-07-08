import { SortFilterItem } from "@/lib/constants"

export type PathFilterItem = { title: string, path: string };
export type ListItem = SortFilterItem | PathFilterItem;

function FilterItemList ({ list }: { list: ListItem[] }) {
    return (
        <ul>
            {list.map((item, index) => (
                <FilterItemComponent key={index} item={item} />
            ))}
        </ul>
    )
}

function FilterItemDropDown ({ list }: { list: ListItem[] }) {
    return (
        <ul>
            {list.map((item, index) => (
                <FilterItemComponent key={index} item={item} />
            ))}
        </ul>
    )
}

const FilterList = ({ 
    list, title
}: { 
    list: ListItem[], 
    title?: string 
}) => {
  return (
    <div>
      { title ? (
        <nav>
            <h3>{title}</h3>
        </nav>
      ) : null }
      <ul className="hidden md:block">
        <FilterItemList list={list} />
      </ul>
      <ul>
        <FilterItemDropDown list={list} />
      </ul>
    </div>
  )
}

export default FilterList
