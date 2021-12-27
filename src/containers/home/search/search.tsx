import Autocomplete from "./autocomplete";
import Form from "./form";

export default function Search() {
  return (
    <div className="center flex-1 max-w-[84.75rem]">
      <div className=" self-end flex-1 h-[calc(50%_+_4.5rem)] z-10">
        <div className="flex flex-col px-[2rem] rounded-[5px] bg-[white] min-w-min shadow-lg">
          <Form />
          <Autocomplete />
        </div>
      </div>
    </div>
  );
}
