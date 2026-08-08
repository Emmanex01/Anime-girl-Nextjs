import { FunctionComponent } from "react";

interface TextProps {
    html: string;
    className?: string;
}
const Prose: FunctionComponent<TextProps> = ({html, className}) => {
    return (
        <div
            className={`${className} prose mx-auto max-w-6xl text-base leading-7 text-black prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide`}
            dangerouslySetInnerHTML={{__html: html as string}}
        >

        </div>
    )
}

export default Prose;