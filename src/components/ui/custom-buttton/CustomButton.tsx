import clsx from "clsx"
import { Spinner } from "../spinner/Spinner";

interface Props {
  disabled: boolean;
  label: string;
  onClick?: (...arg0: any[]) => any | (() => Promise<void>);
}

export const CustomButton = ({disabled, label, onClick}: Props) => {
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
        onClick={onClick}
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
