import { TextField as MuiTextField } from "@mui/material";
import { useFieldContext } from "../context";

type DateFieldProps = {
  label: string;
  required?: boolean;
  disabled?: boolean;
  onTransform?: (dateStr: string) => string;
};

export default function DateField({
  label,
  required = false,
  disabled = false,
  onTransform,
}: DateFieldProps) {
  const field = useFieldContext<string>();

  const hasError = !field.state.meta.isValid && field.state.meta.isTouched;
  const errorText = hasError
    ? field.state.meta.errors
        .map((e) =>
          typeof e === "string" ? e : (e as any)?.message ?? JSON.stringify(e)
        )
        .join(", ")
    : undefined;

  const displayValue = field.state.value.split("T")[0];

  const handleChange = (value: string) => {
    const transformed = onTransform ? onTransform(value) : value;
    field.handleChange(transformed);
  };

  return (
    <MuiTextField
      fullWidth
      margin="dense"
      type="date"
      label={label}
      value={displayValue}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={hasError}
      helperText={errorText}
      InputLabelProps={{ shrink: true }}
      required={required}
      disabled={disabled}
    />
  );
}
