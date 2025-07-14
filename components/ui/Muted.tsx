import { HtmlHTMLAttributes } from "react"

interface Props extends HtmlHTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
}

export default function Muted({ children, className, ...props }: Props) {
  return (
    <p
      className={
        `${className} mt-2 leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground`
      }
      {...props}
    >
      {children}
    </p>
  )
}


