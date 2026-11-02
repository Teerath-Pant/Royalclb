import { signal } from "@/lib/signal";

export type ModalType = "transfer-in" | "transfer-out" | null;

export const activeModal = signal<ModalType>(null);
export const showRefreshToast = signal(false);

export function openModal(modal: ModalType) {
  activeModal.value = modal;
}

export function closeModal() {
  activeModal.value = null;
}
