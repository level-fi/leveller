import { FC, useLayoutEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  dismiss?: () => void;
  children: React.ReactNode;
  header: string | React.ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, header, dismiss, children }) => {

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isOpen]);

  const onDismiss = () => {
    document.querySelectorAll('.modal .content').forEach((x) => x.classList.add('closing'));
    setTimeout(() => {
      dismiss?.();
    }, 200);
  };

  return isOpen ? (
    <div className="modal fixed top-0 left-0 bottom-0 right-0 overflow-y-auto z-2">
      <div className="backdrop" onClick={onDismiss} />
      <div className="content mx-auto max-w-800px h-100% lg-h-auto flex flex-col justify-end lg-justify-start z-2 relative">
        <div className="rd-10px bg-#212121 mt-10% lg-px-22px lg-pb-22px px-16px pb-16px overflow-auto">
          <div className="flex items-center justify-between text-18px lg-relative lg-pt-22px py-16px sticky top-0 z-1 bg-#212121">
            {typeof header === 'string' ? (
              <div className="triangle relative pl-16px">
                <span className="font-bold text-15px lg-text-18px">{header}</span>
              </div>
            ) : (
              header
            )}
            <div className="close" onClick={onDismiss}></div>
          </div>
          <div className="flex-initial overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;
