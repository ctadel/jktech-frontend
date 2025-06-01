import { GlobalConfig } from 'ngx-toastr';

export const TOAST_CONFIG: Partial<GlobalConfig> = {
  timeOut: 3000,
  positionClass: 'toast-top-right',
  closeButton: true,
  progressBar: true,
  progressAnimation: 'decreasing',
  preventDuplicates: true,
  countDuplicates: true
};
