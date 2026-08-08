'use client'
import { ProductOption, ProductVariant } from "@/lib/shopify/types";
import { useProduct, useUpdateUrl } from "./product-context";



type Combination = {
    id: string;
    availableForSale: boolean;
    [key: string]: string | boolean
}
export default function VariantSelector ({
    options,
    variants,
}: {
    options: ProductOption[];
    variants: ProductVariant[]
}) {
    const { state, updateOption} = useProduct();
    const updateURL = useUpdateUrl()
    const hasNoOptionsOrJustOneOption = !options.length || (options.length === 1 && options[0]?.values.length === 1);
    if (hasNoOptionsOrJustOneOption) {
        return null;
    }
    const combinations: Combination[] = variants.map((variant) => ({
        id: variant.id,
        availableForSale: variant.availableForSale,
        ...variant.selectedOptions.reduce((accumulator, option) => ({
            ...accumulator, [option.name.toLowerCase()]: option.value
        }), {})
    }))
    return options.map((option) => (
        <form
            key={option.id}
        >
            <dl className="mb-8">
                <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
                <dd className="flex flex-wrap gap-3">
                    {option.values.map((value) => {
                        const optionNameLowerCase = option.name.toLowerCase();

                        // Base option params on currency selectedOptions so we can preserve any other param state
                        const optionParams = {...state, [optionNameLowerCase]: value};

                        // filter out invalid options and check if the options combination is availBLE for sale
                        const filtered = Object.entries(optionParams).filter(
                            ([key, values]) => options.find(
                                (option) => 
                                option.name.toLowerCase() === key && 
                                option.values.includes(value)
                            )
                        );

                        const isAvailableForSale = combinations.find((combination) => 
                            filtered.every(([key, value]) => 
                                combination[key] === value && combination.availableForSale
                            )
                        )

                        // The option is active if it's in the selected options
                        const isActive = state[optionNameLowerCase] === value;

                        return (
                            <button 
                                formAction={() => {
                                    const newState = updateOption(optionNameLowerCase, value);
                                    updateURL(newState);
                                }}
                                key={value} 
                                aria-disabled={!isAvailableForSale} 
                                disabled={!isAvailableForSale} 
                                title={`${option.name} ${value} ${!isAvailableForSale ? '(Out of Stock)': ""}`}
                                className={`flex min-w-12 items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-800`}
                            >
                                {value}
                            </button>
                        )
                    })}
                </dd>
            </dl>
        </form>
    ))
}