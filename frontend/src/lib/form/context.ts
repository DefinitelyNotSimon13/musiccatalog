import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import TextField from "./fields/TextField";
import DateField from "./fields/DateField";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    DateField,
  },
  formComponents: {},
});
