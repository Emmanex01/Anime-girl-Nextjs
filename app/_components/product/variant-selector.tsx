'use client';
import { ProductOption, ProductVariant } from '@/lib/shopify/types';
import { useProduct, useUpdateUrl } from './product-context';

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateUrl();

  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {} as Record<string, string>,
    ),
  }));

  return (
    <div className="space-y-7">
      {options.map((option) => {
        const optionNameLowerCase = option.name.toLowerCase();
        const selectedValue = state[optionNameLowerCase];

        return (
          <div key={option.id} className="space-y-3">
            {/* Option heading */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {option.name}
                </span>

                {selectedValue && (
                  <>
                    <span className="text-neutral-300 dark:text-neutral-700">
                      /
                    </span>

                    <span className="text-sm text-neutral-500 dark:text-neutral-400">
                      {selectedValue}
                    </span>
                  </>
                )}
              </div>

              <span className="text-xs text-neutral-400">
                {option.values.length} options
              </span>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                /*
                 * Preserve all currently selected options while testing
                 * whether this particular option/value combination exists.
                 */
                const optionParams = {
                  ...state,
                  [optionNameLowerCase]: value,
                };

                const filtered = Object.entries(optionParams).filter(
                  ([key, currentValue]) =>
                    options.find(
                      (currentOption) =>
                        currentOption.name.toLowerCase() === key &&
                        currentOption.values.includes(currentValue),
                    ),
                );

                const matchingCombination = combinations.find(
                  (combination) =>
                    filtered.every(
                      ([key, currentValue]) =>
                        combination[key] === currentValue &&
                        combination.availableForSale,
                    ),
                );

                const isAvailableForSale = Boolean(matchingCombination);

                const isActive = selectedValue === value;

                return (
                  <form key={value}>
                    <button
                      type="submit"
                      formAction={() => {
                        const newState = updateOption(
                          optionNameLowerCase,
                          value,
                        );

                        updateURL(newState);
                      }}
                      aria-disabled={!isAvailableForSale}
                      disabled={!isAvailableForSale}
                      title={
                        !isAvailableForSale
                          ? `${option.name} ${value} — Out of stock`
                          : `Select ${option.name}: ${value}`
                      }
                      className={[
                        'relative min-w-18 rounded-lg border px-4 py-3',
                        'text-sm font-medium transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-black/10',
                        'dark:focus:ring-white/20',

                        isActive
                          ? [
                              'border-black bg-black text-white',
                              'shadow-sm',
                              'dark:border-white dark:bg-white dark:text-black',
                            ].join(' ')
                          : [
                              'border-neutral-200 bg-white text-neutral-700',
                              'hover:border-neutral-400 hover:bg-neutral-50',
                              'dark:border-neutral-800 dark:bg-neutral-950',
                              'dark:text-neutral-300 dark:hover:border-neutral-600',
                            ].join(' '),

                        !isAvailableForSale
                          ? [
                              'cursor-not-allowed opacity-40',
                              'line-through',
                              'hover:border-neutral-200 hover:bg-white',
                              'dark:hover:border-neutral-800 dark:hover:bg-neutral-950',
                            ].join(' ')
                          : 'cursor-pointer',
                      ].join(' ')}
                    >
                      {value}

                      {/* Active indicator */}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] text-white dark:bg-white dark:text-black"
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
