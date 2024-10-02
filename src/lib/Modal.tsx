import type { FC, PropsWithChildren } from "react";
import { useEffect, useRef } from "react";

const dialogStyle = {
  height: '250px',
  width: '400px',
  maxWidth: '90vw',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
} as const;

const Modal: FC<
  PropsWithChildren<{ isOpened: boolean; closeModal: () => void }>
> = ({ isOpened, closeModal, children }) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isOpened) {
      ref.current.showModal();
    } else {
      ref.current.close();
    }
  }, [isOpened]);

  return (
    <dialog style={dialogStyle} ref={ref} onCancel={closeModal}>
      {children}
      <button onClick={closeModal}>Close</button>
    </dialog>
  );
};

export default Modal;
