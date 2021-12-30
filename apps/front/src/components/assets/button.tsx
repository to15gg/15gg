import classNames from "classnames";

type ButtonShape = "rounded" | "rectangle" | "text";

type ButtonProps = React.ComponentProps<"button"> & {
  shape: ButtonShape;
};

function getClassName(buttonShape: ButtonShape, customClassNames = ""): string {
  const baseClassName =
    "h-12 w-36 pt-2 hover:bg-teal-400 active:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-700";

  switch (buttonShape) {
    case "rounded":
      return classNames(
        baseClassName,
        "rounded-full text-almostwhite bg-teal-500",
        customClassNames
      );
    case "rectangle":
      return classNames(
        baseClassName,
        "rounded-lg text-almostwhite bg-teal-500",
        customClassNames
      );
    case "text":
      return classNames(
        baseClassName,
        "rounded-full text-almostblack bg-transparent hover:text-almostwhite active:text-almostwhite",
        customClassNames
      );
  }
}

export default function Button(props: ButtonProps) {
  return (
    <button {...props} className={getClassName(props.shape, props.className)} />
  );
}
