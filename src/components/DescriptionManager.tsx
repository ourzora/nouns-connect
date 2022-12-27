import { useDescription } from "../stores/description";

export const DescriptionManager = () => {
  const { description, editing, edit, save, update } = useDescription();

  if (editing) {
    return (
      <>
        <div>
          <h3 className="text-md font-bold mb-2">Description</h3>
          <textarea
            value={description}
            onChange={(evt) => {
              update(evt.target.value);
            }}
            rows={6}
            cols={40}
            className="border-2 p-2 border-gray-200 shadow-md"
          />
        </div>
        <button className="border-2 border-gray-300 px-2 py-1 mt-2 hover:border-gray-600" onClick={() => save()}>
          Save
        </button>
      </>
    );
  }

  return (
    <div>
      <h3 className="text-md font-bold">Proposal Description: </h3>
      <div>{description}</div>
      <button className="border-2 border-gray-300 px-2 py-1 mt-2 hover:border-gray-600" onClick={() => edit()}>
        Edit
      </button>
    </div>
  );
};
