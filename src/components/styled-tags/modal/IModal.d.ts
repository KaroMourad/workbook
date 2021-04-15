import ReactModal from "react-modal";
import {ReactNode} from "react";

export interface IModalProps extends ReactModal.Props
{
    children: ReactNode;
}