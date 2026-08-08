import Price from "./Price";

export default function Label({title, amount, currencyCode, position='bottom'}: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center'
}) {
    return (
        <div className={`absolute bottom-0 left-0 flex w-full px-4 pb-4 ${position === 'center' ? 'lg:px-20 lg:pb-[35%' : ''}`}>
            <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md">
                <h3>
                    {title}
                </h3>
                <Price
                    className="flex-none rounded-full bg-blue-600 text-white"
                    amount={amount}
                    currencyCode={currencyCode}
                    currencyCodeClassName='hidden src[275px]/label:inline'
                />
            </div>
        </div>
    )
}