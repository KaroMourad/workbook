import React, {FC} from "react";
import ReactModal from "react-modal";
import {IModalProps} from "./IModal";
import "./modal.css";

const Modal: FC<IModalProps> = (props: IModalProps): JSX.Element =>
{
  const {isOpen, onAfterOpen,onRequestClose, className,overlayClassName, contentLabel, children} = props;
  return (
      <ReactModal
          ariaHideApp={false}
          isOpen={isOpen}
          onAfterOpen={onAfterOpen}
          onRequestClose={onRequestClose}
          className={"modal " + className}
          overlayClassName={"overlay " + overlayClassName}
          contentLabel={contentLabel}

      >
          {children}
      </ReactModal>
  );
};

export default Modal;