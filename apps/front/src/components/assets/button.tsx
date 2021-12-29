type ButtonProps = {
  buttonType: string;
  buttonText: string;
  // 적잘한 타입으로 수정 필요
  buttonOnClick: any;
};

export default function Button(props: ButtonProps) {
  switch (props.buttonType) {
    case "rounded":
      return (
        <button
          className="h-12 w-36 pt-2 rounded-full text-almostwhite bg-teal-500 hover:bg-teal-400 active:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-700"
          onClick={props.buttonOnClick}
        >
          {props.buttonText}
        </button>
      );
    case "rectangle":
      return (
        <button
          className="h-12 w-36 pt-2 rounded-lg text-almostwhite bg-teal-500 hover:bg-teal-400 active:bg-teal-600 disabled:bg-gray-300 disabled:text-gray-700"
          onClick={props.buttonOnClick}
        >
          {props.buttonText}
        </button>
      );
    case "text":
      return (
        <button
          className="h-12 w-36 pt-2 rounded-full text-almostblack bg-transparent hover:bg-teal-400 hover:text-almostwhite active:bg-teal-600 active:text-almostwhite disabled:bg-gray-300 disabled:text-gray-700"
          onClick={props.buttonOnClick}
        >
          {props.buttonText}
        </button>
      );
    default:
      return <button />;
  }
}
