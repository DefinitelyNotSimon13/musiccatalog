import { TextField as MuiTextField } from "@mui/material";
import { useFieldContext } from "../context";

type TextFieldProps = {
  label: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  helperTextStatic?: string;
  disabled?: boolean;
};

export default function TextField({
  label,
  required = false,
  multiline = false,
  rows,
  placeholder,
  helperTextStatic,
  disabled = false,
}: TextFieldProps) {
  const field = useFieldContext<string>();

  const hasError = !field.state.meta.isValid && field.state.meta.isTouched;
  const errorText = hasError
    ? field.state.meta.errors
        .map((e) =>
          typeof e === "string" ? e : (e as any)?.message ?? JSON.stringify(e)
        )
        .join(", ")
    : undefined;

  return (
    <MuiTextField
      fullWidth
      margin="dense"
      label={label}
      value={field.state.value || ""}
      onChange={(e) => field.handleChange(e.target.value)}
      onBlur={field.handleBlur}
      error={hasError}
      helperText={errorText || helperTextStatic}
      required={required}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
