import clsx from "clsx"
import { Spinner } from "../spinner/Spinner";

interface Props {
  disabled: boolean;
  label: string
}

export const CustomButton = ({disabled, label}: Props) => {
  return (
    <button
        type="submit"
        className={
            clsx({
                "btn-primary": !disabled,
                "btn-disabled": disabled
            })
        }
        disabled={disabled}
    >
      {
        !disabled
          ? (
            <>
              {label}
            </>
          )
          : (
            <Spinner showLoadingLabel={true}></Spinner>
          )
      }
    </button>
  )
}
