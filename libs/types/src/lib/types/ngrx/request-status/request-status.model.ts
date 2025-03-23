import { HttpErrorResponse } from '@angular/common/http';

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: HttpErrorResponse };
export type RequestStatusState = { requestStatus: RequestStatus };
