import { useDescription } from "../stores/description";

export const DescriptionManager = () => {
  const { description, editing, edit, updateDescription, updateTitle } =
    useDescription();

  if (editing) {
    return (
      <>
        <div>
          <label
            className="text-lg text-left block mb-2 mt-4"
            htmlFor="proposal-title"
          >
            Proposal Title
          </label>
          <input
            type="text"
            id="proposal-title"
            className="p-4 rounded font-lg mv-4 w-full border-2 border-gray-200 font-pt"
            onChange={(evt: any) => updateTitle(evt.target.value)}
          />

          <label
            htmlFor="proposal-summary"
            className="text-lg text-left block mb-2 mt-4 flex items-end"
          >
            Summary
            <span className="text-right inline-block right-0 absolute text-gray-500 font-regular text-sm">
              (optional)
            </span>
          </label>

          <textarea
            value={description}
            id="proposal-summary"
            onChange={(evt: any) => {
              updateDescription(evt.target.value);
            }}
            rows={6}
            cols={40}
            className="border-2 p-4 border-gray-200 rounded w-full font-pt font-normal"
          />
        </div>
      </>
    );
  }

  return (
    <div>
      <h3 className="text-md font-bold">Proposal Description: </h3>
      <div>{description}</div>
      <button
        className="border-2 border-gray-300 px-2 py-1 mt-2 hover:border-gray-600"
        onClick={() => edit()}
      >
        Edit
      </button>
    </div>
  );
};
