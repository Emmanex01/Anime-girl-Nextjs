import Image from "next/image";
import Label from "../Label";


export function GridTileImage ({
    isInteractive = true,
    active,
    label,
    ...props
}: {
    isInteractive?: boolean;
    active?: boolean;
    label?: {
        title: string;
        amount: string;
        currencycode: string;
        position?: "bottom" | "center";
    };
} & React.ComponentProps<typeof Image>) {
    const relative = label ? 'relative' : '';
    const isActive = active ? 'border-2 border-blue-600' : 'border-neural-200 dark:border-neural-800';
    return (
        <div className={`group flex h-full w-full items-center justify-center overflow-hidden border bg-[rgb(235, 235, 235)] hover:border-blue-600 dark:bg-black ${isActive} ${relative}`}>
            {props.src ? (
                <Image
                    className={`relative h-full w-full object-contain ${isInteractive ? 'transition duration-300 ease-in-out group-hover:scale-105' : ''}`}
                    {...props}
                />
            ) : null}
            {label ? (
                <Label
                    title={label.title}
                    amount={label.amount}
                    currencyCode={label.currencycode}
                    position={label.position}
                />
            ) : null}
        </div>
    )
}