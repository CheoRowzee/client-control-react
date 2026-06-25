type Props = {
  status?: string | null;
};

export function StatusBadge({ status }: Props) {
  const value = status ?? "New";

  const cssClass = value
    .toLowerCase()
    .replace(" ", "-");

  return (
    <span className={`status-badge status-${cssClass}`}>
      {value}
    </span>
  );
}