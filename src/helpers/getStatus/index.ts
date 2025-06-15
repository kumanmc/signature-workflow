import { Sign } from "../../store/types";

export interface SignStatus {
  style: string;
  label: string;
}

export function getStatus(sign: Sign): SignStatus {
  const status = {
    style: 'info.main',
    label: 'Pending',
  };
  if (sign.signedAt) {
    status.style = 'success.main';
    status.label = 'Signed';
  } else if (sign.declinedAt) {
    status.style = 'error.main';
    status.label = 'Declined';
  }
  return status;
}