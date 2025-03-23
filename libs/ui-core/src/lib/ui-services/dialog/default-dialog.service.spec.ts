import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { TestBed } from '@angular/core/testing';
import { DefaultDialogService } from './default-dialog.service';

describe('DefaultDialogService Service', () => {
  let service: DefaultDialogService;
  let mockDialogRefs: DialogRef<any>[];
  let mockDialog: Dialog;

  beforeEach(() => {
    mockDialogRefs = []; // Simulate the dialogs opened in cdk Dialog
    mockDialog = {
      openDialogs: mockDialogRefs,
      afterOpened: {} as any,
      afterAllClosed: {} as any,
      getDialogById: jest.fn(),
      closeAll: jest.fn(),
      open: jest.fn(),
    } as unknown as Dialog;

    TestBed.configureTestingModule({
      providers: [
        DefaultDialogService,
        { provide: Dialog, useValue: mockDialog },
      ],
    });

    service = TestBed.inject(DefaultDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('hasOpenDialogs', () => {
    it('should return true if there are open dialogs', () => {
      mockDialogRefs.push({} as DialogRef<any, any>); // Add a mock dialog to simulate an open dialog
      expect(service.hasOpenDialogs()).toBe(true);
    });

    it('should return false if there are no open dialogs', () => {
      mockDialogRefs.length = 0; // Clear the mock dialogs array
      expect(service.hasOpenDialogs()).toBe(false);
    });
  });

  describe('hasOpenDialogsOfType', () => {
    it('should return true if a dialog of the specified type is open', () => {
      const mockComponent = class {};
      const dialogInstance = { componentInstance: new mockComponent() } as DialogRef<any>;
      mockDialogRefs.push(dialogInstance); // Add a mock dialog instance

      expect(service.hasOpenDialogsOfType(mockComponent)).toBe(true);
    });

    it('should return false if no dialog of the specified type is open', () => {
      const mockComponent = class {};
      mockDialogRefs.length = 0; // Clear the mock dialogs array

      expect(service.hasOpenDialogsOfType(mockComponent)).toBe(false);
    });
  });

  describe('getTopDialog', () => {
    it('should return the top dialog if dialogs are open', () => {
      const dialog1 = {} as DialogRef<any>;
      const dialog2 = {} as DialogRef<any>;
      mockDialogRefs.push(dialog1, dialog2); // Add two dialogs to simulate open dialogs

      expect(service.getTopDialog()).toBe(dialog2);
    });

    it('should return undefined if no dialogs are open', () => {
      mockDialogRefs.length = 0; // Clear the mock dialogs array

      expect(service.getTopDialog()).toBeUndefined();
    });
  });

  describe('closeAll', () => {
    it('should call Dialog.closeAll', () => {
      service.closeAll();
      expect(mockDialog.closeAll).toHaveBeenCalled();
    });
  });

  describe('getDialogById', () => {
    it('should call Dialog.getDialogById with the correct id', () => {
      const dialogId = 'test-dialog-id';
      const dialogRef = {} as DialogRef<any>;
      (mockDialog.getDialogById as jest.Mock).mockReturnValue(dialogRef);

      const result = service.getDialogById(dialogId);

      expect(mockDialog.getDialogById).toHaveBeenCalledWith(dialogId);
      expect(result).toBe(dialogRef);
    });
  });
});
