export function EmptyState({ text }: { text: string }) {
  return <p className="text-sm opacity-70">{text}</p>;
}

export function ErrorState({ text }: { text: string }) {
  return (
    <p role="alert" className="text-sm text-red-600">
      {text}
    </p>
  );
}
