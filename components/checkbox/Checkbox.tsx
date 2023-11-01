import { useEffect, useId, useState } from "react";

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  const id = useId();

  return (
    <div>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          onChange();
        }}
        id={id}
        className="checkbox hidden"
      />
      <label
        className="checkbox__label"
        htmlFor={id}>
        <span></span>
      </label>
    </div>
  );
};

export default Checkbox;
