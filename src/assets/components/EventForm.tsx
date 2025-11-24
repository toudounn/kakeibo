interface EventFormProps {
  type: "income" | "expense";
  newEvent: { startAge: number; endAge: number; amount: number; category: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: () => void;
}

export function EventForm({ type, newEvent, onChange, onAdd }: EventFormProps) {
  return (
    <div>
      <h3>{type === "income" ? "収入イベント追加" : "支出イベント追加"}</h3>
      <label>
        開始年齢:
        <input type="number" name="startAge" value={newEvent.startAge} onChange={onChange} />
      </label>
      <label>
        終了年齢:
        <input type="number" name="endAge" value={newEvent.endAge} onChange={onChange} />
      </label>
      <label>
        金額:
        <input type="number" name="amount" value={newEvent.amount} onChange={onChange} />
      </label>
      <label>
        内容:
        <input type="text" name="category" value={newEvent.category} onChange={onChange} />
      </label>
      <button onClick={onAdd}>{type === "income" ? "収入追加" : "支出追加"}</button>
    </div>
  );
}
