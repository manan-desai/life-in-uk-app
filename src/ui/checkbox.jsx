export function Checkbox({ checked, onCheckedChange, disabled }) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => onCheckedChange(e.target.checked)}
      disabled={disabled}
    />
  );
}
