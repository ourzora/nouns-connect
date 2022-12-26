import { useDescription } from "../stores/description";

export const DescriptionManager = () => {
  const { description, editing, edit, save, update } = useDescription();

  if (editing) {
    return (
      <>
        <div>
          <textarea
            value={description}
            onChange={(evt) => {
              update(evt.target.value);
            }}
            rows={6}
            cols={40}
            className="border-1 ml-6 p-2 border-gray-200 shadow-md"
          />
        </div>
        <button className="text-underline" onClick={() => save()}>
          Save
        </button>
      </>
    );
  }

  return (
    <div>
      <div>{description}</div>
      <button className="text-underline" onClick={() => edit()}>
        Edit
      </button>
    </div>
  );
};
