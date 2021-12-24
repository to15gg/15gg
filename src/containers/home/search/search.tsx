import Autocomplete from "./autocomplete";
import Form from "./form";

export default function Search() {
  return (
    <div className="absolute flex flex-col w-full max-w-[550px] px-[2rem] rounded-[5px] bg-[white]">
      <Form />
      <Autocomplete />
    </div>
  );
}
