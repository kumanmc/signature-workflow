import { Sign } from "../../store/types";

export interface SignStatus {
  style: string;
  label: string;
  signDisabled: boolean;
  declineDisabled: boolean;
}

export function getStatus(sign: Sign): SignStatus {
  const status = {
    style: 'info.main',
    label: 'Pending',
    signDisabled: false,
    declineDisabled: false,
  };
  if (sign.signedAt) {
    status.style = 'success.main';
    status.label = 'Signed';
    status.signDisabled = true;
    status.declineDisabled = true;
  } else if (sign.declinedAt) {
    status.style = 'error.main';
    status.label = 'Declined';
    status.signDisabled = true;
    status.declineDisabled = true;
  }
  return status;
}