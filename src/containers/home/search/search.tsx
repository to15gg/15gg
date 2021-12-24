import Autocomplete from "./autocomplete";
import Form from "./form";

export default function Search() {
  return (
    <div className="absolute self-end w-full max-w-[550px] h-[50%]">
      <div className="flex flex-col px-[2rem] rounded-[5px] bg-[white]">
        <Form />
        <Autocomplete />
      </div>
    </div>
  );
}
