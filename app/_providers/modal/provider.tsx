"use client";

import Modal from ".";
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

export enum Modals {}

type ModalsType = {
  [key in Modals]: (props: any) => JSX.Element;
};

const ModalOptions: ModalsType = {};

type ModalProps = ReactElement | Modals;

type ModalContextProps = {
  show: (content: ModalProps) => void;
  hide: () => void;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [showModal, setShowModal] = useState(false);

  const show = (content: ModalProps) => {
    if (typeof content === "string" && ModalOptions[content]) {
      setModalContent(ModalOptions[content]);
    } else {
      setModalContent(content);
    }

    setShowModal(true);
  };

  const hide = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300); // Adjust this timeout as per your transition duration
  };

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {showModal && (
        <Modal showModal={showModal} setShowModal={setShowModal}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
