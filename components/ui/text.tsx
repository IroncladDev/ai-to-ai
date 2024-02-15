import { styled } from "react-tailwind-variants";
import sanitizeHtml from "sanitize-html";
import { sanitize } from "isomorphic-dompurify";
import { marked } from "marked";
import { cn } from "@/lib/utils";

const clean = (dirty: string) =>
  sanitizeHtml(dirty, {
    allowedTags: ["b", "i", "em", "strong", "a", "code", "br", "s", "strike"],
    allowedAttributes: {
      a: ["href", "target"],
    },
  });

const TextBase = styled("span", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      h1: "text-4xl",
      h2: "text-3xl",
    },
    color: {
      default: "text-foreground",
      dimmer: "text-foreground-dimmer",
      dimmest: "text-foreground-dimmest",
      inherit: "text-inherit",
    },
    weight: {
      default: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    multiline: {
      true: "",
      false: "truncate",
      "clamp-2": "line-clamp-2",
      "clamp-3": "line-clamp-3",
      "clamp-4": "line-clamp-4",
    },
    center: {
      true: "text-center",
    },
  },
  defaultVariants: {
    color: "default",
    size: "sm",
    weight: "default",
    multiline: false,
    center: false,
  },
});

const Text = ({
  children,
  markdown,
  maxLines,
  style,
  ...props
}: React.ComponentProps<typeof TextBase> & {
  markdown?: boolean;
  maxLines?: number;
}) => {
  const styleProp: React.ComponentProps<typeof TextBase>["style"] = {
    ...style,
    ...(maxLines && {
      WebkitLineClamp: maxLines,
      WebkitBoxOrient: "vertical",
      display: "-webkit-box",
      overflow: "hidden",
    }),
  };

  if (markdown && typeof children === "string")
    return (
      <TextBase
        {...props}
        className={cn("markdown", props.className)}
        style={styleProp}
        dangerouslySetInnerHTML={{
          __html: sanitize(
            clean(marked(children.replace(/\r?\n/g, "<br/>")) as string),
          ),
        }}
      />
    );

  return (
    <TextBase {...props} style={styleProp}>
      {children}
    </TextBase>
  );
};

export default Text;